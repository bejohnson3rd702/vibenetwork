# The VIBE NETWORK – UI & Streaming Platform

## Environments & Stripe Setup

The platform uses environment separation so that **Stripe is exclusively enabled on the Staging server**, while **Dev** and **Prod** operate with Stripe completely disabled (using seamless demo unlocks).

---

### Environment Commands

| Command | Environment | Port | Stripe Status | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `npm run staging` | **Staging (`stg`)** | `5174` | **ENABLED (Test Mode)** | Testing live Stripe Checkout, PPV stream unlocks, subscription tiers, Stripe Connect onboarding, and test cards (`4242 4242 4242 4242`). |
| `npm run dev` | **Development (`dev`)** | `5173` | **DISABLED** | Local feature development with instant simulated purchases and demo mode. |
| `npm run build:stg` | **Staging Build** | — | **ENABLED** | Production-grade staging bundle with Stripe enabled. |
| `npm run build:prod` | **Production Build** | — | **DISABLED** | Clean production bundle free of test Stripe keys and calls. |
| `npm run preview:stg` | **Staging Preview** | `5174` | **ENABLED** | Previews the staging build on port 5174. |

---

### Environment Files
- `.env.staging`: Contains `VITE_ENABLE_STRIPE="true"`, `VITE_STRIPE_PUBLIC_KEY`, and `STRIPE_SECRET_KEY` for live test mode transactions.
- `.env.development`: Contains `VITE_ENABLE_STRIPE="false"` and blank keys.
- `.env.production`: Contains `VITE_ENABLE_STRIPE="false"` and blank keys.
- `.env`: Local fallback default.

---

### Feature Gate Utility
Import helper functions anywhere in the codebase:
```typescript
import { isStripeEnabled, getStripeClient, getStripeEnv } from './lib/stripeConfig';

if (isStripeEnabled()) {
  // Stripe is enabled (Staging mode)
} else {
  // Stripe is disabled (Dev & Prod)
}
```
