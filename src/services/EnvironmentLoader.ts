import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

export class EnvironmentLoader {
  private static loadedEnvPath: string | null = null;
  private static originalEnv: { [key: string]: string | undefined } = {};

  /**
   * Load environment variables from a custom .env file or default .env
   */
  static loadCustomEnvFile(): void {
    const envPath = this.getCustomEnvPath();

    if (envPath && envPath !== this.loadedEnvPath) {
      this.restoreOriginalEnv();
      this.loadEnvFile(envPath);
      this.loadedEnvPath = envPath;
    } else if (!envPath && this.loadedEnvPath) {
      // If no .env file is found, restore original environment
      this.restoreOriginalEnv();
      this.loadedEnvPath = null;
    }
  }

  /**
   * Get the custom .env file path from VS Code configuration or default .env
   */
  private static getCustomEnvPath(): string | null {
    const config = vscode.workspace.getConfiguration();
    const envFilePath = config.get<string>("json-synchronizer.envFilePath");

    let targetPath: string;

    if (!envFilePath || envFilePath.trim() === "") {
      // Default to .env in workspace root if no custom path is specified
      targetPath = ".env";
    } else {
      targetPath = envFilePath.trim();
    }

    // Handle relative and absolute paths
    let resolvedPath = targetPath;

    if (!path.isAbsolute(resolvedPath)) {
      // If it's a relative path, resolve it relative to the workspace
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (workspaceFolders && workspaceFolders.length > 0) {
        resolvedPath = path.resolve(
          workspaceFolders[0].uri.fsPath,
          resolvedPath,
        );
      } else {
        // Fallback to current working directory
        resolvedPath = path.resolve(process.cwd(), resolvedPath);
      }
    }

    // Check if file exists
    if (fs.existsSync(resolvedPath)) {
      return resolvedPath;
    } else {
      // Only show warning if user explicitly specified a path
      if (envFilePath && envFilePath.trim() !== "") {
        vscode.window.showWarningMessage(
          `Environment file not found: ${resolvedPath}`,
        );
      }
      // For default .env, silently return null if it doesn't exist
      return null;
    }
  }

  /**
   * Load environment variables from a specific file
   */
  private static loadEnvFile(filePath: string): void {
    try {
      // Backup original environment variables
      this.backupOriginalEnv();

      // Load the .env file
      const result = dotenv.config({ path: filePath });

      if (result.error) {
        vscode.window.showErrorMessage(
          `Error loading environment file: ${result.error.message}`,
        );
        return;
      }

      // Merge with process.env
      if (result.parsed) {
        Object.assign(process.env, result.parsed);
      }

      vscode.window.showInformationMessage(
        `Environment loaded from: ${path.basename(filePath)}`,
      );
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to load environment file: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Backup original environment variables
   */
  private static backupOriginalEnv(): void {
    const envKeys = [
      "GOOGLE_API_KEY",
      "GOOGLE_CLOUD_PROJECT",
      "AZURE_TRANSLATOR_KEY",
      "AZURE_TRANSLATOR_REGION",
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY",
      "AWS_DEFAULT_REGION",
      "JSON_SYNCHRONIZER_GOOGLE_KEY",
      "JSON_SYNCHRONIZER_GOOGLE_PROJECT",
      "JSON_SYNCHRONIZER_MICROSOFT_KEY",
      "JSON_SYNCHRONIZER_MICROSOFT_REGION",
      "JSON_SYNCHRONIZER_AMAZON_KEY",
      "JSON_SYNCHRONIZER_AMAZON_SECRET",
      "JSON_SYNCHRONIZER_AMAZON_REGION",
    ];

    envKeys.forEach((key) => {
      if (!(key in this.originalEnv)) {
        this.originalEnv[key] = process.env[key];
      }
    });
  }

  /**
   * Restore original environment variables
   */
  private static restoreOriginalEnv(): void {
    Object.entries(this.originalEnv).forEach(([key, value]) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
  }

  /**
   * Get status of currently loaded environment file
   */
  static getLoadedEnvStatus(): string {
    if (this.loadedEnvPath) {
      const fileName = path.basename(this.loadedEnvPath);
      const isDefault = fileName === ".env" && !vscode.workspace.getConfiguration().get<string>("json-synchronizer.envFilePath");
      return isDefault 
        ? `Using default .env file: ${fileName}`
        : `Custom env loaded: ${fileName}`;
    }
    return "Using system environment variables";
  }

  /**
   * List available .env files in the workspace
   */
  static async getAvailableEnvFiles(): Promise<string[]> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return [];
    }

    const envFiles: string[] = [];
    const workspacePath = workspaceFolders[0].uri.fsPath;

    try {
      const files = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspacePath, ".env*"),
        null,
        10,
      );

      files.forEach((file) => {
        const relativePath = path.relative(workspacePath, file.fsPath);
        envFiles.push(relativePath);
      });

      return envFiles.sort();
    } catch (error) {
      console.error("Error finding .env files:", error);
      return [];
    }
  }
}
