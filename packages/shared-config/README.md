# @repo/shared-config

Shared configuration files for TypeScript, ESLint, and Prettier across all microservices and packages.

## Usage

### TypeScript

In your `tsconfig.json`:

```json
{
  "extends": "@repo/shared-config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### ESLint

In your `eslint.config.js`:

```js
import sharedConfig from '@repo/shared-config/eslint.config.js'

export default [
  ...sharedConfig,
  // Your custom rules here
]
```

### Prettier

In your `prettier.config.js`:

```js
import sharedConfig from '@repo/shared-config/prettier.config.js'

export default sharedConfig
```

## Included Configurations

- **tsconfig.base.json** - TypeScript compiler options with strict mode
- **eslint.config.js** - ESLint flat config with best practices
- **prettier.config.js** - Prettier formatting rules
