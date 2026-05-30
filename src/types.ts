import type { ReactNode } from 'react';

export interface LandingNavLink {
  label: string;
  href: string;
  /** Renders as the filled accent button (e.g. the GitHub link). */
  primary?: boolean;
}

export interface LandingMetaCell {
  k: string;
  v: ReactNode;
}

export interface LandingPrimitive {
  num: string;
  title: ReactNode;
  body: ReactNode;
}

export interface LandingSecurityRow {
  k: string;
  v: ReactNode;
}

export interface LandingEcoCard {
  name: string;
  title: string;
  body: string;
  /** GitHub repo "owner/name"; its latest release feeds the live status badge. */
  repo: string;
  fallback?: string;
  /** Highlights this card as the current repo. */
  current?: boolean;
}

export interface LandingFooterLink {
  label: string;
  href: string;
}

/**
 * Everything that differs between the light-* landings. The structure, CSS,
 * fonts, animations, version fetching and copy button live in the component;
 * only this data changes per project.
 */
export interface LandingData {
  /** GitHub repo "owner/name" whose latest release fills the version badge. */
  githubRepo: string;
  brand: string;
  nav: LandingNavLink[];
  hero: {
    tag: string;
    headline: ReactNode;
    lede: ReactNode;
    meta: LandingMetaCell[];
    banner?: { src: string; alt: string; captionLeft: string; captionRight: string };
  };
  primitives: { label: string; heading: ReactNode; items: LandingPrimitive[] };
  quickstart: {
    label: string;
    heading: ReactNode;
    side: ReactNode;
    install: string;
    /** Pre-highlighted HTML for the code sample, rendered verbatim. */
    codeHtml: string;
  };
  security: { label: string; heading: ReactNode; rows: LandingSecurityRow[]; note: ReactNode };
  ecosystem: { label: string; heading: ReactNode; cards: LandingEcoCard[] };
  footer: { sig: string; links: LandingFooterLink[]; metaLeft: string; metaRight: string };
}
