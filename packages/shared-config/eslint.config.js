/**
 * ESLint Configuration
 * Shared ESLint rules for all packages and apps
 */

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/pnpm-lock.yaml',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Best Practices
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      
      // Code Style
      'semi': ['error', 'never'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-parens': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      
      // ES6+
      'no-duplicate-imports': 'error',
      'prefer-template': 'warn',
      'prefer-spread': 'warn',
      
      // Error Prevention
      'no-unreachable': 'error',
      'no-fallthrough': 'error',
      'no-implicit-coercion': 'warn',
    },
  },
]
