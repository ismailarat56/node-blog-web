import { Route, Routes } from "react-router";
import AccountLayout from "./components/AccountLayout.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import Layout from "./components/Layout.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import ChangeEmailPage from "./pages/ChangeEmailPage.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import EditPostPage from "./pages/EditPostPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NewPostPage from "./pages/NewPostPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/posts/:slug"
          element={<PostDetailPage />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route
          path="/account"
          element={
            <RequireAuth>
              <AccountLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AccountPage />} />
          <Route path="password" element={<ChangePasswordPage />} />
          <Route path="email" element={<ChangeEmailPage />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="posts/new" element={<NewPostPage />} />
          <Route path="posts/:id/edit" element={<EditPostPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
