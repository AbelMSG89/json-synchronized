import * as vscode from "vscode"
import fs from "fs/promises"
import path from "path"
import crypto from "crypto"
import ReactDOM from 'react-dom';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

function getNonce() {
  return crypto.randomBytes(16).toString("base64")
}

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

// This method is called when your extension is deactivated
export function deactivate() {}

async function readAndParseJson(
  filePath: string
): Promise<Record<string, any>> {
  const content = await fs.readFile(filePath, { encoding: "utf-8" })
  return JSON.parse(content)
}

async function createWebviewPanel(context: vscode.ExtensionContext, fileUris: vscode.Uri[]) {
  const fileNames: string[] = fileUris.map((uri) => path.basename(uri.fsPath));
  const jsonData: Array<Record<string, any>> = await Promise.all(
    fileUris.map((uri) => readAndParseJson(uri.fsPath))
  );
  const nonce = getNonce(); 

  const panel: vscode.WebviewPanel = vscode.window.createWebviewPanel(
    "jsonFiles",
    "Harmonize JSON",
    vscode.ViewColumn.One,
    { enableScripts: true, retainContextWhenHidden: true }
  );

  const scriptUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview.js'));
	
  panel.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}';">
    </head>
    <body>
      <div id="root"></div>
      <script nonce="${nonce}" src="${scriptUri}"></script>
      </script>
    </body>
    </html>
  `;
}

function getWebviewContent(
  fileNames: string[],
  jsonData: Array<Record<string, any>>,
  nonce: string
): string {
  let tableHeaders = "<th>Key</th>"
  fileNames.forEach((name) => {
    tableHeaders += `<th>${name}</th>`
  })

  function generateTableRows(
    dataArray: Array<Record<string, any>>,
    depth = 0,
    parentId = "root"
  ) {
    let rows = ""
    const allKeys = new Set<string>()

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

      if (isNested) {
        rows += `<tr id="${uniqueRowId}-header" onclick="toggleVisibility('${uniqueRowId}');"><td style="padding-left: ${
          depth * 20
        }px; cursor: pointer;">${key}</td>${fileNames
          .map(() => "<td></td>")
          .join("")}</tr>`
        const nestedDataArray = dataArray.map((obj) => obj[key] || {})
        const nestedRows = generateTableRows(
          nestedDataArray,
          depth + 1,
          uniqueRowId
        )
        rows += `<tr id="${uniqueRowId}" class="collapse" style="display:none;"><td colspan="${
          fileNames.length + 1
        }" style="padding:0;"><table style='border-spacing: 0; width: 100%; border-collapse: collapse; table-layout: fixed;'>${nestedRows}</table></td></tr>`
      } else {
        let row = `<tr><td style="padding-left: ${depth * 20}px;">${key}</td>`
        dataArray.forEach((obj, index) => {
					const value = obj[key];
          // Ensure to escape potential HTML in the content to prevent XSS and rendering issues
          const safeContent = (obj[key] ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;")
						const cellClass = !value ? 'missing-value' : '';
						row += `<td contenteditable="true" class="${cellClass}" onfocus="this.setAttribute('data-original', this.innerText)" onblur="handleBlur('${uniqueRowId}', ${index}, this)">${safeContent}</td>`;
        })
        row += "</tr>"
        rows += row
      }
    })

    return rows
  }

  const tableRows = generateTableRows(jsonData)

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
