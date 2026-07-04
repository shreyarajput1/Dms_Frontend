# DocVault — Document Management System

**Repository:** `<ADD YOUR GITHUB REPO URL HERE BEFORE SUBMITTING>`

A React front-end built for the Allsoft Document Management assignment — OTP-based
login, a static admin interface, document upload with categorisation and tagging,
document search, and preview/download (including bulk ZIP download).

---

## Tech stack

- **React 18** (functional components + hooks)
- **React Router v6** for routing and route guarding
- **React Context API** (`AuthContext`) for application-wide auth/session state
  — satisfies the "state management" requirement in the assignment brief
- **Axios** for API calls, with a request interceptor that attaches the `token`
  header to every authenticated request
- **file-saver** + **jszip** for individual and bulk (ZIP) file downloads
- Plain, hand-written CSS (`src/index.css`) — a small custom design system,
  no UI framework dependency, fully responsive down to mobile

---

## Getting started

```bash
npm install
npm start
```

The app runs at `http://localhost:3000`. It talks directly to the Allsoft API at:

```
https://apis.allsoft.co/api/documentManagement
```

(see `src/api/api.js` for the base URL and endpoint helpers, sourced from the
Postman collection provided with the assignment).

To build a production bundle:

```bash
npm run build
```

---

## Project structure

```
src/
  api/
    api.js                  # Axios instance + endpoint wrapper functions
                             # (generateOTP, validateOTP, documentTags,
                             #  saveDocumentEntry, searchDocumentEntry)
  context/
    AuthContext.js           # Login/logout state, token persisted in localStorage
  components/
    Login/
      Login.js                # Two-step OTP login (mobile number -> OTP -> token)
    Admin/
      AdminUserForm.js        # Static admin form for creating users (2.3)
    Upload/
      FileUpload.js            # Upload form: date, category, dynamic sub-category,
                               # tags, remarks, image/PDF-only file picker
    Search/
      FileSearch.js            # Search filters form
      SearchResults.js        # Results table, preview modal, downloads
    common/
      TagInput.js              # Token/chip tag input, autocompletes from documentTags
      Navbar.js                # Top navigation
      PrivateRoute.js         # Route guard — redirects to /login if not authenticated
  pages/                      # Route-level wrappers (LoginPage, UploadPage,
                               # SearchPage, AdminPage)
  utils/
    download.js                # Single-file and ZIP download helpers
    users.js                    # localStorage-backed store used by the admin form
  App.js                       # Route definitions
  index.js / index.css        # Entry point + design tokens/styles
```

---

## How the app maps to the assignment brief

**1. Project setup** — Create React App structure, React Router for routing,
Context API for services/state, component folders organised by feature.

**2. Registration and login**
- **2.1** `Login.js` collects a mobile number, calls `generateOTP`, then collects
  the OTP and calls `validateOTP`. The token returned is stored in `localStorage`
  and attached to every subsequent request via an Axios interceptor (`token`
  header), exactly as shown in the Postman collection.
- **2.2** No mobile number is hardcoded — whatever number is entered in the form
  is the one sent to the API.
- **2.3** `/admin` is a simple, static, front-end-only form for creating
  username/password users, kept separate from the OTP login and gated behind
  login like the rest of the authenticated area.

**3. File upload** (`/upload`)
- Date picker for `document_date`
- Personal / Professional dropdown for `major_head`
- A dependent second dropdown for `minor_head` — Names (John, Tom, Emily, Sara,
  Aditi) for Personal, Departments (Accounts, HR, IT, Finance, Operations) for
  Professional
- Tag input with chips; existing tags are fetched from the `documentTags`
  endpoint as you type, and new tags are simply included in the upload payload
  (the backend saves any tag it hasn't seen before)
- A plain text remarks field
- File picker restricted to image types and PDF only

**4. File search** (`/search`) — category dropdowns, tag filter, and From/To
date range, calling `searchDocumentEntry` with the exact payload shape from the
Postman collection.

**5. File preview and download** — results render in a table with Preview and
Download actions per row. Preview opens a modal that renders images inline and
PDFs in an iframe, and shows a friendly "preview not available" message for any
other file type. A "Download all as ZIP" button fetches every result client-side
and bundles them with JSZip.

**Additional instructions**
- **State management:** Context API (`AuthContext`) for auth state; local
  component state (`useState`) for form/UI state.
- **Responsive design:** layout is grid/flex based with breakpoints for mobile
  (see the `@media` rules in `index.css`); the login screen collapses from a
  split hero layout to a single column below 880px.
- **Documentation:** this README.

---

## Known limitations / assumptions

- **Mobile number registration:** `generateOTP` will return
  `"This Mobile Number is not yet Registered"` for any number the backend
  doesn't already recognise. The Postman collection has no endpoint to
  self-register a number, so this is a backend-side requirement outside the
  scope of the front-end. If you hit this while testing, contact
  **nk@allsoft.co** to have your number registered.
- The Postman collection doesn't document the exact shape of `validateOTP`'s
  success response or `searchDocumentEntry`'s result rows, so `api.js` /
  `SearchResults.js` defensively try a few common shapes (`data.token`,
  `data.data`, etc.). If the live API differs, the small extraction helpers at
  the top of those files are the only place that needs adjusting.
- File preview assumes the API returns a publicly reachable URL per document;
  if the real endpoint instead returns a relative path or requires the `token`
  header to fetch the file, `getFileUrl` in `SearchResults.js` is the single
  place to update.
- "Download all as ZIP" fetches each file client-side, so it depends on the
  file URLs being reachable without CORS restrictions from the browser.
- The Personal/Professional sub-category options (`minor_head`) are a fixed
  list taken from the assignment's own examples, since the Postman collection
  does not expose an endpoint to fetch them dynamically.

---

## Testing

Manual testing was performed against the flows above once a valid mobile
number/token was available. No automated test suite was added given the scope
of the assignment; `npm test` will run the default CRA/Jest runner if tests are
added later.

---

## Contact

For questions about the assignment itself: **nk@allsoft.co**
