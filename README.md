# prajj.com

Personal site. Hand-coded, no build step, no framework, no package manager.
Deployed straight from `main` by GitHub Pages.

```
index.html          the site — Swiss/print layout, all sections inline
retro.html          the 1999 edition: GeoCities / MySpace / Win98 / Matrix skins
articles/           106 essays, one directory each
fintech/            Top 50 Fintech series, 50 entries
  article.css       one stylesheet shared by all 158 subpages
motion.js           pointer-driven motion, shared by every modern page
retro.js            shared behaviour for the subpages
vendor/lenis.min.js inertial scrolling, self-hosted
```

## Motion

Scroll-linked motion is native CSS, running on the compositor:
`animation-timeline: view()` for reveals, wipes and counters,
`animation-timeline: scroll()` for the progress bars,
`@view-transition` for cross-document navigation, and a registered
`@property` `<integer>` for the counters, which fall back to their static
value where it is unsupported.

Only what CSS cannot do is JavaScript — inertial scrolling, the cursor, and
magnetic controls — and all of it is gated on `prefers-reduced-motion` and a
fine pointer. Firefox has no scroll-driven animations yet and degrades to
static content rather than to blank space.

`retro.html` deliberately loads none of this.

## Running it

Any static server; there is nothing to build.

```sh
python3 -m http.server 8000
```

## Notes

- `retro.html` is `noindex,follow` with its canonical pointing at `/`, so it
  does not compete with the home page for the same entity.
- The `Person` JSON-LD in `index.html` is the main structured-data surface.
  Keep it in sync when the numbers change.
- `retro.js` is a misleading name: the pages loading it are the modern
  subpages, not the retro one. Renaming means touching 158 files.
