# Troubleshooting Guide

This guide helps you resolve common issues with JSON Synchronized.

## Common Issues

### Translation Not Working

#### Issue: Translation button doesn't appear

**Possible causes:**

- No translation service configured
- Invalid API credentials
- No other language files in the workspace
- Cell contains no text

**Solution:**

1. Verify translation service configuration in VS Code settings or environment variables
2. Check API credentials are valid and have appropriate permissions
3. Ensure you have multiple JSON files with language codes (e.g., `en.json`, `es.json`)
4. Make sure the cell contains text content

#### Issue: Translation fails with error

**Possible causes:**

- Invalid API credentials
- API rate limits exceeded
- Network connectivity issues
- Unsupported language codes

**Solution:**

1. Check VS Code Developer Console (`Help > Toggle Developer Tools`) for error details
2. Verify API credentials and permissions
3. Check your API usage limits
4. Ensure source and target languages are supported by your chosen service

### Environment Configuration Issues

#### Issue: Environment variables not loading

**Possible causes:**

- .env file path incorrect
- File permissions
- Environment variables not properly formatted

**Solution:**

1. Use `JSON Synchronized: Select Environment File` command to select the
   correct .env file
2. Ensure .env file is readable and properly formatted:

   ```bash
   GOOGLE_API_KEY=your-api-key
   AZURE_TRANSLATOR_KEY=your-key
   ```

3. Check file paths - use absolute paths if relative paths don't work
4. Restart VS Code after changing environment configuration

#### Issue: Custom .env file not found

**Possible causes:**

- Incorrect file path (relative vs absolute)
- File doesn't exist
- Typo in filename

**Solution:**

1. Use the Command Palette command `JSON Synchronized: Select Environment File`
   to browse and select your .env file
2. Check if the file exists in the expected location
3. For relative paths, ensure they're relative to the workspace root
4. Use absolute paths if you're unsure about relative path resolution

### File Synchronization Issues

#### Issue: Changes not syncing between files

**Possible causes:**

- Files not properly detected as JSON
- Syntax errors in JSON files
- File permissions

**Solution:**

1. Ensure all files have valid JSON syntax
2. Check file permissions (files must be writable)
3. Refresh the JSON Synchronized view
4. Close and reopen the extension

#### Issue: Wrong language detection

**Possible causes:**

- Filename doesn't contain recognizable language code
- Language code not in expected format

**Solution:**

1. Rename files to include standard language codes
   (e.g., `en.json`, `es-ES.json`, `fr_FR.json`)
2. Supported patterns:
   - `en.json` (language only)
   - `en-US.json` (language-country)
   - `en_US.json` (language_country)
   - `messages.en.json` (prefix.language.json)

### Performance Issues

#### Issue: Extension is slow with large files

**Possible causes:**

- Very large JSON files
- Too many nested objects
- Network latency for translation services

**Solution:**

1. Consider splitting large JSON files into smaller, more focused files
2. Limit translation batch sizes by translating individual fields rather
   than bulk operations
3. Use local caching by avoiding redundant translations

## Error Messages

### "Translation service not configured"

Configure a translation service in VS Code settings or environment variables.
See [Translation Services](./translation-services.md) for setup instructions.

### "No valid translation target languages found"

Ensure you have multiple JSON files with different language codes in your workspace.

### "Failed to load environment file"

Check that your .env file path is correct and the file is readable.
Use the Command Palette to select the file if needed.

### "API rate limit exceeded"

You've exceeded your translation service's rate limits. Wait before trying again
or upgrade your API plan.

### "Invalid API credentials"

Check your API keys and ensure they're correctly configured with appropriate permissions.

## Getting Help

If you're still experiencing issues:

1. **Check the Output Panel**: Go to `View > Output` and select "JSON Synchronized"
   to see detailed logs
2. **Enable Debug Mode**: Add `"json-synchronized.debug": true` to your
   VS Code settings for verbose logging
3. **Check Developer Console**: Use `Help > Toggle Developer Tools` to
   see JavaScript errors
4. **Review Configuration**: Verify all settings in `File > Preferences > Settings`
   under "JSON Synchronized"

## Reporting Issues

When reporting issues, please include:

1. **VS Code version** and **JSON Synchronized version**
2. **Operating system** and version
3. **Complete error messages** from the Output panel or Developer Console
4. **Configuration details** (without exposing API keys)
5. **Steps to reproduce** the issue
6. **Sample JSON files** (if relevant and non-sensitive)

Create an issue at: [GitHub Issues](https://github.com/AbelMSG89/json-synchronized/issues)

## Related Documentation

- [Installation & Setup](./installation.md)
- [Translation Features](./translation-features.md)
- [Environment Configuration](./environment-configuration.md)
- [Translation Services](./translation-services.md)
- [Architecture](./architecture.md)
