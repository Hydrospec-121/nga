# Wise Ayan Birthday Protocol

A static birthday puzzle website in the HydroSpec neo-brutalist style.

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a browser.
3. Solve the three puzzles in order:
   - `CREEPER`
   - `Rafsan` (capitalization does not matter)
   - `footsteps` or `steps`

The countdown has been removed. All three puzzles must be solved to reveal the redeem code.

## Important code privacy note
The redeem code is stored in `script.js`. Anyone can inspect a static website's source and find it without solving the puzzles. Since you plan to send the site on the birthday itself, that may be acceptable. The puzzles are playful UI, not real security. For stronger protection, keep the real code out of public JavaScript and release it through a server-side endpoint.

## Publish later
For Cloudflare Pages, upload `index.html`, `style.css`, and `script.js` to a GitHub repository, then connect the repository to Cloudflare Pages as a static site. No build command is needed.
