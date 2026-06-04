'use client';

import { useEffect, useState } from 'react';
import type { LandingData } from './types';

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

/**
 * Theme slider. Dependency-free on purpose: it mirrors exactly what next-themes
 * (attribute="class", storageKey="theme") does to the DOM, so it stays in sync
 * with the rest of the Fumadocs site without importing next-themes into this
 * shared package (a second copy would have its own context and break useTheme).
 */
function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);
  const toggle = () => {
    const html = document.documentElement;
    const next = html.classList.contains('dark') ? 'light' : 'dark';
    html.classList.remove('light', 'dark');
    html.classList.add(next);
    html.style.colorScheme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode / storage disabled - DOM is still updated */
    }
    setDark(next === 'dark');
  };
  return (
    <button
      type="button"
      className={dark ? 'theme-toggle is-dark' : 'theme-toggle'}
      aria-label="Toggle colour theme"
      onClick={toggle}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-thumb">{dark ? <MoonIcon /> : <SunIcon />}</span>
      </span>
    </button>
  );
}

/**
 * The shared bespoke landing for the light-* ecosystem. All structure, CSS,
 * fonts, animations, GitHub version fetching and the copy button live here;
 * everything project-specific comes from `data`.
 *
 * Consumers must also import the stylesheet once:
 *   import 'light-landing-page/styles.css';
 */
export function LandingPage({ data }: { data: LandingData }) {
  const { githubRepo } = data;

  useEffect(() => {
    const btn = document.querySelector('[data-copy]');
    const src = document.getElementById('code-sample');
    if (btn && src) {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText((src as HTMLElement).innerText.trim());
          btn.textContent = 'Copied';
          btn.classList.add('done');
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('done');
          }, 1600);
        } catch {
          btn.textContent = 'Select';
        }
      });
    }

    const repos = new Set<string>([githubRepo]);
    document.querySelectorAll('[data-eco-status][data-gh-repo]').forEach((el) => {
      const r = el.getAttribute('data-gh-repo');
      if (r) repos.add(r);
    });

    const fetchLatest = (
      repo: string,
    ): Promise<{ tag_name?: string; prerelease?: boolean } | null> =>
      fetch(`https://api.github.com/repos/${repo}/releases/latest`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

    Promise.all([...repos].map((repo) => fetchLatest(repo).then((d) => [repo, d] as const))).then(
      (entries) => {
        const releases = new Map(entries);
        const project = releases.get(githubRepo);
        if (project?.tag_name) {
          const tag = project.tag_name;
          const v = tag.startsWith('v') ? tag : `v${tag}`;
          document.querySelectorAll('[data-gh-version]').forEach((el) => {
            el.textContent = v;
          });
        }
        document.querySelectorAll('[data-eco-status][data-gh-repo]').forEach((el) => {
          const repo = el.getAttribute('data-gh-repo');
          const fallback = el.getAttribute('data-fallback') || 'In development';
          const d = repo ? releases.get(repo) : null;
          const tag = d?.tag_name;
          if (!tag) {
            el.textContent = fallback;
            return;
          }
          const v = tag.startsWith('v') ? tag : `v${tag}`;
          el.textContent = `${d?.prerelease === true ? 'Pre-release - ' : 'Stable - '}${v}`;
        });
      },
    );
  }, [githubRepo]);

  return (
    <div className="bespoke-landing">
      <header className="top">
        <div className="shell">
          <div className="top-row">
            <a className="mark" href={data.nav[0]?.href ?? '#'}>
              <span className="mark-dot" aria-hidden="true" />
              <span>{data.brand}</span>
              <em data-gh-version />
            </a>
            <div className="top-right">
              <nav className="top-nav" aria-label="primary">
                {data.nav
                  .filter((l) => !l.href.includes('github.com'))
                  .map((l) => (
                    <a key={l.label} href={l.href} className={l.primary ? 'primary' : undefined}>
                      {l.label}
                    </a>
                  ))}
              </nav>
              <div className="top-actions">
                <a
                  className="gh-link"
                  href={`https://github.com/${githubRepo}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub repository"
                >
                  <GitHubIcon />
                </a>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="shell">
            <div className="hero-eyebrow">
              <span className="v" data-gh-version />
              <span className="divider" />
              <span className="tag">{data.hero.tag}</span>
            </div>
            <div className="hero-headline">
              <h1 className="display">{data.hero.headline}</h1>
              <p className="hero-lede">{data.hero.lede}</p>
              <div className="hero-meta">
                {data.hero.meta.map((c) => (
                  <div className="cell" key={c.k}>
                    <div className="k">{c.k}</div>
                    <div className="v">{c.v}</div>
                  </div>
                ))}
              </div>
            </div>
            {data.hero.banner && (
              <figure className="hero-figure">
                <div className="hero-banner">
                  {data.hero.banner.node ? (
                    data.hero.banner.node
                  ) : data.hero.banner.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={data.hero.banner.src} alt={data.hero.banner.alt ?? ''} />
                  ) : null}
                  <div className="corners" aria-hidden="true" />
                </div>
                <figcaption className="hero-banner-caption">
                  <span>{data.hero.banner.captionLeft}</span>
                  <span>{data.hero.banner.captionRight}</span>
                </figcaption>
              </figure>
            )}
          </div>
        </section>
        <section id="primitives">
          <div className="shell">
            <div className="section-head">
              <div className="label">{data.primitives.label}</div>
              <h2>{data.primitives.heading}</h2>
            </div>
            <div className="prims">
              {data.primitives.items.map((p) => (
                <div className="prim" key={p.num}>
                  <div className="num">{p.num}</div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="quick-start">
          <div className="shell">
            <div className="section-head">
              <div className="label">{data.quickstart.label}</div>
              <h2>{data.quickstart.heading}</h2>
            </div>
            <div className="qstart">
              <div className="side">
                {data.quickstart.side}
                <span className="install">{data.quickstart.install}</span>
              </div>
              <div className="code-window">
                <div className="bar">
                  <span className="pills">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>example.ts</span>
                  <button className="copy" type="button" aria-label="Copy code" data-copy>
                    Copy
                  </button>
                </div>
                <pre id="code-sample" dangerouslySetInnerHTML={{ __html: data.quickstart.codeHtml }} />
              </div>
            </div>
          </div>
        </section>
        <section id="security">
          <div className="shell">
            <div className="section-head">
              <div className="label">{data.security.label}</div>
              <h2>{data.security.heading}</h2>
            </div>
            <div className="sec-grid">
              {data.security.rows.map((r) => (
                <div className="row" key={r.k}>
                  <div className="k">{r.k}</div>
                  <div className="v">{r.v}</div>
                </div>
              ))}
            </div>
            <div className="sec-note">{data.security.note}</div>
          </div>
        </section>
        <section id="ecosystem">
          <div className="shell">
            <div className="section-head">
              <div className="label">{data.ecosystem.label}</div>
              <h2>{data.ecosystem.heading}</h2>
            </div>
            <div className="eco">
              {data.ecosystem.cards.map((c) => (
                <article className={c.current ? 'eco-card this' : 'eco-card'} key={c.name}>
                  <div className="mono-name">{c.name}</div>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                  <div
                    className="status"
                    data-eco-status
                    data-gh-repo={c.repo}
                    data-fallback={c.fallback ?? 'In development'}
                  >
                    Loading
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="shell">
          <div className="foot-row">
            <div className="sig">{data.footer.sig}</div>
            <nav className="foot-links" aria-label="footer">
              {data.footer.links.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="foot-meta">
            <span>{data.footer.metaLeft}</span>
            <span>{data.footer.metaRight}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
