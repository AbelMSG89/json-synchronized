import * as vscode from "vscode";
import fsPromise from "fs/promises";
import fs from "fs";
import * as path from "path";
import { TranslationService } from "./services/TranslationService";
import { EnvironmentLoader } from "./services/EnvironmentLoader";

export function activate(context: vscode.ExtensionContext) {
  // Load custom environment file on activation
  EnvironmentLoader.loadCustomEnvFile();

  // Listen for configuration changes to reload environment file
  const configChangeListener = vscode.workspace.onDidChangeConfiguration(
    (e) => {
      if (e.affectsConfiguration("json-synchronized.envFilePath")) {
        EnvironmentLoader.loadCustomEnvFile();
      }
    },
  );
  context.subscriptions.push(configChangeListener);

  const disposable = vscode.commands.registerCommand(
    "json-synchronized.synchronize",
    async (uri) => {
      const files = await vscode.workspace.findFiles(
        new vscode.RelativePattern(uri.fsPath, "**/*.json"),
      );
      createWebviewPanel(uri.fsPath, context, files);
    },
  );

  const selectEnvFileCommand = vscode.commands.registerCommand(
    "json-synchronized.selectEnvFile",
    async () => {
      await selectEnvironmentFile();
    },
  );

  context.subscriptions.push(disposable, selectEnvFileCommand);
}

export function deactivate() {}

async function readAndParseJson(
  filePath: string,
): Promise<Record<string, any>> {
  if (!fs.existsSync(filePath)) {
    // File doesn't exist; handle accordingly
    return {};
  }
  try {
    const content = await fsPromise.readFile(filePath, { encoding: "utf-8" });
    if (!content.trim()) {
      // Content is empty; return an empty object or handle accordingly
      return {};
    }
    return JSON.parse(content);
  } catch (e) {
    console.warn(e);
    // Do not show error message here; handle it in the caller
    throw e;
  }
}

