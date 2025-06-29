# Change Log

## [1.1.1]

### 🐛 Bug Fixes

- **Windows Compatibility**: Fixed language code extraction for Windows file paths
  - Language headers now display as `fr`, `es`, `en` instead of `\fr`, `\es`,
    `\en` on Windows
  - Improved cross-platform path handling using both `/` and `\` separators
- **Webview Content Security Policy**: Fixed incomplete CSP that prevented the
  extension from loading
- **Path Resolution**: Enhanced file path processing for both Windows and
  Unix-based systems

### 🔧 Technical Improvements

- **Cross-Platform Path Handling**: Updated `extractLanguageFromFileName` to
  support both Windows (`\`) and Unix (`/`) path separators
- **Table Header Display**: Column headers now show clean language codes
  extracted from file names
- **TypeScript Configuration**: Improved tsconfig.json to include all source
  files
- **VS Code API Compatibility**: Fixed deprecated `joinPath` usage for better
  compatibility

## [1.1.0]

### 🌟 Major Features

- **Translation Support**: Added automatic translation using
  Microsoft Translator, Google Translate, and Amazon Translate
- **Smart Language Detection**: Automatically detects source and target languages
- from file names
- **One-Click Translation**: Translate text to multiple languages with a single click
- **Environment Configuration**: Enhanced support for custom .env files and
  environment variables

### 🎨 UI/UX Improvements

- **Translation Buttons**: Added inline translation buttons for easy text translation
- **Better Visual Feedback**: Improved error handling and user notifications
- **Enhanced Key Editing**: Better input validation and error states

### 🔧 Configuration Enhancements

- **Custom .env File Support**: Load environment variables from custom .env files
- **Flexible Path Configuration**: Support for relative and absolute .env file paths
- **Command Palette Integration**: Added "Select Environment File" command
- **Secure Credential Management**: Environment variable-based API key storage

### 📚 Documentation

- **Comprehensive Guides**: Added detailed documentation for translation services
- **Environment Configuration**: Step-by-step setup guides
- **Troubleshooting**: Common issues and solutions
- **API Reference**: Complete API documentation

## [1.0.4]

- Update dependencies

## [1.0.3]

- Handle discard changes in Git

## [1.0.1]

- Added logo

## [1.0.0]

- Initial release
