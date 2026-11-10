# Halden Architects

A four-page website for a fictional architecture studio, built with plain HTML, CSS and JavaScript. No frameworks, no build step, no dependencies.

The project's building drawings are generated in the browser, so every project gets its own elevation without a single image file.

## Pages

| Page | File | What it has |
| --- | --- | --- |
| Home | `index.html` | Animated hero drawing, recent work, design principles |
| Projects | `projects.html` | Nine projects, type filters, detail dialog |
| Studio | `studio.html` | Studio statement, four-step process, team, awards |
| Contact | `contact.html` | Validated enquiry form and studio details |

## Features

- **Generated elevation drawings.** Each project is drawn as an SVG from a numeric seed. The hero drawing animates line by line.
- **Light and dark themes.** Follows the system setting by default. A toggle in the header overrides it and saves the choice in `localStorage`.
- **Shared layout.** The header and footer are written once in `js/main.js` and injected into every page.
- **Filterable projects.** Filter by type, then open any project in an accessible `<dialog>`.
- **Form validation.** Name, email and message are checked with clear error messages. The form is a demo and sends nothing.
- **Responsive and accessible.** Works from phone to desktop, with a collapsing menu, visible keyboard focus and support for reduced motion.

## Project structure

```
halden/
├── index.html
├── projects.html
├── studio.html
├── contact.html
├── css/
│   └── style.css      all styles and theme tokens
└── js/
    ├── data.js        project and team content
    └── main.js        header, footer, theme, drawings, filters, form
```

## Run locally

Open `index.html` in a browser. You can also serve the folder with any static server:

```bash
cd halden
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

Fonts (Schibsted Grotesk and Inter Tight) load from Google Fonts. Without an internet connection the site falls back to system fonts.

## Customise

- **Add or edit a project:** change the `projects` array in `js/data.js`. Each project has a `seed`, and a different number gives a different drawing.
- **Edit the team:** change the `team` array in the same file.
- **Change colours:** edit the CSS variables at the top of `css/style.css`. Light and dark values are defined separately.
- **Add a page:** create the HTML file, add it to the `PAGES` list at the top of `js/main.js`, and include `data.js` and `main.js` at the end of the page.
- **Make the form work:** the submit handler in `js/main.js` currently shows a confirmation only. Replace it with a call to your form service or backend.

## Notes

The studio, people, projects, awards and contact details are all fictional and were written as a design example.

## License

Add the license of your choice before publishing, for example MIT.
