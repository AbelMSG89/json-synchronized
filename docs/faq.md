# Frequently Asked Questions (FAQ)

## General Questions

### What is JSON Synchronized?

JSON Synchronized is a VS Code extension that allows you to edit multiple JSON
files simultaneously in a convenient table format. It's particularly useful for
managing internationalization (i18n) files and includes automatic translation
capabilities.

### How is this different from other JSON editors?

JSON Synchronized offers:

- **Simultaneous editing** of multiple JSON files
- **Table-based interface** for easy comparison and editing
- **Built-in translation support** with Google, Microsoft, and Amazon services
- **Real-time synchronization** across all files
- **Missing key detection** and warnings
- **Nested object support** with expandable groups

### What file formats are supported?

Currently, JSON Synchronized supports:

- **JSON files** (`.json`)
- Files must contain a single object (not arrays)
- Nested objects are fully supported
- String values can be translated automatically

## Installation & Setup

### Why can't I find "JSON Synchronized" in the marketplace?

Make sure you're searching for the exact name "JSON Synchronized" by publisher
AbelMSG89. If you still can't find it:

1. Check your VS Code version (requires 1.93.0+)
2. Try refreshing the Extensions view
3. Use the direct marketplace link from our documentation

### The extension installed but commands don't appear

Try these steps:

1. **Restart VS Code** completely
2. Use `Ctrl+Shift+P` → "Developer: Reload Window"
3. Check if the extension is **enabled** in Extensions view
4. Verify VS Code version compatibility

### How do I know if the extension is working?

After installation:

1. Right-click on any folder in Explorer
2. You should see "Synchronize JSON" option
3. Command Palette should show JSON Synchronized commands
4. Check the Output panel for any error messages

## Usage Questions

### How do I open JSON files for editing?

There are several ways:

1. **Right-click** on a folder → "Synchronize JSON"
2. **Command Palette** → "JSON Synchronized: Synchronize JSON"
3. Open any JSON file and use the command
4. The extension will find all JSON files in the selected folder

### Why don't my files appear in the table?

Check these common issues:

1. **File format**: Only `.json` files are supported
2. **File structure**: Files must contain a single object, not arrays
3. **File location**: Make sure files are in the selected folder
4. **File permissions**: Ensure VS Code can read the files
5. **JSON validity**: Files must contain valid JSON

### How do I add new translation keys?

1. **Use the "+" button** in the table interface
2. **Type a new key** in the key column
3. **Add values** for each language
4. Keys are automatically added to all files

### Can I edit nested objects?

Yes! JSON Synchronized fully supports nested objects:

- Click the **expand/collapse arrows** to view nested structures
- Edit nested values directly in the table
- Add new nested keys using dot notation (e.g., `user.profile.name`)

## Translation Features

### Which translation services are supported?

JSON Synchronized supports three major translation services:

- **Google Translate** (Google Cloud Translation API)
- **Microsoft Translator** (Azure Cognitive Services)
- **Amazon Translate** (AWS Translation Service)

### How do I set up automatic translation?

1. **Choose a service** (Google, Microsoft, or Amazon)
2. **Get API credentials** from the service provider
3. **Configure environment variables** (recommended) or VS Code settings
4. **Set the translation service** in settings
5. **Use the translate button** (🌐) that appears when hovering over text

### Why don't I see the translation button?

The translation button appears when:

- **Translation service is configured** properly
- **Cell contains text** to translate
- **Multiple language files** are present
- **API credentials are valid**

### Translation isn't working

Check these common issues:

1. **API credentials**: Verify your API keys are correct
2. **Service configuration**: Ensure the right service is selected
3. **Environment variables**: Check if variables are loaded correctly
4. **Network connection**: Translation requires internet access
5. **API quotas**: You might have exceeded your API limits

## Environment Configuration

### What's the difference between .env files and VS Code settings?

- **Environment variables (.env files)**: More secure, project-specific,
  version-controlled
- **VS Code settings**: Easier to configure, but less secure for API keys

