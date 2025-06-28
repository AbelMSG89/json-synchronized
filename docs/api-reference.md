# API Reference

This document provides detailed API reference for JSON Synchronizer's translation services and configuration.

## Translation Services

### ITranslationService Interface

Base interface for all translation services.

```typescript
interface ITranslationService {
  translate(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string>;
  isConfigured(): boolean;
  getSupportedLanguages(): string[];
}
```

#### Methods

##### `translate(text, targetLanguage, sourceLanguage?)`

Translates text from source language to target language.

**Parameters:**

- `text` (string): Text to translate
- `targetLanguage` (string): Target language code (e.g., 'es', 'fr', 'de')
- `sourceLanguage` (string, optional): Source language code. If not provided, service will attempt auto-detection

**Returns:** `Promise<string>` - Translated text

**Throws:** Error if translation fails or service is not configured

##### `isConfigured()`

Checks if the translation service is properly configured with valid credentials.

**Returns:** `boolean` - True if service is configured and ready to use

##### `getSupportedLanguages()`

Returns list of supported language codes for this service.

**Returns:** `string[]` - Array of supported language codes

### GoogleTranslator

Google Cloud Translation API implementation.

#### Google Configuration

**Environment Variables:**

- `GOOGLE_API_KEY` (required): Google Cloud API key
- `GOOGLE_CLOUD_PROJECT` (optional): Google Cloud project ID

**VS Code Settings:**

```json
{
  "json-synchronizer.translationService": "GoogleTranslator",
  "json-synchronizer.translationServiceGoogle": ["api-key", "", "project-id"]
}
```

#### Google Supported Languages

Supports 100+ languages. Common codes:

- `en` - English
- `es` - Spanish  
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese (Simplified)

### MicrosoftTranslator

Azure Cognitive Services Translator implementation.

#### Microsoft Configuration

**Environment Variables:**

- `AZURE_TRANSLATOR_KEY` (required): Azure Translator subscription key
- `AZURE_TRANSLATOR_REGION` (required): Azure region (e.g., 'eastus', 'westeurope')

**VS Code Settings:**

```json
{
  "json-synchronizer.translationService": "MicrosoftTranslator",
  "json-synchronizer.translationServiceMicrosoft": ["subscription-key", "", "region"]
}
```

#### Microsoft Supported Languages

Supports 90+ languages. Common codes:

- `en` - English
- `es` - Spanish
- `fr` - French  
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `ko` - Korean
- `zh-Hans` - Chinese (Simplified)

### AmazonTranslator

AWS Translate service implementation.

#### Amazon Configuration

**Environment Variables:**

- `AWS_ACCESS_KEY_ID` (required): AWS access key ID
- `AWS_SECRET_ACCESS_KEY` (required): AWS secret access key
- `AWS_DEFAULT_REGION` (required): AWS region (e.g., 'us-east-1', 'eu-west-1')

**VS Code Settings:**

```json
{
  "json-synchronizer.translationService": "AmazonTranslator",
  "json-synchronizer.translationServiceAmazon": ["access-key", "secret-key", "region"]
}
```

#### Amazon Supported Languages

Supports 75+ languages. Common codes:

- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese (Simplified)

## Configuration API

### TranslationConfiguration

Manages translation service configuration and credentials.

```typescript
class TranslationConfiguration {
  static getTranslationService(): ITranslationService | null;
  static isConfigured(): boolean;
  static getDefaultLanguage(): string;
}
```

#### Configuration Methods

##### `getTranslationService()`

Gets the configured translation service instance.

**Returns:** `ITranslationService | null` - Configured service or null if none configured

##### `isTranslationConfigured()`

Checks if any translation service is properly configured.

**Returns:** `boolean` - True if a service is configured and ready

##### `getDefaultLanguage()`

Gets the default source language for translations.

**Returns:** `string` - Default language code (default: 'en')

### EnvironmentLoader

Handles loading environment variables from .env files.

```typescript
class EnvironmentLoader {
  static loadEnvironmentFile(filePath?: string): Promise<void>;
  static getEnvironmentVariable(key: string): string | undefined;
}
```

