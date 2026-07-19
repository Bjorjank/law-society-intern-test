"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CloseIcon, MenuIcon } from "@/components/icons";
import {
  navigationSections,
  searchableNavigation,
  socialLinks,
} from "@/data/navigation";
import { figmaAssets } from "@/lib/figma-assets";

function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function SocialLinks() {
  return (
    <div className="social-links" aria-label="Social media and contact links">
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          aria-label={link.label}
          className={link.shortLabel === "instagram" ? "social-instagram" : undefined}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.shortLabel === "instagram" ? <span /> : link.shortLabel}
        </a>
      ))}
      <span className="social-divider" aria-hidden="true">|</span>
      <a href="https://www.lawsociety.org.sg/contact-us/" className="contact-link">
        Contact us
      </a>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeKey, setActiveKey] = useState(navigationSections[0].key);
  const [query, setQuery] = useState("");

  const openButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeSection = useMemo(
    () => navigationSections.find((section) => section.key === activeKey) ?? navigationSections[0],
    [activeKey],
  );

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return [];

    return searchableNavigation
      .filter((item) => `${item.label} ${item.group}`.toLocaleLowerCase().includes(normalized))
      .slice(0, 10);
  }, [query]);

  const openMenu = useCallback(() => {
    setClosing(false);
    setQuery("");
    setActiveKey(navigationSections[0].key);
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    if (!open || closing) return;
    setClosing(true);
  }, [closing, open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = openButtonRef.current;
    document.body.style.overflow = "hidden";

    const focusSearch = window.requestAnimationFrame(() => searchInputRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusSearch);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [closeMenu, open]);

  useEffect(() => {
    if (!open || !closing) return;

    // Animation events can be skipped by some browsers, extensions, or reduced-motion settings.
    // This timeout guarantees that the dialog never remains stuck in an inert closing state.
    const closeFallback = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 400);

    return () => window.clearTimeout(closeFallback);
  }, [closing, open]);

  const focusRelativeLink = (
    selector: string,
    current: HTMLAnchorElement,
    direction: -1 | 1 | "first" | "last",
  ) => {
    const links = Array.from(dialogRef.current?.querySelectorAll<HTMLAnchorElement>(selector) ?? []);
    if (links.length === 0) return;

    const currentIndex = Math.max(0, links.indexOf(current));
    const nextIndex = direction === "first"
      ? 0
      : direction === "last"
        ? links.length - 1
        : (currentIndex + direction + links.length) % links.length;

    links[nextIndex]?.focus();
  };

  const handlePrimaryKeyDown = (
    event: React.KeyboardEvent<HTMLAnchorElement>,
    key: string,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      focusRelativeLink(
        ".navigation-primary a",
        event.currentTarget,
        event.key === "ArrowDown" ? 1 : -1,
      );
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusRelativeLink(
        ".navigation-primary a",
        event.currentTarget,
        event.key === "Home" ? "first" : "last",
      );
      return;
    }

    const section = navigationSections.find((item) => item.key === key);
    if (
      event.key === "ArrowRight"
      && window.matchMedia("(min-width: 768px)").matches
      && section
      && section.children.length > 0
    ) {
      event.preventDefault();
      setActiveKey(key);
      window.requestAnimationFrame(() => {
        dialogRef.current?.querySelector<HTMLAnchorElement>(".navigation-secondary a")?.focus();
      });
    }
  };

  const handleSecondaryKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      focusRelativeLink(
        ".navigation-secondary a",
        event.currentTarget,
        event.key === "ArrowDown" ? 1 : -1,
      );
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusRelativeLink(
        ".navigation-secondary a",
        event.currentTarget,
        event.key === "Home" ? "first" : "last",
      );
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      dialogRef.current
        ?.querySelector<HTMLAnchorElement>(`.navigation-primary a[data-section-key="${activeKey}"]`)
        ?.focus();
    }
  };

  const handlePrimaryClick = (event: React.MouseEvent<HTMLAnchorElement>, key: string) => {
    const section = navigationSections.find((item) => item.key === key);
    if (!section) return;

    if (window.matchMedia("(min-width: 768px)").matches && section.children.length > 0) {
      event.preventDefault();
      setActiveKey(key);
      return;
    }

    closeMenu();
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const firstResult = searchResults[0];
    if (!firstResult) return;

    closeMenu();
    if (isExternalLink(firstResult.href)) {
      window.location.assign(firstResult.href);
    } else {
      window.location.hash = firstResult.href.replace(/^#/, "");
    }
  };

  return (
    <>
      <header className="site-header">
        <a className="site-logo" href="#top" aria-label="The Law Society of Singapore homepage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={figmaAssets.logo} alt="The Law Society of Singapore" />
        </a>

        <div className="desktop-social"><SocialLinks /></div>

        <aside className="hero-rail" aria-label="Page controls">
          <button
            ref={openButtonRef}
            type="button"
            className="menu-trigger"
            onClick={openMenu}
            aria-label="Open navigation menu"
            aria-expanded={open && !closing}
            aria-controls="main-navigation-dialog"
          >
            <MenuIcon />
          </button>
          <a className="scroll-down" href="#functions">
            <span>Scroll<br />down</span>
            <span className="scroll-dot">↓</span>
          </a>
        </aside>
      </header>

      {open && (
        <div
          className={`nav-backdrop${closing ? " is-closing" : ""}`}
          role="presentation"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) closeMenu();
          }}
        >
          <div
            id="main-navigation-dialog"
            ref={dialogRef}
            className={`navigation-dialog${closing ? " is-closing" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget && closing) {
                setOpen(false);
                setClosing(false);
              }
            }}
          >
            <div className="navigation-dialog-inner">
              <div className="navigation-topbar">
                <SocialLinks />
                <button className="navigation-close" type="button" onClick={closeMenu} aria-label="Close navigation menu">
                  <CloseIcon />
                </button>
              </div>

              <form className="navigation-search" role="search" onSubmit={handleSearchSubmit}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
                <label className="sr-only" htmlFor="navigation-search-input">Search navigation</label>
                <input
                  ref={searchInputRef}
                  id="navigation-search-input"
                  type="search"
                  placeholder="Search here"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoComplete="off"
                />
              </form>

              {query.trim() ? (
                <div className="navigation-search-results" aria-live="polite">
                  <p className="navigation-result-count">
                    {searchResults.length > 0
                      ? `${searchResults.length} navigation result${searchResults.length === 1 ? "" : "s"}`
                      : "No navigation results"}
                  </p>
                  {searchResults.length > 0 && (
                    <nav aria-label="Navigation search results">
                      {searchResults.map((result) => (
                        <a
                          key={`${result.group}-${result.label}`}
                          href={result.href}
                          onClick={closeMenu}
                        >
                          <span>{result.label}</span>
                          <small>{result.group}</small>
                        </a>
                      ))}
                    </nav>
                  )}
                </div>
              ) : (
                <div className="navigation-content">
                  <nav className="navigation-primary" aria-label="Main sections">
                    {navigationSections.map((section) => (
                      <a
                        key={section.key}
                        className={section.key === activeKey ? "active" : ""}
                        href={section.href}
                        aria-current={section.key === activeKey ? "page" : undefined}
                        data-section-key={section.key}
                        onPointerEnter={() => setActiveKey(section.key)}
                        onFocus={() => setActiveKey(section.key)}
                        onKeyDown={(event) => handlePrimaryKeyDown(event, section.key)}
                        onClick={(event) => handlePrimaryClick(event, section.key)}
                      >
                        {section.label}
                      </a>
                    ))}
                  </nav>

                  <nav className="navigation-secondary" aria-label={`${activeSection.label} links`}>
                    {activeSection.children.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onKeyDown={handleSecondaryKeyDown}
                        onClick={closeMenu}
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="navigation-scales" src={figmaAssets.navScales} alt="" aria-hidden="true" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
