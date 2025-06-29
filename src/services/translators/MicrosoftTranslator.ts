import axios, { AxiosError, AxiosResponse } from "axios";
import * as vscode from "vscode";
import { TranslationConfiguration } from "../TranslationConfiguration";
import {
  ITranslationService,
  TranslationRequest,
  TranslationResult,
} from "../ITranslationService";

export class MicrosoftTranslator implements ITranslationService {
  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const apiKey =
      TranslationConfiguration.TRANSLATION_SERVICE_MICROSOFT_KEY ||
      TranslationConfiguration.TRANSLATION_SERVICE_API_KEY;
    if (!apiKey || apiKey.length === 0) {
      vscode.window.showErrorMessage(
        "Your Microsoft API Key is blank. Please update setting json-synchronized.translationServiceApiKey",
      );
      return { [request.sourceLanguage]: request.text };
    }

    const apiRegion =
      TranslationConfiguration.TRANSLATION_SERVICE_MICROSOFT_REGION ||
      TranslationConfiguration.TRANSLATION_SERVICE_API_REGION;
    if (!apiRegion || apiRegion.length === 0) {
      vscode.window.showErrorMessage(
        "Your Microsoft API Region is blank. Please update setting json-synchronized.translationServiceApiRegion",
      );
      return { [request.sourceLanguage]: request.text };
    }

    const endpoint = "https://api.cognitive.microsofttranslator.com";
    const results: TranslationResult = {};

    if (!request.text || request.text.length === 0) {
      return { [request.sourceLanguage]: request.text };
    }

    // Clean up language codes for Microsoft API
    const sourceLanguage = this.normalizeLanguageCode(request.sourceLanguage);
    const targetLanguages = request.targetLanguages.map((lang) =>
      this.normalizeLanguageCode(lang),
    );

    // Preserve placeholders like {0}, {1}, etc.
    const substitutes: string[] = [];
    let modifiedText = request.text;
    let place = 0;
    while (true) {
      const startIndex = modifiedText.indexOf("{", place);
      const endIndex = modifiedText.indexOf("}", place);
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        substitutes.push(modifiedText.substring(startIndex, endIndex + 1));
        modifiedText =
          modifiedText.substring(0, startIndex) +
          `__PLACEHOLDER_${substitutes.length - 1}__` +
          modifiedText.substring(endIndex + 1);
        place = startIndex + `__PLACEHOLDER_${substitutes.length - 1}__`.length;
      } else {
        break;
      }
    }

    for (const targetLang of targetLanguages) {
      if (targetLang === sourceLanguage) {
        continue;
      }

      try {
        const response = await axios({
          baseURL: endpoint + "/translate",
          method: "post",
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
            "Ocp-Apim-Subscription-Region": apiRegion,
            "Content-type": "application/json",
          },
          params: {
            "api-version": "3.0",
            from: sourceLanguage,
            to: targetLang,
          },
          data: [
            {
              text: modifiedText,
            },
          ],
          responseType: "json",
        });

        const data = response.data;
        if (
          data &&
          data.length > 0 &&
          data[0].translations &&
          data[0].translations.length > 0
        ) {
          let translatedText = data[0].translations[0].text;

          // Restore placeholders
          substitutes.forEach((substitute, index) => {
            translatedText = translatedText.replace(
              `__PLACEHOLDER_${index}__`,
              substitute,
            );
          });

          // Map back to original language format
          const originalTargetLang =
            request.targetLanguages.find(
              (lang) => this.normalizeLanguageCode(lang) === targetLang,
            ) || targetLang;

          results[originalTargetLang] = translatedText;
        }
      } catch (error) {
        const err = error as AxiosError;
        const response = err.response as AxiosResponse;
        vscode.window.showErrorMessage(
          `Translation failed for language ${targetLang}: ${err.toString()}\n${response?.data ? JSON.stringify(response.data) : ""}`,
        );
      }
    }

    return results;
  }

  private normalizeLanguageCode(language: string): string {
    // Convert language codes for Microsoft Translator API
    // Handle formats like 'en_US', 'en-US', 'en/US', etc.
    let normalized = language.split("/")[0].split("_")[0].split("-")[0];

    // Special cases for Microsoft Translator
    const languageMap: { [key: string]: string } = {
      zh: "zh-Hans", // Simplified Chinese
      "zh-cn": "zh-Hans",
      "zh-tw": "zh-Hant", // Traditional Chinese
      "zh-hk": "zh-Hant",
      pt: "pt-br", // Portuguese (Brazil)
      sr: "sr-Latn", // Serbian (Latin)
    };

    return languageMap[normalized.toLowerCase()] || normalized;
  }
}
