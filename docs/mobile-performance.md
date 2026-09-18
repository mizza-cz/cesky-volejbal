# Mobile performance: first implementation pass

This PR contains source changes only. Run `npx gulp build` after checkout to regenerate the tracked `build` directory, including responsive images and `gallery.js`, before testing or deployment.

## Build

Use Node.js 20.3+ (verified with 24.19.0):

```sh
npm ci
npx gulp build
npx gulp
```

`gulpfile.js` is now tracked. A clean build generates HTML and JS before PurgeCSS reads them. Cookie consent assets are sourced from `src/static`, gallery JSON is copied from `src/layouts`, and FsLightbox is copied separately to `build/js/gallery.js`.

PNG/JPEG compression and responsive WebP generation run locally with Sharp; no TinyPNG account is required. Optional `npx gulp optimize-images` uses the `TINYPNG_API_KEY` environment variable. The npm lockfile was regenerated with npm 11 when adding Sharp.

## Changes

-   First homepage image and article image load eagerly with high fetch priority. Only the first slide receives high priority.
-   Slider images are visible without JavaScript. Full-size duplicate placeholder images and the image-load visibility gate were removed.
-   First homepage image and article image have generated WebP width variants and `sizes` matching their layouts. Other slider images retain lazy loading. The fourth slide's incorrect mobile image source was fixed.
-   Partner logos and banners have intrinsic dimensions; the main partner slot keeps its intended ratio on narrow screens.
-   FsLightbox is no longer included in the initial bundle. One shared library request starts on gallery activation alongside the JSON request. Failed loads can be retried, with a Czech error message. Relative JSON links work locally and under the GitHub Pages project path.
-   PurgeCSS scans original component/vendor JS to preserve runtime-generated selectors.

## Size comparison

Compared with commit `bff96eed93fcdecd046dcfd59fdbdc0d05acfeb7`. Decimal bytes; gzip is calculated locally, not observed server transfer size.

| Asset                    |         Before |               After |
| ------------------------ | -------------: | ------------------: |
| Initial scripts.js       |        205,603 |             156,087 |
| Initial scripts.js, gzip |         59,710 |              43,885 |
| styles.css               |         84,127 |              83,906 |
| First homepage photo     | 499,958 (JPEG) | 85,386 (960px WebP) |
| Article photo            |  451,210 (PNG) | 53,706 (768px WebP) |

The selected image size depends on viewport and device pixel ratio. JPEG/PNG fallback images remain available. Rebuilt fallback assets use a different local compressor, so their sizes differ from the previous TinyPNG output.

## Validation

-   Clean `npx gulp build` succeeds and outputs all 39 page templates.
-   Chromium checks at 390px and 1440px: homepage, article, extraliga programs, match detail, club detail, and referee documents. No page JavaScript exceptions or horizontal page overflow were observed.
-   Mobile navigation, slide controls, Select2 initialization, partner images after scrolling, and gallery opening were checked.
-   FsLightbox was absent before opening the gallery and available after opening it. The first hero image rendered with JavaScript disabled.
-   CDN access was unavailable in the test environment. Browser requests for jQuery 3.6.0 and Bootstrap 5.1.3 were fulfilled with the matching npm distributions. Gallery responses used local sample images to isolate UI behavior from the external placeholder image service.

## Backend integration and remaining audit

This is a static-template change, not a production PSI result. Apply the markup changes to the live server templates, deploy `gallery.js` beside `scripts.js`, and generate equivalent responsive variants for actual CMS photos. Sample filenames and dimensions must be replaced with those of each real image. Keep `data-source` pointed at the actual gallery API.

Still required: six production URLs and repeatable mobile traces identifying actual LCP elements, layout shifts including scroll/load behavior, server/API timings, and unused JS/CSS. No production LCP or CLS target has been claimed as achieved.

Select2, Slick, Magnific Popup, jQuery and Bootstrap still load globally. Further page-specific JS/CSS splitting, font-display/fallback adjustments and critical CSS should follow measured usage and visual regression checks. The current gallery split is the first reduction of initial JS, not the entire optimization task.
