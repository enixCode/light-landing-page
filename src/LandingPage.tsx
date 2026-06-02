'use client';

import { useEffect } from 'react';
import type { LandingData } from './types';

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
            <nav className="top-nav" aria-label="primary">
              {data.nav.map((l) => (
                <a key={l.label} href={l.href} className={l.primary ? 'primary' : undefined}>
                  {l.label}
                </a>
              ))}
            </nav>
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