#### Environment Methods

##### `loadEnvironmentFile(filePath?)`

Loads environment variables from specified .env file or default location.

**Parameters:**

- `filePath` (string, optional): Path to .env file. If not provided, loads from workspace root

**Returns:** `Promise<void>`

**Throws:** Error if file cannot be loaded or parsed

##### `getEnvironmentVariable(key)`

Gets environment variable value.

**Parameters:**

- `key` (string): Environment variable name

**Returns:** `string | undefined` - Variable value or undefined if not set

## VS Code Settings

### Core Settings

```json
{
  "json-synchronizer.translationService": "GoogleTranslator" | "MicrosoftTranslator" | "AmazonTranslator",
  "json-synchronizer.defaultLanguage": "en",
  "json-synchronizer.envFilePath": "./path/to/.env"
}
```

### Service-Specific Settings

#### Google Translator Configuration

```json
{
  "json-synchronizer.translationServiceGoogle": [
    "api-key",
    "", 
    "project-id"
  ]
}
```

#### Microsoft Translator Configuration

```json
{
  "json-synchronizer.translationServiceMicrosoft": [
    "subscription-key",
    "",
    "region"
  ]
}
```

#### Amazon Translator Configuration

```json
{
  "json-synchronizer.translationServiceAmazon": [
    "access-key-id",
    "secret-access-key", 
    "region"
  ]
}
```

## Commands

### Palette Commands

#### `JSON Synchronizer: Select Environment File`

**Command ID:** `json-synchronizer.selectEnvFile`

Opens file picker to select custom .env file for loading environment variables.

**Usage:**

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "JSON Synchronizer: Select Environment File"
3. Select your .env file from the file picker
4. Extension will load environment variables from selected file

#### `JSON Synchronizer: Translate Field`

**Command ID:** `json-synchronizer.translateField`

**Internal command** - Triggered by translation button clicks in the UI.

**Parameters:**

- Field path and content
- Source and target languages
- Translation service configuration

## Error Handling

### Common Error Types

#### `TranslationError`

Thrown when translation request fails.

**Properties:**

- `message`: Error description
- `service`: Translation service name
- `sourceLanguage`: Source language code
- `targetLanguage`: Target language code
- `originalText`: Text that failed to translate

#### `ConfigurationError`

Thrown when service configuration is invalid.

**Properties:**

- `message`: Error description
- `service`: Service name
- `missingConfig`: Array of missing configuration keys

#### `EnvironmentError`

Thrown when environment file loading fails.

**Properties:**

- `message`: Error description
- `filePath`: Path to the problematic .env file
- `cause`: Underlying error cause

## Language Code Standards

### Supported Formats

The extension supports multiple language code formats:

#### ISO 639-1 (2-letter codes)

- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German

#### ISO 639-1 with Region (BCP 47)

- `en-US` - English (United States)
- `en-GB` - English (United Kingdom)
- `es-ES` - Spanish (Spain)
- `es-MX` - Spanish (Mexico)
- `fr-FR` - French (France)
- `fr-CA` - French (Canada)

#### Alternative Formats

- `en_US` - Underscore separator
- `en-us` - Lowercase
- `EN` - Uppercase

### File Naming Patterns

Supported filename patterns for language detection:

- `{language}.json` - e.g., `en.json`, `es.json`
- `{language}-{region}.json` - e.g., `en-US.json`, `fr-CA.json`
- `{language}_{region}.json` - e.g., `en_US.json`, `fr_CA.json`
- `{prefix}.{language}.json` - e.g., `messages.en.json`, `labels.es.json`
- `{prefix}-{language}.json` - e.g., `strings-en.json`, `text-es.json`

## Related Documentation

- [Installation & Setup](./installation.md)
- [Translation Features](./translation-features.md)
- [Environment Configuration](./environment-configuration.md)
- [Translation Services](./translation-services.md)
- [Troubleshooting](./troubleshooting.md)
- [Architecture](./architecture.md)
