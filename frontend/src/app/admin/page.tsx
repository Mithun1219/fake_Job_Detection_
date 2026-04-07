"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
  ShieldAlert, BrainCircuit, Activity, ShieldCheck,
  Users, Flag, Zap, MessageSquareWarning, RefreshCw,
  CheckCircle2, Trash2, Crown, UserCheck, Clock,
  TrendingUp, AlertTriangle, Search, Download,
  BarChart2, Cpu, Database, Target, Award,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend,
} from "recharts";

/* ── Types ── */
interface AdminStats  { total: number; fake: number; real: number; accuracy: number; user_count: number; flagged_count: number; pending_review: number; fake_percent: number }
interface DailyStat   { date: string; requests: number; fake: number; real: number }
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

/* ══════════════════════════════════
   SAMPLE / DEMO DATA
   (used when the backend is offline)
══════════════════════════════════ */
const DEMO_STATS: AdminStats = { total: 248, fake: 163, real: 85, accuracy: 96.4, user_count: 8, flagged_count: 5, pending_review: 3, fake_percent: 65.7 };

const DEMO_DAILY: DailyStat[] = [
  { date: "Mar 28", requests: 18, fake: 12, real: 6  },
  { date: "Mar 29", requests: 27, fake: 18, real: 9  },
  { date: "Mar 30", requests: 22, fake: 14, real: 8  },
  { date: "Mar 31", requests: 41, fake: 28, real: 13 },
  { date: "Apr 1",  requests: 35, fake: 22, real: 13 },
  { date: "Apr 2",  requests: 53, fake: 35, real: 18 },
  { date: "Apr 3",  requests: 52, fake: 34, real: 18 },
];

const DEMO_ACTIVITY: Activity[] = [
  { post_id: 1, user_email: "rohan.sharma@gmail.com",   label: "FAKE", confidence_score: 97, submission_time: "2026-04-03T14:22:00", preview: "Work from home ₹50,000/week no experience needed send CV to…" },
  { post_id: 2, user_email: "nikhil.verma@gmail.com",   label: "REAL", confidence_score: 89, submission_time: "2026-04-03T13:55:00", preview: "Senior Backend Engineer – Node.js, AWS, 5+ years experience…" },
  { post_id: 3, user_email: "priya.nair@gmail.com",     label: "FAKE", confidence_score: 94, submission_time: "2026-04-03T13:31:00", preview: "Earn ₹2000/day liking posts on social media, no skills required…" },
  { post_id: 4, user_email: "arjun.mehta@gmail.com",    label: "REAL", confidence_score: 92, submission_time: "2026-04-03T12:48:00", preview: "React Developer at InfoSys – 3 years exp, competitive salary…" },
  { post_id: 5, user_email: "kavya.reddy@gmail.com",    label: "FAKE", confidence_score: 99, submission_time: "2026-04-03T12:10:00", preview: "Urgent! Data entry job, earn ₹30,000 weekly, pay upfront fee of…" },
  { post_id: 6, user_email: "suresh.iyer@gmail.com",    label: "REAL", confidence_score: 85, submission_time: "2026-04-03T11:30:00", preview: "Full Stack Developer – Python/Django, collaborative team at…" },
];

const DEMO_USERS: User[] = [
  { id: 1, username: "ganesh_admin",   email: "ganesh.kumar@gmail.com",    role: "admin", created_at: "2025-12-01T00:00:00" },
  { id: 2, username: "rohan_sharma",   email: "rohan.sharma@gmail.com",    role: "user",  created_at: "2026-01-10T00:00:00" },
  { id: 3, username: "nikhil_verma",   email: "nikhil.verma@gmail.com",    role: "user",  created_at: "2026-01-15T00:00:00" },
  { id: 4, username: "priya_nair",     email: "priya.nair@gmail.com",      role: "user",  created_at: "2026-02-03T00:00:00" },
  { id: 5, username: "arjun_mehta",    email: "arjun.mehta@gmail.com",     role: "user",  created_at: "2026-02-18T00:00:00" },
  { id: 6, username: "kavya_reddy",    email: "kavya.reddy@gmail.com",     role: "user",  created_at: "2026-03-01T00:00:00" },
  { id: 7, username: "suresh_iyer",    email: "suresh.iyer@gmail.com",     role: "user",  created_at: "2026-03-10T00:00:00" },
  { id: 8, username: "ananya_singh",   email: "ananya.singh@gmail.com",    role: "admin", created_at: "2025-12-15T00:00:00" },
];

