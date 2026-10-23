# Nordik Drive

React frontend for the Nordik Drive data management platform.

The application provides screens for browsing files, searching records, viewing documents, and working with forms. It connects to a separate Go backend.

## Main features

| Area | Features |
| --- | --- |
| Files | File lists, uploads, replacement, and version history. |
| Data tables | Search, filtering, and record views using AG Grid. |
| Documents | Photo and document viewers. |
| Forms | Data entry forms and submission screens. |
| Administration | Application management pages. |
| Support | Contact pages and support call screens. |
| NIA | Chat interface with voice and audio features where supported. |

## Technology

| Tool | Used for |
| --- | --- |
| React and TypeScript | Application pages and components. |
| Redux Toolkit | Shared application state. |
| React Router | Page navigation. |
| Material UI and styled-components | Interface components and styling. |
| AG Grid | Data tables. |
| React Hook Form and Yup | Form handling and validation. |
| Jest and React Testing Library | Unit and component tests. |
| Cypress | Browser tests. |
| Docker and Nginx | Container build and serving the built application. |

## How the frontend is organised

Pages are kept separate from shared components. Redux handles shared state, and common hooks support data fetching and other repeated work.

Several pages are loaded when needed rather than being imported into the main bundle at startup. A shared API URL helper keeps URL construction in one place.

| Location | Purpose |
| --- | --- |
| `src/pages/` | Main application pages. |
| `src/components/` | Shared interface elements, tables, and dialogs. |
| `src/store/` | Redux state and middleware. |
| `src/hooks/` | Shared React hooks. |
| `src/config/` | Application configuration helpers. |
| `src/lib/` | Shared utilities. |
| `cypress/` | Browser test code. |

## Main pages

These are frontend page routes, not backend API endpoints.

| Route | Page |
| --- | --- |
| `/files` | File list. |
| `/dataview` | Data table view. |
| `/file-content` | File content page. |
| `/contact-us` | Contact and support information. |
| `/faq` | Frequently asked questions. |
| `/profile` | User profile and support-related settings. |

## Local development

Use Node.js 20 and npm, matching the current CI setup.

```bash
git clone https://github.com/databasenordik/nordik-drive.git
cd nordik-drive
npm ci --legacy-peer-deps
```

Start the development server:

```bash
npm start
```

The frontend opens at `http://localhost:3000`.

Connected features need a development backend and the correct local connection settings. Use a test account and generated sample records when checking those features.

The project uses React Scripts. Restart the development server after changing its local environment settings.

## Tests

Run the unit tests once with coverage:

```bash
npm run test:unit:ci
```

Run the unit tests in watch mode:

```bash
npm run test:unit
```

Start the development server and run the browser tests:

```bash
npm run test:e2e
```

Open the Cypress interface:

```bash
npm run cy:open
```

Component tests sit alongside their source files. The current Cypress tests cover account screens and use mocked API responses. A separate check with a development backend is needed to test connected application behaviour.

## Build

```bash
npm run build
```

The build output is written to `build/`.

Build the Docker image:

```bash
docker build -t nordik-drive:local .
```

The image serves the built application through Nginx. It also needs the appropriate development backend settings when started.

## Related project

[The Nordik Drive API](https://github.com/databasenordik/nordikdriveapi) is the Go backend used by this frontend.
