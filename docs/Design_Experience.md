# Edvora design experience

Warm paper, forest navigation, clay and ochre accents; expressive homepage composition; distinct accents for seven public routes; workspace headers, panels, interactive fee collection chart, Student balance cards and access-page treatment.

Motion progressively enhances server-rendered content. IntersectionObserver and lazy GSAP reveals run after hydration, clean up on route changes, and skip reduced-motion users. Scroll progress and an accessible back-to-top button support long pages.

## Hydration diagnosis
The live Chrome DOM contained third-party extension style elements absent from server HTML, including styles targeting YouTube advertisements. The prior revision passed clean Chromium browser checks. Do not suppress root hydration warnings or disable SSR to conceal browser-injected markup. Verify in a clean profile or with the injecting extension disabled. Tests exercise public routes and reduced-motion rendering without extensions.

Authentication, payment verification, permissions, notifications and database contracts are unchanged.
