"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Loader2, AlertTriangle } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState("");
  // Guard so the effect only fires once even if dependencies change
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const token    = searchParams.get("token");
    const email    = searchParams.get("email");
    const role     = searchParams.get("role");
    const username = searchParams.get("username");
    const err      = searchParams.get("error");

    if (err) {
      setError(decodeURIComponent(err));
      return;
    }

    if (token && email && role && username) {
      login(token, { email, role, username });
      router.replace("/");
    } else {
      setError("OAuth login failed — missing token or user info. Please try again.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">
              JobCheck <span className="text-emerald-500">AI</span>
            </span>
          </div>

          <div className="flex flex-col items-center gap-4 p-6 bg-red-50 border border-red-200 rounded-2xl">
            <AlertTriangle className="w-10 h-10 text-red-500" />
            <h2 className="text-lg font-semibold text-red-700">Login Failed</h2>
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>

          <button
            onClick={() => router.push("/login")}
            className="mt-6 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white gap-5">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-900">
          JobCheck <span className="text-emerald-500">AI</span>
        </span>
      </div>

      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      <p className="text-slate-500 text-sm">Completing sign-in, please wait…</p>
    </div>
  );
}
