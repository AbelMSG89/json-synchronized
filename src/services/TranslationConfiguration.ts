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
      .get<string>("json-synchronized.translationService");
    return value && value !== "" ? (value as TranslationServiceEnum) : null;
  }

  static get TRANSLATION_SERVICE_API_KEY(): string | null {
    // Try environment variable first, then VS Code setting
    const envValue = process.env.JSON_SYNCHRONIZED_API_KEY;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string>("json-synchronized.translationServiceApiKey");
    return value && value !== "" ? value : null;
  }

  static get TRANSLATION_SERVICE_API_SECRET(): string | null {
    // Try environment variable first, then VS Code setting
    const envValue = process.env.JSON_SYNCHRONIZED_API_SECRET;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string>("json-synchronized.translationServiceApiSecret");
    return value && value !== "" ? value : null;
  }

  static get TRANSLATION_SERVICE_API_REGION(): string | null {
    // Try environment variable first, then VS Code setting
    const envValue = process.env.JSON_SYNCHRONIZED_API_REGION;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string>("json-synchronized.translationServiceApiRegion");
    return value && value !== "" ? value : null;
  }

  static get TRANSLATION_SERVICE_AMAZON_KEY(): string | null {
    // Try environment variable first
    const envValue =
      process.env.AWS_ACCESS_KEY_ID || process.env.JSON_SYNCHRONIZED_AMAZON_KEY;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronized.translationServiceAmazon");
    return value && value.length === 3 && value[0] !== "" ? value[0] : null;
  }

  static get TRANSLATION_SERVICE_AMAZON_SECRET(): string | null {
    // Try environment variable first
    const envValue =
      process.env.AWS_SECRET_ACCESS_KEY ||
      process.env.JSON_SYNCHRONIZED_AMAZON_SECRET;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronized.translationServiceAmazon");
    return value && value.length === 3 && value[1] !== "" ? value[1] : null;
  }

  static get TRANSLATION_SERVICE_AMAZON_REGION(): string | null {
    // Try environment variable first
    const envValue =
      process.env.AWS_DEFAULT_REGION ||
      process.env.JSON_SYNCHRONIZED_AMAZON_REGION;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronized.translationServiceAmazon");
    return value && value.length === 3 && value[2] !== "" ? value[2] : null;
  }

  static get TRANSLATION_SERVICE_GOOGLE_KEY(): string | null {
    // Try environment variable first
    const envValue =
      process.env.GOOGLE_API_KEY || process.env.JSON_SYNCHRONIZED_GOOGLE_KEY;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronized.translationServiceGoogle");
    return value && value.length === 3 && value[0] !== "" ? value[0] : null;
  }

  static get TRANSLATION_SERVICE_GOOGLE_SECRET(): string | null {
    // Try environment variable first
    const envValue = process.env.JSON_SYNCHRONIZED_GOOGLE_SECRET;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronized.translationServiceGoogle");
    return value && value.length === 3 && value[1] !== "" ? value[1] : null;
  }

  static get TRANSLATION_SERVICE_GOOGLE_PROJECT_ID(): string | null {
    // Try environment variable first
    const envValue =
      process.env.GOOGLE_CLOUD_PROJECT ||
      process.env.JSON_SYNCHRONIZED_GOOGLE_PROJECT;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronized.translationServiceGoogle");
    return value && value.length === 3 && value[2] !== "" ? value[2] : null;
  }

  static get TRANSLATION_SERVICE_MICROSOFT_KEY(): string | null {
    // Try environment variable first
    const envValue =
      process.env.AZURE_TRANSLATOR_KEY ||
      process.env.JSON_SYNCHRONIZED_MICROSOFT_KEY;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronized.translationServiceMicrosoft");
    return value && value.length === 3 && value[0] !== "" ? value[0] : null;
  }

  static get TRANSLATION_SERVICE_MICROSOFT_SECRET(): string | null {
    // Try environment variable first
    const envValue = process.env.JSON_SYNCHRONIZED_MICROSOFT_SECRET;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronized.translationServiceMicrosoft");
    return value && value.length === 3 && value[1] !== "" ? value[1] : null;
  }

  static get TRANSLATION_SERVICE_MICROSOFT_REGION(): string | null {
    // Try environment variable first
    const envValue =
      process.env.AZURE_TRANSLATOR_REGION ||
      process.env.JSON_SYNCHRONIZED_MICROSOFT_REGION;
    if (envValue && envValue !== "") {
      return envValue;
    }

    const value = vscode.workspace
      .getConfiguration()
      .get<string[]>("json-synchronized.translationServiceMicrosoft");
    return value && value.length === 3 && value[2] !== "" ? value[2] : null;
  }

  static get DEFAULT_LANGUAGE(): string {
    const value = vscode.workspace
      .getConfiguration()
      .get<string>("json-synchronized.defaultLanguage");
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
