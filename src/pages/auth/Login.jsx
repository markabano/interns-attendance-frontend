import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/auth/login", { email, password });

      login(res.data.user, res.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600 blur-[150px] opacity-20"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600 blur-[150px] opacity-20"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 bg-white/10 backdrop-blur-xl p-10 rounded-2xl w-full max-w-md shadow-2xl border border-white/20"
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-white text-center mb-6 tracking-wide"
        >
          Internship Attendance System
        </motion.h1>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 text-sm text-red-300 bg-red-500/20 border border-red-400/30 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-white/80 text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-white/40 transition-all"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-white/80 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-white/40 transition-all"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:bg-purple-600/50 rounded-xl text-white font-semibold tracking-wide transition-all shadow-lg shadow-purple-600/30"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-white/60">
          © {new Date().getFullYear()} Internship Attendance System
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
