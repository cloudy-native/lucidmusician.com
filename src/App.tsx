import { Route, Routes } from "react-router-dom";

import { TrailingSlashRedirect } from "@/components/TrailingSlashRedirect";
import AboutPage from "@/pages/about";
import BetaPage from "@/pages/beta";
import BlogPage from "@/pages/blog";
import BlogArticlePage from "@/pages/blog-article";
import DocsPage from "@/pages/docs";
import IndexPage from "@/pages/index";
import NotFoundPage from "@/pages/not-found";
import ReleaseNotesPage from "./pages/release-notes";
import RoadmapPage from "./pages/roadmap";
import SupportPage from "./pages/support";

function App() {
  return (
    <>
      <TrailingSlashRedirect />
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<DocsPage />} path="/docs" />
        <Route element={<SupportPage />} path="/support" />
        <Route element={<ReleaseNotesPage />} path="/release-notes" />
        <Route element={<RoadmapPage />} path="/roadmap" />
        <Route element={<BlogPage />} path="/blog" />
        <Route element={<BlogArticlePage />} path="/blog/:slug" />
        <Route element={<AboutPage />} path="/about" />
        <Route element={<BetaPage />} path="/beta" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </>
  );
}

export default App;
