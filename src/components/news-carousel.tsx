/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import type { NewsArticle, NewsResponse } from "@/lib/news";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}


async function requestNews(signal?: AbortSignal): Promise<NewsArticle[]> {
  const response = await fetch("/api/news", { cache: "no-store", signal });
  if (!response.ok) throw new Error("News request failed");

  const data = (await response.json()) as NewsResponse;
  if (!Array.isArray(data.articles) || data.articles.length === 0) {
    throw new Error("News response was empty");
  }

  return data.articles;
}

function NewsSkeleton() {
  return (
    <article className="press-card press-skeleton news-card-basis" aria-hidden="true">
      <div className="skeleton-image" />
      <div className="skeleton-line wide" />
      <div className="skeleton-line medium" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
    </article>
  );
}

export function NewsCarousel() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [documentPaused, setDocumentPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const paused = hoverPaused || focusPaused || documentPaused;

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setArticles(await requestNews());
    } catch {
      setArticles([]);
      setError("We could not load the latest news. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    requestNews(controller.signal)
      .then((nextArticles) => {
        if (active) setArticles(nextArticles);
      })
      .catch((reason: unknown) => {
        if (!active || (reason instanceof DOMException && reason.name === "AbortError")) return;
        setArticles([]);
        setError("We could not load the latest news. Check your connection and try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateControls();
    const observer = new ResizeObserver(updateControls);
    observer.observe(track);
    track.addEventListener("scroll", updateControls, { passive: true });

    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", updateControls);
    };
  }, [articles, loading, updateControls]);

  const move = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>("[data-news-card]");
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "30");
    const distance = (card?.offsetWidth ?? track.clientWidth) + (Number.isFinite(gap) ? gap : 30);
    track.scrollBy({ left: distance * direction, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (loading || error || paused || articles.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;

      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 8) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        move(1);
      }
    }, 6000);

    return () => window.clearInterval(timer);
  }, [articles.length, error, loading, move, paused]);

  useEffect(() => {
    const handleVisibility = () => setDocumentPaused(document.hidden);
    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <section id="news" className="press-section" aria-labelledby="press-title">
      <div className="press-heading-row">
        <h2 id="press-title" className="section-kicker">Media &amp; Press</h2>
        <div className="press-controls" aria-label="News carousel controls">
          <button type="button" onClick={() => move(-1)} disabled={!canPrev || loading || Boolean(error)} aria-label="Show previous news article">
            <ArrowLeftIcon />
          </button>
          <button type="button" onClick={() => move(1)} disabled={!canNext || loading || Boolean(error)} aria-label="Show next news article">
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      {error ? (
        <div className="press-error" role="alert">
          <h3>News is temporarily unavailable</h3>
          <p>{error}</p>
          <button type="button" onClick={() => void loadNews()}>Try again</button>
        </div>
      ) : (
        <div
          ref={trackRef}
          className="news-track press-track"
          role="region"
          aria-roledescription="carousel"
          aria-label="Latest media and press articles"
          tabIndex={0}
          onMouseEnter={() => setHoverPaused(true)}
          onMouseLeave={() => setHoverPaused(false)}
          onFocusCapture={() => setFocusPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusPaused(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              move(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              move(1);
            }
          }}
        >
          {loading
            ? Array.from({ length: 3 }, (_, index) => <NewsSkeleton key={index} />)
            : articles.map((article) => (
                <article key={article.id} data-news-card className="press-card news-card-basis">
                  <a className="press-image" href={article.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
                    <img
                      src={article.imageUrl}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/figma/press-1.jpg";
                      }}
                    />
                  </a>
                  <div className="press-card-body">
                    <h3>{article.title}</h3>
                    <p className="press-meta">
                      <span>{article.section}</span> | <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                    </p>
                    <p className="press-description">{article.description}</p>
                    <a className="press-more" href={article.url} target="_blank" rel="noopener noreferrer">
                      More detail <span aria-hidden="true">⟶</span>
                    </a>
                  </div>
                </article>
              ))}
        </div>
      )}
    </section>
  );
}
