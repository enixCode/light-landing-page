# light-landing-page

Shared bespoke landing page for the **light-\*** ecosystem ([light-runner](https://github.com/enixCode/light-runner), light-run, light-process). One design, one stylesheet, parameterised per project so the three sites stay visually identical and update from a single source.

## Usage

```tsx
import { LandingPage, type LandingData } from 'light-landing-page';
import 'light-landing-page/styles.css';

const data: LandingData = {
  /* project-specific content: brand, hero, primitives, security, ecosystem, ... */
};

export default function Home() {
  return <LandingPage data={data} />;
}
```

`LandingPage` is a client component: hero + banner, primitives, code window, security grid, ecosystem and footer, with the Fraunces / JetBrains Mono type, live GitHub release badges and a copy button. Everything that differs between projects lives in `data` (see the `LandingData` type); the structure, CSS, fonts, animations and logic are shared.

To change the design once for all three sites: edit this package, bump the version, and `npm update` in each consumer.

## Develop

```bash
npm install
npm run build   # tsup -> dist/ (ESM + types)
```