async function createWebviewPanel(
  baseUriPath: string,
  context: vscode.ExtensionContext,
  fileUris: vscode.Uri[],
) {
  /**
   * fileName -> json data map
   */
  const uriData: Record<string, any> = {};

  const result = await Promise.all(
    fileUris.map(async (uri) => {
      return {
        fileName: getFileName(baseUriPath, uri),
        json: await readAndParseJson(uri.fsPath),
        uri,
      };
    }),
  );

  // Filter out files that contain arrays and show a warning
  const validResults = result.filter(({ fileName, json }) => {
    if (Array.isArray(json)) {
      vscode.window.showWarningMessage(
        `Unable to load file '${fileName}'. No support for JSON arrays.`,
      );
      return false;
    }
    return true;
  });

  // Update uriData and fileUris with valid files only
  validResults.forEach(({ fileName, json }) => (uriData[fileName] = json));
  fileUris = validResults.map(({ uri }) => uri);

  const panel: vscode.WebviewPanel = vscode.window.createWebviewPanel(
    "jsonFiles",
    "Synchronize JSON",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        // allow the webview to load local resources from the 'dist' directory
        vscode.Uri.file(path.join(context.extensionPath, "dist")),
      ],
    },
  );

  const scriptUri = panel.webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, "dist", "webview.js")),
  );

  panel.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-eval' 'unsafe-inline' ${panel.webview.cspSource};">
    </head>
    <body>
      <div id="root"></div>
      <script src="${scriptUri}"></script>
    </body>
    </html>
  `;

  // send initial data
  panel.webview.postMessage({ type: "json", data: uriData });

  panel.webview.onDidReceiveMessage(
    async (message) => {
      switch (message.command) {
        case "invalidData":
          vscode.window.showErrorMessage(
            `
              Invalid data: This extension only supports files containing a single JSON object with nested objects and string values. 
            `,
            { modal: true, detail: message.newValue },
          );
          panel.dispose();
          break;
        case "showWarning":
          vscode.window.showWarningMessage(message.newValue);
          break;
        case "edit":
          const fileUri = fileUris[message.fileIndex];
          update(message.key, fileUri, message);
          break;
        case "add":
          fileUris.forEach((fileUri) => {
            update(message.key, fileUri, message);
          });
          break;
        case "remove":
          vscode.window
            .showInformationMessage(
              `Are you sure you want to delete ${message.key.join(".")}?`,
              { modal: true },
              "OK",
            )
            .then((res) => {
              if (res === "OK") {
                fileUris.forEach((fileUri) => {
                  deleteKey(message.key, fileUri);
                });
              }
            });
          break;
        case "renameKey":
          // Check if the new key already exists at the same level
          const checkResult = checkKeyExists(
            message.oldPath,
            message.newKey,
            uriData,
          );
          if (checkResult.exists) {
            vscode.window.showWarningMessage(
              `Key "${message.newKey}" already exists`,
            );
            return;
          }

          fileUris.forEach((fileUri) => {
            renameKey(message.oldPath, message.newKey, fileUri);
          });
          break;
        case "translate":
          if (
            message.text &&
            message.sourceLanguage &&
            message.targetLanguages
          ) {
            await handleTranslation(
              message.key!,
              message.text,
              message.sourceLanguage,
              message.targetLanguages,
            );
          }
          break;
      }
    },
    undefined,
    context.subscriptions,
  );

  async function handleTranslation(
    keyPath: string[],
    sourceText: string,
    sourceLanguage: string,
    targetLanguages: string[],
  ) {
    // Ensure environment is loaded before translation
    EnvironmentLoader.loadCustomEnvFile();

    if (!TranslationService.hasTranslationService()) {
      vscode.window.showWarningMessage(
        "No translation service configured. Please configure a translation service in settings.",
      );
      return;
    }

    try {
      // Show progress indicator
      const translations = await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Translating...",
          cancellable: false,
        },
        async (progress) => {
          progress.report({ message: "Processing translation request..." });

          const result = await TranslationService.translateText(
            sourceText,
            sourceLanguage,
            targetLanguages,
          );

          if (Object.keys(result).length === 0) {
            throw new Error("No translations received");
          }

          progress.report({ message: "Applying translations to files..." });

          // Apply translations to files
          for (const [targetLanguage, translatedText] of Object.entries(
            result,
          )) {
            // Find the file index for this target language
            const targetFileIndex = fileUris.findIndex((uri) => {
              const fileName = getFileName(baseUriPath, uri);
              const fileLanguage = fileName.split("/")[0].toLowerCase();
              return fileLanguage === targetLanguage;
            });

            if (targetFileIndex !== -1) {
              const targetFileUri = fileUris[targetFileIndex];
              await update(keyPath, targetFileUri, {
                command: "edit",
                key: keyPath,
                fileIndex: targetFileIndex,
                newValue: translatedText,
              });
            }
          }

          // Refresh the webview
          panel.webview.postMessage({ type: "json", data: uriData });

          return result;
        },
      );

      vscode.window.showInformationMessage(
        `Successfully translated to ${Object.keys(translations).length} language(s)`,
      );
    } catch (error) {
      vscode.window.showErrorMessage(
        `Translation failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async function deleteKey(parts: string[], fileUri: vscode.Uri) {
    const filePath = fileUri.fsPath;
    const jsonData = uriData[getFileName(baseUriPath, fileUri)];

    if (!jsonData) {
      // The file was not loaded (e.g., contains an array)
      return;
    }

    let target = jsonData;

    for (let i = 0; i < parts.length - 1; i++) {
      if (target[parts[i]] === undefined) {
        // key path doesn't exist, nothing to remove
        return;
      }
      target = target[parts[i]];
    }

    const lastKey = parts[parts.length - 1];
    if (Object.prototype.hasOwnProperty.call(target, lastKey)) {
      delete target[lastKey];

      await fsPromise.writeFile(
        filePath,
        JSON.stringify(jsonData, null, 2),
        "utf-8",
      );
    }
  }

  function checkKeyExists(
    oldPath: string[],
    newKey: string,
    uriData: Record<string, any>,
  ): { exists: boolean } {
    // Check if the new key exists at the same level in any file
    for (const fileName in uriData) {
      const jsonData = uriData[fileName];
      if (!jsonData) {
        continue;
      }

      let target = jsonData;

      // Navigate to the parent object
      for (let i = 0; i < oldPath.length - 1; i++) {
        if (!target[oldPath[i]]) {
          target = null;
          break;
        }
        target = target[oldPath[i]];
      }

      // Check if new key exists at this level
      if (target && Object.prototype.hasOwnProperty.call(target, newKey)) {
        return { exists: true };
      }
    }
    return { exists: false };
  }

  async function renameKey(
    oldPath: string[],
    newKey: string,
    fileUri: vscode.Uri,
  ) {
    const filePath = fileUri.fsPath;
    const jsonData = uriData[getFileName(baseUriPath, fileUri)];

    if (!jsonData) {
      // The file was not loaded (e.g., contains an array)
      return;
    }

    let target = jsonData;

    // Navigate to the parent object
    for (let i = 0; i < oldPath.length - 1; i++) {
      if (!target[oldPath[i]]) {
        // Path doesn't exist, nothing to rename
        return;
      }
      target = target[oldPath[i]];
    }

    const oldKey = oldPath[oldPath.length - 1];

    // Check if the old key exists
    if (!Object.prototype.hasOwnProperty.call(target, oldKey)) {
      return;
    }

    // Store the value
    const value = target[oldKey];

    // Delete the old key and set the new key
    delete target[oldKey];
    target[newKey] = value;

    // Update the uriData with the new structure
    uriData[getFileName(baseUriPath, fileUri)] = jsonData;

    // Write to file
    await fsPromise.writeFile(
      filePath,
      JSON.stringify(jsonData, null, 2),
      "utf-8",
    );
  }

  async function update(parts: string[], fileUri: vscode.Uri, message: any) {
    const filePath = fileUri.fsPath;
    const newJsonData = uriData[getFileName(baseUriPath, fileUri)];

    if (!newJsonData) {
      // The file was not loaded (e.g., contains an array)
      return;
    }

    let target = newJsonData;
    for (let i = 0; i < parts.length; i++) {
      if (i === parts.length - 1) {
        target[parts[i]] = message.newValue;
      } else {
        if (!target[parts[i]]) {
          // ensure nested objects exist
          target[parts[i]] = {};
        }
        target = target[parts[i]];
      }
    }
    await fsPromise.writeFile(
      filePath,
      JSON.stringify(newJsonData, null, 2),
      "utf-8",
    );
  }

  // Create a single watcher for all JSON files in the folder
  const pattern = new vscode.RelativePattern(baseUriPath, "**/*.json");
  const watcher = vscode.workspace.createFileSystemWatcher(pattern);

  const maxRetries = 5;
  const retryDelay = 50; // milliseconds

  const pendingUpdates: { [key: string]: NodeJS.Timeout } = {};

  async function handleFileChange(uri: vscode.Uri, attempt = 1) {
    const fileName = getFileName(baseUriPath, uri);
    try {
      const data = await readAndParseJson(uri.fsPath);

      if (Array.isArray(data)) {
        vscode.window.showWarningMessage(
          `Unable to load file '${fileName}'. No support for JSON arrays.`,
        );
        // Remove the file from uriData and fileUris if it was previously valid
        if (uriData[fileName]) {
          delete uriData[fileName];
          fileUris = fileUris.filter((file) => file.fsPath !== uri.fsPath);
          panel.webview.postMessage({ type: "json", data: uriData });
        }
        return;
      }

      // If the file was not previously loaded and is now valid, add it
      if (!uriData[fileName]) {
        uriData[fileName] = data;
        fileUris.push(uri);
      } else {
        uriData[fileName] = data;
      }

      panel.webview.postMessage({ type: "json", data: uriData });
    } catch (e) {
      // If the file is empty or invalid, retry after a short delay
      if (attempt <= maxRetries) {
        clearTimeout(pendingUpdates[uri.fsPath]);
        pendingUpdates[uri.fsPath] = setTimeout(() => {
          handleFileChange(uri, attempt + 1);
        }, retryDelay);
      } else {
        // After max retries, give up and show an error if necessary
        console.warn(
          `Failed to parse JSON file after ${maxRetries} attempts: ${uri.fsPath}`,
        );
      }
    }
  }

  watcher.onDidChange(handleFileChange);
  watcher.onDidCreate(async (uri) => {
    // Handle new file creation
    await handleFileChange(uri);
  });
  watcher.onDidDelete((uri) => {
    // Handle file deletion
    const fileName = getFileName(baseUriPath, uri);
    delete uriData[fileName];
    // Remove the fileUri from the array
    fileUris = fileUris.filter((file) => file.fsPath !== uri.fsPath);
    panel.webview.postMessage({ type: "json", data: uriData });
  });

  panel.onDidDispose(() => watcher.dispose());
}

