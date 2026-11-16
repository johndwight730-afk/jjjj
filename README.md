# Fieldhouse Sporting Management

A responsive sporting management app with a Google Sheets data store and a Google Apps Script API. The frontend is plain HTML, CSS, and JavaScript; no build step is required.

## Set up Google Sheets and Apps Script

1. Create a Google spreadsheet for the system.
2. Open **Extensions → Apps Script** from that spreadsheet and replace the editor contents with `Code.gs` from this project.
3. Run `doGet` once from the Apps Script editor and authorize the requested spreadsheet permissions. The app creates its sheets and column headers automatically. The `Sessions` sheet stores login sessions; user passwords are salted and hashed.
5. Select **Deploy → New deployment → Web app**. Choose **Execute as: Me** and allow access to **Anyone** so the hosted frontend can call the API. Copy the deployed web app URL.
6. Paste the URL into `apiUrl` in [config.js](./config.js).
7. Serve the project folder from a static web host (or a local web server); open `index.html` and create the first account. When the Users sheet has no user records, that account is automatically assigned the **Master Admin** role and approved, regardless of the role selected in the form. Later users keep their selected role and await approval.

Apps Script deployments use a versioned snapshot. After changing `Code.gs`, create a new deployment version or update the existing deployment before testing.

## Features

- Splash/login screen and registration with name, email, username, password confirmation, and role.
- Master Admin approval, denial, and deletion of accounts.
- Users can update their username and password and upload a profile picture from the profile controls. Profile photos are resized and stored in the Users sheet; the new column is added automatically when the updated Apps Script runs.
- House setup supports four default form rows and up to ten rows per save; house names are required, descriptions are optional, and admins can assign each house a scoreboard color.
- House descriptions are shown beneath each house name on the Live Score page.
- Master Admins can manage the school name, motto, address, logo, meet title, and one of 20 certificate designs. Certificate previews scale to the screen with a sports trophy and school-logo watermark. Certificates print one per A4 landscape page or two landscape certificates stacked on an A4 portrait page.
- House color names such as Yellow, Blue, Orange, or Mauve automatically select a matching color in the admin form; admins can still use the color picker to adjust it.
- The theme toggle in the top bar switches between dark and light appearance on desktop and mobile and remembers the selection.
- The top bar stays pinned while scrolling. Its navigation toggle collapses the desktop sidebar and opens a vertical mobile drawer with a dimmed backdrop; the X control closes it.
- Admin-managed categories, events, point values, and numeric positions; each list accepts up to ten values per save.
- Score entry requires an award or a zero status for every house. Non-zero point values must be unique within an event; zero is permitted for multiple houses.
- House leaderboard, results, a color-backed Live Score scoreboard that refreshes every 15 seconds while open, point history, and searchable/filterable athlete certificates.
- Certificate forms start with two athlete rows and share a category/event across the submitted athletes. Each certificate has a view/print/PNG export action; house-filtered or all-house certificate and recipient-list batches can be printed, with confirmed batches tracked by type and scope and resettable by a Master Admin. After the print dialog closes, confirm whether the output printed or saved successfully; browsers do not expose that result to the app.
- Role checks are enforced by the Apps Script API, not only by the frontend. Only Master Admins can manage users, setup lists, houses, or clear scoring history.

## Background photos

The slideshow cycles through ten locally stored running and track photos in `photo/`. They are sourced from Pexels and are free to use under the [Pexels license](https://www.pexels.com/license/); attribution is optional.
Photos change every five seconds.

- [athletics-01.jpg — African marathon runner](https://www.pexels.com/photo/african-man-running-a-marathon-18178318/)
- [athletics-02.jpg — marathon runner](https://www.pexels.com/photo/a-man-running-at-a-marathon-12736376/)
- [athletics-03.jpg — runners on track](https://www.pexels.com/photo/men-running-on-track-field-5961847/)
- [athletics-04.jpg — track sprinters](https://www.pexels.com/photo/sprinters-on-a-running-track-19787364/)
- [athletics-05.jpg — women's marathon](https://www.pexels.com/photo/women-running-in-race-18752819/)
- [athletics-06.jpg — women's track race](https://www.pexels.com/photo/women-running-on-track-19613736/)
- [athletics-07.jpg — marathon runners](https://www.pexels.com/photo/foggy-marathon-race-with-two-leading-runners-29840320/)
- [athletics-08.jpg — athletes racing](https://www.pexels.com/photo/two-athletes-competing-in-intense-race-38137157/)
- [athletics-09.jpg — relay runner](https://www.pexels.com/photo/young-athlete-running-on-track-in-mexico-city-38563822/)
- [athletics-10.jpg — cross-country marathon](https://www.pexels.com/photo/runners-during-the-marathon-18408904/)

## Notes

- Keep the spreadsheet and Apps Script project private to trusted administrators. Anyone with the deployed URL can submit a registration request; the first person to register on an empty Users sheet becomes the approved Master Admin.
- This is a starter application. Deploy it over HTTPS and test with a non-production spreadsheet before using it for official results.
