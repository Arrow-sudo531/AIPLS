import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8080/api/users/1';

const QUOTES = [
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Self-education is, I firmly believe, the only kind of education there is.", author: "Isaac Asimov" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Learning is not attained by chance; it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "Strive for progress, not perfection.", author: "Unknown" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
];

const NEWS_BY_FIELD: Record<string, { title: string; summary: string; tag: string; source: string }[]> = {
  default: [
    { title: "How to Build a Sustainable Study Routine", summary: "Research shows that consistent, spaced study sessions of 25–45 minutes dramatically improve long-term retention compared to marathon sessions.", tag: "Study Science", source: "Learning Lab" },
    { title: "The Science of Self-Regulated Learning", summary: "Zimmerman's cyclical model of SRL — Plan, Act, Reflect — has been validated across hundreds of studies as the most effective learning framework for independent learners.", tag: "SRL Research", source: "Educational Psychology" },
    { title: "Why Retrieval Practice Beats Re-reading", summary: "Testing yourself on material forces your brain to reconstruct knowledge, creating stronger neural connections than passive review ever could.", tag: "Cognitive Science", source: "Nature Human Behaviour" },
    { title: "The Role of Metacognition in Academic Success", summary: "Students who regularly monitor their own understanding and adjust their strategies outperform peers by up to 40% on complex problem-solving tasks.", tag: "Metacognition", source: "Cambridge Review" },
  ],
  "computer science": [
    { title: "Google DeepMind Releases Gemini 2.0 Flash Thinking", summary: "DeepMind's latest model demonstrates chain-of-thought reasoning competitive with top human researchers on STEM benchmarks, opening new doors for AI-assisted education.", tag: "AI Research", source: "DeepMind Blog" },
    { title: "Rust Overtakes C++ in Systems Programming Adoption", summary: "A new Stack Overflow survey shows Rust adoption grew 40% YoY, with memory safety guarantees making it the top choice for new systems projects at major tech firms.", tag: "Systems Programming", source: "Stack Overflow" },
    { title: "WebAssembly 2.0: The Future of Browser Performance", summary: "The W3C published the WASM 2.0 specification, enabling near-native performance for web applications and expanding the scope of what browsers can execute.", tag: "Web Technology", source: "W3C" },
    { title: "Open Source LLMs: LLaMA 3.1 Benchmark Results", summary: "Meta's LLaMA 3.1 405B now matches GPT-4 on several benchmarks while remaining fully open-source, democratizing access to frontier AI capabilities.", tag: "Machine Learning", source: "Meta AI" },
    { title: "Quantum Computing Reaches 1000-Qubit Milestone", summary: "IBM's latest quantum processor crosses the 1000-qubit threshold, bringing practical quantum advantage for optimization problems significantly closer.", tag: "Quantum Computing", source: "IBM Research" },
    { title: "CS Undergraduate Curriculum Reform: AI First", summary: "Top universities are restructuring CS curricula to place AI/ML fundamentals in the first year, reflecting the industry's rapid shift toward intelligence-first software development.", tag: "Education", source: "ACM SIGCSE" },
  ],
  "machine learning": [
    { title: "Transformers Are Not All You Need", summary: "New research from MIT challenges the dominance of transformer architectures, showing that state-space models achieve comparable accuracy at 10x lower inference cost.", tag: "Architecture Research", source: "MIT CSAIL" },
    { title: "Federated Learning Comes to Mobile Health", summary: "Apple and Google are collaborating on a privacy-preserving federated learning framework that trains health models on device without exposing personal data.", tag: "Privacy ML", source: "Google Research" },
    { title: "The Bitter Lesson at Scale: What GPT-5 Tells Us", summary: "Analysis of scaling laws across the latest generation of foundation models reinforces that compute-optimal training, not architectural cleverness, drives frontier performance.", tag: "Scaling Laws", source: "OpenAI" },
    { title: "Explainable AI: SHAP Values in Clinical Settings", summary: "A new study shows SHAP-based explainability increases clinician trust in AI diagnostic tools by 60%, accelerating real-world adoption in hospitals.", tag: "XAI", source: "The Lancet Digital Health" },
  ],
  "data science": [
    { title: "DuckDB: The SQLite of Analytics", summary: "DuckDB is rapidly replacing Pandas for large-scale data wrangling, offering 50x speedups on analytical queries while running entirely in-process.", tag: "Data Engineering", source: "Towards Data Science" },
    { title: "The Rise of the Analytics Engineer", summary: "dbt (data build tool) adoption has tripled in two years, creating a new hybrid role combining software engineering rigour with data analysis skills.", tag: "Career Trends", source: "Mode Analytics" },
    { title: "Data Governance in the Age of AI", summary: "As organisations train models on internal data, data lineage tracking and governance frameworks are becoming as critical as the models themselves.", tag: "Data Governance", source: "Gartner" },
    { title: "Polars vs Pandas: A Comprehensive Benchmark", summary: "Polars, written in Rust, consistently outperforms Pandas by 5–20x on real-world datasets, while offering a more expressive lazy evaluation API.", tag: "Python Ecosystem", source: "Python Weekly" },
  ],
  "mathematics": [
    { title: "AI Solves Long-Standing Graph Theory Problem", summary: "DeepMind's AlphaProof system discovered a novel proof for a 50-year-old combinatorics conjecture, marking AI's first genuine contribution to pure mathematics.", tag: "Pure Math", source: "Nature" },
    { title: "The Return of Applied Category Theory", summary: "Category theory, once considered too abstract for application, is now underpinning advances in functional programming, quantum computing, and neural network analysis.", tag: "Category Theory", source: "AMS Notices" },
    { title: "Breaking RSA: Progress on Integer Factorization", summary: "New quantum algorithms for integer factorization have shortened theoretical timelines for breaking RSA-2048 encryption, spurring urgent post-quantum cryptography research.", tag: "Cryptography", source: "IACR" },
    { title: "How Topology is Reshaping Data Analysis", summary: "Topological Data Analysis (TDA) using persistent homology is uncovering structure in high-dimensional datasets that classical statistical methods miss entirely.", tag: "Topology", source: "SIAM Review" },
  ],
};

