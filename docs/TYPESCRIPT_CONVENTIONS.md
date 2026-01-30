# TypeScript Conventions

This document defines TypeScript configuration and module conventions for this monorepo.

## Project References (Monorepo)

We use TypeScript project references for incremental builds. Each package follows this pattern:

- `tsconfig.json` — root config with `references` to build/test configs
- `tsconfig.build.json` — build config (must have `composite: true`)
- `tsconfig.test.json` — test config (if the package has tests)

**Rule:** All build configs must set `composite: true`. This is required for project references to work.

```json
// tsconfig.build.json
{
  "include": ["src"],
  "compilerOptions": {
    "composite": true,
    "outDir": "dist",
    "rootDir": "src",
    "tsBuildInfoFile": ".tsbuildinfo/build.tsbuildinfo"
  },
  "references": [
    { "path": "../core/tsconfig.build.json" }
  ]
}
```

## Module Resolution and Imports

We write ESM with explicit `.ts` extensions for **relative** imports. The compiler rewrites them to `.js` at emit time.

### Relative Imports: Always Use `.ts`

```typescript
// CORRECT
import { Organization } from "./entities/Organization.ts"
import { OrganizationErrors } from "./errors/OrganizationErrors.ts"
import { OrganizationService } from "./services/OrganizationService.ts"

// WRONG
import { Organization } from "./entities/Organization.js"
```

### Package Imports: Never Use Extensions

```typescript
// CORRECT
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { PgClient } from "@effect/sql-pg"
import { ConfigService } from "@repo/config"

// WRONG
import * as Effect from "effect/Effect.js"
import * as Schema from "effect/Schema.ts"
```

### Never Import From `/src/`

Public APIs are defined via `package.json` exports. `/src/` is private.

```typescript
// CORRECT
import { ConfigService } from "@repo/config"
import { CoreRuntime } from "@repo/core/runtime"

// WRONG
import { ConfigService } from "@repo/config/src/ConfigService"
import { CoreRuntime } from "@repo/core/src/Runtime"
```

## Avoid Barrel Files

**Rule:** Avoid `index.ts` barrel files inside feature folders. They create hidden dependencies, increase bundle size, and make imports ambiguous.

Allowed: package entrypoints like `packages/core/src/index.ts` only.

```typescript
// CORRECT
import { Organization } from "./entities/Organization.ts"
import { OrganizationId } from "./values/OrganizationId.ts"

// WRONG
import { Organization, OrganizationId } from "./entities/index.ts"
```

## Module Structure

Follow the domain-first structure from `specs/CORE_CODE_ORGANIZATION.md`. Prefer focused modules over mega-files.

Example domain layout:

```
packages/core/src/organization/
├── entities/
│   └── Organization.ts
├── values/
│   └── OrganizationId.ts
├── services/
│   └── OrganizationService.ts
└── errors/
    └── OrganizationErrors.ts
```

## Type-Only Imports

Use `import type` for types to reduce runtime output and make dependencies explicit.

```typescript
import type { OrganizationId } from "../values/OrganizationId.ts"
import { Organization } from "../entities/Organization.ts"
```

## Naming Conventions

- **Files:** `PascalCase.ts` for exported Effect/Schema entities and services.
- **Types:** `PascalCase`.
- **Values/constants:** `camelCase` or `SCREAMING_SNAKE_CASE` for env-like constants.
- **Errors:** `[Entity][Problem]Error` (e.g. `ApiKeyExpiredError`).

## Strictness

TypeScript should remain strict for better LLM guidance and correctness:

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`
- `noImplicitOverride: true`

If a config must relax strictness, it must be documented in the package README with justification.

