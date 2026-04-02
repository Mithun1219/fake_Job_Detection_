"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
  ShieldAlert, BrainCircuit, Activity, ShieldCheck,
  Users, Flag, Zap, MessageSquareWarning, RefreshCw,
  CheckCircle2, Trash2, Crown, UserCheck, Clock,
  TrendingUp, AlertTriangle, Search, Download,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";

/* ── Types ── */
interface AdminStats  { total: number; fake: number; real: number; accuracy: number }
interface DailyStat   { date: string; requests: number }
interface User        { id: number; username: string; email: string; role: string; created_at: string }
interface FlaggedPost { post_id: number; job_text: string; label: string; confidence_score: number; submission_time: string; user_email: string; reviewed: number }
interface Activity    { post_id: number; user_email: string; label: string; confidence_score: number; submission_time: string; preview: string }
interface KeywordStat { keyword: string; count: number }

type Tab = "overview" | "users" | "flagged" | "model" | "threats";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview",       icon: Activity           },
  { id: "users",    label: "Users",          icon: Users              },
  { id: "flagged",  label: "Flagged Posts",  icon: Flag               },
  { id: "model",    label: "Model Info",     icon: BrainCircuit       },
  { id: "threats",  label: "Threat Intel",   icon: MessageSquareWarning },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  /* ── Overview state ── */
  const [stats,     setStats]     = useState<AdminStats | null>(null);
  const [dailyData, setDailyData] = useState<DailyStat[]>([]);
  const [activity,  setActivity]  = useState<Activity[]>([]);
  const [overviewLoading, setOverviewLoading] = useState(true);

  /* ── Users state ── */
  const [users,       setUsers]       = useState<User[]>([]);
  const [userSearch,  setUserSearch]  = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const [roleMsg,     setRoleMsg]     = useState("");

  /* ── Flagged state ── */
  const [flagged,       setFlagged]       = useState<FlaggedPost[]>([]);
  const [flaggedLoading, setFlaggedLoading] = useState(false);

  /* ── Threats state ── */
  const [keywords,       setKeywords]       = useState<KeywordStat[]>([]);
  const [threatsLoading, setThreatsLoading] = useState(false);

  /* ── Retrain state ── */
  const [retraining,   setRetraining]   = useState(false);
  const [retrainMsg,   setRetrainMsg]   = useState("");

  /* ── Load overview ── */
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [s, d, a] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/daily-stats"),
          api.get("/admin/recent-activity"),
        ]);
        setStats(s.data);
        setDailyData(d.data);
        setActivity(a.data);
      } catch (e) { console.error(e); }
      finally { setOverviewLoading(false); }
    };
    fetchOverview();
    const interval = setInterval(() => api.get("/admin/recent-activity").then(r => setActivity(r.data)), 30000);
    return () => clearInterval(interval);
  }, []);

  /* ── Load users ── */
  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try { const r = await api.get("/admin/users"); setUsers(r.data); }
    catch (e) { console.error(e); }
    finally { setUsersLoading(false); }
  }, []);

  /* ── Load flagged ── */
  const loadFlagged = useCallback(async () => {
    setFlaggedLoading(true);
    try { const r = await api.get("/admin/flagged"); setFlagged(r.data); }
    catch (e) { console.error(e); }
    finally { setFlaggedLoading(false); }
  }, []);

  /* ── Load threats ── */
  const loadThreats = useCallback(async () => {
    setThreatsLoading(true);
    try { const r = await api.get("/admin/keyword-stats"); setKeywords(r.data); }
    catch (e) { console.error(e); }
    finally { setThreatsLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === "users"   && users.length   === 0) loadUsers();
    if (activeTab === "flagged" && flagged.length  === 0) loadFlagged();
    if (activeTab === "threats" && keywords.length === 0) loadThreats();
  }, [activeTab, users.length, flagged.length, keywords.length, loadUsers, loadFlagged, loadThreats]);

  /* ── Handlers ── */
  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setRoleMsg(`✓ Role updated`);
      loadUsers();
      setTimeout(() => setRoleMsg(""), 3000);
    } catch { setRoleMsg("✗ Failed to update role"); }
  };

  const handleReview = async (postId: number) => {
    try {
      await api.put(`/admin/flagged/${postId}/review`);
      setFlagged(prev => prev.map(p => p.post_id === postId ? { ...p, reviewed: 1 } : p));
    } catch { alert("Failed to mark as reviewed"); }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("Delete this post from the database?")) return;
    try {
      await api.delete(`/admin/flagged/${postId}`);
      setFlagged(prev => prev.filter(p => p.post_id !== postId));
    } catch { alert("Failed to delete post"); }
  };

  const handleRetrain = async () => {
    if (!confirm("This will retrain the model on the full dataset (~17,000 jobs). It may take 1-2 minutes. Continue?")) return;
    setRetraining(true);
    setRetrainMsg("Training in progress… please wait");
    try {
      const r = await api.post("/admin/retrain");
      setRetrainMsg(`✅ ${r.data.message}`);
    } catch (e: any) {
      setRetrainMsg(`❌ ${e.response?.data?.detail || "Retrain failed"}`);
    } finally { setRetraining(false); }
  };

  /* ── Metric cards ── */
  const metricCards = stats ? [
    { title: "Total Scans",     value: stats.total,        icon: Activity,    color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Fake Detected",   value: stats.fake,         icon: ShieldAlert, color: "text-red-500",     bg: "bg-red-500/10"     },
    { title: "Authentic Jobs",  value: stats.real,         icon: ShieldCheck, color: "text-green-500",   bg: "bg-green-500/10"   },
    { title: "ML Accuracy",     value: `${stats.accuracy}%`, icon: BrainCircuit, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ] : [];

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row pt-16 bg-slate-50">

      {/* ── Sidebar ── */}
      <aside className="w-full lg:w-60 shrink-0 bg-white border-r border-slate-200 lg:min-h-[calc(100vh-80px)] p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-2">Navigation</p>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer
                ${activeTab === t.id
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                  : "text-slate-600 hover:bg-slate-100"}`}
            >
              <t.icon className="w-4 h-4 shrink-0" />
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 p-6 lg:p-8 min-w-0">

        {/* Header */}
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-500 mt-1 text-sm">Platform metrics, user management & model control</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Retrain button */}
              <button
                onClick={handleRetrain}
                disabled={retraining}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-all shadow disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${retraining ? "animate-spin" : ""}`} />
                {retraining ? "Training…" : "Retrain Model"}
              </button>
              {/* PDF export */}
              <a
                href="http://localhost:8000/admin/export-pdf"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-transparent rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-lg"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>
          </div>
          {/* Retrain message */}
          {retrainMsg && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
              {retrainMsg}
            </div>
          )}
        </AnimatedSection>

        {/* ══════════════════ OVERVIEW TAB ══════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Metric Cards */}
            {overviewLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-36" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metricCards.map((card, i) => (
                  <AnimatedSection key={card.title} direction="up" delay={i * 0.1}>
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${card.color}`}>
                        <card.icon className="w-24 h-24 -mr-6 -mt-6 rotate-12" />
                      </div>
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${card.bg}`}>
                        <card.icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                      <h3 className="text-3xl font-bold mb-1 text-slate-900">{card.value}</h3>
                      <p className="text-sm font-medium text-slate-500">{card.title}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            )}

            {/* Charts */}
            {!overviewLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AnimatedSection direction="up" delay={0.3} className="lg:col-span-2">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-[360px] flex flex-col">
                    <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-slate-900">
                      <TrendingUp className="w-5 h-5 text-emerald-500" /> Prediction Requests (7 Days)
                    </h3>
                    <div className="flex-grow">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor:"#fff", border:"1px solid #e2e8f0", borderRadius:"8px" }} />
                          <Area type="monotone" dataKey="requests" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGreen)" animationDuration={1500} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection direction="up" delay={0.4}>
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-[360px] flex flex-col">
                    <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-slate-900">
                      <ShieldAlert className="w-5 h-5 text-red-400" /> Detection Split
                    </h3>
                    <div className="flex-grow">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: "Fake", value: stats?.fake || 0 },
                          { name: "Real", value: stats?.real || 0 },
                        ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ backgroundColor:"#fff", border:"1px solid #e2e8f0", borderRadius:"8px" }} />
                          <Bar dataKey="value" radius={[6,6,0,0]} animationDuration={1500}>
                            <Cell fill="#ef4444" />
                            <Cell fill="#10b981" />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            )}

            {/* Recent Activity Feed */}
            <AnimatedSection direction="up" delay={0.5}>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold flex items-center gap-2 text-slate-900">
                    <Zap className="w-5 h-5 text-amber-500" /> Live Activity Feed
                  </h3>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    Auto-refresh every 30s
                  </span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {activity.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-8">No predictions yet</p>
                  ) : activity.map(a => (
                    <div key={a.post_id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                      <span className={`mt-0.5 w-2.5 h-2.5 rounded-full shrink-0 ${a.label === "FAKE" ? "bg-red-500" : "bg-emerald-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 truncate">{a.preview}…</p>
                        <p className="text-xs text-slate-400 mt-0.5">{a.user_email} · {a.confidence_score}% confidence</p>
                      </div>
                      <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${a.label === "FAKE" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                        {a.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        )}

        {/* ══════════════════ USERS TAB ══════════════════ */}
        {activeTab === "users" && (
          <AnimatedSection>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-500" /> User Management
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">{users.length} registered users</p>
                </div>
                <div className="flex items-center gap-3">
                  {roleMsg && <span className="text-sm text-emerald-600 font-medium">{roleMsg}</span>}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)}
                      placeholder="Search users…"
                      className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                  <button onClick={loadUsers} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
              {usersLoading ? (
                <div className="p-12 text-center">
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-500 mx-auto" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                            {u.username}
                          </td>
                          <td className="px-6 py-4 text-slate-500">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              u.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                            }`}>
                              {u.role === "admin" ? <Crown className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-xs">{u.created_at ? u.created_at.slice(0,10) : "—"}</td>
                          <td className="px-6 py-4">
                            {u.role === "admin" ? (
                              <button
                                onClick={() => handleRoleChange(u.id, "user")}
                                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 transition-colors"
                              >
                                Demote to User
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRoleChange(u.id, "admin")}
                                className="text-xs px-3 py-1.5 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
                              >
                                Promote to Admin
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <p className="text-slate-400 text-sm text-center py-12">No users found</p>
                  )}
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

        {/* ══════════════════ FLAGGED TAB ══════════════════ */}
        {activeTab === "flagged" && (
          <AnimatedSection>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Flag className="w-5 h-5 text-red-500" /> Flagged Posts Review
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">High-confidence fake job postings detected by the model</p>
                </div>
                <button onClick={loadFlagged} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <RefreshCw className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              {flaggedLoading ? (
                <div className="p-12 text-center"><RefreshCw className="w-6 h-6 animate-spin text-emerald-500 mx-auto" /></div>
              ) : flagged.length === 0 ? (
                <div className="p-12 text-center">
                  <ShieldCheck className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                  <p className="text-slate-400">No flagged posts found</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {flagged.map(post => (
                    <div key={post.post_id} className={`p-6 hover:bg-slate-50 transition-colors ${post.reviewed ? "opacity-60" : ""}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
                              🚩 FAKE · {post.confidence_score}% confidence
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {post.submission_time?.slice(0,16) || "—"}
                            </span>
                            <span className="text-xs text-slate-400">{post.user_email}</span>
                            {post.reviewed === 1 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-medium">✓ Reviewed</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-700 font-mono bg-slate-50 p-3 rounded-lg border border-slate-100 line-clamp-3">
                            {post.job_text}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          {!post.reviewed && (
                            <button
                              onClick={() => handleReview(post.post_id)}
                              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Review
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(post.post_id)}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

        {/* ══════════════════ MODEL TAB ══════════════════ */}
        {activeTab === "model" && (
          <AnimatedSection>
            <div className="space-y-6">
              {/* Model stats card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                  <BrainCircuit className="w-5 h-5 text-emerald-500" /> Model Performance
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Accuracy",  value: stats ? `${stats.accuracy}%` : "—", color: "text-emerald-600" },
                    { label: "Algorithm", value: "Logistic Regression",               color: "text-slate-700"   },
                    { label: "Features",  value: "TF-IDF (10k tokens)",               color: "text-slate-700"   },
                    { label: "Dataset",   value: "≈17,000 jobs",                      color: "text-slate-700"   },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
                      <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 pt-5">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Model Files</h3>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-mono text-xs">fake_job_model.pkl</span>
                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-mono text-xs">vectorizer.pkl</span>
                    <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-100 font-mono text-xs">fake_job_postings.csv (~17k rows)</span>
                  </div>
                </div>
              </div>

              {/* Retrain card */}
              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Retrain Model</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Retrains the Logistic Regression model on the full <strong>fake_job_postings.csv</strong> dataset.
                      The process takes ~1-2 minutes and immediately updates the live model in memory.
                    </p>
                    {retrainMsg && (
                      <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                        {retrainMsg}
                      </div>
                    )}
                    <button
                      onClick={handleRetrain}
                      disabled={retraining}
                      className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-all shadow disabled:opacity-60"
                    >
                      <RefreshCw className={`w-4 h-4 ${retraining ? "animate-spin" : ""}`} />
                      {retraining ? "Training in progress…" : "Start Retraining"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Retraining replaces <code>fake_job_model.pkl</code> and <code>vectorizer.pkl</code> on disk and reloads them in memory. Ensure the dataset is intact before proceeding.</p>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ══════════════════ THREATS TAB ══════════════════ */}
        {activeTab === "threats" && (
          <AnimatedSection>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquareWarning className="w-5 h-5 text-orange-500" /> Threat Keyword Intelligence
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">Frequency of scam keywords found in flagged job posts</p>
                </div>
                <button onClick={loadThreats} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <RefreshCw className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              {threatsLoading ? (
                <div className="py-12 text-center"><RefreshCw className="w-6 h-6 animate-spin text-orange-500 mx-auto" /></div>
              ) : keywords.every(k => k.count === 0) ? (
                <div className="py-12 text-center">
                  <MessageSquareWarning className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No keyword data yet — scan some job descriptions first</p>
                </div>
              ) : (
                <>
                  <div className="h-[380px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={keywords.filter(k => k.count > 0)} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis type="category" dataKey="keyword" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={130} />
                        <Tooltip contentStyle={{ backgroundColor:"#fff", border:"1px solid #e2e8f0", borderRadius:"8px" }} />
                        <Bar dataKey="count" radius={[0,6,6,0]} animationDuration={1500} fill="#f97316" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {keywords.filter(k => k.count > 0).slice(0,6).map(k => (
                      <div key={k.keyword} className="flex items-center justify-between px-4 py-3 bg-orange-50 border border-orange-100 rounded-xl">
                        <span className="text-xs font-medium text-orange-800 capitalize">{k.keyword}</span>
                        <span className="text-sm font-bold text-orange-600 ml-2">{k.count}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </AnimatedSection>
        )}

      </main>
    </div>
  );
}
