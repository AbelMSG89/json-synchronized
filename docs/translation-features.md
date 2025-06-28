# Translation Features

## Overview

JSON Synchronizer provides powerful automatic translation capabilities using multiple cloud translation services. Translate your JSON content to multiple languages with a single click while preserving formatting and placeholders.

## Supported Translation Services

### Google Translate API

- **Provider**: Google Cloud Translation
- **Languages**: 100+ languages supported
- **Features**: High-quality neural machine translation
- **Requirements**: Google Cloud Project and API key

### Microsoft Translator

- **Provider**: Azure Cognitive Services
- **Languages**: 70+ languages supported  
- **Features**: Real-time translation with custom models
- **Requirements**: Azure subscription and Translator key

### Amazon Translate

- **Provider**: AWS Translation Service
- **Languages**: 75+ languages supported
- **Features**: Neural machine translation with terminology customization
- **Requirements**: AWS account and IAM credentials

## Key Features

### 🌐 Smart Language Detection

- Automatically detects source and target languages from file names
- Supports common naming patterns: `en.json`, `locale-es.json`, `strings_fr.json`
- Configurable default language fallback

### 🔄 One-Click Translation

- Translation button (🌐) appears when hovering over cells with content
- Translates to all available target languages simultaneously
- Real-time application to corresponding JSON files

### 📝 Placeholder Preservation

- Maintains formatting placeholders during translation
- Supports patterns like `{0}`, `{1}`, `{{variable}}`, `%s`, `%d`
- Preserves HTML tags and special characters

### ⚡ Real-time Updates

- Translated content is immediately applied to target files
- File watching ensures changes are saved automatically
- Progress indicators for long-running translations

## How It Works

### Language Detection Logic

1. **File Name Analysis**: Extracts language code from file names
   - `en.json` → English (en)
   - `locales/es.json` → Spanish (es)
   - `i18n/fr-FR.json` → French (fr-FR)

2. **Fallback Strategy**: Uses configured default language if detection fails

3. **Target Selection**: Identifies all other language files as translation targets

### Translation Process

1. **User Action**: Click translation button on a cell with content
2. **Content Analysis**: Extract text and identify placeholders
3. **API Request**: Send to configured translation service
4. **Response Processing**: Parse results and restore placeholders
5. **File Updates**: Apply translations to target JSON files
6. **User Feedback**: Show success/error notifications

## Configuration

### Service Selection

Choose your preferred translation service in VS Code settings:

```json
{
  "json-synchronizer.translationService": "GoogleTranslator"
}
```

Options: `"GoogleTranslator"`, `"MicrosoftTranslator"`, `"AmazonTranslator"`

### Default Language

Set the default source language:

```json
{
  "json-synchronizer.defaultLanguage": "en"
}
```

### Environment Variables

Configure API credentials securely:

```bash
# Google Translate
JSON_SYNCHRONIZER_GOOGLE_KEY=your-api-key
JSON_SYNCHRONIZER_GOOGLE_PROJECT=your-project-id

# Microsoft Translator  
JSON_SYNCHRONIZER_MICROSOFT_KEY=your-subscription-key
JSON_SYNCHRONIZER_MICROSOFT_REGION=eastus

# Amazon Translate
JSON_SYNCHRONIZER_AMAZON_KEY=your-access-key-id
JSON_SYNCHRONIZER_AMAZON_SECRET=your-secret-access-key
JSON_SYNCHRONIZER_AMAZON_REGION=us-east-1
```

## Usage Examples

### Basic Translation

1. Open JSON Synchronizer on a folder with multiple language files
2. Enter text in any field
3. Hover over the cell and click the 🌐 button
4. Watch translations appear in other language files

### Supported File Structures

#### Standard Structure

```bash
locales/
├── en.json    # Source
├── es.json    # Target
├── fr.json    # Target
└── de.json    # Target
```

#### Nested Structure

```bash
i18n/
├── en/
│   └── common.json
├── es/
│   └── common.json
└── fr/
    └── common.json
```

#### Framework-Specific

```bash
src/
├── locales/
│   ├── en-US.json
│   ├── es-ES.json
│   └── fr-FR.json
└── components/
```

### Placeholder Examples

Input with placeholders:

```json
{
  "welcome": "Welcome {userName}, you have {count} messages"
}
```

Translation preserves placeholders:

```json
{
  "welcome": "Bienvenido {userName}, tienes {count} mensajes"
}
```

## Best Practices

### 1. Content Organization

- Keep related translations in the same JSON structure
- Use descriptive keys that indicate context
- Group related content for better translation quality

### 2. Placeholder Usage

- Use consistent placeholder patterns across your project
- Document placeholder meanings for translators
- Test translations with actual data

### 3. Translation Quality

- Review automated translations before production use
- Consider context and cultural nuances
- Use professional translation services for critical content

### 4. API Usage

- Monitor your translation service usage and costs
- Implement rate limiting for large translation jobs
- Cache translations to avoid redundant API calls

## Troubleshooting

### Translation Button Not Appearing

1. **Check Configuration**: Ensure translation service is properly configured
2. **Verify Credentials**: Check environment variables are correctly set
3. **File Structure**: Ensure multiple language files are detected
4. **Content Requirements**: Button only appears for non-empty cells

### Translation Failures

1. **API Credentials**: Verify your API keys are valid and have proper permissions
2. **Service Limits**: Check if you've exceeded rate limits or quotas
3. **Network Issues**: Ensure internet connectivity and API endpoints are accessible
4. **Content Format**: Some special characters or formats may cause issues

### Quality Issues

1. **Context**: Provide more context in source text for better translations
2. **Placeholders**: Ensure placeholders are properly formatted
3. **Language Pairs**: Some language combinations may have better quality than others
4. **Manual Review**: Always review automated translations for accuracy

## Advanced Configuration

### Custom Language Mapping

For non-standard file naming, you can configure custom language detection patterns in your workspace settings.

### Batch Translation

For large-scale translation projects, consider:

- Using translation service batch APIs
- Implementing queue-based processing
- Setting up translation workflows

### Integration with Translation Management

JSON Synchronizer can integrate with:

- Translation management platforms
- CI/CD pipelines
- Quality assurance workflows

## API Rate Limits & Costs

### Google Translate

- **Free Tier**: 500,000 characters/month
- **Pricing**: $20 per 1M characters
- **Rate Limits**: 100 requests/second

### Microsoft Translator

- **Free Tier**: 2M characters/month
- **Pricing**: $10 per 1M characters
- **Rate Limits**: Varies by subscription

### Amazon Translate

- **Free Tier**: 2M characters/month (first year)
- **Pricing**: $15 per 1M characters
- **Rate Limits**: Varies by region

For more details, see each provider's pricing documentation.
