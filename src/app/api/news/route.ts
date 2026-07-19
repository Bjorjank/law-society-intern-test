import { NextResponse } from "next/server";

import { newsFixture, type NewsArticle, type NewsResponse } from "@/lib/news";

const GUARDIAN_ENDPOINT = "https://content.guardianapis.com/search";
const REQUEST_TIMEOUT_MS = 10_000;

function stripHtml(value?: string): string {
  if (!value) return "Read the latest report and analysis from The Guardian.";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

type GuardianItem = {
  id: string;
  sectionName?: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  fields?: {
    thumbnail?: string;
    trailText?: string;
  };
};

type GuardianPayload = {
  response?: {
    status?: string;
    results?: GuardianItem[];
  };
};

function json(payload: unknown, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": status === 200
        ? "public, s-maxage=1800, stale-while-revalidate=3600"
        : "no-store",
    },
  });
}

export async function GET() {
  if (process.env.NEWS_USE_FIXTURE === "true") {
    const payload: NewsResponse = { articles: newsFixture, source: "fixture" };
    return json(payload);
  }

  const apiKey = process.env.GUARDIAN_API_KEY?.trim();
  if (!apiKey) {
    return json(
      { message: "Guardian API is not configured. Set GUARDIAN_API_KEY or enable NEWS_USE_FIXTURE." },
      503,
    );
  }

  const params = new URLSearchParams({
    "api-key": apiKey,
    "page-size": "9",
    "order-by": "newest",
    "show-fields": "thumbnail,trailText",
    q: "law OR justice OR legal profession",
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${GUARDIAN_ENDPOINT}?${params.toString()}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      return json({ message: "The news service is temporarily unavailable." }, 502);
    }

    const payload = (await response.json()) as GuardianPayload;
    if (payload.response?.status !== "ok" || !Array.isArray(payload.response.results)) {
      return json({ message: "The news service returned an invalid response." }, 502);
    }

    const articles: NewsArticle[] = payload.response.results.map((item, index) => ({
      id: item.id,
      title: item.webTitle,
      description: stripHtml(item.fields?.trailText),
      publishedAt: item.webPublicationDate,
      url: item.webUrl,
      imageUrl: item.fields?.thumbnail || `/images/news-fallback-${(index % 3) + 1}.svg`,
      section: item.sectionName || "News",
    }));

    if (articles.length < 6) {
      return json({ message: "The news service returned insufficient articles." }, 502);
    }

    const result: NewsResponse = { articles, source: "guardian" };
    return json(result);
  } catch (error: unknown) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return json(
      { message: timedOut ? "The news service timed out. Please try again." : "Unable to connect to the news service. Please try again." },
      502,
    );
  } finally {
    clearTimeout(timeout);
  }
}
