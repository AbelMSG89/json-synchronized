import * as vscode from "vscode"
import fsPromise from "fs/promises"
import fs from "fs"

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "json-synchronizer.synchronize",
    async (uri) => {
      const files = await vscode.workspace.findFiles(
        new vscode.RelativePattern(uri.fsPath, "**/*.json")
      )
      createWebviewPanel(uri.fsPath, context, files)
    }
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {}

async function readAndParseJson(
  filePath: string
): Promise<Record<string, any>> {
  const content = await fsPromise.readFile(filePath, { encoding: "utf-8" })
  try {
    return JSON.parse(content)
  } catch (e) {
    console.warn(e)
    vscode.window.showErrorMessage(`Unable to parse JSON`, {
      modal: true,
      detail: filePath,
    })
    return {}
  }
}

async function createWebviewPanel(
  baseUriPath: string,
  context: vscode.ExtensionContext,
  fileUris: vscode.Uri[]
) {
  /**
   * fileName -> json data map
   */
  const uriData: Record<string, any> = {}

  const result = await Promise.all(
    fileUris.map(async (uri) => {
      return {
        fileName: getFileName(baseUriPath, uri),
        json: await readAndParseJson(uri.fsPath),
      }
    })
  )

  result
    .filter(({ fileName, json }) => {
      if (json instanceof Array) {
        vscode.window.showWarningMessage(
          `
          Unable to load file '${fileName}'. No support for JSON arrays.
        `
        )
        return false
      }
      return true
    })
    .forEach(({ fileName, json }) => (uriData[fileName] = json))

  const panel: vscode.WebviewPanel = vscode.window.createWebviewPanel(
    "jsonFiles",
    "Synchronize JSON",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        // allow the webview to load local resources from the 'dist' directory
        vscode.Uri.joinPath(context.extensionUri, "dist"),
      ],
    }
  )

  const scriptUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "dist", "webview.js")
  )

  panel.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" >
    </head>
    <body>
      <div id="root"></div>
      <script src="${scriptUri}"></script>
    </body>
    </html>
  `

  // send initial data
  panel.webview.postMessage({ type: "json", data: uriData })

  panel.webview.onDidReceiveMessage(
    async (message) => {
      switch (message.command) {
        case "invalidData":
          vscode.window.showErrorMessage(
            `
              Invalid data: This extension only supports files containing a single JSON object with nested objects and string values. 
            `,
            { modal: true, detail: message.newValue }
          )
          panel.dispose()
          break
        case "showWarning":
          vscode.window.showWarningMessage(message.newValue)
          break
        case "edit":
          const fileUri = fileUris[message.fileIndex]
          update(message.key, fileUri, message)
          break
        case "add":
          fileUris.forEach((fileUri) => {
            update(message.key, fileUri, message)
          })
          break
        case "remove":
          vscode.window
            .showInformationMessage(
              `Are you sure you want to delete ${message.key.join(".")}?`,
              { modal: true },
              "OK"
            )
            .then((res) => {
              if (res === "OK") {
                fileUris.forEach((fileUri) => {
                  deleteKey(message.key, fileUri)
                })
              }
            })
          break
      }
    },
    undefined,
    context.subscriptions
  )

  async function deleteKey(parts: string[], fileUri: vscode.Uri) {
    const filePath = fileUri.fsPath
    const jsonData = uriData[getFileName(baseUriPath, fileUri)]

    let target = jsonData

    for (let i = 0; i < parts.length - 1; i++) {
      if (target[parts[i]] === undefined) {
        // key path doesn't exist, nothing to remove
        return
      }
      target = target[parts[i]]
    }

    const lastKey = parts[parts.length - 1]
    if (target.hasOwnProperty(lastKey)) {
      delete target[lastKey]

      await fsPromise.writeFile(
        filePath,
        JSON.stringify(jsonData, null, 2),
        "utf-8"
      )
    }
  }

  async function update(parts: string[], fileUri: vscode.Uri, message: any) {
    const filePath = fileUri.fsPath
    const newJsonData = uriData[getFileName(baseUriPath, fileUri)]

    let target = newJsonData
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
    await fsPromise.writeFile(
      filePath,
      JSON.stringify(newJsonData, null, 2),
      "utf-8"
    )
  }

  fileUris.forEach((fileUri) => {
    fs.watch(fileUri.fsPath, {}, async () => {
      const data = await readAndParseJson(fileUri.fsPath)
      uriData[getFileName(baseUriPath, fileUri)] = data
      panel.webview.postMessage({ type: "json", data: uriData })
    })
  })
}

/**
 * remove the part of the path that all files share
 */
function getFileName(baseUriPath: string, uri: vscode.Uri) {
  return uri.fsPath.substring(baseUriPath.length, uri.fsPath.length)
}
