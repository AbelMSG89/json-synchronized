export interface TranslationResult {
  [language: string]: string;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguages: string[];
}

export interface ITranslationService {
  translate(request: TranslationRequest): Promise<TranslationResult>;
}
