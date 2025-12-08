// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import { LogOut, User, Calendar, Clock, LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      {/* SIDEBAR */}
      <aside className="w-64 hidden md:flex flex-col p-6 backdrop-blur-xl bg-white/5 border-r border-white/10 shadow-xl">
        <div className="flex items-center gap-3 mb-10">
          <LayoutDashboard className="w-7 h-7 text-blue-400" />
          <h1 className="text-xl font-semibold tracking-wide">Dashboard</h1>
        </div>

        <nav className="flex flex-col gap-2">
          <button className="p-3 flex items-center gap-3 rounded-xl hover:bg-white/10 transition">
            <User className="w-5 h-5 text-blue-300" />
            Profile
          </button>

          <button className="p-3 flex items-center gap-3 rounded-xl hover:bg-white/10 transition">
            <Clock className="w-5 h-5 text-blue-300" />
            Attendance
          </button>

          <button className="p-3 flex items-center gap-3 rounded-xl hover:bg-white/10 transition">
            <Calendar className="w-5 h-5 text-blue-300" />
            Leave Requests
          </button>

          <button
            onClick={logout}
            className="p-3 mt-auto flex items-center gap-3 text-red-300 rounded-xl hover:bg-red-500/20 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10">
        {/* GREETING */}
        <motion.h2
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-6 tracking-wide"
        >
          Welcome back, <span className="text-blue-400">{user?.firstName}</span>{" "}
          👋
        </motion.h2>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/10 shadow-xl"
          >
            <h3 className="text-lg font-medium">Hours Completed</h3>
            <p className="text-4xl font-bold text-blue-300 mt-3">120 hrs</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/10 shadow-xl"
          >
            <h3 className="text-lg font-medium">Remaining Hours</h3>
            <p className="text-4xl font-bold text-teal-300 mt-3">80 hrs</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/10 shadow-xl"
          >
            <h3 className="text-lg font-medium">Total Leaves</h3>
            <p className="text-4xl font-bold text-purple-300 mt-3">3</p>
          </motion.div>
        </div>

        {/* RECENT ACTIVITY */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 backdrop-blur-lg bg-white/10 border border-white/10 p-6 rounded-2xl shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <span>Time In</span>
              <span className="text-blue-300">08:03 AM</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <span>Time Out</span>
              <span className="text-blue-300">05:01 PM</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <span>Leave Filed</span>
              <span className="text-blue-300">Pending Approval</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
