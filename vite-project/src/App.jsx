import { lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, MotionConfig } from "motion/react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import WhatsappButton from "./components/WhatsappButton";

import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";

import usePortfolio from "./hooks/usePortfolio";
const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProjects = lazy(() => import("./pages/admin/Projects"));
const AdminProfile = lazy(() => import("./pages/admin/Profile"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));

function NotFound() {
  return (
    <section className="portfolio-page min-h-[65vh] px-6 py-24 text-center">
      <p className="text-sm font-medium text-(--accent)">404</p>

      <h1 className="pf-heading mt-4 text-4xl">Page not found.</h1>

      <Link to="/" className="pf-button mt-8">
        Back to home
      </Link>
    </section>
  );
}

function Layout() {
  const { profile } = usePortfolio();
  const { pathname } = useLocation();

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    if (isAdminPage) {
      if (pathname === "/admin/login") {
        document.title = `${profile.name} | Admin Login`;
      }

      return;
    }

    const titles = {
      "/": "Full-Stack Web Developer",
      "/about": "About",
      "/projects": "Projects",
      "/contact": "Contact",
    };

    document.title = `${profile.name} | ${titles[pathname] || "Page not found"}`;
  }, [pathname, isAdminPage, profile.name]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      {!isAdminPage && <Navbar />}

      <main id="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="portfolio-page min-h-screen p-8">
              <p role="status">Loading page…</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminPage && (
        <>
          <Footer />
          <WhatsappButton />
        </>
      )}
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AnimatePresence>
          {loading && <Preloader onComplete={() => setLoading(false)} />}
        </AnimatePresence>

        <Layout />
      </BrowserRouter>
    </MotionConfig>
  );
}
