# Landing page · SprintStack Bold in Instrument colours — design reference

This is a design mockup created in a visual design tool, exported as a
standalone page. Treat it as a REFERENCE MOCKUP, not production code:
the markup and inline styles carry the design's precise values — colors,
font sizes, spacing, radii, shadows, layout — which an implementation
should replicate faithfully in its own components and styling system
rather than copy wholesale.

## Contents

- `Bold.dc.html` — the artboard (a Design Component: an `<x-dc>`
  template + a small logic class). The values to replicate live in its
  inline `style="…"` attributes and the `<helmet><style>` block.
- `bold-instrument-colors.css` — referenced resource
- `ds/SprintStack-bold/components/bundle.css` — referenced resource
- `ds/SprintStack-bold/components/bundle.js` — referenced resource
- `ds/SprintStack-bold/tokens.css` — referenced resource
- `ds/SprintStack-instrument/components/bundle.css` — referenced resource
- `ds/SprintStack-instrument/components/bundle.js` — referenced resource
- `ds/SprintStack-instrument/tokens.css` — referenced resource
- `ds/SprintStack-bold/tokens.json` — referenced resource
- `ds/SprintStack-instrument/tokens.json` — referenced resource
- `support.js`, `vendor/react*.js` — the runtime that renders the
  component in a browser; not part of the design.

## Viewing

Serve the folder (e.g. `python3 -m http.server`) and open `Bold.dc.html`;
some browsers block the scripts over file://.
