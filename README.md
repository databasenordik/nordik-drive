# Nordik Drive

React frontend for the Nordik Drive data management platform.

The application provides screens for browsing files, finding records, viewing documents, and working with forms.

## Main features

- File browsing and uploads.
- Search and filtering in data tables.
- Document and photo viewers.
- File version history.
- Forms and administration pages.
- Support pages.
- NIA chat interface.

## Built with

- React and TypeScript
- Redux Toolkit and React Router
- Material UI and styled-components
- AG Grid
- React Hook Form and Yup
- Jest, React Testing Library, and Cypress
- Docker and Nginx

## Development

Use Node.js 20 and npm.

```bash
npm ci --legacy-peer-deps
npm start
```

The development server starts the frontend. Connected features also need a separately configured development backend.

## Tests

Run unit tests:

```bash
npm run test:unit:ci
```

Run browser tests:

```bash
npm run test:e2e
```

The browser tests use mocked API responses.

## Build

```bash
npm run build
```

## Related project

[Backend application](https://github.com/databasenordik/nordikdriveapi)
