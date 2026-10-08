import { useLocation } from "react-router";
import ApiStatusBanner from "./ApiStatusBanner.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="layout">
      <ApiStatusBanner />
      <Header />
      <main className="layout__main">
        <ErrorBoundary resetKey={location.pathname}>
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
