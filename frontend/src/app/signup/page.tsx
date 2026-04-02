"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { ShieldCheck, Loader2, Mail, Lock, User, Eye, EyeOff, AlertTriangle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/* ── Scanning animation canvas ── */
function ScanCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let scanY = 0;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const DOTS = 48;
    const dots = Array.from({ length: DOTS }, () => ({
      x: Math.random() * 1000, y: Math.random() * 800,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: 1.5 + Math.random() * 2, flagged: false,
    }));

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Moving scan line
      scanY = (scanY + 0.8) % H;
      const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      grad.addColorStop(0, "rgba(16,185,129,0)");
      grad.addColorStop(0.5, "rgba(16,185,129,0.12)");
      grad.addColorStop(1, "rgba(16,185,129,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 30, W, 60);

      // Flag dots near scan line
      dots.forEach((d) => {
        if (Math.abs(d.y - scanY) < 20 && Math.random() < 0.02) d.flagged = !d.flagged;
      });

      // Draw connections
      for (let i = 0; i < dots.length; i++) {
        const di = { x: (dots[i].x / 1000) * W, y: (dots[i].y / 800) * H };
        for (let j = i + 1; j < dots.length; j++) {
          const dj = { x: (dots[j].x / 1000) * W, y: (dots[j].y / 800) * H };
          const dist = Math.hypot(di.x - dj.x, di.y - dj.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,220,150,${0.1 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(di.x, di.y); ctx.lineTo(dj.x, dj.y); ctx.stroke();
          }
        }
      }

      // Draw dots
      dots.forEach((d) => {
        const px = (d.x / 1000) * W, py = (d.y / 800) * H;
        if (d.flagged) {
          // pulsing red ring
          ctx.beginPath();
          ctx.arc(px, py, d.r + 3, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,80,80,0.3)";
          ctx.lineWidth = 1.5; ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(px, py, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.flagged ? "rgba(255,90,90,0.8)" : "rgba(99,220,150,0.75)";
        ctx.fill();
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > 1000) d.vx *= -1;
        if (d.y < 0 || d.y > 800) d.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await api.post("/signup", { username, email, password, role });
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex">

      {/* ── LEFT: dark themed panel ── */}
      <div className="hidden lg:flex lg:w-[52%] relative bg-[#050d1a] flex-col items-center justify-center overflow-hidden select-none">
        <ScanCanvas />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.07)_0%,_transparent_70%)] pointer-events-none" />

        <div className="relative z-10 px-12 max-w-lg text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">JobCheck <span className="text-emerald-400">AI</span></span>
          </div>

          {/* Feature Pills */}
          <div className="mb-8 space-y-2">
            {[
              { icon: "🛡️", text: "AI-powered fake job detection" },
              { icon: "📊", text: "Confidence scores for every posting" },
              { icon: "🔍", text: "Real-time keyword threat analysis" },
              { icon: "📁", text: "Full history of your scanned jobs" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-left">
                <span className="text-lg">{f.icon}</span>
                <span className="text-sm text-slate-300">{f.text}</span>
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-bold text-white leading-snug mb-4">
            Join <span className="text-emerald-400">98,000+</span> job seekers<br />
            who trust JobCheck AI
          </h1>

          {/* Live scan indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-emerald-500/20 rounded-full text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI scanner active — watch the dots being flagged
          </div>
        </div>
      </div>

      {/* ── RIGHT: signup form ── */}
      <div className="flex-1 bg-white flex items-center justify-center px-8 py-10 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">JobCheck <span className="text-emerald-500">AI</span></span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-1">Create Account</h2>
          <p className="text-slate-500 text-sm mb-8">Start protecting yourself from fraudulent job postings.</p>

          {error && (
            <div className="mb-5 flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}
          {success && (
            <div className="mb-5 flex items-center gap-2 p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle className="w-4 h-4 shrink-0" />{success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text" required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email" required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPass ? "text" : "password"} required
                  className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-slate-900 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Account Type</label>
              <div className="flex gap-3">
                {["user", "admin"].map((r) => (
                  <button
                    key={r} type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${role === r
                        ? r === "admin"
                          ? "bg-emerald-50 border-purple-400 text-emerald-700"
                          : "bg-emerald-50 border-emerald-400 text-emerald-700"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                  >
                    {r === "user" ? "👤 Candidate" : "🛡️ Admin"}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 hover:-translate-y-0.5"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>
          </form>

          {/* ── OR divider ── */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">or sign up with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* ── Google button (full width) ── */}
          <button
            type="button"
            onClick={() => { window.location.href = 'http://localhost:8000/auth/google'; }}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all duration-200 mb-3"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continue with Google
          </button>

          {/* ── LinkedIn + GitHub (side by side) ── */}
          <div className="grid grid-cols-2 gap-3">
            {/* LinkedIn */}
            <button
              type="button"
              onClick={() => { window.location.href = 'http://localhost:8000/auth/linkedin'; }}
              className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-[#0A66C2]/5 hover:border-[#0A66C2]/30 hover:shadow-md transition-all duration-200"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#0A66C2" className="shrink-0">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={() => { window.location.href = 'http://localhost:8000/auth/github'; }}
              className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-900/5 hover:border-slate-400 hover:shadow-md transition-all duration-200"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#111827" className="shrink-0">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub
            </button>
          </div>

          <p className="mt-6 text-sm text-slate-500 text-center">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
