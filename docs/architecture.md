# Project Architecture

## Overview

JSON Synchronizer is a VS Code extension built with TypeScript, React, and modern
web technologies. The architecture follows a modular design with clear separation
of concerns between the extension backend and webview frontend.

## Technology Stack

### Core Technologies

- **TypeScript** - Main programming language
- **VS Code Extension API** - Extension framework
- **React** - Frontend UI framework
- **ESBuild** - Fast bundling and compilation
- **Node.js** - Runtime environment

### Translation Service Providers

- **Google Cloud Translation API** - Neural machine translation
- **Microsoft Translator** - Azure Cognitive Services
- **Amazon Translate** - AWS translation service
- **Axios** - HTTP client for API requests

### Development Tools

- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **TypeScript Compiler** - Type checking
- **npm-run-all** - Parallel script execution

## Project Structure

```bash
json-synchronizer/
├── src/                          # Source code
│   ├── extension.ts             # Main extension entry point
│   ├── webview.tsx              # React webview application
│   ├── declarations.d.ts        # Type declarations
│   ├── styles.css               # Global styles
│   │
│   ├── components/              # React components
│   │   ├── Table.tsx           # Main table component
│   │   ├── AddNewKey.tsx       # Add new translation key
│   │   ├── Icons.tsx           # Icon components
│   │   └── TranslationButton.tsx # Translation button
│   │
│   ├── hooks/                   # React hooks
│   │   └── useJSONSynchronizer.ts # Main application logic
│   │
│   ├── services/                # Backend services
│   │   ├── TranslationService.ts      # Main translation orchestrator
│   │   ├── TranslationConfiguration.ts # Configuration management
│   │   ├── EnvironmentLoader.ts       # Environment file handling
│   │   ├── ITranslationService.ts     # Translation service interface
│   │   └── translators/               # Translation service implementations
│   │       ├── GoogleTranslator.ts
│   │       ├── MicrosoftTranslator.ts
│   │       └── AmazonTranslator.ts
│   │
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── dataUtils.ts        # Data manipulation utilities
│   │   └── tableRowGenerator.ts # Table row generation
│   │
│   └── test/                    # Test files
│       └── extension.test.ts    # Extension tests
│
├── media/                       # Static assets
│   ├── logo.png               # Extension logo
│   ├── logo.svg               # Vector logo
│   └── *.gif                   # Documentation GIFs
│
├── docs/                        # Documentation
│   ├── README.md               # Documentation index
│   ├── installation.md        # Installation guide
│   ├── translation-features.md # Translation documentation
│   └── ...                     # Additional docs
│
├── dist/                        # Compiled output
├── out/                         # Test compilation output
├── node_modules/               # Dependencies
│
├── package.json                # Package configuration
├── tsconfig.json              # TypeScript configuration
├── eslint.config.mjs          # ESLint configuration
├── esbuild.js                 # Build configuration
├── .gitignore                 # Git ignore rules
├── .env.example               # Environment template
└── README.md                   # Main documentation
```

## Component Architecture

### Extension Backend (`extension.ts`)

The main extension file handles:

- Command registration and execution
- Webview panel creation and management
- File system operations (reading/writing JSON files)
- File watching for real-time updates
- Message passing between extension and webview
- Translation request handling

Key responsibilities:

```typescript
// Command registration
vscode.commands.registerCommand("json-synchronizer.synchronize", ...)

// Webview creation
const panel = vscode.window.createWebviewPanel(...)

// File operations
const content = await fsPromise.readFile(filePath, { encoding: "utf-8" })

// Message handling
panel.webview.onDidReceiveMessage(async (message) => { ... })
```

### React Frontend (`webview.tsx`)

The webview application provides:

- Table-based JSON editing interface
- Real-time synchronization across files
- Translation button integration
- Add/remove key functionality
- Warning aggregation for missing values

Main components:

- **App Component** - Root application component
- **Table Component** - Main editing interface
- **TranslationButton** - Translation trigger
- **AddNewKey** - New key creation

### Services Layer

#### Translation Services Layer

- **TranslationService.ts** - Main orchestrator that routes requests to
  specific providers
- **TranslationConfiguration.ts** - Manages configuration from VS Code settings
  and environment variables
- **Individual Translators** - Provider-specific implementations