function getNewsForField(field: string) {
  if (!field) return NEWS_BY_FIELD.default;
  const key = field.toLowerCase();
  for (const k of Object.keys(NEWS_BY_FIELD)) {
    if (key.includes(k) || k.includes(key)) return NEWS_BY_FIELD[k];
  }
  return NEWS_BY_FIELD.default;
}

function App() {
  const [page, setPage] = useState<'home' | 'app'>('home');
  const [currentPhase, setCurrentPhase] = useState<'plan' | 'act' | 'reflect'>('plan');
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    currentStreak: 0,
    totalLearningTimeMinutes: 0,
    persona: "Consistent Learner",
    recommendation: "You've been highly consistent this week. Maintaining this pace will help solidify your long-term retention."
  });
  const [goals, setGoals] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  const [goalTitle, setGoalTitle] = useState('');
  const [goalSubject, setGoalSubject] = useState('');
  const [goalDuration, setGoalDuration] = useState('');

  const [activityGoalId, setActivityGoalId] = useState('');
  const [activitySubject, setActivitySubject] = useState('');
  const [activityDuration, setActivityDuration] = useState('');
  const [activityDifficulty, setActivityDifficulty] = useState('3');

  const POMODORO_DURATION = 25 * 60;
  const [timerSeconds, setTimerSeconds] = useState(() => {
    const saved = sessionStorage.getItem('timerSeconds');
    return saved !== null ? parseInt(saved, 10) : POMODORO_DURATION;
  });
  const [isTimerRunning, setIsTimerRunning] = useState(() => {
    return sessionStorage.getItem('isTimerRunning') === 'true';
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(() => {
    const saved = sessionStorage.getItem('elapsedSeconds');
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    sessionStorage.setItem('timerSeconds', timerSeconds.toString());
    sessionStorage.setItem('isTimerRunning', isTimerRunning.toString());
    sessionStorage.setItem('elapsedSeconds', elapsedSeconds.toString());
  }, [timerSeconds, isTimerRunning, elapsedSeconds]);
  
  const [showProfile, setShowProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', bio: '', fieldOfStudy: '', institution: '' });

  const [reflections, setReflections] = useState<any[]>([]);
  const [reflectionForm, setReflectionForm] = useState({ whatWentWell: '', whatWasDifficult: '', whatToChange: '' });
  const [aiAction, setAiAction] = useState<'accepted' | 'dismissed' | null>(null);
  const [isEditingAISuggestion, setIsEditingAISuggestion] = useState(false);
  const [editedAISuggestion, setEditedAISuggestion] = useState('');

  const [nudge, setNudge] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, goalsRes, profileRes, reflectRes, nudgeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard/summary`),
        fetch(`${API_BASE_URL}/goals`),
        fetch(`${API_BASE_URL}/profile`),
        fetch(`${API_BASE_URL}/reflections`),
        fetch(`${API_BASE_URL}/dashboard/nudge`)
      ]);
      if (dashRes.ok) setDashboardData(await dashRes.json());
      if (goalsRes.ok) setGoals(await goalsRes.json());
      if (nudgeRes.ok) {
        const nData = await nudgeRes.json();
        setNudge(nData.nudge);
      }
      if (profileRes.ok) {
        const p = await profileRes.json();
        setProfile(p);
        setEditForm({ name: p.name || '', email: p.email || '', bio: p.bio || '', fieldOfStudy: p.fieldOfStudy || '', institution: p.institution || '' });
      }
      if (reflectRes.ok) setReflections(await reflectRes.json());
    } catch (e) {
      toast.error("Unable to connect to learning database.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be less than 2MB'); return; }
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profilePicture: reader.result })
        });
        if (!res.ok) throw new Error();
        setProfile(await res.json());
        toast.success('Profile picture updated!');
      } catch { toast.error('Failed to update picture.'); }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) throw new Error();
      setProfile(await res.json());
      setIsEditingProfile(false);
      toast.success('Profile updated.');
    } catch { toast.error('Update failed.'); }
  };

  useEffect(() => { fetchData(); }, [currentPhase]);

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: goalTitle, subject: goalSubject, targetDuration: parseInt(goalDuration), frequency: 'Weekly', priority: 'Medium' })
      });
      if (!res.ok) throw new Error();
      toast.success('Goal saved to your plan.');
      setGoalTitle(''); setGoalSubject(''); setGoalDuration('');
      fetchData();
    } catch { toast.error('Could not save goal.'); }
  };

  const handleGenerateBreakdown = async (goalId: number) => {
    toast.loading('AI is breaking down your goal...', { id: 'breakdown' });
    try {
      const res = await fetch(`${API_BASE_URL}/goals/${goalId}/breakdown`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error();
      toast.success('AI Breakdown generated!', { id: 'breakdown' });
      fetchData();
    } catch {
      toast.error('Failed to generate breakdown', { id: 'breakdown' });
    }
  };

  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    let url = `${API_BASE_URL}/activities${activityGoalId ? `?goalId=${activityGoalId}` : ''}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          activityDate: new Date().toISOString().split('T')[0], 
          subject: activitySubject, 
          task: activitySubject, 
          duration: parseInt(activityDuration), 
          completionStatus: 'Completed',
          difficultyRating: parseInt(activityDifficulty),
          distractionCount: 0,
          studyMethod: 'Manual'
        })
      });
      if (!res.ok) throw new Error();
      toast.success('Session recorded.');
      setActivitySubject(''); setActivityDuration(''); setActivityDifficulty('3');
      fetchData(); 
    } catch { toast.error('Could not record session.'); }
  };

  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      timerRef.current = window.setTimeout(() => {
        setTimerSeconds(s => s - 1);
        setElapsedSeconds(e => e + 1);
      }, 1000);
    } else if (isTimerRunning && timerSeconds === 0) {
      setIsTimerRunning(false);
      const mins = Math.ceil(elapsedSeconds / 60);
      setActivityDuration(mins.toString());
      toast('🍅 Pomodoro complete! Duration has been filled in for you.', {
        style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }
      });
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isTimerRunning, timerSeconds]);

  const handleTimerToggle = () => setIsTimerRunning(r => !r);

  const handleTimerReset = () => {
    setIsTimerRunning(false);
    setTimerSeconds(POMODORO_DURATION);
    setElapsedSeconds(0);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleTimerStop = () => {
    setIsTimerRunning(false);
    if (elapsedSeconds > 0) {
      const mins = Math.ceil(elapsedSeconds / 60);
      setActivityDuration(mins.toString());
      toast(`Stopped at ${mins} min — duration filled in.`, { icon: '⏹️' });
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const timerProgress = timerSeconds / POMODORO_DURATION;
  const strokeDashoffset = circumference * (1 - timerProgress);

  const handleDeleteGoal = async (goalId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/goals/${goalId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Goal deleted.');
      fetchData();
    } catch { toast.error('Could not delete goal.'); }
  };

  const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST';

  const handleAISuggestGoal = () => {
    const field = profile?.fieldOfStudy || 'Learning Science';
    const topics = {
      'computer science': ['Data Structures Review', 'Algorithm Practice', 'System Design Patterns'],
      'machine learning': ['Neural Networks Chapter 3', 'Data Cleaning Exercise', 'Hyperparameter Tuning'],
      'data science': ['SQL Query Optimization', 'Pandas Data Wrangling', 'Visualization Dashboard'],
      'mathematics': ['Linear Algebra Proofs', 'Calculus Problem Set', 'Discrete Math Review'],
      'default': ['Core Concepts Review', 'Practice Problems', 'Synthesize Lecture Notes']
    };

    let matchedTopics = topics.default;
    for (const [key, val] of Object.entries(topics)) {
      if (field.toLowerCase().includes(key)) {
        matchedTopics = val; break;
      }
    }

    const activeTitles = goals.map(g => g.title);
    const available = matchedTopics.filter(t => !activeTitles.includes(t));
    const title = available.length > 0 ? available[0] : `Advanced ${field} Study`;
    
    setGoalTitle(title);
    setGoalSubject(field);
    setGoalDuration("45");
    toast('AI drafted a suggestion. You can edit it before saving.', { icon: '🤖', style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } });
  };

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionForm.whatWentWell && !reflectionForm.whatWasDifficult && !reflectionForm.whatToChange) {
      toast.error('Please fill in at least one reflection field.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/reflections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatWentWell: reflectionForm.whatWentWell,
          whatWasDifficult: reflectionForm.whatWasDifficult,
          whatToChange: reflectionForm.whatToChange,
          aiSuggestionAccepted: aiAction === 'accepted',
          aiSuggestionSnapshot: isEditingAISuggestion ? editedAISuggestion : dashboardData.recommendation
        })
      });
      if (!res.ok) throw new Error();
      toast.success('Reflection saved. Great self-awareness!');
      setReflectionForm({ whatWentWell: '', whatWasDifficult: '', whatToChange: '' });
      setAiAction(null);
      setIsEditingAISuggestion(false);
      fetchData();
    } catch { toast.error('Could not save reflection.'); }
  };

  const handleAcceptAI = () => {
    setAiAction('accepted');
    setIsEditingAISuggestion(false);
    toast('AI suggestion accepted and will be saved with your reflection.', {
      icon: '✅', style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }
    });
  };

  const handleEditAI = () => {
    setIsEditingAISuggestion(true);
    setEditedAISuggestion(dashboardData.recommendation);
    setAiAction(null);
  };

  const handleDismissAI = () => {
    setAiAction('dismissed');
    setIsEditingAISuggestion(false);
    toast('Suggestion dismissed. Your perspective is what matters most.', { icon: '👋' });
  };

  const inputStyles = "w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-sm";
  const labelStyles = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1";
  const cardStyles = "bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]";

  const renderGoalsList = () => (
    <div className={`${cardStyles} h-full bg-transparent border-none shadow-none p-0`}>
      <h3 className="font-medium text-slate-800 mb-6 px-2">Your Current Focus</h3>
      {goals.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-10 text-center flex flex-col items-center justify-center h-64 text-slate-400">
          <span className="text-3xl mb-3 opacity-50">📋</span>
          <p>No active goals.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.filter(g => g.status === 'ACTIVE').map(goal => {
            const progressPercent = goal.targetDuration ? Math.min(100, Math.round((goal.progressMinutes / goal.targetDuration) * 100)) : 0;
            const subtasks = goal.aiBreakdown ? JSON.parse(goal.aiBreakdown) : [];
            return (
              <div key={goal.id} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow duration-300 group relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover:bg-teal-400 transition-colors"></div>
                <div className="pl-3">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-slate-800 text-base">{goal.title}</h4>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all text-xs"
                        title="Delete goal"
                      >
                        ✕
                      </button>
                      <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{progressPercent}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mb-4 items-center">
                    <div className="flex gap-4">
                      <span>{goal.subject}</span>
                      <span>•</span>
                      <span>{goal.progressMinutes} / {goal.targetDuration} mins logged</span>
                    </div>
                    {!goal.aiBreakdown && (
                      <button 
                        onClick={() => handleGenerateBreakdown(goal.id)}
                        className="text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-2 py-1 rounded-md transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                        title="Break this down into smaller steps"
                      >
                        ✨ AI Breakdown
                      </button>
                    )}
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                    <div className="bg-teal-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  {subtasks.length > 0 && (
                    <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <h5 className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-1">✨ Suggested Breakdown</h5>
                      <ul className="space-y-1.5">
                        {subtasks.map((task: string, idx: number) => (
                          <li key={idx} className="text-xs text-slate-500 flex items-start gap-2">
                            <span className="text-teal-500 mt-0.5">▪</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-sans selection:bg-teal-100 flex flex-col">
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: '16px', background: '#fff', color: '#334155', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', fontSize: '14px', fontWeight: 500 } }} />

      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <button
          onClick={() => { setPage('home'); setCurrentPhase('plan'); }}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img src="/logo.png" alt="AIPLC Logo" className="h-14 w-auto object-contain" />
          <h1 className="font-bold text-[#1e3a8a] tracking-tight text-2xl hidden sm:block">AIPLC</h1>
        </button>

        {page === 'app' && (
          <div className="flex items-center gap-1 md:gap-2 bg-slate-50 p-1 md:p-1.5 rounded-full border border-slate-100 overflow-x-auto max-w-[50%] md:max-w-none">
            {[
              { id: 'plan', label: '1. Plan', desc: 'Forethought' },
              { id: 'act', label: '2. Act', desc: 'Performance' },
              { id: 'reflect', label: '3. Reflect', desc: 'Self-Reflection' }
            ].map((phase, idx) => (
              <React.Fragment key={phase.id}>
                <button
                  onClick={() => setCurrentPhase(phase.id as any)}
                  className={`flex flex-col items-center px-3 md:px-6 py-1.5 md:py-2 rounded-full transition-all duration-300 whitespace-nowrap ${currentPhase === phase.id ? 'bg-white shadow-sm border border-slate-100 scale-100 opacity-100' : 'opacity-60 hover:opacity-100 hover:bg-slate-100/50 scale-95'}`}
                >
                  <span className={`text-xs md:text-sm font-semibold ${currentPhase === phase.id ? 'text-teal-700' : 'text-slate-600'}`}>{phase.label}</span>
                  <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-slate-400 mt-0.5 hidden sm:block">{phase.desc}</span>
                </button>
                {idx < 2 && <span className="text-slate-300 mx-0.5 md:mx-1 hidden sm:block">→</span>}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          {page === 'home' && (
            <button
              onClick={() => { setPage('app'); setCurrentPhase('plan'); }}
              className="text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-full transition-colors shadow-sm"
            >
              Open Dashboard →
            </button>
          )}
          <button onClick={() => setShowProfile(true)} className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-full transition-colors pr-4 border border-transparent hover:border-slate-100">
            {profile?.profilePicture ? (
              <img src={profile.profilePicture} className="w-8 h-8 rounded-full object-cover" alt="User" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">{getInitials(profile?.name)}</div>
            )}
            <span className="text-sm font-medium text-slate-600 hidden sm:block">{profile?.name?.split(' ')[0] || 'Learner'}</span>
          </button>
        </div>
      </header>

      {page === 'home' && (
        <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-12 space-y-16 animate-in fade-in duration-500">

          <section className="text-center pt-8 pb-4">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6">
              {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'}, {profile?.name?.split(' ')[0] || 'Learner'} 👋
            </p>
            <div className="relative max-w-3xl mx-auto bg-gradient-to-br from-teal-50 to-indigo-50 rounded-3xl p-10 border border-teal-100 shadow-sm">
              <div className="text-4xl text-teal-200 font-serif leading-none mb-4 select-none">"</div>
              <p className="text-2xl md:text-3xl font-light text-slate-700 leading-snug mb-6 transition-all duration-500">
                {QUOTES[quoteIndex].text}
              </p>
              <p className="text-sm font-medium text-slate-400">— {QUOTES[quoteIndex].author}</p>
              <div className="flex justify-center gap-2 mt-8">
                {QUOTES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setQuoteIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === quoteIndex ? 'bg-teal-500 w-4' : 'bg-slate-300 hover:bg-slate-400'}`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => setQuoteIndex(i => (i + 1) % QUOTES.length)}
              className="mt-5 text-xs text-slate-400 hover:text-teal-600 transition-colors font-medium"
            >
              ↻ Next quote
            </button>
          </section>

          <section className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => { setPage('app'); setCurrentPhase('plan'); }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-8 py-4 rounded-2xl transition-all shadow-sm text-base"
            >
              1. Plan your week →
            </button>
            <button
              onClick={() => { setPage('app'); setCurrentPhase('act'); }}
              className="bg-white hover:bg-teal-50 text-slate-700 border border-slate-200 font-medium px-8 py-4 rounded-2xl transition-all text-base"
            >
              2. Log a session
            </button>
            <button
              onClick={() => { setPage('app'); setCurrentPhase('reflect'); }}
              className="bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200 font-medium px-8 py-4 rounded-2xl transition-all text-base"
            >
              3. Reflect
            </button>
          </section>

          <section>
            <div className="flex items-baseline gap-3 mb-8">
              <h2 className="text-2xl font-light text-slate-800">Updates in</h2>
              <span className="text-2xl font-semibold text-teal-700">
                {profile?.fieldOfStudy || 'Learning Science'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {getNewsForField(profile?.fieldOfStudy || '').map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium ml-auto">{item.source}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 leading-snug">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.summary}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex gap-4 items-start">
            <div className="text-2xl shrink-0">💡</div>
            <div>
              <p className="font-medium text-slate-700 mb-1">Quick tip for today</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Before your next study session, spend 2 minutes writing down <em>exactly</em> what you want to accomplish. Students who set specific intentions retain 30% more than those who simply "start studying."
              </p>
            </div>
          </section>
        </main>
      )}

      {page === 'app' && (
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-10">

        {currentPhase === 'plan' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <span className="text-teal-600 font-medium text-sm tracking-wide uppercase bg-teal-50 px-3 py-1 rounded-full">Phase 1: Forethought</span>
              <h2 className="text-3xl md:text-4xl font-light text-slate-800 mt-6 mb-4">What would you like to achieve?</h2>
              <p className="text-slate-500 leading-relaxed">Setting specific, manageable goals helps reduce cognitive load. I can suggest a target based on your syllabus, but you always have the final say.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5">
                <div className={cardStyles}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium text-slate-800">Draft a Goal</h3>
                    <button onClick={handleAISuggestGoal} className="text-xs font-medium text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5">
                      <span className="text-sm">✨</span> AI Suggestion
                    </button>
                  </div>
                  <form onSubmit={handleSaveGoal} className="space-y-5">
                    <div>
                      <label className={labelStyles}>Goal Description</label>
                      <input type="text" required value={goalTitle} onChange={e => setGoalTitle(e.target.value)} className={inputStyles} placeholder="e.g., Complete Chapter 3 exercises" />
                    </div>
                    <div>
                      <label className={labelStyles}>Subject</label>
                      <input type="text" value={goalSubject} onChange={e => setGoalSubject(e.target.value)} className={inputStyles} placeholder="e.g., Mathematics" />
                    </div>
                    <div>
                      <label className={labelStyles}>Target Duration (Minutes)</label>
                      <input type="number" required min="1" value={goalDuration} onChange={e => setGoalDuration(e.target.value)} className={inputStyles} placeholder="45" />
                    </div>
                    <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3.5 px-6 rounded-xl transition-all shadow-sm mt-2">Set Goal</button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-7">
                {renderGoalsList()}
              </div>
            </div>
          </div>
        )}

        {currentPhase === 'act' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <span className="text-sky-600 font-medium text-sm tracking-wide uppercase bg-sky-50 px-3 py-1 rounded-full">Phase 2: Performance</span>
              <h2 className="text-3xl md:text-4xl font-light text-slate-800 mt-6 mb-4">Ready to focus?</h2>
              <p className="text-slate-500 leading-relaxed">Log your learning session below. It's okay if things didn't go perfectly—honest tracking is how we improve.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              <div className="lg:col-span-6 space-y-8">

                <div className={`${cardStyles} !p-6`}>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-medium text-slate-800">Pomodoro Timer</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Start the timer, then log your session below</p>
                    </div>
                    {elapsedSeconds > 0 && !isTimerRunning && (
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                        {Math.ceil(elapsedSeconds / 60)} min recorded ✓
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-8">
                    
                    <div className="relative shrink-0">
                      <svg width="128" height="128" className="-rotate-90">
                        <circle cx="64" cy="64" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="8" />
                        <circle
                          cx="64" cy="64" r={radius}
                          fill="none"
                          stroke={isTimerRunning ? '#14b8a6' : timerSeconds < POMODORO_DURATION ? '#f97316' : '#cbd5e1'}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-light font-mono text-slate-800 tracking-tight">{formatTime(timerSeconds)}</span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-0.5">
                          {isTimerRunning ? 'focusing' : timerSeconds === POMODORO_DURATION ? 'ready' : 'paused'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 flex-1">
                      <button
                        type="button"
                        onClick={handleTimerToggle}
                        className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${isTimerRunning ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'}`}
                      >
                        {isTimerRunning ? '⏸ Pause' : timerSeconds < POMODORO_DURATION ? '▶ Resume' : '▶ Start Focus'}
                      </button>
                      {elapsedSeconds > 0 && (
                        <button
                          type="button"
                          onClick={handleTimerStop}
                          className="w-full py-3 rounded-xl font-medium text-sm bg-slate-800 text-white hover:bg-slate-700 transition-all"
                        >
                          ⏹ Stop & Fill Duration
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleTimerReset}
                        className="w-full py-2.5 rounded-xl font-medium text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 transition-all"
                      >
                        ↺ Reset
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-sky-50/50 border border-sky-100 rounded-3xl p-6 flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sky-500 shadow-sm shrink-0 mt-1">💭</div>
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <h4 className="font-medium text-slate-800">Observation</h4>
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-sky-600 bg-white px-2 py-0.5 rounded border border-sky-100">Pattern Recognition</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {nudge || "Analyzing your study patterns to generate a personalized insight..."}
                    </p>
                  </div>
                </div>

                <div className={cardStyles}>
                  <h3 className="font-medium text-slate-800 mb-6 text-center">Log Session</h3>
                  <form onSubmit={handleLogActivity} className="space-y-6">
                    <div>
                      <label className={labelStyles}>Linked Goal (Optional)</label>
                      <select value={activityGoalId} onChange={e => setActivityGoalId(e.target.value)} className={inputStyles}>
                        <option value="">— Independent Session —</option>
                        {goals.filter(g => g.status === 'ACTIVE').map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                      </select>
                    </div>
                    
                    <div>
                      <label className={labelStyles}>Topic Covered</label>
                      <input type="text" required value={activitySubject} onChange={e => setActivitySubject(e.target.value)} className={inputStyles} placeholder="e.g., Neural Networks" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className={labelStyles}>Duration (Mins)</label>
                        <input type="number" required min="1" value={activityDuration} onChange={e => setActivityDuration(e.target.value)} className={inputStyles} placeholder="30" />
                      </div>
                      <div>
                        <label className={labelStyles}>Perceived Effort</label>
                        <select value={activityDifficulty} onChange={e => setActivityDifficulty(e.target.value)} className={inputStyles}>
                          <option value="1">Very Light</option>
                          <option value="2">Light</option>
                          <option value="3">Moderate</option>
                          <option value="4">Heavy</option>
                          <option value="5">Exhausting</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3.5 px-6 rounded-xl transition-all shadow-sm">Save Record</button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-6">
                {renderGoalsList()}
              </div>

            </div>
          </div>
        )}

        {currentPhase === 'reflect' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-indigo-600 font-medium text-sm tracking-wide uppercase bg-indigo-50 px-3 py-1 rounded-full">Phase 3: Self-Reflection</span>
              <h2 className="text-3xl md:text-4xl font-light text-slate-800 mt-6 mb-4">Open Learner Model</h2>
              <p className="text-slate-500 leading-relaxed">Review your learning data, engage with the AI's analysis, and write your own reflection to close the SRL cycle.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className={cardStyles}>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Consistency</div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-light text-slate-800">{dashboardData.currentStreak}</span>
                  <span className="text-slate-500 font-medium">days</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <p className="text-xs text-slate-500 leading-relaxed"><strong className="text-slate-700 block mb-1">Why this matters:</strong> Daily consistency builds stronger neural pathways than binge-studying.</p>
                </div>
              </div>
              <div className={cardStyles}>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Time Invested</div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-light text-slate-800">{Math.floor(dashboardData.totalLearningTimeMinutes / 60)}</span>
                  <span className="text-slate-500 font-medium mr-1">h</span>
                  <span className="text-5xl font-light text-slate-800">{dashboardData.totalLearningTimeMinutes % 60}</span>
                  <span className="text-slate-500 font-medium">m</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <p className="text-xs text-slate-500 leading-relaxed"><strong className="text-slate-700 block mb-1">Why this matters:</strong> Volume ensures sufficient cognitive effort for mastery in complex subjects.</p>
                </div>
              </div>
              <div className={cardStyles}>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Goals Met</div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-light text-slate-800">{goals.filter(g => g.status === 'COMPLETED').length}</span>
                  <span className="text-slate-500 font-medium">/ {goals.length}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <p className="text-xs text-slate-500 leading-relaxed"><strong className="text-slate-700 block mb-1">Why this matters:</strong> Completion rate shows how accurately you calibrate your forethought vs. actual capacity.</p>
                </div>
              </div>
            </div>

            <div className={`bg-indigo-50/40 border rounded-3xl p-8 transition-all ${aiAction === 'dismissed' ? 'opacity-40 border-slate-200' : aiAction === 'accepted' ? 'border-green-200 bg-green-50/40' : 'border-indigo-100'}`}>
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm shrink-0 ${aiAction === 'accepted' ? 'bg-green-100 text-green-600' : 'bg-white text-indigo-500'}`}>
                  {aiAction === 'accepted' ? '✅' : aiAction === 'dismissed' ? '👋' : '✨'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className="font-medium text-slate-800">AI Synthesis</h3>
                    {dashboardData.persona && (
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded border ${
                        dashboardData.persona.includes('Efficient') ? 'bg-green-100 text-green-700 border-green-200' :
                        dashboardData.persona.includes('Over-Planner') ? 'bg-orange-100 text-orange-700 border-orange-200' :
                        dashboardData.persona.includes('Distracted') ? 'bg-red-100 text-red-700 border-red-200' :
                        dashboardData.persona.includes('Under-Estimator') ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-teal-100 text-teal-700 border-teal-200'
                      }`}>
                        {dashboardData.persona}
                      </span>
                    )}
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-100">Explainable Feedback</span>
                    {aiAction && (
                      <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded ${aiAction === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {aiAction === 'accepted' ? 'Accepted' : 'Dismissed'}
                      </span>
                    )}
                  </div>

                  {isEditingAISuggestion ? (
                    <div className="mb-4">
                      <textarea
                        rows={3}
                        value={editedAISuggestion}
                        onChange={e => setEditedAISuggestion(e.target.value)}
                        className={`${inputStyles} resize-none`}
                        placeholder="Edit the AI suggestion..."
                      />
                      <div className="flex gap-3 mt-3">
                        <button onClick={() => { setAiAction('accepted'); setIsEditingAISuggestion(false); }} className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Save Edit</button>
                        <button onClick={() => { setIsEditingAISuggestion(false); setEditedAISuggestion(''); }} className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600 leading-relaxed mb-5">
                      {dashboardData.recommendation || "You met 80% of your target this week. Consider lowering your target slightly to maintain consistency without risking burnout."}
                    </p>
                  )}

                  {!aiAction && !isEditingAISuggestion && (
                    <div className="flex gap-3 flex-wrap">
                      <button onClick={handleAcceptAI} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">Accept & Apply</button>
                      <button onClick={handleEditAI} className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-sm font-medium px-5 py-2 rounded-lg transition-colors">Edit Suggestion</button>
                      <button onClick={handleDismissAI} className="text-slate-400 hover:text-slate-600 text-sm font-medium px-4 py-2 transition-colors ml-auto">Dismiss</button>
                    </div>
                  )}
                  {aiAction && (
                    <button onClick={() => { setAiAction(null); setIsEditingAISuggestion(false); }} className="text-xs text-slate-400 hover:text-slate-600 transition-colors mt-2">
                      ↩ Undo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className={`${cardStyles} border-2 border-indigo-100`}>
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 text-lg">Your Reflection</h3>
                <p className="text-sm text-slate-500 mt-1">Write your own thoughts to close this learning cycle. This is for you, not the AI.</p>
              </div>

              <form onSubmit={handleSaveReflection} className="space-y-6">
                <div>
                  <label className={`${labelStyles} text-emerald-600`}>What went well this week?</label>
                  <textarea
                    rows={3}
                    value={reflectionForm.whatWentWell}
                    onChange={e => setReflectionForm({ ...reflectionForm, whatWentWell: e.target.value })}
                    className={`${inputStyles} resize-none`}
                    placeholder="e.g., I stayed consistent with my Machine Learning sessions and finished Chapter 4..."
                  />
                </div>
                <div>
                  <label className={`${labelStyles} text-amber-600`}>What was difficult or didn't go as planned?</label>
                  <textarea
                    rows={3}
                    value={reflectionForm.whatWasDifficult}
                    onChange={e => setReflectionForm({ ...reflectionForm, whatWasDifficult: e.target.value })}
                    className={`${inputStyles} resize-none`}
                    placeholder="e.g., I struggled with the statistics module and kept getting distracted in the evenings..."
                  />
                </div>
                <div>
                  <label className={`${labelStyles} text-indigo-600`}>What will I change or try next week?</label>
                  <textarea
                    rows={3}
                    value={reflectionForm.whatToChange}
                    onChange={e => setReflectionForm({ ...reflectionForm, whatToChange: e.target.value })}
                    className={`${inputStyles} resize-none`}
                    placeholder="e.g., I'll try studying statistics in the morning when I have more energy..."
                  />
                </div>

                {aiAction && (
                  <div className={`text-sm rounded-xl p-4 border ${aiAction === 'accepted' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    {aiAction === 'accepted' ? '✅ AI suggestion will be saved as accepted with this reflection.' : '👋 AI suggestion marked as dismissed.'}
                  </div>
                )}

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 px-6 rounded-xl transition-all shadow-sm">
                  Save Reflection & Close Cycle
                </button>
              </form>
            </div>

            {reflections.length > 0 && (
              <div>
                <h3 className="font-medium text-slate-700 mb-4 px-1">Past Reflections</h3>
                <div className="space-y-4">
                  {reflections.map(r => (
                    <details key={r.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden group">
                      <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                          <span className="font-medium text-slate-700">Week {r.weekLabel}</span>
                          {r.aiSuggestionAccepted && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">AI Accepted</span>}
                        </div>
                        <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} ▾</span>
                      </summary>
                      <div className="px-5 pb-5 space-y-3 border-t border-slate-100 pt-4">
                        {r.whatWentWell && <div><p className="text-xs font-semibold text-emerald-600 mb-1">What went well</p><p className="text-sm text-slate-600 leading-relaxed">{r.whatWentWell}</p></div>}
                        {r.whatWasDifficult && <div><p className="text-xs font-semibold text-amber-600 mb-1">What was difficult</p><p className="text-sm text-slate-600 leading-relaxed">{r.whatWasDifficult}</p></div>}
                        {r.whatToChange && <div><p className="text-xs font-semibold text-indigo-600 mb-1">What to change</p><p className="text-sm text-slate-600 leading-relaxed">{r.whatToChange}</p></div>}
                        {r.aiSuggestionSnapshot && <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3"><p className="text-xs font-semibold text-indigo-600 mb-1">AI Suggestion at the time</p><p className="text-xs text-slate-500 italic leading-relaxed">"{r.aiSuggestionSnapshot}"</p></div>}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      )}

      {showProfile && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto border-l border-slate-100 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800">Learner Profile</h2>
              <button onClick={() => setShowProfile(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors">✕</button>
            </div>
            <div className="p-8 flex-1">
              <div className="flex flex-col items-center mb-8">
                <div className="relative group cursor-pointer mb-4">
                  {profile?.profilePicture ? (
                    <img src={profile.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-sm ring-4 ring-slate-50" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-3xl font-light ring-4 ring-white shadow-sm">{getInitials(profile?.name)}</div>
                  )}
                  <label className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-xs font-medium">Update</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
                  </label>
                </div>
                {!isEditingProfile && (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-800">{profile?.name || 'Test Learner'}</h3>
                    <p className="text-sm text-slate-500">{profile?.fieldOfStudy || 'Student'}</p>
                    <button onClick={() => setIsEditingProfile(true)} className="mt-4 text-xs font-medium text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full hover:bg-teal-100 transition-colors">Edit Information</button>
                  </div>
                )}
              </div>
              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div><label className={labelStyles}>Full Name</label><input type="text" className={inputStyles} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required /></div>
                  <div><label className={labelStyles}>Email Address</label><input type="email" className={inputStyles} value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} required /></div>
                  <div><label className={labelStyles}>Field of Study</label><input type="text" className={inputStyles} value={editForm.fieldOfStudy} onChange={e => setEditForm({ ...editForm, fieldOfStudy: e.target.value })} /></div>
                  <div><label className={labelStyles}>Institution</label><input type="text" className={inputStyles} value={editForm.institution} onChange={e => setEditForm({ ...editForm, institution: e.target.value })} /></div>
                  <div><label className={labelStyles}>Short Bio</label><textarea rows={3} className={inputStyles} value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} /></div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium py-3 rounded-xl transition-colors">Save Details</button>
                    <button type="button" onClick={() => setIsEditingProfile(false)} className="flex-1 bg-white border border-slate-200 text-slate-600 text-sm font-medium py-3 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">About Me</h4>
                  <div className="space-y-4 text-sm">
                    <div><span className="text-slate-400 block mb-0.5">Email</span><span className="font-medium text-slate-700">{profile?.email || '—'}</span></div>
                    <div><span className="text-slate-400 block mb-0.5">Institution</span><span className="font-medium text-slate-700">{profile?.institution || '—'}</span></div>
                    {profile?.bio && <div><span className="text-slate-400 block mb-0.5">Bio</span><span className="text-slate-600 leading-relaxed">{profile.bio}</span></div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
