# Translation Services Setup

## Overview

This guide provides step-by-step instructions for setting up translation services
with JSON Synchronizer. Each service has different requirements and pricing models.

## Google Cloud Translation API

### Google Cloud Prerequisites

- Google Cloud Platform account
- Billing enabled on your project
- Cloud Translation API enabled

### Google Cloud Setup Steps

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Click "New Project" or select existing project
   - Note your Project ID

2. **Enable the Translation API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Cloud Translation API"
   - Click "Enable"

3. **Create API Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key
   - (Optional) Restrict the key to Translation API only

4. **Configure JSON Synchronizer**

   **Using Environment Variables (Recommended):**

   ```bash
   # In your .env file
   JSON_SYNCHRONIZER_GOOGLE_KEY=your-api-key-here
   JSON_SYNCHRONIZER_GOOGLE_PROJECT=your-project-id
   ```

   **Using VS Code Settings:**

   ```json
   {
     "json-synchronizer.translationService": "GoogleTranslator",
     "json-synchronizer.translationServiceGoogle": [
       "your-api-key-here",
       "",
       "your-project-id"
     ]
   }
   ```

### Google Cloud Translation API Pricing

- **Free Tier**: 500,000 characters per month
- **Paid**: $20 per 1M characters
- **Rate Limits**: 100 requests per second per project

## Microsoft Translator (Azure)

### Microsoft Azure Prerequisites

- Microsoft Azure account
- Active Azure subscription

### Microsoft Setup Steps

1. **Create Translator Resource**
   - Go to [Azure Portal](https://portal.azure.com/)
   - Click "Create a resource"
   - Search for "Translator"
   - Select "Translator" and click "Create"

2. **Configure Resource**
   - Choose subscription and resource group
   - Select pricing tier (F0 for free tier)
   - Choose region (e.g., "East US")
   - Create the resource

3. **Get Credentials**
   - Navigate to your Translator resource
   - Go to "Keys and Endpoint"
   - Copy "Key 1" and "Location/Region"

4. **Configure JSON Synchronizer**

   **Using Environment Variables (Recommended):**

   ```bash
   # In your .env file
   JSON_SYNCHRONIZER_MICROSOFT_KEY=your-subscription-key
   JSON_SYNCHRONIZER_MICROSOFT_REGION=eastus
   ```

   **Using VS Code Settings:**

   ```json
   {
     "json-synchronizer.translationService": "MicrosoftTranslator",
     "json-synchronizer.translationServiceMicrosoft": [
       "your-subscription-key",
       "",
       "eastus"
     ]
   }
   ```

### Microsoft Translator Pricing

- **Free Tier**: 2M characters per month
- **Paid**: $10 per 1M characters
- **Rate Limits**: Varies by subscription tier

## Amazon Translate (AWS)

### Amazon Prerequisites

- AWS account
- AWS CLI configured (optional)
- IAM user with appropriate permissions

### Amazon Setup Steps

1. **Create IAM User**
   - Go to [AWS Console](https://console.aws.amazon.com/)
   - Navigate to IAM → Users
   - Click "Add user"
   - Select "Programmatic access"

2. **Attach Permissions**
   - Attach existing policy: "TranslateFullAccess"
   - Or create custom policy with minimal permissions:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "translate:TranslateText",
           "translate:GetTerminology",
           "translate:ListTerminologies"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

3. **Generate Access Keys**
   - Complete user creation
   - Download or copy the Access Key ID and Secret Access Key
   - Choose your preferred AWS region

4. **Configure JSON Synchronizer**

   **Using Environment Variables (Recommended):**

   ```bash
   # In your .env file
   JSON_SYNCHRONIZER_AMAZON_KEY=your-access-key-id
   JSON_SYNCHRONIZER_AMAZON_SECRET=your-secret-access-key
   JSON_SYNCHRONIZER_AMAZON_REGION=us-east-1
   ```

   **Using VS Code Settings:**

   ```json
   {
     "json-synchronizer.translationService": "AmazonTranslator",
     "json-synchronizer.translationServiceAmazon": [
       "your-access-key-id",
       "your-secret-access-key",
       "us-east-1"
     ]
   }
   ```

### Amazon Translate Pricing

- **Free Tier**: 2M characters per month (first 12 months)
- **Paid**: $15 per 1M characters
- **Rate Limits**: 100 TPS (transactions per second)

## Service Comparison

| Feature | Google | Microsoft | Amazon |
|---------|--------|-----------|---------|
| **Free Tier** | 500K chars/month | 2M chars/month | 2M chars/month (1 year) |
| **Pricing** | $20/1M chars | $10/1M chars | $15/1M chars |
| **Languages** | 100+ | 70+ | 75+ |
| **Quality** | Excellent | Very Good | Very Good |
| **Rate Limits** | 100 req/sec | Variable | 100 TPS |
| **Setup Complexity** | Medium | Easy | Hard |

## Switching Between Services

You can easily switch between translation services:

1. **Update Environment Variables**

   ```bash
   # Change from Google to Microsoft
   # JSON_SYNCHRONIZER_GOOGLE_KEY=...
   JSON_SYNCHRONIZER_MICROSOFT_KEY=your-microsoft-key
   JSON_SYNCHRONIZER_MICROSOFT_REGION=eastus
   ```

2. **Update VS Code Setting**

   ```json
   {
     "json-synchronizer.translationService": "MicrosoftTranslator"
   }
   ```

3. **Restart VS Code** or reload the extension

## Testing Your Setup

1. **Create Test Files**

   ```bash
   test-translations/
   ├── en.json
   ├── es.json
   └── fr.json
   ```

2. **Add Test Content**

   ```json
   // en.json
   {
     "hello": "Hello World",
     "greeting": "Welcome to our application"
   }
   ```

3. **Test Translation**
   - Right-click folder → "Synchronize JSON"
   - Enter text in English file
   - Click translation button (🌐)
   - Verify translations appear in other files

## Troubleshooting

### Authentication Errors

- **Google**: Verify API key and project ID are correct
- **Microsoft**: Check subscription key and region match
- **Amazon**: Ensure access keys have proper permissions

### Rate Limiting

- **Monitor Usage**: Check your service dashboards
- **Implement Delays**: For bulk translations, add delays between requests
- **Upgrade Plans**: Consider higher tier plans for heavy usage

### Quality Issues

- **Context**: Provide more context in source text
- **Placeholders**: Ensure placeholders are properly formatted
- **Language Pairs**: Some combinations work better than others

### Network Issues

- **Proxy Settings**: Configure VS Code proxy if needed
- **Firewall**: Ensure translation service URLs are accessible
- **Timeout**: Check internet connection stability

## Best Practices

### Security

- **Use Environment Variables**: Never store credentials in VS Code settings
- **Rotate Keys**: Regularly rotate API keys
- **Restrict Permissions**: Use minimal required permissions
- **Monitor Usage**: Watch for unusual API usage

### Performance

- **Batch Requests**: Translate multiple strings when possible
- **Cache Results**: Avoid re-translating the same content
- **Monitor Quotas**: Track usage to avoid service interruptions

### Quality

- **Review Translations**: Always review automated translations
- **Consistent Terminology**: Use consistent terms across languages
- **Context Matters**: Provide context for better translations
- **Professional Review**: Consider professional translation for critical content

For more detailed information, see:

- [Translation Features Documentation](./translation-features.md)
- [Environment Configuration Guide](./environment-configuration.md)
- [Troubleshooting Guide](./troubleshooting.md)
