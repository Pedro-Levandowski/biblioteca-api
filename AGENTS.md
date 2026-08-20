# Biblioteca API


## Commands
- **Dev Server**: `npm run dev` (starts on `http://localhost:3000`, respects
`PORTA` env var)
- **Tests**: `npm test` (runs Node.js built-in test runner via `node --test
"verificacoes/**/*.spec.js"`)


## Architecture & Conventions
- **Runtime**: Node.js `>= 20`, native ES modules (`"type": "module"`).
- **Framework**: Zero third-party dependencies; uses Node.js native
`node:http`.
- **Testing**: Uses built-in `node:test` and `node:assert/strict`.
- **Data Persistence**: In-memory storage only (resets on server restart).
- **Language**: Domain logic, code, routes, and tests are in Brazilian Portuguese.


## Domain & API Rules
- **Validation**: Validation errors must return HTTP status 422.
- **Error Responses**: All errors follow a strict JSON structure: `{ "erro":
{ "codigo": "STRING", "mensagem": "STRING" } }`.
- **Identifiers**: IDs are generated with a prefix and 4 random hex bytes
(format: `prefix_<8-hex-chars>`).
- **Tests**: Test files must be placed inside the `verificacoes/` directory
and use the `.spec.js` suffix.