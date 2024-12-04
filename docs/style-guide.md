# Fiction Platform Style Guide

## Names and Casing

- Vue
  - Components:
    - Casing: PascalCase - `UserCard.vue`, `CardTemplate.vue`
    - Multi-word: All words capitalized - `UserCard`, `CardTemplate`
  - Props: camelCase - `userCard`, `cardTemplate`, kebab-case in templates - `user-card`, `card-template`
- TypeScript/JavaScript files: camelCase - `userSchema.ts`, `cardUtils.ts`
- Markdown/docs: kebab-case - `getting-started.md`, `style-guide.md`
- Test files: Same case as source + `.test.ts` - `userSchema.test.ts`
- Folder names: kebab-case - `user-cards`, `card-templates`

- No abbreviations in names. Use full words. - `userCard` instead of `usrCard`


## TypeScript Conventions
- Zod schemas: PascalCase with Schema suffix

```typescript
const UserSchema = z.object({...})
type User = z.infer<typeof UserSchema>
```

- One argument pattern for functions

```typescript
// Good
function updateUser({ id, name, email }: UpdateUserArgs)

// Avoid
function updateUser(id: string, name: string, email: string)
```

## Architecture

- Never use globals, ever. All variables must be dependency injected.

## Vue Conventions

## Styling Conventions

## Testing Conventions
