import * as vscode from "vscode";

export enum TranslationServiceEnum {
  MicrosoftTranslator = "MicrosoftTranslator",
  GoogleTranslator = "GoogleTranslator",
  AmazonTranslator = "AmazonTranslator",
}

export class TranslationConfiguration {
  static get TRANSLATION_SERVICE(): TranslationServiceEnum | null {
    const value = vscode.workspace
      .getConfiguration()
      .get<string>("json-synchronizer.translationService");
    return value && value !== "" ? (value as TranslationServiceEnum) : null;
  }

  static get TRANSLATION_SERVICE_API_KEY(): string | null {
    // Try environment variable first, then VS Code setting
    const envValue = process.env.JSON_SYNCHRONIZER_API_KEY;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string>("json-synchronizer.translationServiceApiKey");
    return value && value !== "" ? value : null;
  }

  static get TRANSLATION_SERVICE_API_SECRET(): string | null {
    // Try environment variable first, then VS Code setting
    const envValue = process.env.JSON_SYNCHRONIZER_API_SECRET;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string>("json-synchronizer.translationServiceApiSecret");
    return value && value !== "" ? value : null;
  }

  static get TRANSLATION_SERVICE_API_REGION(): string | null {
    // Try environment variable first, then VS Code setting
    const envValue = process.env.JSON_SYNCHRONIZER_API_REGION;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string>("json-synchronizer.translationServiceApiRegion");
    return value && value !== "" ? value : null;
  }

  static get TRANSLATION_SERVICE_AMAZON_KEY(): string | null {
    // Try environment variable first
    const envValue =
      process.env.AWS_ACCESS_KEY_ID || process.env.JSON_SYNCHRONIZER_AMAZON_KEY;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronizer.translationServiceAmazon");
    return value && value.length === 3 && value[0] !== "" ? value[0] : null;
  }

  static get TRANSLATION_SERVICE_AMAZON_SECRET(): string | null {
    // Try environment variable first
    const envValue =
      process.env.AWS_SECRET_ACCESS_KEY ||
      process.env.JSON_SYNCHRONIZER_AMAZON_SECRET;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronizer.translationServiceAmazon");
    return value && value.length === 3 && value[1] !== "" ? value[1] : null;
  }

  static get TRANSLATION_SERVICE_AMAZON_REGION(): string | null {
    // Try environment variable first
    const envValue =
      process.env.AWS_DEFAULT_REGION ||
      process.env.JSON_SYNCHRONIZER_AMAZON_REGION;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronizer.translationServiceAmazon");
    return value && value.length === 3 && value[2] !== "" ? value[2] : null;
  }

  static get TRANSLATION_SERVICE_GOOGLE_KEY(): string | null {
    // Try environment variable first
    const envValue =
      process.env.GOOGLE_API_KEY || process.env.JSON_SYNCHRONIZER_GOOGLE_KEY;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronizer.translationServiceGoogle");
    return value && value.length === 3 && value[0] !== "" ? value[0] : null;
  }

  static get TRANSLATION_SERVICE_GOOGLE_SECRET(): string | null {
    // Try environment variable first
    const envValue = process.env.JSON_SYNCHRONIZER_GOOGLE_SECRET;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronizer.translationServiceGoogle");
    return value && value.length === 3 && value[1] !== "" ? value[1] : null;
  }

  static get TRANSLATION_SERVICE_GOOGLE_PROJECT_ID(): string | null {
    // Try environment variable first
    const envValue =
      process.env.GOOGLE_CLOUD_PROJECT ||
      process.env.JSON_SYNCHRONIZER_GOOGLE_PROJECT;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronizer.translationServiceGoogle");
    return value && value.length === 3 && value[2] !== "" ? value[2] : null;
  }

  static get TRANSLATION_SERVICE_MICROSOFT_KEY(): string | null {
    // Try environment variable first
    const envValue =
      process.env.AZURE_TRANSLATOR_KEY ||
      process.env.JSON_SYNCHRONIZER_MICROSOFT_KEY;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronizer.translationServiceMicrosoft");
    return value && value.length === 3 && value[0] !== "" ? value[0] : null;
  }

  static get TRANSLATION_SERVICE_MICROSOFT_SECRET(): string | null {
    // Try environment variable first
    const envValue = process.env.JSON_SYNCHRONIZER_MICROSOFT_SECRET;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronizer.translationServiceMicrosoft");
    return value && value.length === 3 && value[1] !== "" ? value[1] : null;
  }

  static get TRANSLATION_SERVICE_MICROSOFT_REGION(): string | null {
    // Try environment variable first
    const envValue =
      process.env.AZURE_TRANSLATOR_REGION ||
      process.env.JSON_SYNCHRONIZER_MICROSOFT_REGION;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronizer.translationServiceMicrosoft");
    return value && value.length === 3 && value[2] !== "" ? value[2] : null;
  }

  static get DEFAULT_LANGUAGE(): string {
    const value = vscode.workspace
      .getConfiguration()
      .get<string>("json-synchronizer.defaultLanguage");
    return value !== undefined ? value : "en";
  }

  static hasTranslationService(): boolean {
    const service = this.TRANSLATION_SERVICE;
    if (!service) {
      return false;
    }

    switch (service) {
      case TranslationServiceEnum.MicrosoftTranslator:
        return (
          !!(
            this.TRANSLATION_SERVICE_MICROSOFT_KEY ||
            this.TRANSLATION_SERVICE_API_KEY
          ) &&
          !!(
            this.TRANSLATION_SERVICE_MICROSOFT_REGION ||
            this.TRANSLATION_SERVICE_API_REGION
          )
        );
      case TranslationServiceEnum.GoogleTranslator:
        return (
          !!(
            this.TRANSLATION_SERVICE_GOOGLE_KEY ||
            this.TRANSLATION_SERVICE_API_KEY
          ) &&
          !!(
            this.TRANSLATION_SERVICE_GOOGLE_PROJECT_ID ||
            this.TRANSLATION_SERVICE_API_REGION
          )
        );
      case TranslationServiceEnum.AmazonTranslator:
        return (
          !!(
            this.TRANSLATION_SERVICE_AMAZON_KEY ||
            this.TRANSLATION_SERVICE_API_KEY
          ) &&
          !!(
            this.TRANSLATION_SERVICE_AMAZON_SECRET ||
            this.TRANSLATION_SERVICE_API_SECRET
          ) &&
          !!(
            this.TRANSLATION_SERVICE_AMAZON_REGION ||
            this.TRANSLATION_SERVICE_API_REGION
          )
        );
      default:
        return false;
    }
  }
}
