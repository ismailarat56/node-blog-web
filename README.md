**English** · [Türkçe](README.tr.md)

<div align="center">

# Node Blog Web

**React front end for Node Blog API: blog pages, author panel and admin panel.**

![React](https://img.shields.io/badge/React-19-20232a?logo=react&logoColor=61dafb)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-2ea44f)

[Highlights](#highlights) · [Setup](#setup-and-running) · [Pages](#pages) · [Session](#session-and-data-layer) · [Documents](#documents)

</div>

A single-page React application that shows the posts, categories and comments served by [node-blog-api](https://github.com/ismailarat56/node-blog-api). It contains the blog pages for readers, the post panel for authors, and category, post and user management for admins. It is written in JavaScript (JSX) with React 19, React Router 8, Vite 8 and TanStack Query 5.

The user interface is in Turkish. The detailed documents under `docs/` and the notes under `notes/` are in Turkish.

## Highlights

- **Blog pages:** post list, category filter, pagination, post detail and comments that can be replied to.
- **Session:** the access token is kept only in memory; the API writes the refresh token as an `httpOnly` cookie, and the front end never sees it.
- **Token refresh:** the token is refreshed once at startup and on a `401` response, and the original request is sent again with the new token.
- **Cross-tab coordination:** refreshes are queued with Web Locks; login and logout are announced to the other tabs with BroadcastChannel.
- **Account flows:** email verification, password reset, password change with a code, and email change.
- **Author panel:** creating drafts, editing, publishing and unpublishing, cover image upload, delete and undo, comment moderation.
- **Admin panel:** category, post and user management; its pages are split into separate JavaScript files with `lazy`.
- **Server data cache:** the admin lists are loaded with TanStack Query; data counts as fresh for 30 seconds, and 4xx errors are not retried.
- **Filters in the URL:** the filter, sort and page selections of the author and admin lists are kept in the address; in the admin panel the search is added to the query with a 400 ms delay.
- **Optimistic update:** the active state of a category changes immediately with `useOptimistic`, and the badge returns to its previous state on error.
- **API status banner:** shows a warning when the API cannot be reached and retries after 10 seconds; there is an `ErrorBoundary` for render errors in the main content.

## Requirements

- Node.js 22.22 or later, and npm.
- The [node-blog-api](https://github.com/ismailarat56/node-blog-api) stack running with Docker Compose (port 8080).

## Setup and running

1. Start the services in the folder of the API project ([node-blog-api](https://github.com/ismailarat56/node-blog-api)):

    ```bash
    docker compose up -d
    ```

2. In the folder of this project, install the dependencies and start the development server:

    ```bash
    npm install
    npm run dev
    ```

3. Open http://localhost:5173 in the browser.

The Vite proxy carries `/api`, `/uploads` and `/health` requests to `http://127.0.0.1:8080`. The browser sends requests to the same origin as the application; Vite forwards them to the API. This is a development setting; in production these paths must also be routed on the web server.

### Commands

| Command           | What it does                                             |
| ----------------- | -------------------------------------------------------- |
| `npm install`     | Installs the dependencies.                               |
| `npm run dev`     | Starts the development server.                           |
| `npm run build`   | Builds the production files into the `dist/` folder.     |
| `npm run preview` | Previews the build output at http://localhost:4173.      |
| `npm run lint`    | Checks the code with Oxlint.                             |

`npm run build` must be run before the preview. `dist/` is a reproducible output and is not added to Git.

## Pages

| Section | Addresses | Access |
| --- | --- | --- |
| Blog | `/`, `/posts/:slug` | Public |
| Login and account recovery | `/login`, `/forgot-password`, `/reset-password`, `/verify-email` | Public |
| My account | `/account`, `/account/password`, `/account/email` | Requires a session |
| Author panel | `/dashboard`, `/dashboard/posts/new`, `/dashboard/posts/:id/edit` | Requires a session |
| Admin panel | `/admin`, `/admin/posts`, `/admin/users`, `/admin/users/new`, `/admin/users/:id` | Requires a session and the admin role |

The component of each page and the API requests it sends: [docs/SAYFALAR.md](docs/SAYFALAR.md)

## API coverage

The front end uses the API endpoints under the `/api/v1` prefix and also the `GET /health` endpoint. In the endpoint-by-endpoint table, 43 of the API's 49 application endpoints are connected to a screen or a component. The remaining six endpoints:

- `POST /auth/register`: the registration page has not been added yet.
- `GET /auth/me`: the user information is taken from the login and refresh responses.
- `PUT /users/:id`, `PUT /posts/:id`, `PUT /categories/:id`: PATCH is preferred so that only the changed fields are sent.
- `GET /categories/:id`: the admin list already returns the same fields.

Full table and reasons: [docs/API_KAPSAMI.md](docs/API_KAPSAMI.md). Problems seen in the API while writing the front end: [docs/API_SORUNLARI.md](docs/API_SORUNLARI.md)

## Session and data layer

- At startup `AuthProvider` sends `POST /api/v1/auth/refresh` once. If it succeeds the state becomes `authenticated`, otherwise `anonymous`.
- Authenticated requests go through `authRequest`. `401` responses that arrive at the same time wait for a single refresh; if the refresh also gets a `401`, the session is closed.
- `RequireAuth` checks the session and `RequireAdmin` checks the admin role. These are front-end gates; the API enforces the actual authorization.
- User content is rendered as plain text; `dangerouslySetInnerHTML` is not used.
- The user, category and post lists in the admin panel are loaded with TanStack Query. The blog pages and the author panel use the `useApi` hook.
- On logout the token, the user state and the Query Client cache are cleared.

Details: [docs/OTURUM.md](docs/OTURUM.md) and [docs/PANELLER.md](docs/PANELLER.md)

## Folder structure

```
src/
  main.jsx           entry point: QueryClientProvider, BrowserRouter, AuthProvider
  App.jsx            route definitions; admin pages are loaded with lazy
  api/               request client, error conversion, /health check, Query Client, cache keys
  auth/              session state, Context, in-memory access token, refresh, cross-tab messages
  components/        shared components, layouts, RequireAuth and RequireAdmin
  components/admin/  row, form and header components of the admin tables
  hooks/             useApi, useApiHealth, useCountdown, useDebouncedValue
  pages/             pages that correspond to the routes
  pages/admin/       admin pages loaded with lazy
  utils/             date, slug, form and URL filter helpers
  index.css          styles
public/              favicon
docs/                detailed documents
notes/               end-of-day summaries of the development process and the verification record
vite.config.js       development proxy
```

File-by-file description: [docs/KLASOR_YAPISI.md](docs/KLASOR_YAPISI.md)

## Known gaps

- There is no registration page. The `/register` route and the `POST /api/v1/auth/register` call have not been added yet; the "Kayıt ol" (Sign up) links in the menu and on the login page go to the not-found page.
- The repo has no permanent automated test suite. The code is checked with `npm run lint` and `npm run build`.
- The API has no CORS setting; the application runs only from the same origin (Vite proxy or nginx).
- The application does not start in old browsers that lack Web Locks or BroadcastChannel.
- On concurrent edits the last writer wins; there is no version check.

Full list: [docs/BILINEN_SINIRLAMALAR.md](docs/BILINEN_SINIRLAMALAR.md). Planned work: [docs/SONRAKI_ADIMLAR.md](docs/SONRAKI_ADIMLAR.md)

## Documents

| File | Content |
| --- | --- |
| [docs/SAYFALAR.md](docs/SAYFALAR.md) | Table of addresses, components and API requests |
| [docs/API_KAPSAMI.md](docs/API_KAPSAMI.md) | Which API endpoints are connected to the front end |
| [docs/OTURUM.md](docs/OTURUM.md) | Token storage, refresh, cross-tab coordination, logout |
| [docs/PANELLER.md](docs/PANELLER.md) | How the author panel and the admin panel work |
| [docs/KLASOR_YAPISI.md](docs/KLASOR_YAPISI.md) | What the folders and files do |
| [docs/SURUM_NOTLARI.md](docs/SURUM_NOTLARI.md) | URL filters and cache change, verification of the release tags |
| [docs/BILINEN_SINIRLAMALAR.md](docs/BILINEN_SINIRLAMALAR.md) | Full list of the known limitations |
| [docs/API_SORUNLARI.md](docs/API_SORUNLARI.md) | Problems found in the API while writing the front end |
| [docs/SONRAKI_ADIMLAR.md](docs/SONRAKI_ADIMLAR.md) | Planned work |

The end-of-day summaries are in the [notes/](notes/) folder.

## License

The code is released under the [MIT license](LICENSE).
