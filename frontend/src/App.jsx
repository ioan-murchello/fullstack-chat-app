import { Route, Routes } from "react-router-dom";
import useAuthStore from "./store/useAuthStore.js";
import { Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import {
  HomePage,
  Signup,
  Login,
  SettingsPage,
  Profile,
} from "./pages/pages.js";
import { Toaster } from "react-hot-toast";
import useThemeStore from "./store/useThemeStore.js";
import { useEffect } from "react";

function App() {
  const { user, checkAuth, isChecking } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isChecking && !user) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }
  return (
    <div data-theme={theme}>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
