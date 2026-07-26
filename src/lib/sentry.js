// src/lib/sentry.js
import * as Sentry from "@sentry/react";

/**
 * Call this once, as early as possible (top of main.jsx), before ReactDOM.render.
 * Requires VITE_SENTRY_DSN in your .env file(s).
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    // Don't crash local dev if the DSN isn't set — just skip silently.
    console.warn("Sentry DSN not set — error tracking is disabled.");
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE, // "development" | "production"

    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(), // records a video-like replay leading up to errors
    ],

    // Tracing — capture 100% of transactions in dev, dial it down in prod
    tracesSampleRate: import.meta.env.MODE === "production" ? 0.2 : 1.0,

    // Which URLs get distributed trace headers attached. Add your Supabase
    // project so requests to it are linked to the trace that triggered them.
    tracePropagationTargets: [
      "localhost",
      /^https:\/\/hhyirzqlrgdhrfxtjhsv\.supabase\.co/,
    ],

    // Session Replay sampling
    replaysSessionSampleRate: 0.1, // 10% of normal sessions
    replaysOnErrorSampleRate: 1.0, // always capture a replay when an error happens

    // Sentry structured logging (Sentry.logger.info/warn/error calls, if you use them)
    enableLogs: true,
  });
}