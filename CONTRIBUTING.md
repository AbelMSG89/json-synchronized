# Contributing to JSON Synchronizer

Thank you for your interest in contributing to JSON Synchronizer!  
This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16.x or higher
- **VS Code** 1.93.0 or higher
- **Git** for version control
- **npm** for dependency management

### Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/YourUsername/json-synchronizer.git
   cd json-synchronizer
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Setup Development Environment**

   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Add your development API keys (optional for basic development)
   # Edit .env with your translation service credentials
   ```

4. **Start Development**

   ```bash
   # Start watch mode for development
   npm run watch
   
   # In another terminal, press F5 in VS Code to launch Extension Development Host
   ```

## 🏗️ Project Structure

Understanding the project structure will help you contribute effectively:

```bash
src/
├── extension.ts              # Main extension entry point
├── webview.tsx              # React frontend application
├── components/              # React UI components
├── services/                # Backend services and APIs
├── hooks/                   # React hooks
├── utils/                   # Utility functions
├── types/                   # TypeScript type definitions
└── test/                    # Test files
```

## 📝 Types of Contributions

### 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Environment details** (VS Code version, OS, etc.)
5. **Console logs** if available
6. **Screenshots or GIFs** if relevant

**Bug Report Template:**

```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- VS Code Version: 
- Extension Version:
- OS: 
- Translation Service: 

## Additional Context
Any other relevant information
```

### ✨ Feature Requests

For new features, please:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** the feature would solve
3. **Propose a solution** with implementation details
4. **Consider alternatives** and their trade-offs
5. **Provide use cases** and examples

### 🔧 Code Contributions

We welcome code contributions! Here's how:

#### Before You Start

1. **Check open issues** for existing work
2. **Create an issue** for new features or major changes
3. **Discuss implementation** with maintainers
4. **Fork the repository** and create a feature branch

#### Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style and patterns
   - Add tests for new functionality
   - Update documentation as needed
   - Ensure TypeScript types are correct

3. **Test your changes**

   ```bash
   # Run type checking
   npm run check-types
   
   # Run linting
   npm run lint
   
   # Run tests
   npm test
   
   # Test in Extension Development Host
   # Press F5 in VS Code
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "add new translation service support"
   ```

5. **Push and create PR**

   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 Coding Standards

### TypeScript Guidelines

- **Use strict TypeScript** - Enable all strict compiler options
- **Explicit types** - Prefer explicit types over `any`
- **Interface over type** - Use interfaces for object shapes
- **Async/await** - Prefer async/await over Promises

```typescript
// Good
interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguages: string[];
}

async function translateText(
  request: TranslationRequest
): Promise<TranslationResponse> {
  // Implementation
}

// Avoid
function translateText(request: any): any {
  // Implementation
}
```

### Code Style

- **ESLint configuration** - Follow the project's ESLint rules
- **Prettier formatting** - Use Prettier for consistent formatting
- **Naming conventions**:
  - `camelCase` for variables and functions
  - `PascalCase` for classes and interfaces
  - `UPPER_SNAKE_CASE` for constants
  - `kebab-case` for file names

### React Guidelines

- **Functional components** - Use function components with hooks
- **TypeScript props** - Always type component props
- **Custom hooks** - Extract reusable logic into custom hooks
- **Error boundaries** - Handle errors gracefully

```typescript
// Good
interface TableProps {
  data: JSONData;
  onUpdate: (key: string, value: string) => void;
}

const Table: React.FC<TableProps> = ({ data, onUpdate }) => {
  // Component implementation
};

// Component with custom hook
const useTranslation = (service: TranslationService) => {
  // Hook implementation
};
```

### VS Code Extension Guidelines

- **Command naming** - Use consistent command naming patterns
- **Configuration** - Add proper configuration schema to `package.json`
- **Error handling** - Provide meaningful error messages to users
- **Progress indication** - Use progress indicators for long operations

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run watch-tests

# Run specific test file
npm test -- --grep "translation"
```

### Writing Tests

- **Unit tests** for services and utilities
- **Integration tests** for extension functionality
- **Mock external dependencies** (file system, APIs)
- **Test error conditions** and edge cases

```typescript
// Example test
describe('TranslationService', () => {
  it('should translate text using Google Translator', async () => {
    const service = new TranslationService();
    const result = await service.translateText('Hello', 'en', ['es']);
    
    expect(result).toHaveProperty('es');
    expect(result.es).toBeTruthy();
  });
});
```

## 📚 Documentation

### Documentation Updates

When contributing code, also update:

- **README.md** - For user-facing changes
- **docs/** - For detailed documentation
- **Code comments** - For complex logic
- **Type annotations** - For public APIs
- **CHANGELOG.md** - For notable changes

### Documentation Style

- **Clear and concise** - Use simple, direct language
- **Examples** - Include code examples and use cases
- **Structure** - Use consistent heading and formatting
- **Links** - Cross-reference related documentation

## 🔄 Pull Request Process

### Before Submitting

1. **Rebase on main** - Ensure your branch is up to date
2. **Run all checks** - Tests, linting, type checking
3. **Update documentation** - Include relevant documentation updates
4. **Clean commit history** - Use meaningful commit messages

### PR Guidelines

1. **Descriptive title** - Clearly describe what the PR does
2. **Detailed description** - Explain the changes and motivation
3. **Link related issues** - Reference relevant issue numbers
4. **Screenshots/GIFs** - For UI changes
5. **Breaking changes** - Clearly mark breaking changes

**PR Template:**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] Added new tests

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings or errors
```

### Review Process

1. **Automated checks** - CI must pass
2. **Code review** - At least one maintainer review
3. **Testing** - Manually test significant changes
4. **Approval** - Maintainer approval required
5. **Merge** - Squash and merge strategy

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

### Release Checklist

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with release notes
3. **Test thoroughly** in clean environment
4. **Create release tag** with release notes
5. **Publish to marketplace** (maintainers only)

## 🏷️ Issue Labels

We use labels to organize issues:

- **bug** - Something isn't working
- **enhancement** - New feature or request
- **documentation** - Improvements or additions to docs
- **good first issue** - Good for newcomers
- **help wanted** - Extra attention is needed
- **priority/high** - High priority issue
- **translation** - Related to translation features

## 💬 Communication

### Discussion Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Pull Request Reviews** - Code-specific discussions

### Getting Help

- **Documentation** - Check the [docs](./docs/) first
- **Search Issues** - Look for existing discussions
- **Create Issue** - For bugs or feature requests
- **Discussion** - For questions or ideas

## 📄 License

By contributing, you agree that your contributions will be licensed under the same
license as the project (MIT License).

## 🙏 Recognition

Contributors will be:

- **Listed in CHANGELOG.md** for significant contributions
- **Mentioned in release notes** for major features
- **Added to contributors list** (if requested)

## ❓ Questions?

If you have questions about contributing:

1. Check the [FAQ](./docs/faq.md)
2. Search existing [issues](https://github.com/AbelMSG89/json-synchronizer/issues)
3. Create a [discussion](https://github.com/AbelMSG89/json-synchronizer/discussions)
4. Ask in a pull request review

Thank you for contributing to JSON Synchronizer! 🎉
