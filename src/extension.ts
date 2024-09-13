import * as vscode from "vscode"
import fs from "fs/promises"
import path from "path"
import crypto from "crypto"

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
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

async function createWebviewPanel(
  context: vscode.ExtensionContext,
  fileUris: vscode.Uri[]
) {
  const fileNames: string[] = fileUris.map((uri) => path.basename(uri.fsPath))
  const jsonData: Array<Record<string, any>> = await Promise.all(
    fileUris.map((uri) => readAndParseJson(uri.fsPath))
  )
  const nonce = getNonce()
  

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

  // Safely serialize the jsonData to avoid XSS attacks
  const jsonDataString = JSON.stringify(jsonData).replace(/</g, "\\u003c")
  const fileNamesString = JSON.stringify(fileNames).replace(/</g, '\\u003c');
  
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
      <script nonce="${nonce}">
        // expose data to React
        const initialData = ${jsonDataString};
        const fileNames = ${fileNamesString};
      </script>
      <script nonce="${nonce}" src="${scriptUri}"></script>
      </script>
    </body>
    </html>
  `

  // send initial data
  panel.webview.postMessage({ type: 'json', data: jsonData });

  // Handle messages received from the webview
  panel.webview.onDidReceiveMessage(
    async (message) => {
      if (message.command === "edit") {
        // Handle edit message
        const filePath = fileUris[message.fileIndex].fsPath;
        const jsonData = await readAndParseJson(filePath);
        const parts = message.key.split("-");

        // Remove the first parentID "root"
        parts.shift();
        let target = jsonData;

        for (let i = 0; i < parts.length; i++) {
          if (i === parts.length - 1) {
            target[parts[i]] = message.newValue;
          } else {
            if (!target[parts[i]]) {
              // Ensure nested objects exist
              target[parts[i]] = {};
            }
            target = target[parts[i]];
          }
        }
        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
        vscode.window.showInformationMessage(
          `Updated ${parts.join(".")} in ${path.basename(filePath)}`
        );
      }
    },
    undefined,
    context.subscriptions
  );
}