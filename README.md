# The Midnight Portal

A standalone static countdown portal built with HTML, CSS, and vanilla JavaScript. No build step, framework, API key, or backend is required.

## Files

- `index.html` — complete responsive site, styling, countdown, and animations.
- `README.md` — these setup, test, and deployment instructions.

## Configure the destination

Open `index.html` in a text editor and find this line near the beginning of the JavaScript:

```js
const DESTINATION_URL = "";
```

Paste your real destination URL between the quotation marks, for example:

```js
const DESTINATION_URL = "https://your-real-site.example";
```

That example is illustrative only; replace it with your actual URL. `http://` and `https://` URLs are accepted. Keep it blank until you are ready. If it remains blank or is invalid, the portal still unlocks on schedule, but the button is disabled and cannot navigate.

## Unlock schedule

The production target is configured as:

```js
const TARGET_TIMESTAMP = new Date("2026-10-20T00:00:00+06:00").getTime();
```

This is October 20, 2026, at 12:00 AM in Bangladesh (UTC+06:00), equivalent to `2026-10-19T18:00:00Z`. The explicit offset makes it independent of the visitor's local time zone.

The page recalculates the difference between the target timestamp and the current device clock on each update. It checks immediately at page load and again when a background tab becomes visible, so a sleeping tab can catch up without refreshing.

## Preview and test

For testing, temporarily change the target line in `index.html` to one of the following:

**Preview the locked state** (about 1 hour from the moment you open the page):

```js
const TARGET_TIMESTAMP = Date.now() + 60 * 60 * 1000;
```

**Preview the unlocked state immediately:**

```js
const TARGET_TIMESTAMP = Date.now() - 1000;
```

Save and reload the page after each change. For a live unlock-transition test, set the target to a few seconds in the future, save, and reload. You should see the countdown reach zero and the interface open automatically. To test a working button, set `DESTINATION_URL` to a URL you control.

**Before deploying, restore the real timestamp exactly:**

```js
const TARGET_TIMESTAMP = new Date("2026-10-20T00:00:00+06:00").getTime();
```

Do not deploy with the temporary `Date.now()` test expression. Remove any test destination and insert the intended real destination URL.

## Local preview

1. Extract the project ZIP.
2. Open `index.html` directly in a modern browser, or run a local static server from the project directory:
   - Python: `python -m http.server 8000`
   - Then visit `http://localhost:8000`.
3. Test desktop and mobile widths using browser developer tools.

## Deploy on Cloudflare Pages

This is a separate static project; it does not modify an existing website or repository.

### Direct upload (beginner-friendly)

1. Sign in to the Cloudflare dashboard.
2. Open **Workers & Pages** and choose to create a Pages project using **Direct Upload** (the exact labels may vary as Cloudflare updates its dashboard).
3. Upload the extracted project folder or a ZIP containing `index.html` and `README.md`, following the dashboard's current prompts.
4. Deploy. No build command is needed; there is no build process.
5. Open the assigned `*.pages.dev` URL and verify the countdown, page styling, and mobile layout.

If Cloudflare's current dashboard flow does not accept a ZIP in the selected route, use its folder upload option or connect a new repository containing these two files. Do not connect or overwrite an existing website unless you deliberately choose that project.

## Time accuracy and security limits

The unlock is determined by the absolute target instant, not by a saved browser flag, so refreshes and later visits resolve to the same state on a correctly set device clock. This implementation intentionally does not call an external time API: that avoids an unnecessary network dependency and keeps the page self-contained.

Because this is a frontend-only static site, it cannot securely verify the real time. Someone can change their device clock or inspect/modify the source and force the visual unlocked state. If the destination itself must remain confidential, do not rely on this portal as access control; protect the destination separately. The portal controls the ordinary user-facing experience, not secure authorization.

## Test checklist

- **Before target:** countdown updates, sealed status is visible, and destination button is hidden.
- **At target:** countdown is removed and the open state/button appear automatically without refresh.
- **After target:** reload immediately shows open state.
- **Blank destination:** button remains visibly unavailable and click does nothing.
- **Time zones:** the explicit `+06:00` offset maps to one global instant in all visitor time zones.
- **Responsive:** inspect narrow mobile widths and desktop widths; the four units remain in one readable row.
- **Reduced motion:** enable the operating system's reduced-motion setting and confirm functionality still works with minimal animation.
