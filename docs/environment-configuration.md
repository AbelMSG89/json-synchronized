# Environment Configuration

## Overview

JSON Synchronized supports flexible environment configuration for managing
translation service credentials securely. You can use system environment variables,
custom .env files, or a combination of both.

## Supported Configuration Methods

### 1. Default .env File (Recommended)

Place a `.env` file in your workspace root for automatic loading.

### 2. Custom .env Files

Use environment-specific files like `.env.development`, `.env.production`.

### 3. System Environment Variables

Set variables in your system environment or shell profile.

### 4. VS Code Settings

Configure credentials directly in VS Code settings (less secure).

## Environment File Support

### Automatic Detection

JSON Synchronized automatically loads a `.env` file from your workspace root if:

- No custom `envFilePath` is specified in settings
- The `.env` file exists in the workspace root
- No warning is shown if the default `.env` file doesn't exist

### Custom Environment Files

Configure custom environment files using the `json-synchronized.envFilePath` setting:

```json
{
  "json-synchronized.envFilePath": ".env.development"
}
```

#### Supported Path Types

**Relative Paths** (from workspace root):

```text
.env.development
.env.production  
config/.env.local
environments/dev.env
```

**Absolute Paths**:

```text
/home/user/shared/.env
C:\Users\Username\config\.env
/usr/local/etc/json-sync/.env
```

### Environment File Selection

Use the Command Palette for easy environment file management:

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: `JSON Synchronized: Select Environment File`
3. Choose from available .env files in your workspace
4. Select "None" to use system environment variables

## Supported Variables

### Google Translate API

#### Google Translate Standard Variables

```bash
GOOGLE_API_KEY=your-google-cloud-api-key
GOOGLE_CLOUD_PROJECT=your-google-cloud-project-id
```

#### Google Translate Custom Variables

```bash
JSON_SYNCHRONIZED_GOOGLE_KEY=your-api-key
JSON_SYNCHRONIZED_GOOGLE_PROJECT=your-project-id
```

### Microsoft Translator API

#### Microsoft Standard Variables

```bash
AZURE_TRANSLATOR_KEY=your-azure-translator-key
AZURE_TRANSLATOR_REGION=your-azure-region
```

#### Microsoft Custom Variables

```bash
JSON_SYNCHRONIZED_MICROSOFT_KEY=your-translator-key
JSON_SYNCHRONIZED_MICROSOFT_REGION=your-region
```

### Amazon Translate API

#### Amazon Standard Variables

```bash
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_DEFAULT_REGION=your-aws-region
```

#### Amazon Custom Variables

```bash
JSON_SYNCHRONIZED_AMAZON_KEY=your-access-key-id
JSON_SYNCHRONIZED_AMAZON_SECRET=your-secret-access-key
JSON_SYNCHRONIZED_AMAZON_REGION=your-region
```

## Configuration Examples

### Single Service Setup

**Google Translate Only** (`.env`):

```bash
# Google Translate Configuration
JSON_SYNCHRONIZED_GOOGLE_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
JSON_SYNCHRONIZED_GOOGLE_PROJECT=my-translation-project
```

VS Code Settings:

```json
{
  "json-synchronized.translationService": "GoogleTranslator",
  "json-synchronized.defaultLanguage": "en"
}
```

### Multi-Environment Setup

**Development Environment** (`.env.development`):

```bash
# Development Translation Settings
JSON_SYNCHRONIZED_GOOGLE_KEY=AIzaSyDev_key_here
JSON_SYNCHRONIZED_GOOGLE_PROJECT=my-dev-project
```

**Production Environment** (`.env.production`):

```bash
# Production Translation Settings  
JSON_SYNCHRONIZED_GOOGLE_KEY=AIzaSyProd_key_here
JSON_SYNCHRONIZED_GOOGLE_PROJECT=my-prod-project
```

**Workspace Settings**:

```json
{
  "json-synchronized.translationService": "GoogleTranslator",
  "json-synchronized.envFilePath": ".env.development"
}
```

### Multiple Services Setup

**All Services** (`.env`):

```bash
# Google Translate
JSON_SYNCHRONIZED_GOOGLE_KEY=your-google-key
JSON_SYNCHRONIZED_GOOGLE_PROJECT=your-google-project

# Microsoft Translator
JSON_SYNCHRONIZED_MICROSOFT_KEY=your-microsoft-key
JSON_SYNCHRONIZED_MICROSOFT_REGION=eastus

# Amazon Translate
JSON_SYNCHRONIZED_AMAZON_KEY=your-amazon-key
JSON_SYNCHRONIZED_AMAZON_SECRET=your-amazon-secret
JSON_SYNCHRONIZED_AMAZON_REGION=us-east-1
```

