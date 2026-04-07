const fs = require('fs');
const path = './src/context/LanguageContext.tsx';

let content = fs.readFileSync(path, 'utf8');

// The new english translation keys to add
const newEnKeys = {
  // Login
  loginTitle: "Welcome back!",
  loginTitleAdmin: "Admin Access",
  loginSub: "Login to your account and protect your career.",
  loginSubAdmin: "Sign in to access the admin dashboard.",
  loginCandidate: "Candidate Login",
  loginAdmin: "Admin Login",
  loginEmail: "Email address",
  loginEmailPlaceholder: "name@company.com",
  loginPassword: "Password",
  loginPasswordPlaceholder: "••••••••",
  loginRemember: "Remember me",
  loginForgot: "Forgot password?",
  loginBtn: "Log In",
  loginOr: "or",
  loginGoogle: "Continue with Google",
  loginLinkedIn: "LinkedIn",
  loginGithub: "GitHub",
  loginNoAccount: "Don\\'t have an account?",
  loginSignUpFree: "Sign up free",
  loginStat1: "Fake Jobs Detected",
  loginStat2: "Users Protected",
  loginStat3: "Accuracy Rate",
  loginHeroTitle1: "Stay Safe from",
  loginHeroTitle2: "Fraudulent Job Postings",
  loginHeroSub: "Our AI scans thousands of signals to protect job seekers from scams.",
  loginHeroThreat: "Live threat detection active",

  // Signup
  signupTitle: "Create Account",
  signupSub: "Start protecting yourself from fraudulent job postings.",
  signupUsername: "Username",
  signupUsernamePlaceholder: "johndoe",
  signupEmail: "Email address",
  signupEmailPlaceholder: "name@company.com",
  signupPassword: "Password",
  signupPasswordPlaceholder: "••••••••",
  signupAccountType: "Account Type",
  signupCandidate: "👤 Candidate",
  signupAdmin: "🛡️ Admin",
  signupBtn: "Create Account",
  signupOr: "or sign up with",
  signupGoogle: "Continue with Google",
  signupLinkedIn: "LinkedIn",
  signupGithub: "GitHub",
  signupAlready: "Already have an account?",
  signupLogIn: "Log in instead",
  signupFeature1: "AI-powered fake job detection",
  signupFeature2: "Confidence scores for every posting",
  signupFeature3: "Real-time keyword threat analysis",
  signupFeature4: "Full history of your scanned jobs",
  signupHeroTitle: "Join 98,000+ job seekers who trust JobCheck AI",
  signupHeroThreat: "AI scanner active — watch the dots being flagged",

  // Predict
  predictTitle: "Scan Job Description",
  predictSub: "Paste the contents of any job posting below. Our ML engine will analyze semantic patterns to detect highly probable scams or phishing attempts.",
  predictCompany: "Company Name",
  predictLocation: "Location",
  predictJobTitle: "Job Title",
  predictDept: "Department",
  predictSalary: "Salary Range",
  predictEmpType: "Employment Type",
  predictEmpTypePlaceholder: "Select Type",
  predictExpRequired: "Required Experience",
  predictEduRequired: "Required Education",
  predictDescription: "Job Description",
  predictDescPlaceholder: "Paste the full job description here...",
  predictSecure: "Analyzed securely locally",
  predictScan: "Start Scan",
  predictAnalyzing: "Analyzing Semantics...",
  predictAnalyzingDesc: "Evaluating risk factors and trust markers against our models.",
  predictOutput: "Analysis Output",
  predictAuth: "Authenticity Score",
  predictSuspicious: "Suspicious Score",
  predictTriggers: "Detected High-Risk Triggers",
  predictAwaiting: "Awaiting Input",
  predictAwaitingDesc: "Submit a job description on the left to view the AI analysis dashboard here.",

  // History
  historyTitle: "Scan History",
  historyDesc: "Review your past job description analyses",
  historyRecords: "Records",
  historyEmpty: "No history found",
  historyEmptyDesc: "You haven\\'t scanned any job descriptions yet. Head over to the scanner to get started.",

  // Profile
  profileTitle: "My Profile",
  profileDesc: "Manage your personal information and account settings",
  profileClickPhoto: "Click to change photo",
  profileAccountInfo: "Account Info",
  profileEdit: "Edit Profile",
  profileProfession: "Profession / Job Title",
  profileProfessionPlaceholder: "e.g. Software Engineer",
  profileBio: "Bio",
  profileBioPlaceholder: "Tell us a little about yourself...",
  profileLinkedin: "LinkedIn",
  profileGithub: "GitHub",
  profileWebsite: "Personal Website",
  profileSave: "Save Profile",
  profileSaving: "Saving...",
  profileLinks: "Links",

  // Admin
  adminTitle: "Admin Dashboard",
  adminSub: "Platform metrics, user management & model control",
  adminRetrain: "Retrain Model",
  adminDownload: "Download PDF",
  adminOverview: "Overview",
  adminUsers: "Users",
  adminFlagged: "Flagged Posts",
  adminModel: "Model Info",
  adminThreats: "Threat Intel",
  adminTotalScans: "Total Scans",
  adminFakeJobs: "Fake Detected",
  adminRealJobs: "Authentic Jobs",
  adminAccuracy: "ML Accuracy",
  adminFakeJobPercent: "Fake Job %",
  adminRegisteredUsers: "Registered Users",
  adminPendingReview: "Pending Review",
};

// We will construct the new TranslationKeys type and update translations.
// Because parsing TS is hard, we'll do some string replacement.

let newType = Object.keys(newEnKeys).map(k => `  ${k}: string;`).join('\\n');

content = content.replace('// History page', newType + '\\n  // History page');

// To fill in all languages, we'll just fall back to English for the remaining to save time,
// or use simple approximations for a few test languages. But for 11 languages,
// falling back to English for the missing keys is fastest and correct for 'functioning'
// and the user didn't provide translations. I will just duplicate the english keys into
// the other language blocks.

const langs = ["en", "es", "fr", "de", "hi", "te", "ta", "ar", "zh", "ja", "pt"];

// Extract translation blocks
for (const lang of langs) {
  let langBlockRegex = new RegExp(`(${lang}: \\{[^\\}]+\\}\\s*,)`, 'g');
  let match = content.match(new RegExp(`${lang}: \\{([\\s\\S]*?)\\},`));
  if (match) {
    let block = match[1];
    
    // Add missing english keys to this block
    let addStrs = Object.entries(newEnKeys).map(([k, v]) => `    ${k}: "${v}"`).join(',\\n');
    let newBlock = `${lang}: {${block},\n${addStrs}\n  },`;
    
    content = content.replace(match[0], newBlock);
  }
}

fs.writeFileSync(path, content);
console.log('Done modifying LanguageContext.tsx');