### How do I use multiple environment files?

1. **Create different .env files** (`.env.development`, `.env.production`)
2. **Use Command Palette**: "JSON Synchronized: Select Environment File"
3. **Or configure** `json-synchronized.envFilePath` setting
4. **Switch between environments** as needed

### Why isn't my .env file loading?

Check these issues:

1. **File location**: Must be in workspace root (unless custom path specified)
2. **File name**: Should be exactly `.env` (no extensions)
3. **File format**: Use `KEY=value` format, no spaces around `=`
4. **Restart required**: Reload VS Code after creating/editing .env files

## Troubleshooting

### Files are not saving automatically

JSON Synchronized automatically saves changes, but if it's not working:

1. **Check file permissions** in your workspace
2. **Verify files aren't read-only**
3. **Check Output panel** for error messages
4. **Try manual save** with `Ctrl+S`

### Performance is slow with many files

For better performance with large projects:

1. **Limit the number of files** in the folder
2. **Use smaller JSON files** when possible
3. **Close other VS Code extensions** temporarily
4. **Increase VS Code memory** if needed

### Extension crashes or freezes

If the extension becomes unresponsive:

1. **Check Output panel** for error details
2. **Reload the window**: `Ctrl+Shift+P` → "Developer: Reload Window"
3. **Restart VS Code** completely
4. **Check for conflicting extensions**
5. **Report the issue** on GitHub with error details

### Translation errors

Common translation issues:

1. **Invalid API keys**: Double-check your credentials
2. **Network issues**: Check your internet connection
3. **Service limits**: You might have hit API quotas
4. **Unsupported languages**: Check if your language pair is supported

## Advanced Usage

### Can I use this with Git?

Yes! JSON Synchronized works great with version control:

- **All changes are saved** to actual JSON files
- **Git will track** all modifications normally
- **Use .gitignore** for environment files with secrets
- **Commit frequently** when making bulk changes

### How do I backup my translations?

Since JSON Synchronized works with actual files:

1. **Regular Git commits** provide version history
2. **Copy your JSON files** to backup locations
3. **Export environment configurations** separately
4. **Document your translation setup** in your README

### Can I use this for non-i18n JSON files?

Absolutely! JSON Synchronized works with any JSON files that:

- Contain a single object structure
- Have similar schemas across files
- Benefit from side-by-side editing

### Integration with other tools

JSON Synchronized can work alongside:

- **i18next** and other i18n frameworks
- **Build tools** that process JSON files
- **Translation management platforms**
- **Automated testing** workflows

## Getting Help

### Where can I report bugs?

1. **GitHub Issues**: <https://github.com/AbelMSG89/json-synchronized/issues>
2. **Include details**: VS Code version, extension version, error messages
3. **Provide examples**: Sample files that reproduce the issue
4. **Check existing issues** first to avoid duplicates

### How can I request new features?

1. **GitHub Discussions**: <https://github.com/AbelMSG89/json-synchronized/discussions>
2. **Feature requests**: Use the "Ideas" category
3. **Explain the use case** and why it would be helpful
4. **Upvote existing requests** if they match your needs

### Where can I get community support?

1. **GitHub Discussions**: For questions and community help
2. **Stack Overflow**: Tag your questions with `json-synchronized`
3. **VS Code Discord**: General VS Code extension support
4. **Check the documentation**: Most questions are covered in our guides

### How can I contribute?

See our [Contributing Guide](../CONTRIBUTING.md) for:

- Code contributions
- Documentation improvements
- Translation help
- Bug reports and testing

---

## Still Have Questions?

If your question isn't answered here:

1. 📖 Check our [complete documentation](./README.md)
2. 🔍 Search [existing GitHub issues](https://github.com/AbelMSG89/json-synchronized/issues)
3. 💬 Ask in [GitHub Discussions](https://github.com/AbelMSG89/json-synchronized/discussions)
4. 🐛 Report bugs with detailed information

We're here to help make your JSON editing experience as smooth as possible! 🚀