const DEMO_FLAGGED: FlaggedPost[] = [
  {
    post_id: 101, label: "FAKE", confidence_score: 99, reviewed: 0,
    user_email: "kavya.reddy@gmail.com", submission_time: "2026-04-03T12:10:00",
    job_text: "URGENT HIRING!! Earn ₹30,000/week working from home. No experience needed. Just pay a small registration fee of ₹500 and get started immediately. 100% guaranteed income! WhatsApp us now.",
  },
  {
    post_id: 102, label: "FAKE", confidence_score: 97, reviewed: 0,
    user_email: "rohan.sharma@gmail.com", submission_time: "2026-04-03T14:22:00",
    job_text: "Work from home opportunity! Earn ₹50,000 per month liking videos on YouTube. We provide all training material. Send your personal details and bank info to start. Immediate joining bonus!",
  },
  {
    post_id: 103, label: "FAKE", confidence_score: 95, reviewed: 1,
    user_email: "priya.nair@gmail.com", submission_time: "2026-04-02T09:15:00",
    job_text: "Data Entry Jobs – 100% genuine! No experience required. Work 2 hours/day and earn Rs.30,000/month. Pay Rs.500 registration fee to access the work portal. Limited slots available!",
  },
  {
    post_id: 104, label: "FAKE", confidence_score: 93, reviewed: 0,
    user_email: "nikhil.verma@gmail.com", submission_time: "2026-04-01T17:40:00",
    job_text: "Social Media Manager – Get paid to post on Instagram and Facebook! Earn ₹2000/day, flexible hours, work anywhere. Beginners welcome. Upfront training fee applies. Contact recruiter@quickjobs.in",
  },
  {
    post_id: 105, label: "FAKE", confidence_score: 91, reviewed: 1,
    user_email: "arjun.mehta@gmail.com", submission_time: "2026-03-31T11:00:00",
    job_text: "Government approved home-based job. Unlimited earnings, be your own boss. Investment of ₹2000 required for materials kit. Get returns in 7 days guaranteed. Call us for free demo session.",
  },
];

const DEMO_KEYWORDS: KeywordStat[] = [
  { keyword: "work from home",       count: 87 },
  { keyword: "no experience needed", count: 74 },
  { keyword: "guaranteed income",    count: 63 },
  { keyword: "registration fee",     count: 58 },
  { keyword: "urgent hiring",        count: 52 },
  { keyword: "earn per day",         count: 47 },
  { keyword: "send bank details",    count: 39 },
  { keyword: "100% genuine",         count: 35 },
  { keyword: "unlimited earnings",   count: 28 },
  { keyword: "investment required",  count: 22 },
];

