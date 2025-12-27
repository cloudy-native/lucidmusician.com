import { Route, Routes } from "react-router-dom";

import AboutPage from "@/pages/about";
import BlogPage from "@/pages/blog";
import BlogArticlePage from "@/pages/blog-article";
import DocsPage from "@/pages/docs";
import IndexPage from "@/pages/index";
import NotFoundPage from "@/pages/not-found";
import ReleaseNotesPage from "./pages/release-notes";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<ReleaseNotesPage />} path="/release-notes" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<BlogArticlePage />} path="/blog/:slug" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}

export default App;
