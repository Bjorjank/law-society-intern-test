/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

import { CloseIcon } from "@/components/icons";
import { figmaAssets } from "@/lib/figma-assets";

export function AnniversaryBanner() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <section id="anniversary" className="anniversary-section" aria-label="60th Anniversary">
        <img src={figmaAssets.anniversary} alt="Law Society members commemorating the anniversary" />
        <div className="anniversary-overlay" />
        <div className="anniversary-ribbon" aria-hidden="true" />
        <div className="anniversary-title">
          <span>Celebrating</span>
          <div><strong>60</strong><sup>th</sup></div>
          <span>Anniversary</span>
        </div>
        <button
          ref={triggerRef}
          type="button"
          className="play-button"
          aria-label="Open anniversary video information"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span>▶</span>
          <small>Play video</small>
        </button>
        <div className="torn-edge anniversary-torn" aria-hidden="true" />
      </section>

      {open && (
        <div
          className="anniversary-modal-backdrop"
          role="presentation"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            ref={modalRef}
            className="anniversary-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="anniversary-modal-title"
            aria-describedby="anniversary-modal-description"
          >
            <button ref={closeRef} className="anniversary-modal-close" type="button" onClick={() => setOpen(false)} aria-label="Close anniversary dialog">
              <CloseIcon />
            </button>
            <img src={figmaAssets.anniversary} alt="" aria-hidden="true" />
            <div>
              <p className="section-kicker">60th Anniversary</p>
              <h2 id="anniversary-modal-title">Anniversary video source not supplied</h2>
              <p id="anniversary-modal-description">
                The Figma test case includes the play control and poster image, but no video file or video URL.
                The control is implemented without inventing or embedding unapproved media.
              </p>
              <a className="text-arrow" href="https://www.lawsociety.org.sg/">
                <span>Visit Law Society</span>
                <span aria-hidden="true">⟶</span>
              </a>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