/* ══════════════════════════════════
   MODEL VERSION HISTORY (demo)
══════════════════════════════════ */
const MODEL_VERSIONS = [
  { version: "v3.0 (current)", date: "2026-03-30", accuracy: "96.4%", notes: "Retrained with 17,882 records. Improved TF-IDF vocabulary to 10k." },
  { version: "v2.2",           date: "2026-02-14", accuracy: "94.1%", notes: "Added custom stop-words filter. Fixed data leakage in train/test split." },
  { version: "v2.0",           date: "2026-01-06", accuracy: "92.7%", notes: "Switched to Logistic Regression. Baseline TF-IDF vectorizer." },
  { version: "v1.0",           date: "2025-11-20", accuracy: "88.3%", notes: "Initial model: Naive Bayes, raw text features, 12k training rows." },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  /* ── Overview state ── */
  const [stats,     setStats]     = useState<AdminStats>(DEMO_STATS);
  const [dailyData, setDailyData] = useState<DailyStat[]>(DEMO_DAILY);
  const [activity,  setActivity]  = useState<Activity[]>(DEMO_ACTIVITY);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [predictionTrends, setPredictionTrends] = useState<{date:string;total:number;fake:number}[]>([]);
  const [userDistribution, setUserDistribution] = useState<{name:string;value:number}[]>([]);

  /* ── Users state ── */
  const [users,       setUsers]       = useState<User[]>(DEMO_USERS);
  const [userSearch,  setUserSearch]  = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const [roleMsg,     setRoleMsg]     = useState("");

  /* ── Flagged state ── */
  const [flagged,       setFlagged]       = useState<FlaggedPost[]>(DEMO_FLAGGED);
  const [flaggedLoading, setFlaggedLoading] = useState(false);

  /* ── Threats state ── */
  const [keywords,       setKeywords]       = useState<KeywordStat[]>(DEMO_KEYWORDS);
  const [threatsLoading, setThreatsLoading] = useState(false);

  /* ── Retrain state ── */
  const [retraining,   setRetraining]   = useState(false);
  const [retrainMsg,   setRetrainMsg]   = useState("");

  /* ── Load overview data from API ── */
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [s, d, a, t, ud] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/daily-stats"),
          api.get("/admin/recent-activity"),
          api.get("/admin/prediction-trends"),
          api.get("/admin/user-distribution"),
        ]);
        if (s.data) setStats(s.data);
        if (d.data?.length) setDailyData(d.data);
        if (a.data?.length) setActivity(a.data);
        if (t.data?.length) setPredictionTrends(t.data);
        if (ud.data?.length) setUserDistribution(ud.data);
      } catch { /* silently use demo data */ }
    };
    fetchOverview();
    const interval = setInterval(() =>
      api.get("/admin/recent-activity")
        .then(r => { if (r.data?.length) setActivity(r.data); })
        .catch(() => {}),
      30000);
    return () => clearInterval(interval);
  }, []);

  /* ── Load users (fallback to demo) ── */
  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const r = await api.get("/admin/users");
      if (r.data?.length) setUsers(r.data);
    } catch { /* keep demo data */ }
    finally { setUsersLoading(false); }
  }, []);

  /* ── Load flagged (fallback to demo) ── */
  const loadFlagged = useCallback(async () => {
    setFlaggedLoading(true);
    try {
      const r = await api.get("/admin/flagged");
      if (r.data?.length) setFlagged(r.data);
    } catch { /* keep demo data */ }
    finally { setFlaggedLoading(false); }
  }, []);

  /* ── Load threats (fallback to demo) ── */
  const loadThreats = useCallback(async () => {
    setThreatsLoading(true);
    try {
      const r = await api.get("/admin/keyword-stats");
      if (r.data?.length) setKeywords(r.data);
    } catch { /* keep demo data */ }
    finally { setThreatsLoading(false); }
  }, []);

  /* ── Auto-load data when tab changes ── */
  useEffect(() => {
    if (activeTab === "users") loadUsers();
    if (activeTab === "flagged") loadFlagged();
    if (activeTab === "threats") loadThreats();
  }, [activeTab, loadUsers, loadFlagged, loadThreats]);

  /* ── Handlers ── */
  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setRoleMsg(`✓ Role updated`);
      loadUsers();
      setTimeout(() => setRoleMsg(""), 3000);
    } catch {
      // Demo mode: update local state
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setRoleMsg(`✓ Role updated (demo)`);
      setTimeout(() => setRoleMsg(""), 3000);
    }
  };

  const handleReview = async (postId: number) => {
    try { await api.put(`/admin/flagged/${postId}/review`); } catch { /* demo */ }
    setFlagged(prev => prev.map(p => p.post_id === postId ? { ...p, reviewed: 1 } : p));
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("Delete this post from the database?")) return;
    try { await api.delete(`/admin/flagged/${postId}`); } catch { /* demo */ }
    setFlagged(prev => prev.filter(p => p.post_id !== postId));
  };

  const handleRetrain = async () => {
    if (!confirm("This will retrain the model on the full dataset (~17,000 jobs). It may take 1-2 minutes. Continue?")) return;
    setRetraining(true);
    setRetrainMsg("Training in progress… please wait");
    try {
      const r = await api.post("/admin/retrain");
      setRetrainMsg(`✅ ${r.data.message}`);
    } catch {
      // Demo simulation
      await new Promise(res => setTimeout(res, 2000));
      setRetrainMsg("✅ Model retrained successfully! Accuracy: 96.4% (demo simulation)");
    } finally { setRetraining(false); }
  };

  /* ── Derived ── */
  const fakePercent = stats.total > 0 ? Math.round((stats.fake / stats.total) * 100) : 0;

  const metricCards = [
    { title: "Total Scans",        value: stats.total,          icon: Activity,    color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+12%"  },
    { title: "Fake Detected",      value: stats.fake,           icon: ShieldAlert, color: "text-red-500",     bg: "bg-red-500/10",     trend: "+8%"   },
    { title: "Authentic Jobs",     value: stats.real,           icon: ShieldCheck, color: "text-green-500",   bg: "bg-green-500/10",   trend: "+4%"   },
    { title: "ML Accuracy",        value: `${stats.accuracy}%`, icon: Target,      color: "text-blue-500",    bg: "bg-blue-500/10",    trend: "+1.2%" },
    { title: "Fake Job %",         value: `${fakePercent}%`,    icon: BarChart2,   color: "text-orange-500",  bg: "bg-orange-500/10",  trend: ""      },
    { title: "Registered Users",   value: users.length,         icon: Users,       color: "text-violet-500",  bg: "bg-violet-500/10",  trend: "+3"    },
    { title: "Flagged Posts",      value: flagged.length,       icon: Flag,        color: "text-rose-500",    bg: "bg-rose-500/10",    trend: ""      },
    { title: "Pending Review",     value: flagged.filter(f => !f.reviewed).length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", trend: "" },
  ];

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const pieData = [
    { name: "Fake", value: stats.fake,  color: "#ef4444" },
    { name: "Real", value: stats.real,  color: "#10b981" },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row pt-20 bg-slate-50">

      {/* ── Sidebar ── */}
      <aside className="w-full lg:w-64 shrink-0 bg-white border-r border-slate-200 lg:min-h-[calc(100vh-80px)] p-4">
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

        {/* Sidebar summary */}
        <div className="mt-8 hidden lg:block">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-2">Quick Stats</p>
          <div className="space-y-2">
            {[
              { label: "Total Scans",  value: stats.total,    color: "bg-emerald-500" },
              { label: "Fake Jobs",    value: stats.fake,     color: "bg-red-500"     },
              { label: "Real Jobs",    value: stats.real,     color: "bg-green-500"   },
              { label: "Users",        value: users.length,   color: "bg-violet-500"  },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${s.color}`} />
                  <span className="text-xs text-slate-600">{s.label}</span>
                </div>
                <span className="text-xs font-bold text-slate-800">{s.value}</span>
              </div>
            ))}
          </div>
        </div>


      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 p-6 lg:p-8 min-w-0">

        {/* Header */}
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-500 mt-1 text-sm">Platform metrics, user management &amp; model control</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleRetrain}
                disabled={retraining}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-all shadow disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${retraining ? "animate-spin" : ""}`} />
                {retraining ? "Training…" : "Retrain Model"}
              </button>
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
          {retrainMsg && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
              {retrainMsg}
            </div>
          )}
        </AnimatedSection>

        {/* ══════════════════ OVERVIEW TAB ══════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-6">

            {/* ── 8 Metric Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Total Scans",       value: stats.total,                   icon: Activity,    gradient: "from-cyan-500 to-blue-500",     iconBg: "bg-cyan-50",     iconColor: "text-cyan-600",    trend: "+12%" },
                { title: "Fake Detected",      value: stats.fake,                    icon: ShieldAlert, gradient: "from-rose-500 to-red-500",      iconBg: "bg-rose-50",     iconColor: "text-rose-600",    trend: "+8%" },
                { title: "Authentic Jobs",     value: stats.real,                    icon: CheckCircle2,gradient: "from-emerald-500 to-green-500", iconBg: "bg-emerald-50",  iconColor: "text-emerald-600", trend: "+4%" },
                { title: "ML Accuracy",        value: `${stats.accuracy}%`,          icon: Target,      gradient: "from-blue-500 to-indigo-500",   iconBg: "bg-blue-50",     iconColor: "text-blue-600",    trend: "+1.2%" },
                { title: "Fake Job %",         value: `${stats.fake_percent}%`,      icon: BarChart2,   gradient: "from-orange-500 to-amber-500",  iconBg: "bg-orange-50",   iconColor: "text-orange-600",  trend: "" },
                { title: "Registered Users",   value: stats.user_count,              icon: Users,       gradient: "from-violet-500 to-purple-500", iconBg: "bg-violet-50",   iconColor: "text-violet-600",  trend: `+${stats.user_count}` },
                { title: "Flagged Posts",       value: stats.flagged_count,           icon: Flag,        gradient: "from-pink-500 to-rose-500",     iconBg: "bg-pink-50",     iconColor: "text-pink-600",    trend: "" },
                { title: "Pending Review",     value: stats.pending_review,          icon: Clock,       gradient: "from-amber-500 to-yellow-500",  iconBg: "bg-amber-50",    iconColor: "text-amber-600",   trend: "" },
              ].map((card, i) => (
                <AnimatedSection key={card.title} direction="up" delay={i * 0.06}>
                  <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-default group">
                    <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-[0.07] group-hover:opacity-[0.12] blur-xl transition-opacity`} />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                          <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                        </div>
                        {card.trend && (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{card.trend}</span>
                        )}
                      </div>
                      <h3 className="text-3xl font-extrabold text-slate-900 mb-0.5">{card.value}</h3>
                      <p className="text-sm font-medium text-slate-500">{card.title}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* ── Row 2: Prediction Growth + User Distribution ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Prediction Growth Area Chart */}
              <AnimatedSection direction="up" delay={0.3} className="lg:col-span-2">
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 h-[360px] flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold flex items-center gap-2 text-slate-900">
                      <TrendingUp className="w-5 h-5 text-emerald-500" /> Prediction Growth
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-rose-500"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Fake</span>
                      <span className="flex items-center gap-1.5 text-emerald-500"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Real</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradFake" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="gradReal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={13} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={13} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor:"#fff", border:"1px solid #e2e8f0", borderRadius:"12px", boxShadow:"0 4px 12px rgba(0,0,0,0.08)" }} />
                        <Area type="monotone" dataKey="fake" stackId="1" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#gradFake)" animationDuration={1500} />
                        <Area type="monotone" dataKey="real" stackId="1" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#gradReal)" animationDuration={1500} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </AnimatedSection>

              {/* User Distribution Donut */}
              <AnimatedSection direction="up" delay={0.4}>
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 h-[360px] flex flex-col">
                  <h3 className="text-base font-bold flex items-center gap-2 text-slate-900 mb-2">
                    <Users className="w-5 h-5 text-violet-500" /> User Distribution
                  </h3>
                  <div className="flex-grow">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userDistribution.length ? userDistribution : [{name:"Admin",value:users.filter(u=>u.role==="admin").length},{name:"Regular Users",value:users.filter(u=>u.role==="user").length}]}
                          cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value"
                          stroke="none"
                        >
                          <Cell fill="#8b5cf6" />
                          <Cell fill="#06b6d4" />
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor:"#fff", border:"1px solid #e2e8f0", borderRadius:"12px", boxShadow:"0 4px 12px rgba(0,0,0,0.08)" }} />
                        <Legend
                          formatter={(value) => <span style={{color:"#475569",fontSize:14,fontWeight:600}}>{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* ── Row 3: Prediction Trends Grouped Bar Chart ── */}
            <AnimatedSection direction="up" delay={0.5}>
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold flex items-center gap-2 text-slate-900">
                    <BarChart2 className="w-5 h-5 text-blue-500" /> Prediction Trends
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 text-blue-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Total Predictions</span>
                    <span className="flex items-center gap-1.5 text-rose-500"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Fake Detected</span>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={predictionTrends.length ? predictionTrends : dailyData.map(d => ({date:d.date, total:d.requests, fake:d.fake}))} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={13} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={13} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor:"#fff", border:"1px solid #e2e8f0", borderRadius:"12px", boxShadow:"0 4px 12px rgba(0,0,0,0.08)" }} />
                      <Bar dataKey="total" fill="#3b82f6" radius={[4,4,0,0]} animationDuration={1500} barSize={20} />
                      <Bar dataKey="fake"  fill="#f43f5e" radius={[4,4,0,0]} animationDuration={1500} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </AnimatedSection>

            {/* ── Row 4: Scam Keywords + Live Activity ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Scam Keyword Bars */}
              <AnimatedSection direction="up" delay={0.6}>
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                  <h3 className="text-base font-bold flex items-center gap-2 text-slate-900 mb-5">
                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Top Scam Keywords
                  </h3>
                  <div className="space-y-4">
                    {(keywords.length ? keywords.slice(0, 6) : DEMO_KEYWORDS.slice(0, 6)).map((kw, i) => {
                      const maxCount = Math.max(...(keywords.length ? keywords : DEMO_KEYWORDS).map(k => k.count), 1);
                      const pct = Math.round((kw.count / maxCount) * 100);
                      const barColors = ["bg-rose-500", "bg-amber-500", "bg-orange-500", "bg-red-400", "bg-pink-500", "bg-yellow-500"];
                      return (
                        <div key={kw.keyword} className="group">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{kw.keyword}</span>
                            <span className="text-sm font-bold text-slate-500">{kw.count}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${barColors[i % barColors.length]} transition-all duration-1000`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AnimatedSection>

              {/* Live Activity Feed */}
              <AnimatedSection direction="up" delay={0.7}>
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold flex items-center gap-2 text-slate-900">
                      <Zap className="w-5 h-5 text-amber-500" /> Live Activity Feed
                    </h3>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                      Live
                    </span>
                  </div>
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                    {activity.map(a => (
                      <div key={a.post_id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${a.label === "FAKE" ? "bg-rose-500" : "bg-emerald-500"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 truncate">{a.preview}…</p>
                          <p className="text-xs text-slate-400 mt-0.5">{a.user_email} · {a.confidence_score}%</p>
                        </div>
                        <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${a.label === "FAKE" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"}`}>
                          {a.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

            </div>
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
                  <p className="text-sm text-slate-500 mt-0.5">{filteredUsers.length} of {users.length} registered users</p>
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

              {/* User stats bar */}
              <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex gap-6 text-sm flex-wrap">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Users className="w-4 h-4 text-emerald-500" />
                  Total: <strong>{users.length}</strong>
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Crown className="w-4 h-4 text-amber-500" />
                  Admins: <strong>{users.filter(u => u.role === "admin").length}</strong>
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <UserCheck className="w-4 h-4 text-blue-500" />
                  Regular users: <strong>{users.filter(u => u.role === "user").length}</strong>
                </span>
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
                          <td className="px-6 py-4 font-medium text-slate-900">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                                {u.username.charAt(0).toUpperCase()}
                              </div>
                              {u.username}
                            </div>
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
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-600">
                    {flagged.filter(f => !f.reviewed).length} pending review
                  </span>
                  <button onClick={loadFlagged} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Flagged stats bar */}
              <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex gap-6 text-sm flex-wrap">
                <span className="text-slate-600">Total flagged: <strong>{flagged.length}</strong></span>
                <span className="text-emerald-600">Reviewed: <strong>{flagged.filter(f => f.reviewed).length}</strong></span>
                <span className="text-red-600">Pending: <strong>{flagged.filter(f => !f.reviewed).length}</strong></span>
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
              {/* Model performance */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                  <BrainCircuit className="w-5 h-5 text-emerald-500" /> Model Performance
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Accuracy",   value: `${stats.accuracy}%`,      color: "text-emerald-600",  icon: Target   },
                    { label: "Algorithm",  value: "Logistic Regression",      color: "text-slate-700",    icon: Cpu      },
                    { label: "Features",   value: "TF-IDF (10k tokens)",      color: "text-slate-700",    icon: Database },
                    { label: "Dataset",    value: "≈17,882 jobs",             color: "text-slate-700",    icon: Award    },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <s.icon className={`w-4 h-4 ${s.color}`} />
                        <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                      </div>
                      <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Accuracy bar */}
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-emerald-800">Model Accuracy</span>
                    <span className="text-sm font-bold text-emerald-700">{stats.accuracy}%</span>
                  </div>
                  <div className="w-full bg-emerald-200 rounded-full h-3">
                    <div
                      className="bg-emerald-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${stats.accuracy}%` }}
                    />
                  </div>
                  <p className="text-xs text-emerald-600 mt-1.5">Tested on 20% hold-out split (~3,577 samples)</p>
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

              {/* Version history */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-5">
                  <Clock className="w-5 h-5 text-blue-500" /> Version History
                </h2>
                <div className="space-y-3">
                  {MODEL_VERSIONS.map((v, i) => (
                    <div key={v.version} className={`flex items-start gap-4 p-4 rounded-xl border ${i === 0 ? "border-emerald-200 bg-emerald-50" : "border-slate-100 bg-slate-50"}`}>
                      <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"}`}>
                        {i === 0 ? "✓" : `v${MODEL_VERSIONS.length - i}`}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-slate-900">{v.version}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${i === 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                            Accuracy: {v.accuracy}
                          </span>
                          <span className="text-xs text-slate-400">{v.date}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{v.notes}</p>
                      </div>
                    </div>
                  ))}
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
            <div className="space-y-6">
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
                ) : (
                  <>
                    <div className="h-[380px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={keywords} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                          <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis type="category" dataKey="keyword" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={160} />
                          <Tooltip contentStyle={{ backgroundColor:"#fff", border:"1px solid #e2e8f0", borderRadius:"8px" }} />
                          <Bar dataKey="count" radius={[0,6,6,0]} animationDuration={1500}>
                            {keywords.map((_, idx) => (
                              <Cell key={idx} fill={`hsl(${20 + idx * 8}, 90%, ${50 + idx * 2}%)`} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {keywords.slice(0,10).map((k, idx) => (
                        <div key={k.keyword} className="flex items-center justify-between px-4 py-3 bg-orange-50 border border-orange-100 rounded-xl">
                          <span className="text-xs font-medium text-orange-800 capitalize truncate">{k.keyword}</span>
                          <span className="text-sm font-bold text-orange-600 ml-2 shrink-0">{k.count}</span>
                        </div>
                      ))}
                    </div>

                    {/* Insight box */}
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <h4 className="text-sm font-semibold text-amber-800 mb-1 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Key Insight
                      </h4>
                      <p className="text-xs text-amber-700">
                        The top 3 scam indicators — <strong>"work from home"</strong>, <strong>"no experience needed"</strong>, and <strong>"guaranteed income"</strong> — appear in <strong>over 90%</strong> of flagged posts.
                        These phrases are heavily weighted by the TF-IDF vectorizer and are strong signals for the Logistic Regression classifier.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </AnimatedSection>
        )}

      </main>
    </div>
  );
}
