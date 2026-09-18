# Issued For Destruction

Vue 3 website with a Netlify-backed editor at **/admin** (also linked as **Band login** in the footer).

## Develop and verify

- `npm install`
- `npm run dev` — public website preview. The editor requires the Netlify runtime.
- `npm run build`
- `npm test` — API authorization, draft privacy, validation, persistence and conflict tests.
- `npm run lint`

For full local functionality, install Netlify CLI, run `netlify link` against your existing project, then `netlify dev` (port 8888). Use a separate Netlify test project when testing real content changes. Plain Vite still renders the bundled band content, but does not simulate a successful login or save.

## Enable editing on your existing Netlify site

1. Deploy this repository through your existing Netlify Git integration. The included netlify.toml sets the build command, output directory, serverless functions, and SPA fallback. Do not upload only the dist folder: the editor also needs the deployed functions.
2. In your project's Netlify dashboard, open **Identity** and choose **Enable Identity** if needed.
3. Set registration to **Invite only**.
4. Invite your email address from Identity. Open the invitation email; the site redirects you to /admin to choose a password.
5. In Netlify Identity, open your user and add the role **admin** (lowercase). Log out and back in after role changes.
6. Visit **https://YOUR-SITE/admin** and log in with that email and password.

Netlify documentation: https://docs.netlify.com/manage/security/secure-access-to-sites/identity/get-started/

No passwords or service tokens belong in frontend code. There is no built-in default account. Netlify Identity handles authentication and password recovery. The function checks the authenticated admin role on every private read and write. Git Gateway is not required.

## Editing

- News: add a title, date, introduction and story; optionally provide an HTTPS image URL. Preview the text, then check **Publish on the website when saved** and choose **Save changes**. Leave unchecked to save a private draft. Dates are display dates, not scheduled publishing.
- Members: edit names, instruments, biographies and photo URLs; add or remove members.
- Band story: edit the biography paragraphs.
- A save applies all pending edits in the editor. Removal needs confirmation, then Save changes.
- If another editor saves first, your save is rejected to prevent overwriting their work. Copy your changes somewhere safe, reload and reapply.
- Photos currently use image links or existing files under public/members; file upload is not included.

Content is stored in the site-wide **ifd-content** Netlify Blobs store, key **content**, and survives redeployments. Published changes appear without rebuilding. News drafts are filtered by the server, never sent in public responses. Text is rendered without raw HTML.

Back up content by downloading the content blob from Netlify's Blobs dashboard. The initial content is in src/content/defaults.json; it is used only until the first save. Editing this seed after a save will not overwrite live content. Deploy previews on the same Netlify project share site-wide storage; use a separate project for isolated editorial testing.

## Current scope

Music links and the existing Fest I Hallen show remain in their Vue pages. The editor manages news, members and band history. No fictional news, releases or additional dates have been added. Live Identity configuration and a deployed login/save round trip must be verified on your Netlify project after enabling Identity.
