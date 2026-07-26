import { Suspense, lazy } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Wallpage } from "./pages/wallpage";
import ErrorBoundary from "./components/ErrorBoundary";
const AdminPage = lazy(() => import("./pages/adminPage"));
const FacultyPage = lazy(() =>
  import("./pages/facultyPage").then((m) => ({ default: m.FacultyPage }))
);

function RouteLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary>
                  <Wallpage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/admin"
              element={
                <ErrorBoundary>
                  <AdminPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/faculty"
              element={
                <ErrorBoundary>
                  <FacultyPage />
                </ErrorBoundary>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}