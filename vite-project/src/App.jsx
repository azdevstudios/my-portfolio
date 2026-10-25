import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
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

function NotFound() {
  return (
    <section className="min-h-[65vh] px-6 py-24 text-center">
      <p className="mb-4 text-sm font-medium text-blue-600">404</p>

      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Page not found.
      </h1>

      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
      >
        Back to home
      </Link>
    </section>
  );
}

function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    const titles = {
      "/": "Full-Stack Web Developer",
      "/about": "About",
      "/projects": "Projects",
      "/contact": "Contact",
    };

    document.title = `Ali Zain | ${titles[pathname] || "Page not found"}`;
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <Navbar />

      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <WhatsappButton />
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AnimatePresence>
          {loading && (
            <Preloader onComplete={() => setLoading(false)} />
          )}
        </AnimatePresence>

        <Layout />
      </BrowserRouter>
    </MotionConfig>
  );
}