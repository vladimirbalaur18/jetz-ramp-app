# ✈️ JETZ Ramp App

*A mobile tool that helps ramp‑handling teams create flights, coordinate turnaround check‑lists, and generate ground‑service invoices – even when the network is down.*

---

## ✨ Key Features

| Area                   | What it does                                                              | Why it matters                                       |
| ---------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Flight builder**     | Quickly add ARR/DEP data, aircraft type, parking stand & services         | Reduces radio chatter and copy‑paste errors          |
| **Ramp checklist**     | Interactive task list (fuelling, GPU, catering, baggage) with live status | Keeps the whole team in sync during a 30‑min turn    |
| **Offline‑first**      | Local Realm DB caches everything and queues updates                       | Agents can work on the apron with poor Wi‑Fi         |
| **Auto‑generated PDF** | Creates signed turnaround sheets & itemised invoices                      | Eliminates manual paperwork and post‑shift re‑typing |
| **Roles & auth**       | Supervisor vs. agent permissions; secure Expo Auth session                | Prevents unauthorised edits to flight records        |

---

## 🏗️ Tech Stack

| Layer        | Library / Service                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| UI           | **React Native** + React‑Native‑Paper                                                                    |
| State        | **Redux Toolkit** (feature slices under `/redux`)                                                        |
| Persistence  | **Realm** (`realm.ts`) for offline‑first storage                                                         |
| Networking   | Custom REST client in `/services` (Axios‑like wrapper)                                                   |
| Navigation   | React Navigation (stack + tabs)                                                                          |
| Autocomplete | [`@telenko/react-native-paper-autocomplete`](https://github.com/telenko/react-native-paper-autocomplete) |
| Build & OTA  | **Expo** + **EAS** (`app.json`, `eas.json`)                                                              |
| Types        | 100 % **TypeScript**                                                                                     |

---

## 📂 Project Structure

```text
/
├─ app/                 # Entry points & navigation tree
├─ components/          # Re‑usable presentational components
├─ redux/               # Feature‑based RTK slices & thunks
├─ services/            # API layer & PDF generator
├─ models/              # Type aliases & ORM entities
├─ hooks/               # Shared React hooks
├─ utils/               # Date, currency & aviation helpers
└─ assets/              # SVG, PNG, fonts
```

---

## 🚀 Getting Started

1. **Clone & install**

   ```bash
   git clone https://github.com/vladimirbalaur18/jetz-ramp-app.git
   cd jetz-ramp-app
   pnpm install    # or npm / yarn
   ```

2. **Set environment variables**

   Copy `.env.example` → `.env` and fill in:

   ```env
   API_URL=https://example.com/api
   SENTRY_DSN=your_dsn_here
   ```

3. **Run locally**

   ```bash
   npx expo start    # choose Android, iOS or Web
   ```

4. **Build release**

   ```bash
   eas build -p android --profile production
   eas build -p ios --profile production
   ```

---

## 🛠️ Scripts

| Command              | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `dev` / `expo start` | Launch Metro bundler & open Expo Go                          |
| `typecheck`          | Run TypeScript in `--noEmit` mode                            |
| `lint`               | ESLint + Prettier                                            |
| `test`               | Jest unit tests (reducers & utils)                           |
| `generate:pdf`       | Node script that turns a completed flight into a PDF invoice |

---

## 🧩 How It Works

1. A flight is created and stored in **Realm**, providing an optimistic UI update.
2. A background worker syncs pending Realm mutations when a connection is available.
3. The **Checklist** screen subscribes to the Realm object, reflecting real‑time task status.
4. On completion, the **PDF generator** renders the ramp checklist and pushes it to the backend, which e‑mails the customer automatically.

---

## 🧪 Testing

| Type     | Tool                                        |
| -------- | ------------------------------------------- |
| Unit     | Jest + React‑Native‑Testing‑Library         |
| DB logic | Realm in‑memory adapter                     |
| E2E      | Detox (Android) *(optional, not yet in CI)* |

---

## 🤝 Contributing

1. Fork the repo and create a feature branch.
2. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`feat: …`).
3. Run `pnpm lint && pnpm typecheck` before opening a PR.
4. Describe **why** your change is needed in the PR body.

---

## 📜 License

MIT © 2025 [Vladimir Balaur](https://github.com/vladimirbalaur18)

---

###