#### Environment Management

- **EnvironmentLoader.ts** - Handles loading custom .env files and
  environment variable management

#### Data Management

- **dataUtils.ts** - Utilities for language detection, placeholder preservation,
  and data manipulation
- **tableRowGenerator.ts** - Generates table rows from JSON data structures

## Data Flow

### 1. Extension Initialization

```text
User Action (Right-click folder) 
→ Command Registration 
→ File Discovery 
→ Webview Creation 
→ Initial Data Load
```

### 2. JSON Synchronization

```text
User Edit in Webview 
→ Message to Extension 
→ File System Update 
→ File Watcher Trigger 
→ Broadcast to All Webviews
```

### 3. Translation Flow

```text
Translation Button Click 
→ Extract Text & Context 
→ Language Detection 
→ Translation Service API Call 
→ Process Response 
→ Update Target Files 
→ UI Feedback
```

### 4. Environment Loading

```text
Extension Activation 
→ Check envFilePath Setting 
→ Load .env File (if specified) 
→ Parse Environment Variables 
→ Configure Translation Services
```

## Communication Patterns

### Extension ↔ Webview

- **Bidirectional messaging** using VS Code's webview message API
- **JSON-based protocol** for structured communication
- **Event-driven updates** for real-time synchronization

Message Types:

```typescript
interface MessageToWebview {
  type: 'json' | 'update' | 'error'
  data: any
}

interface MessageToExtension {
  type: 'update' | 'rename' | 'translate' | 'add'
  // ... specific data for each type
}
```

### Service Integration

- **Dependency injection** pattern for translation services
- **Configuration-driven** service selection
- **Async/await** for API calls and file operations

## Security Architecture

### Credential Management

- **Environment variables** preferred over VS Code settings
- **Custom .env file support** with workspace isolation
- **No credential storage** in extension or workspace settings
- **Runtime-only** credential loading

### API Security

- **HTTPS-only** communication with translation services
- **API key validation** before service calls
- **Rate limiting** awareness and error handling
- **Secure credential rotation** support

## Error Handling

### Extension Level

- **Try-catch blocks** around file operations
- **Graceful degradation** when translation services fail
- **User feedback** through VS Code notifications
- **Logging** to output channel for debugging

### Frontend Level

- **React error boundaries** for component isolation
- **Input validation** before sending to extension
- **Loading states** for async operations
- **User-friendly error messages**

## Performance Considerations

### File Operations

- **Asynchronous I/O** for non-blocking file access
- **File watching** for efficient change detection
- **Debounced updates** to prevent excessive writes
- **Memory-efficient** JSON parsing

### Translation Services

- **Request batching** where supported by APIs
- **Caching strategies** to avoid redundant calls
- **Timeout handling** for API requests
- **Queue management** for multiple translations

### UI Performance

- **Virtual scrolling** for large datasets (future enhancement)
- **Optimized re-renders** with React.memo
- **Lazy loading** of components
- **Efficient state management**

## Extensibility

### Adding New Translation Services

1. Implement `ITranslationService` interface
2. Add configuration options to `package.json`
3. Register service in `TranslationService.ts`
4. Add environment variable support
5. Update documentation

### Adding New Features

1. Define new message types for extension ↔ webview communication
2. Implement backend logic in `extension.ts`
3. Add frontend components and hooks
4. Update configuration schema if needed
5. Add tests and documentation

## Testing Strategy

### Unit Tests

- **Service layer testing** with mocked dependencies
- **Utility function testing** with various inputs
- **Configuration testing** with different scenarios

### Integration Tests

- **Extension lifecycle testing**
- **File system operation testing**
- **Translation service integration testing**

### Manual Testing

- **Multi-language file scenarios**
- **Large dataset performance**
- **Error condition handling**
- **Cross-platform compatibility**

## Build Process

### Development Build

```bash
npm run watch  # Parallel TypeScript and ESBuild watching
```

### Production Build

```bash
npm run package  # Type check + lint + optimized build
```

### Build Tools

- **ESBuild** - Fast bundling with tree shaking
- **TypeScript** - Type checking and compilation
- **ESLint** - Code quality and style enforcement
- **npm-run-all** - Parallel script execution

This architecture provides a solid foundation for the extension while maintaining
flexibility for future enhancements and third-party integrations.
