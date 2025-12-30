# @studio/core

DI infrastructure package for multi-client React Native applications.

## Quick Start

```typescript
// 1. In your app entry point
import '@studio/core'; // Imports reflect-metadata

// 2. Compose container
import { composeContainer, DIProvider, DIErrorBoundary } from '@studio/core';

const container = await composeContainer({
  clientId: process.env.EXPO_PUBLIC_CLIENT_ID || 'default',
});

// 3. Wrap your app
<DIErrorBoundary>
  <DIProvider container={container}>
    <App />
  </DIProvider>
</DIErrorBoundary>

// 4. Use services in components
import { useService, TOKENS, type IAuthService } from '@studio/core';

function LoginScreen() {
  const authService = useService<IAuthService>(TOKENS.Auth.Service);
  // ...
}
```

## Architecture

```
@studio/core/
├── contracts/          # Service interfaces (what services DO)
│   ├── auth/
│   ├── payment/
│   ├── storage/
│   └── analytics/
│
├── services/           # Implementations (HOW they do it)
│   ├── auth/
│   ├── payment/
│   └── storage/
│
└── di/                 # DI infrastructure
    ├── tokens/         # Symbol identifiers
    ├── container/      # Container factory & validation
    ├── modules/        # ContainerModules (bindings)
    ├── registry/       # Client registry
    ├── react/          # React hooks & providers
    └── middleware/     # Debug utilities
```

## Key Concepts

### 1. Contracts (Interfaces)

Define WHAT a service does, not HOW.

```typescript
// contracts/auth/IAuthService.ts
export interface IAuthService {
  login(credentials: Credentials): Promise<AuthResponse>;
  logout(): Promise<void>;
}
```

### 2. Tokens

Unique identifiers for DI resolution.

```typescript
// di/tokens/index.ts
export const TOKENS = {
  Auth: {
    Service: Symbol.for('Auth.Service'),
  },
} as const;
```

### 3. Services (Implementations)

Implement interfaces with `@injectable()` decorator.

```typescript
// services/auth/firebase-auth.service.ts
@injectable()
export class FirebaseAuthService implements IAuthService {
  async login(credentials: Credentials) { /* Firebase logic */ }
  async logout() { /* Firebase logic */ }
}
```

### 4. Modules (Bindings)

Connect tokens to implementations.

```typescript
// di/modules/clients/client-a.module.ts
export const ClientAModule = new ContainerModule((options) => {
  options.bind(TOKENS.Auth.Service).to(FirebaseAuthService).inSingletonScope();
});
```

### 5. React Integration

```typescript
// In components
const authService = useService<IAuthService>(TOKENS.Auth.Service);
await authService.login({ email, password });
```

## Adding a New Service

1. **Define contract** in `contracts/{domain}/I{Service}.ts`
2. **Add token** in `di/tokens/index.ts`
3. **Create implementation** in `services/{domain}/{impl}.service.ts`
4. **Bind in module** in `di/modules/clients/{client}.module.ts`

## Client Configuration

Clients are selected via `EXPO_PUBLIC_CLIENT_ID` env var.

```bash
# Build for client-a
EXPO_PUBLIC_CLIENT_ID=client-a expo build
```

Register client modules:

```typescript
// di/registry/client-registry.ts
clientRegistry.register('client-a', () =>
  import('../modules/clients/client-a.module').then(m => m.ClientAModule)
);
```

## Exports

```typescript
// Tokens
export { TOKENS } from '@studio/core';

// Contracts
export type { IAuthService, IPaymentService, IStorageService } from '@studio/core';

// React
export { DIProvider, DIErrorBoundary, useService, useServices } from '@studio/core';

// Container
export { composeContainer, clientRegistry } from '@studio/core';
```
