// src/components/ErrorBoundary.jsx
import * as Sentry from "@sentry/react";
import { AlertTriangle } from "lucide-react";

function ErrorFallback({ error, resetError }) {
  return (
    <div className="yb-modal-scrim" role="alert" aria-live="assertive">
      <div className="yb-modal yb-modal-narrow" style={{ textAlign: "center" }}>
        <AlertTriangle size={32} className="text-brand" style={{ margin: "0 auto" }} />
        <h2 className="yb-modal-title" style={{ marginTop: "0.75rem" }}>
          Something went wrong
        </h2>
        <p className="yb-field-error" style={{ marginBottom: "1rem" }}>
          {error?.message || "An unexpected error occurred. Our team has been notified."}
        </p>
        <div className="yb-form-actions">
          <button
            type="button"
            className="yb-btn yb-btn-ghost"
            onClick={() => window.location.assign("/")}
          >
            Go home
          </button>
          <button type="button" className="yb-btn yb-btn-primary" onClick={resetError}>
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ErrorBoundary({ children }) {
  return (
    <Sentry.ErrorBoundary fallback={ErrorFallback} showDialog={false}>
      {children}
    </Sentry.ErrorBoundary>
  );
}