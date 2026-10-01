import { Route, Routes } from "react-router";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/posts/:slug"
          element={<PostDetailPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
