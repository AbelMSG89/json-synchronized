import * as vscode from "vscode"
import fsPromise from "fs/promises"
import fs from "fs"
import path from "path"

export function activate(context: vscode.ExtensionContext) {
  console.log("json-harmonizer is active")

  const disposable = vscode.commands.registerCommand(
    "json-harmonizer.harmonize",
    async (uri) => {
      const files = await vscode.workspace.findFiles(
        new vscode.RelativePattern(uri.fsPath, "**/*.json")
      )
      createWebviewPanel(uri.fsPath, context, files)
    }
  )

  context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function readAndParseJson(
  filePath: string
): Promise<Record<string, any>> {
  const content = await fsPromise.readFile(filePath, { encoding: "utf-8" })

  try {
    return JSON.parse(content)
  } catch (e) {
    console.warn(e)
    return {}
  }
}

function getFileName(baseUriPath: string, uri: vscode.Uri) {
  return uri.fsPath.substring(baseUriPath.length, uri.fsPath.length)
}

async function createWebviewPanel(
  baseUriPath: string,
  context: vscode.ExtensionContext,
  fileUris: vscode.Uri[]
) {
  const jsonData: Record<string, any> = {}

  const result = await Promise.all(
    fileUris.map(async (uri) => {
      return {
        // remove the part of the path that all files share
        uri: getFileName(baseUriPath, uri),
        json: await readAndParseJson(uri.fsPath),
      }
    })
  )

  result.forEach(({ uri, json }) => (jsonData[uri] = json))

  const panel: vscode.WebviewPanel = vscode.window.createWebviewPanel(
    "jsonFiles",
    "Harmonize JSON",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode.Uri.joinPath(context.extensionUri, "dist"), // Allow the webview to load local resources from the 'dist' directory
      ],
    }
  )

  const scriptUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "dist", "webview.js")
  )

  // todo: <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'">;
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
  panel.webview.postMessage({ type: "json", data: jsonData })

  // Handle messages received from the webview
  panel.webview.onDidReceiveMessage(
    async (message) => {
      switch (message.command) {
        case "edit":
          edit(message)
          break
        case "add":
          add(message)
          break
        case "remove":
          remove(message)
          break
      }
    },
    undefined,
    context.subscriptions
  )

  async function remove(message: any) {
    const parts = message.key
    // Remove the first parentID "root"
    parts.shift()
  
    fileUris.forEach(async (fileUri) => {
      await deleteKey(parts, fileUri)
    })
  }

  async function deleteKey(parts: string[], fileUri: vscode.Uri) {
    const filePath = fileUri.fsPath
    const jsonData = await readAndParseJson(filePath)
  
    let target = jsonData
    const pathStack = []
  
    for (let i = 0; i < parts.length - 1; i++) {
      if (target[parts[i]] === undefined) {
        // Key doesn't exist in this file, nothing to remove
        return
      }
      pathStack.push(target)
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
  
      vscode.window.showInformationMessage(
        `Removed ${parts.join(".")} in ${getFileName(baseUriPath, fileUri)}`
      )
    } else {
      // Key doesn't exist in this file
      vscode.window.showInformationMessage(
        `Key ${parts.join(".")} not found in ${getFileName(baseUriPath, fileUri)}`
      )
    }
  }

  async function update(parts: string[], fileUri: vscode.Uri, message: any) {
    const filePath = fileUri.fsPath
    const newJsonData = await readAndParseJson(filePath)

    let target = newJsonData
    for (let i = 0; i < parts.length; i++) {
      if (i === parts.length - 1) {
        target[parts[i]] = message.newValue // Set the value for the key
      } else {
        if (!target[parts[i]]) {
          // Ensure nested objects exist
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
    vscode.window.showInformationMessage(
      `${message.command === "add" ? "Added" : "Updated"} ${parts.join(
        "."
      )} in ${getFileName(baseUriPath, fileUri)}`
    )
  }


  async function edit(message: any) {
    const fileUri = fileUris[message.fileIndex]
    const parts = message.key

    // Remove the first parentID "root"
    parts.shift()

    update(parts, fileUri, message)
  }

  async function add(message: any) {
    const parts = message.key
    // Remove the first parentID "root"
    parts.shift()

    fileUris.forEach(async (fileUri) => {
      update(parts, fileUri, message)
    })
  }

  fileUris.forEach((fileUri) => {
    fs.watch(fileUri.fsPath, {}, async () => {
      const data = await readAndParseJson(fileUri.fsPath)
      jsonData[getFileName(baseUriPath, fileUri)] = data
      panel.webview.postMessage({ type: "json", data: jsonData })
    })
  })
}
