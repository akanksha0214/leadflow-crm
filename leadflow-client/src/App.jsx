import { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { loadUser } from "./redux/authSlice";
import { Toaster } from "react-hot-toast";

// lazy-loaded pages
const Login = lazy(() => import("./pages/Login"));
const CreateUser = lazy(() => import("./pages/CreateUser"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Leads = lazy(() => import("./pages/Leads"))

function App() {
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "40vh" }}>
        Checking authentication...
      </div>
    );
  }

  return (


    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />
      <Router>
        <Suspense
          fallback={
            <div style={{ textAlign: "center", marginTop: "40vh" }}>
              Loading page...
            </div>
          }
        >
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />

            {/* PROTECTED DASHBOARD */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads"
              element={
                <ProtectedRoute><Leads /></ProtectedRoute>
              }
            />

            {/* ADMIN-ONLY SIGNUP */}
            <Route
              path="/create-user"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <CreateUser />
                </ProtectedRoute>
              }
            />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </Router>
    </>


  );
}

export default App;
