# Credits & Attribution

## 🏆 Original Authors & Contributors

### Primary Base Project

**[oscar-green/json-synchronizer](https://github.com/oscar-green/json-synchronizer)**

- **Author**: oscar-green
- **License**: MIT
- **Contribution**: Core JSON synchronization functionality
- **Components Used**:
  - File watching and real-time updates
  - Table-based editing interface
  - JSON parsing and synchronization
  - VS Code extension structure
  - Webview implementation

### Translation Service Architecture

**[DionJChapman/Localization-Internationalization-Editor](https://github.com/DionJChapman/Localization-Internationalization-Editor)**

- **Author**: DionJChapman
- **License**: MIT
- **Contribution**: Translation service patterns and architecture
- **Components Used**:
  - Translation service interface design
  - API integration patterns
  - Configuration management concepts
  - Service provider abstraction

## ✨ Enhancements & New Features

This fork significantly extends the original functionality with:

### Translation Features

- **Multiple Cloud Providers**: Support for Google Translate,
  Microsoft Translator, and Amazon Translate
- **Smart Language Detection**: Automatic detection of source and
  target languages from file names
- **One-Click Translation**: UI button for instant translation to multiple languages
- **Placeholder Preservation**: Maintains formatting placeholders like `{0}`,
  `{1}` during translation

### Environment Management

- **Custom .env File Support**: Load environment variables from custom .env files
- **Flexible Path Configuration**: Support for relative and absolute paths
- **Environment File Selection**: Command palette integration
  for easy .env file switching
- **Multiple Environment Types**: Support for `.env.development`,
  `.env.production`, etc.

### Security Improvements

- **Secure Credential Management**: Environment variable-based API key storage
- **Automatic .gitignore**: Prevents accidental credential commits
- **Configuration Validation**: Checks for proper service configuration

### User Experience

- **Enhanced Documentation**: Comprehensive guides and troubleshooting
- **Better Error Handling**: Improved error messages and user feedback
- **Configuration Helpers**: Guided setup for translation services

## 🙏 Acknowledgments

We extend our gratitude to:

- **oscar-green** for creating the original JSON Synchronizer extension
  that serves as the foundation
- **DionJChapman** for the translation service architecture and patterns
- **Microsoft**, **Google**, and **Amazon** for providing translation APIs
- **VS Code Team** for the excellent extension development platform
- **The Open Source Community** for continuous inspiration and collaboration

## 📄 License Compliance

This project respects and maintains the original MIT licenses of both base projects:

- Original JSON Synchronizer: MIT License
- Translation service patterns: MIT License
- This enhanced version: MIT License

All original copyright notices and attributions are preserved
in the respective code sections.

## 🤝 Contributing to Credits

If you contribute to this project and would like to be acknowledged, please:

1. Add your contribution to the [CHANGELOG.md](../CHANGELOG.md)
2. Update this credits file if you're adding significant new functionality
3. Follow the established attribution patterns

Thank you to all contributors who help make this project better! 🎉
