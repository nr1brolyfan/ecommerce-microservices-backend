/**
 * Prettier Configuration
 * Shared code formatting rules
 */

export default {
  // Print width
  printWidth: 100,
  
  // Tabs vs Spaces
  tabWidth: 2,
  useTabs: false,
  
  // Semicolons
  semi: false,
  
  // Quotes
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  
  // Trailing commas
  trailingComma: 'all',
  
  // Brackets
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  
  // Line endings
  endOfLine: 'lf',
  
  // Embedded languages
  embeddedLanguageFormatting: 'auto',
  
  // Prose wrap
  proseWrap: 'preserve',
  
  // HTML whitespace sensitivity
  htmlWhitespaceSensitivity: 'css',
  
  // Vue files
  vueIndentScriptAndStyle: false,
  
  // Override for specific file types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 80,
      },
    },
  ],
}
