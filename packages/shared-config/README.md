# @repo/shared-config

Shared configuration files for TypeScript and Biome across all microservices and packages.

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

### Biome

In your root `biome.json`:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "extends": ["./packages/shared-config/biome.json"]
}
```

Or copy the config directly to your root and customize as needed.

### Commands

```bash
# Format and fix issues
pnpm biome check --write

# Check for issues without fixing
pnpm biome check

# Format only
pnpm biome format --write
```

## Included Configurations

- **tsconfig.base.json** - TypeScript compiler options with strict mode
- **biome.json** - Biome linter and formatter configuration with recommended rules