/**
 * Extract a clean display name from the file path
 * For files like /en.json -> "en"
 * For nested files like /en/comments.json -> "en/comments"
 */
function getFileName(baseUriPath: string, uri: vscode.Uri) {
  const relativePath = uri.fsPath.substring(baseUriPath.length);

  // Remove leading slash or backslash if present
  const cleanPath =
    relativePath.startsWith("/") || relativePath.startsWith("\\")
      ? relativePath.substring(1)
      : relativePath;

  // Remove .json extension
  const withoutExtension = cleanPath.replace(/\.json$/, "");

  return withoutExtension;
}

/**
 * Show a quick pick to select an environment file
 */
async function selectEnvironmentFile() {
  try {
    const availableFiles = await EnvironmentLoader.getAvailableEnvFiles();

    if (availableFiles.length === 0) {
      vscode.window.showInformationMessage(
        "No .env files found in the workspace. You can create one or set a custom path in settings.",
      );
      return;
    }

    const items = [
      {
        label: "$(clear-all) None (use system environment)",
        description: "Use system environment variables",
        detail: "Clear custom environment file setting",
        envPath: "",
      },
      ...availableFiles.map((file) => ({
        label: `$(file-text) ${file}`,
        description: `Environment file`,
        detail: `Use ${file} for environment variables`,
        envPath: file,
      })),
    ];

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: "Select an environment file to use",
      title: "JSON Synchronized - Environment File",
    });

    if (selected !== undefined) {
      // Update the configuration
      const config = vscode.workspace.getConfiguration();
      await config.update(
        "json-synchronized.envFilePath",
        selected.envPath,
        vscode.ConfigurationTarget.Workspace,
      );

      // Load the new environment file
      EnvironmentLoader.loadCustomEnvFile();

      if (selected.envPath) {
        vscode.window.showInformationMessage(
          `Environment file set to: ${selected.envPath}`,
        );
      } else {
        vscode.window.showInformationMessage(
          "Environment file cleared. Using system environment variables.",
        );
      }
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error selecting environment file: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
