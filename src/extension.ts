import * as vscode from "vscode"
import fs from "fs/promises"
import path from "path"

export function activate(context: vscode.ExtensionContext) {
  console.log("json-harmonizer is active")

  const disposable = vscode.commands.registerCommand(
    "json-harmonizer.harmonize",
    async (uri) => {
      const files = await vscode.workspace.findFiles(
        new vscode.RelativePattern(uri.fsPath, "**/*.json")
      )
      createWebviewPanel(context, files)
    }
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {}

async function readAndParseJson(
  filePath: string
): Promise<Record<string, any>> {
  const content = await fs.readFile(filePath, { encoding: "utf-8" })
  return JSON.parse(content)
}

async function createWebviewPanel(
  context: vscode.ExtensionContext,
  fileUris: vscode.Uri[]
): Promise<void> {
  const fileNames: string[] = fileUris.map((uri) => path.basename(uri.fsPath))
  const jsonData: Array<Record<string, any>> = await Promise.all(
    fileUris.map((uri) => readAndParseJson(uri.fsPath))
  )

  const panel: vscode.WebviewPanel = vscode.window.createWebviewPanel(
    "jsonFiles",
    "Harmonize",
    vscode.ViewColumn.One,
    { enableScripts: true, retainContextWhenHidden: true }
  )

  panel.webview.html = getWebviewContent(fileNames, jsonData)

  panel.webview.onDidReceiveMessage(
    async (message) => {
      if (message.command === "edit") {
        const filePath = fileUris[message.fileIndex].fsPath
        const jsonData = await readAndParseJson(filePath)
        const parts = message.key.split("-")
        // remove the first parentID "root"
        parts.shift()
        let target = jsonData

        for (let i = 0; i < parts.length; i++) {
          if (i === parts.length - 1) {
            target[parts[i]] = message.newValue
          } else {
            if (!target[parts[i]]) {
              // ensure nested objects exist
              target[parts[i]] = {}
            }
            target = target[parts[i]]
          }
        }
        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf-8")
        vscode.window.showInformationMessage(
          `Updated ${parts.join(".")} in ${path.basename(filePath)}`
        )
      }
    },
    undefined,
    context.subscriptions
  )
}

function getWebviewContent(
  fileNames: string[],
  jsonData: Array<Record<string, any>>
): string {
  let tableHeaders = "<th>Key</th>"
  fileNames.forEach((name) => {
    tableHeaders += `<th>${name}</th>`
  })

  function generateTableRows(
    dataArray: Array<Record<string, any>>,
    depth = 0,
    parentId = "root"
  ): { rows: string; isMissingValue: number[] } {
    let rows = ""
    const allKeys = new Set<string>()
    /**
     * column index of the files that are missing values
     */
    const missingValues: number[] = []

    dataArray.forEach((obj) => {
      Object.keys(obj).forEach((key) => allKeys.add(key))
    })

    allKeys.forEach((key) => {
      const uniqueRowId = `${parentId}-${key}`
      const isNested = dataArray.some(
        (obj) =>
          typeof obj[key] === "object" &&
          obj[key] !== null &&
          !Array.isArray(obj[key])
      )

      const nestIndentation = depth * 20

      if (isNested) {
        const nestedDataArray = dataArray.map((obj) => obj[key] || {})
        const { rows: nestedRows, isMissingValue } = generateTableRows(
          nestedDataArray,
          depth + 1,
          uniqueRowId
        )

        rows += `<tr id="${uniqueRowId}-header" onclick="toggleVisibility('${uniqueRowId}');">
          <td style="padding-left: ${nestIndentation}px; cursor: pointer;">${key}</td>
          ${fileNames
            .map((_, index) => {
              if (isMissingValue.includes(index)) {
                return `<td class="missing-value"></td>`
              }

              return "<td></td>"
            })
            .join("")}
        </tr>`

        // Add the nested rows within a collapsible row
        rows += `<tr id="${uniqueRowId}" class="collapse" style="display:none;">
          <td colspan="${fileNames.length + 1}" style="padding:0;">
            <table style='border-spacing: 0; width: 100%; border-collapse: collapse; table-layout: fixed;'>${nestedRows}</table>
          </td>
        </tr>`
      } else {
        let row = `<tr><td style="padding-left: ${nestIndentation}px;">${key}</td>`

        dataArray.forEach((obj, index) => {
          const value = obj[key]
          const safeContent = (value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;")

          const cellClass = value?.trim() === "" ? "missing-value" : ""
          if (cellClass) {
            missingValues.push(index) // flag this row as having a missing value
          }

          row += `<td contenteditable="true" class="${cellClass}" onfocus="this.setAttribute('data-original', this.innerText)" 
            onblur="handleBlur('${uniqueRowId}', ${index}, this)">${safeContent}</td>`
        })

        row += "</tr>"
        rows += row
      }
    })

    return { rows, isMissingValue: missingValues }
  }

  const { rows: tableRows } = generateTableRows(jsonData)

  return `
    <html>
    <head>
			<style>
				table { width: 100%; border-collapse: collapse; table-layout: fixed; }
				th, td { border: 1px solid black; padding: 5px; text-align: left; vertical-align: top; }
				th { background-color: #f2f2f2; color: black }
				table > tbody > tr:not(.collapse) { /* Direct children only, excluding collapse class */
					background-color: transparent; /* Default state */
				}
				table > tbody > tr:not(.collapse):hover { /* Apply hover only to non-collapsed direct children */
					background-color: #555555;
				}
				.collapse table { border: none; }
				.collapse table tr { /* Targeting all tr within nested tables */
					background-color: transparent; /* Ensuring no hover effect is applied here */
				}
				.missing-value { background-color: #772222; }
			</style>
      <script>
				const vscode = acquireVsCodeApi()
        function toggleVisibility(id) {
          var element = document.getElementById(id);
          if (element.style.display === 'none') {
            element.style.display = 'table-row';
          } else {
            element.style.display = 'none';
          }
        }
        function sendEdit(uniqueRowId, fileIndex, newValue) {
          vscode.postMessage({
            command: 'edit',
            key: uniqueRowId,
            fileIndex: fileIndex,
            newValue: newValue
          });
        }
				function handleBlur(uniqueRowId, fileIndex, element) {
					var originalValue = element.getAttribute('data-original');
					var newValue = element.innerText;
					if (newValue !== originalValue) {
						sendEdit(uniqueRowId, fileIndex, newValue);
					}

					// Update cell style based on whether the new value is empty
					if (newValue.trim() === '') {
						element.classList.add('missing-value')  // No value entered, keep or set red background
					} else {
						element.classList.remove('missing-value');  // Value entered, clear red background
					}
				}
      </script>
    </head>
    <body>
      <table>
        <thead>
          ${tableHeaders}
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `
}
