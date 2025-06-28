import {
  TranslationConfiguration,
  TranslationServiceEnum,
} from "./TranslationConfiguration";
import {
  ITranslationService,
  TranslationRequest,
  TranslationResult,
} from "./ITranslationService";
import { MicrosoftTranslator } from "./translators/MicrosoftTranslator";
import { GoogleTranslator } from "./translators/GoogleTranslator";
import { AmazonTranslator } from "./translators/AmazonTranslator";

export class TranslationService {
  private static getTranslatorInstance(): ITranslationService | null {
    const service = TranslationConfiguration.TRANSLATION_SERVICE;

    if (!service) {
      return null;
    }

    switch (service) {
      case TranslationServiceEnum.MicrosoftTranslator:
        return new MicrosoftTranslator();
      case TranslationServiceEnum.GoogleTranslator:
        return new GoogleTranslator();
      case TranslationServiceEnum.AmazonTranslator:
        return new AmazonTranslator();
      default:
        return null;
    }
  }

  static async translateText(
    text: string,
    sourceLanguage: string,
    targetLanguages: string[],
  ): Promise<TranslationResult> {
    if (!TranslationConfiguration.hasTranslationService()) {
      return {};
    }

    const translator = this.getTranslatorInstance();
    if (!translator) {
      return {};
    }

    const request: TranslationRequest = {
      text,
      sourceLanguage,
      targetLanguages: targetLanguages.filter(
        (lang) => lang !== sourceLanguage,
      ),
    };

    try {
      return await translator.translate(request);
    } catch (error) {
      console.error("Translation error:", error);
      return {};
    }
  }

  static hasTranslationService(): boolean {
    return TranslationConfiguration.hasTranslationService();
  }

  static getDefaultLanguage(): string {
    return TranslationConfiguration.DEFAULT_LANGUAGE;
  }
}