Switch between services by changing the setting:

```json
{
  "json-synchronized.translationService": "MicrosoftTranslator"
}
```

## Priority Order

Environment variables are loaded in this priority order:

1. **Custom .env file** (specified in `envFilePath`)
2. **Default .env file** (workspace root)
3. **System environment variables**
4. **VS Code settings** (fallback)

## Security Best Practices

### 1. Use Environment Files

- Store credentials in .env files instead of VS Code settings
- Never commit .env files with real credentials to version control
- Use different .env files for different environments

### 2. File Permissions

```bash
# Set restrictive permissions on .env files
chmod 600 .env
chmod 600 .env.production
```

### 3. Git Configuration

Add to `.gitignore`:

```gitignore
# Environment files
.env
.env.local
.env.development
.env.production
*.env
```

### 4. Credential Rotation

- Regularly rotate API keys
- Use different credentials for development and production
- Monitor API usage for unauthorized access

## Troubleshooting

### Environment Not Loading

**Check File Path**:

```bash
# Verify file exists
ls -la .env.development

# Check current working directory
pwd
```

**Verify Configuration**:

```json
{
  "json-synchronized.envFilePath": ".env.development"
}
```

### Variables Not Recognized

**Check Variable Names**:

- Ensure correct spelling and case sensitivity
- Use either standard or custom variable names consistently
- Avoid spaces around `=` in .env files

**Debug Loading**:

1. Open VS Code Output panel
2. Select "JSON Synchronized" from dropdown
3. Look for environment loading messages

### Permission Issues

**Fix File Permissions**:

```bash
# Make file readable by current user
chmod 644 .env

# Check ownership
ls -la .env
```

**Windows Issues**:

- Ensure file is not read-only
- Check antivirus software isn't blocking access
- Try running VS Code as administrator

### Service Configuration

**Verify Service Settings**:

```json
{
  "json-synchronized.translationService": "GoogleTranslator"
}
```

**Test Credentials**:

- Use translation service provider's testing tools
- Verify API keys have proper permissions
- Check service quotas and limits

## Environment Status

### Check Current Status

Use the Command Palette:

1. `Ctrl+Shift+P` → `JSON Synchronized: Select Environment File`
2. The current environment status is shown in the selection list

### Status Messages

- `"Using default .env file: .env"` - Default workspace .env is loaded
- `"Custom env loaded: .env.development"` - Custom environment file is active
- `"Using system environment variables"` - No .env file loaded

## Migration Guide

### From VS Code Settings to Environment Files

1. **Create .env file**:

   ```bash
   touch .env
   ```

2. **Copy credentials** from VS Code settings to .env file:

   ```bash
   # From settings.json
   "json-synchronized.translationServiceGoogle": ["key", "", "project"]
   
   # To .env file
   JSON_SYNCHRONIZED_GOOGLE_KEY=key
   JSON_SYNCHRONIZED_GOOGLE_PROJECT=project
   ```

3. **Remove from VS Code settings**:

   ```json
   {
     "json-synchronized.translationService": "GoogleTranslator"
     // Remove credential arrays
   }
   ```

4. **Test configuration** to ensure translation still works

### From System Variables to .env Files

1. **Check current system variables**:

   ```bash
   env | grep GOOGLE_API_KEY
   ```

2. **Copy to .env file**:

   ```bash
   echo "JSON_SYNCHRONIZED_GOOGLE_KEY=$GOOGLE_API_KEY" >> .env
   ```

3. **Update variable names** if using custom prefix

4. **Test and cleanup** system variables if desired

## Advanced Configuration

### Dynamic Environment Switching

Create workspace scripts for environment switching:

**package.json**:

```json
{
  "scripts": {
    "env:dev": "cp .env.development .env",
    "env:prod": "cp .env.production .env",
    "env:test": "cp .env.test .env"
  }
}
```

### CI/CD Integration

**GitHub Actions**:

```yaml
- name: Setup Translation Environment
  run: |
    echo "JSON_SYNCHRONIZED_GOOGLE_KEY=${{ secrets.GOOGLE_API_KEY }}" >> .env
    echo "JSON_SYNCHRONIZED_GOOGLE_PROJECT=${{ secrets.GOOGLE_PROJECT }}" >> .env
```

**Docker**:

```dockerfile
# Copy environment template
COPY .env.example .env

# Set environment variables
ENV JSON_SYNCHRONIZED_GOOGLE_KEY=${GOOGLE_API_KEY}
ENV JSON_SYNCHRONIZED_GOOGLE_PROJECT=${GOOGLE_PROJECT}
```

This configuration system provides maximum flexibility while maintaining security
and ease of use.
