# Installation & Setup

## Requirements

- **VS Code**: Version 1.93.0 or higher
- **Node.js**: Version 16.x or higher (for development)
- **Translation Services** (optional): API keys for Google, Microsoft, or Amazon
  translation services

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Search for "JSON Synchronizer"
4. Click **Install** on the extension by AbelMSG89

### Manual Installation

1. Download the `.vsix` file from the [releases page](https://github.com/AbelMSG89/json-synchronizer/releases)
2. Open VS Code
3. Go to Extensions view (`Ctrl+Shift+X`)
4. Click the `...` menu → **Install from VSIX...**
5. Select the downloaded `.vsix` file

## Basic Setup

### 1. Verify Installation

After installation, you should see the JSON Synchronizer command available:

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "JSON Synchronizer"
3. You should see available commands

### 2. Test Basic Functionality

1. Create a test folder with JSON files:

   ```bash
   my-project/
   ├── en.json
   ├── es.json
   └── fr.json
   ```

2. Add some content to `en.json`:

   ```json
   {
     "hello": "Hello",
     "welcome": "Welcome to our app"
   }
   ```

3. Right-click on the folder → **Synchronize JSON**
4. The extension should open showing all your JSON files in a table format

## Translation Setup (Optional)

To enable automatic translation features, you'll need to configure a
translation service:

### Quick Setup with Default .env

1. Create a `.env` file in your workspace root
2. Add your translation service credentials:

   ```bash
   # For Google Translate
   JSON_SYNCHRONIZER_GOOGLE_KEY=your-api-key
   JSON_SYNCHRONIZER_GOOGLE_PROJECT=your-project-id
   ```

3. Configure the service in VS Code settings:

   ```json
   {
     "json-synchronizer.translationService": "GoogleTranslator"
   }
   ```

### Detailed Translation Setup

For comprehensive translation setup, see:

- [Translation Features Guide](./translation-features.md)
- [Environment Configuration](./environment-configuration.md)
- [Translation Services Setup](./translation-services.md)

## Workspace Configuration

### Recommended Folder Structure

```bash
your-project/
├── .env                    # Default environment file
├── .env.development       # Development environment
├── .env.production        # Production environment
├── locales/               # Translation files
│   ├── en.json
│   ├── es.json
│   ├── fr.json
│   └── de.json
└── .vscode/
    └── settings.json      # VS Code workspace settings
```

### Example Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "json-synchronizer.translationService": "GoogleTranslator",
  "json-synchronizer.defaultLanguage": "en",
  "json-synchronizer.envFilePath": ".env.development"
}
```

## Troubleshooting Installation

### Extension Not Loading

1. **Check VS Code Version**: Ensure you're using VS Code 1.93.0+
2. **Restart VS Code**: Sometimes a restart is needed after installation
3. **Check Output Panel**: Go to View → Output → Select "JSON Synchronizer"

### Command Not Available

1. **Verify Installation**: Check Extensions view to ensure it's installed and enabled
2. **Reload Window**: Use Command Palette → "Developer: Reload Window"
3. **Check Logs**: Open Developer Tools (`Help → Toggle Developer Tools`)

### Permission Issues

On some systems, you might need to:

1. **Run VS Code as Administrator** (Windows)
2. **Check File Permissions** for your workspace folder
3. **Disable Antivirus** temporarily if it's blocking file operations

## Next Steps

After successful installation:

1. 📖 Read the [Basic Usage Guide](./basic-usage.md)
2. 🌍 Set up [Translation Features](./translation-features.md)
3. ⚙️ Configure [Environment Variables](./environment-configuration.md)
4. 🔧 Explore [Advanced Configuration](./vscode-settings.md)

## Getting Help

If you encounter issues:

1. 📋 Check the [Troubleshooting Guide](./troubleshooting.md)
2. ❓ Read the [FAQ](./faq.md)
3. 🐛 Report bugs on [GitHub Issues](https://github.com/AbelMSG89/json-synchronizer/issues)
4. 💬 Ask questions in [Discussions](https://github.com/AbelMSG89/json-synchronizer/discussions)
