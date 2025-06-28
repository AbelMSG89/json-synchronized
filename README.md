<h1 align="center">
  <p>
    <img src="./media/logo.png" width="94">
  </p>
  JSON Synchronizer
  <p align="center">
    <a href="https://marketplace.visualstudio.com/items?itemName=AbelMSG89.json-synchronizer">
      <img 
        src="https://img.shields.io/visual-studio-marketplace/v/AbelMSG89.json-synchronizer?color=blue&amp;label=JSON%20Synchronizer&logo=visual-studio-code"
        alt="Visual Studio Marketplace Version"
      />
    </a>
  </p>
</h1>

JSON Synchronizer allows simultaneous editing of multiple JSON files with enhanced translation capabilities. Each file must contain a single object, which can include nested objects and strings. Perfect for i18n management and multilingual projects.

## 🎯 About This Project

This extension is based on the excellent work of [oscar-green/json-synchronizer](https://github.com/oscar-green/json-synchronizer) and incorporates translation service patterns from [DionJChapman/Localization-Internationalization-Editor](https://github.com/DionJChapman/Localization-Internationalization-Editor). 

**Enhanced with:**

- ✨ **Automatic Translation Support** with multiple cloud providers
- 🔧 **Advanced Environment Configuration** with custom .env file support
- 🌐 **Smart Language Detection** from file names
- 📁 **Flexible .env File Management** with workspace integration

## 🌍 Translation Support

JSON Synchronizer now includes automatic translation support using leading cloud translation services:

- **Microsoft Translator** - Azure Cognitive Services
- **Google Translate** - Google Cloud Translation API  
- **Amazon Translate** - AWS Translation Service

### Features

- 🌐 **Smart Language Detection** - Automatically detects source and target languages from file names
- 🔄 **One-Click Translation** - Translate text to multiple languages with a single click
- 🔧 **Multiple Services** - Support for Microsoft, Google, and Amazon translation APIs
- 📝 **Placeholder Preservation** - Maintains placeholder text like `{0}`, `{1}` during translation
- ⚡ **Real-time Updates** - Translated content is immediately applied to all target files

### Configuration

To enable translation features, configure one of the supported translation services. **For security, it's recommended to use environment variables instead of storing credentials in VS Code settings.**

#### Using Environment Variables (Recommended)

Set the appropriate environment variables for your chosen service. You can use:

- **System environment variables**
- **Custom .env files** (`.env.development`, `.env.production`, etc.)
- **Default .env file** (automatically loaded from workspace root)

**Quick Setup with .env files:**

1. Copy `.env.example` to `.env` (default) or your preferred file (e.g., `.env.development`)
2. Add your API credentials to the file
3. For custom files: Use Command Palette: `JSON Synchronizer: Select Environment File`
4. For default `.env`: Just place it in your workspace root - it will be loaded automatically

**Supported .env file paths:**

- `.env.development` (relative to workspace)
- `.env.production` (relative to workspace)  
- `/absolute/path/to/.env` (absolute path)
- `config/.env.local` (subdirectory)

**Google Translate:**

```bash
export GOOGLE_API_KEY="your-api-key"
export GOOGLE_CLOUD_PROJECT="your-project-id"
```

**Microsoft Translator:**

```bash
export AZURE_TRANSLATOR_KEY="your-subscription-key"
export AZURE_TRANSLATOR_REGION="your-region"
```

**Amazon Translate:**

```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="your-region"
```

Then configure only the service in VS Code settings:

```json
{
  "json-synchronizer.translationService": "GoogleTranslator",
  "json-synchronizer.defaultLanguage": "en"
}
```

#### Using VS Code Settings (Less Secure)

#### Microsoft Translator

```json
{
  "json-synchronizer.translationService": "MicrosoftTranslator",
  "json-synchronizer.translationServiceMicrosoft": ["your-api-key", "", "your-region"]
}
```

#### Google Translate

```json
{
  "json-synchronizer.translationService": "GoogleTranslator", 
  "json-synchronizer.translationServiceGoogle": ["your-api-key", "", "your-project-id"]
}
```

#### Amazon Translate

```json
{
  "json-synchronizer.translationService": "AmazonTranslator",
  "json-synchronizer.translationServiceAmazon": ["your-access-key", "your-secret-key", "your-region"]
}
```

### Usage

1. **Open JSON Synchronizer** on a folder containing JSON files with language codes (e.g., `en.json`, `es.json`, `fr.json`)
2. **Enter text** in any field that contains content
3. **Click the translation button** (🌐) that appears when hovering over cells with content
4. **Watch as translations** are automatically applied to all other language files

The translation button will only appear when:

- The cell contains text to translate
- There are other language files to translate to
- A translation service is properly configured

## Features

<div align="center">
  Right click on a folder and click "Synchronize JSON" to open all JSON files in the file structure below.<br>

![feature X](https://github.com/oscar-green/json-synchronizer/blob/main/media/folder-click.gif?raw=true)

Files are edited in realtime. <br>
![feature X](https://github.com/oscar-green/json-synchronizer/blob/main/media/realtime-edit.gif?raw=true)

Aggregates warnings of missing values in nested objects.<br>
![feature X](https://github.com/oscar-green/json-synchronizer/blob/main/media/aggregate-warnings.gif?raw=true)

</div>

## 📚 Documentation

For comprehensive documentation, visit the [docs](./docs/) folder:

- [Installation & Setup](./docs/installation.md)
- [Translation Features](./docs/translation-features.md)
- [Environment Configuration](./docs/environment-configuration.md)
- [Troubleshooting](./docs/troubleshooting.md)
- [API Reference](./docs/api-reference.md)

## 🙏 Credits & Attribution

This project builds upon the foundation of excellent open-source work:

### Original Project

- **[oscar-green/json-synchronizer](https://github.com/oscar-green/json-synchronizer)** - Original JSON Synchronizer extension
  - Core JSON synchronization functionality
  - File watching and real-time updates
  - Table-based editing interface

### Translation Service Implementation

- **[DionJChapman/Localization-Internationalization-Editor](https://github.com/DionJChapman/Localization-Internationalization-Editor)** - Translation service patterns
  - Translation service architecture
  - API integration patterns
  - Configuration management concepts

### Enhancements in This Fork

- ✨ **Enhanced Translation Support** - Multiple cloud translation providers
- 🔧 **Advanced Environment Management** - Custom .env file support with workspace integration
- 🌐 **Smart Language Detection** - Automatic source/target language detection
- 📁 **Flexible Configuration** - Command palette integration for .env file selection
- 🔒 **Security Improvements** - Better credential management and environment variable support

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Links

- [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=AbelMSG89.json-synchronizer)
- [GitHub Repository](https://github.com/AbelMSG89/json-synchronizer)
- [Issue Tracker](https://github.com/AbelMSG89/json-synchronizer/issues)
- [Documentation](./docs/)
