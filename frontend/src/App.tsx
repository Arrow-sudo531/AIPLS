import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  Sparkles,
  Clock,
  Target,
  Flame,
  CheckCircle2,
  RotateCcw,
  Play,
  Pause,
  Square,
  Trash2,
  LogOut,
  ChevronRight,
  Check,
  Plus,
  Minus,
  Lightbulb,
  ArrowRight,
  X,
  Layers,
  Award,
  Activity,
  BrainCircuit,
  Calendar,
  Camera,
  RefreshCw,
  Send,
  Printer
} from 'lucide-react';

const AUTH_URL = 'http://localhost:8080/api/auth';

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

const NEWS_BY_FIELD: Record<string, { title: string; summary: string; tag: string; source: string; readTime: string }[]> = {
  default: [
    { title: "How to Build a Sustainable Study Routine", summary: "Research shows that consistent, spaced study sessions of 25–45 minutes dramatically improve long-term retention compared to marathon sessions.", tag: "Study Science", source: "Learning Lab", readTime: "3 min" },
    { title: "The Science of Self-Regulated Learning", summary: "Zimmerman's cyclical model of SRL — Plan, Act, Reflect — has been validated across hundreds of studies as the most effective learning framework for independent learners.", tag: "SRL Research", source: "Educational Psychology", readTime: "4 min" },
    { title: "Why Retrieval Practice Beats Re-reading", summary: "Testing yourself on material forces your brain to reconstruct knowledge, creating stronger neural connections than passive review ever could.", tag: "Cognitive Science", source: "Nature Human Behaviour", readTime: "5 min" },
    { title: "The Role of Metacognition in Academic Success", summary: "Students who regularly monitor their own understanding and adjust their strategies outperform peers by up to 40% on complex problem-solving tasks.", tag: "Metacognition", source: "Cambridge Review", readTime: "4 min" },
  ],
  "computer science": [
    { title: "Google DeepMind Releases Gemini 2.0 Flash Thinking", summary: "DeepMind's latest model demonstrates chain-of-thought reasoning competitive with top human researchers on STEM benchmarks, opening new doors for AI-assisted education.", tag: "AI Research", source: "DeepMind Blog", readTime: "4 min" },
    { title: "Rust Overtakes C++ in Systems Programming Adoption", summary: "A new Stack Overflow survey shows Rust adoption grew 40% YoY, with memory safety guarantees making it the top choice for new systems projects at major tech firms.", tag: "Systems", source: "Stack Overflow", readTime: "3 min" },
    { title: "WebAssembly 2.0: The Future of Browser Performance", summary: "The W3C published the WASM 2.0 specification, enabling near-native performance for web applications and expanding the scope of what browsers can execute.", tag: "Web Tech", source: "W3C", readTime: "5 min" },
    { title: "Open Source LLMs: LLaMA 3.1 Benchmark Results", summary: "Meta's LLaMA 3.1 405B matches proprietary models across multiple coding benchmarks while remaining fully accessible for local inference.", tag: "ML", source: "Meta AI", readTime: "4 min" },
    { title: "Quantum Computing Reaches 1000-Qubit Milestone", summary: "IBM's latest quantum processor crosses the 1000-qubit threshold, bringing practical quantum advantage for optimization problems significantly closer.", tag: "Quantum", source: "IBM Research", readTime: "6 min" },
    { title: "CS Undergraduate Curriculum Reform: AI First", summary: "Top universities are restructuring CS curricula to place AI/ML fundamentals in the first year, reflecting the industry's rapid shift toward intelligence-first development.", tag: "Curriculum", source: "ACM SIGCSE", readTime: "4 min" },
  ],
  "machine learning": [
    { title: "State-Space Models Challenge Transformer Dominance", summary: "New research from MIT indicates state-space architectures achieve comparable accuracy to transformers at 10x lower inference cost on long-context tasks.", tag: "Architecture", source: "MIT CSAIL", readTime: "5 min" },
    { title: "Federated Learning on Mobile Edge Devices", summary: "Collaborative privacy-preserving frameworks allow models to train on decentralized client data without exposing private student records.", tag: "Edge AI", source: "Google Research", readTime: "4 min" },
    { title: "Scaling Laws in Generative AI: Empirical Findings", summary: "Empirical studies continue to validate that compute-optimal allocation and quality data filtering remain the primary drivers of model intelligence.", tag: "Scaling Laws", source: "OpenAI", readTime: "5 min" },
    { title: "Explainable AI in Decision Support Systems", summary: "SHAP-based feature attribution models significantly increase human trust in predictive analytics by exposing decisive factors behind AI recommendations.", tag: "XAI", source: "Nature Machine Intel", readTime: "4 min" },
  ],
  "data science": [
    { title: "DuckDB: In-Process Analytics Revolution", summary: "DuckDB offers substantial execution speedups on analytical vector queries while remaining zero-dependency and running fully in-process.", tag: "Data Engines", source: "Towards Data Science", readTime: "3 min" },
    { title: "Modern Data Stack and Semantic Modeling", summary: "The convergence of metric stores and semantic layers allows analytics teams to maintain a single verified definition for core metrics.", tag: "Analytics", source: "Mode", readTime: "4 min" },
    { title: "Data Quality and Lineage Automation", summary: "Automated test suites for data pipelines reduce silent corruption and ensure downstream machine learning pipelines operate on verified features.", tag: "DataOps", source: "Gartner", readTime: "5 min" },
    { title: "High-Performance Dataframes: Polars vs Pandas", summary: "Rust-backed parallel execution in Polars consistently outperforms legacy single-threaded dataframes on multi-gigabyte datasets.", tag: "Performance", source: "Python Weekly", readTime: "4 min" },
  ],
  "mathematics": [
    { title: "Neural Automated Theorem Proving Breakthroughs", summary: "Deep learning models combined with formal verification systems like Lean have successfully verified complex Olympiad-level geometric proofs.", tag: "Formal Proofs", source: "Nature", readTime: "5 min" },
    { title: "Applied Category Theory in Modern Software", summary: "Category theory structures are increasingly applied to define composable software architectures, state machines, and relational schemas.", tag: "Category Theory", source: "AMS Notices", readTime: "4 min" },
    { title: "Lattice-Based Post-Quantum Cryptography", summary: "NIST has finalized standards for quantum-resistant lattice-based encryption algorithms to replace legacy RSA and elliptic curve protocols.", tag: "Cryptography", source: "NIST", readTime: "6 min" },
    { title: "Topological Data Analysis in High Dimensions", summary: "Persistent homology techniques reveal hidden geometric cluster structures in complex multidimensional behavioral spaces.", tag: "Topology", source: "SIAM Review", readTime: "5 min" },
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

export default function App() {
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(() => {
    const saved = localStorage.getItem('userId');
    return saved ? parseInt(saved, 10) : null;
  });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const API_BASE_URL = loggedInUserId ? `http://localhost:8080/api/users/${loggedInUserId}` : '';

  const [page, setPage] = useState<'home' | 'app'>('home');
  const [currentPhase, setCurrentPhase] = useState<'plan' | 'act' | 'reflect'>('plan');
  const [quoteIndex, setQuoteIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    currentStreak: 0,
    totalLearningTimeMinutes: 0,
    persona: "Consistent Learner",
    recommendation: "You've been consistent. Maintaining this structured rhythm reinforces neural habit pathways."
  });
  const [goals, setGoals] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  const [goalTitle, setGoalTitle] = useState('');
  const [goalSubject, setGoalSubject] = useState('');
  const [goalDuration, setGoalDuration] = useState('45');
  const [goalPriority, setGoalPriority] = useState('Medium');

  const [activityGoalId, setActivityGoalId] = useState('');
  const [activitySubject, setActivitySubject] = useState('');
  const [activityDuration, setActivityDuration] = useState('25');
  const [activityDifficulty, setActivityDifficulty] = useState('3');
  const [activityDistractions, setActivityDistractions] = useState('0');

  const [pomodoroTargetMins, setPomodoroTargetMins] = useState(25);
  const POMODORO_DURATION = pomodoroTargetMins * 60;
  const [timerSeconds, setTimerSeconds] = useState(() => {
    const saved = sessionStorage.getItem('timerSeconds');
    return saved !== null ? parseInt(saved, 10) : 25 * 60;
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
  const [fatigueRisk, setFatigueRisk] = useState<number>(24);
  const [activities, setActivities] = useState<any[]>([]);
  const [isConfirmingSignOut, setIsConfirmingSignOut] = useState(false);
  const [goalFilter, setGoalFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [isSeeding, setIsSeeding] = useState(false);

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };
      playTone(523.25, now, 0.9);
      playTone(659.25, now + 0.18, 1.2);
    } catch {}
  };

  const fetchData = async () => {
    if (!loggedInUserId) return;
    setIsLoading(true);
    try {
      const [dashRes, goalsRes, profileRes, reflectRes, nudgeRes, actRes] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard/summary`),
        fetch(`${API_BASE_URL}/goals`),
        fetch(`${API_BASE_URL}/profile`),
        fetch(`${API_BASE_URL}/reflections`),
        fetch(`${API_BASE_URL}/dashboard/nudge`),
        fetch(`${API_BASE_URL}/activities`)
      ]);
      if (dashRes.ok) setDashboardData(await dashRes.json());
      if (goalsRes.ok) setGoals(await goalsRes.json());
      if (actRes.ok) setActivities(await actRes.json());
      if (nudgeRes.ok) {
        const nData = await nudgeRes.json();
        setNudge(nData.nudge || '');
        if (typeof nData.risk_probability === 'number') {
          setFatigueRisk(Math.round(nData.risk_probability * 100));
        }
      }
      if (profileRes.ok) {
        const p = await profileRes.json();
        setProfile(p);
        setEditForm({
          name: p.name || '',
          email: p.email || '',
          bio: p.bio || '',
          fieldOfStudy: p.fieldOfStudy || '',
          institution: p.institution || ''
        });
      }
      if (reflectRes.ok) setReflections(await reflectRes.json());
    } catch {
      toast.error("Unable to connect to learning database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPhase, loggedInUserId]);

  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      timerRef.current = window.setTimeout(() => {
        setTimerSeconds(s => s - 1);
        setElapsedSeconds(e => e + 1);
      }, 1000);
    } else if (isTimerRunning && timerSeconds === 0) {
      setIsTimerRunning(false);
      playChime();
      const mins = Math.max(1, Math.ceil(elapsedSeconds / 60));
      setActivityDuration(mins.toString());
      const activeGoal = goals.find(g => g.status === 'ACTIVE');
      if (activeGoal && !activityGoalId) {
        setActivityGoalId(activeGoal.id.toString());
        if (!activitySubject) {
          setActivitySubject(activeGoal.title);
        }
      }
      toast.success(`Focus session complete! ${mins}m applied to log form below.`);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTimerRunning, timerSeconds]);

  const handleTimerToggle = () => setIsTimerRunning(r => !r);

  const handleTimerReset = () => {
    setIsTimerRunning(false);
    setTimerSeconds(pomodoroTargetMins * 60);
    setElapsedSeconds(0);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleTimerStop = () => {
    setIsTimerRunning(false);
    const effectiveElapsed = elapsedSeconds > 0 ? elapsedSeconds : (pomodoroTargetMins * 60 - timerSeconds);
    const mins = Math.max(1, Math.ceil(effectiveElapsed > 0 ? effectiveElapsed / 60 : pomodoroTargetMins));
    setActivityDuration(mins.toString());
    const activeGoal = goals.find(g => g.status === 'ACTIVE');
    if (activeGoal && !activityGoalId) {
      setActivityGoalId(activeGoal.id.toString());
      if (!activitySubject) {
        setActivitySubject(activeGoal.title);
      }
    }
    toast.success(`Session recorded: ${mins}m applied to log form below.`);
  };

  const setTimerPreset = (mins: number) => {
    setIsTimerRunning(false);
    setPomodoroTargetMins(mins);
    setTimerSeconds(mins * 60);
    setElapsedSeconds(0);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const filteredGoals = goals.filter(g => {
    if (goalFilter === 'ACTIVE') return g.status !== 'COMPLETED';
    if (goalFilter === 'COMPLETED') return g.status === 'COMPLETED';
    return true;
  });

  const handleSeedSampleData = async () => {
    if (!loggedInUserId || isSeeding) return;
    setIsSeeding(true);
    const toastId = toast.loading('Generating realistic study history...');
    try {
      const sampleGoals = [
        { title: 'Master Dynamic Programming: Memoization & Tabulation', subject: 'Algorithms', targetDuration: 60, priority: 'High', status: 'ACTIVE' },
        { title: 'Database Normalization & BCNF Decomposition', subject: 'DBMS', targetDuration: 45, priority: 'Medium', status: 'COMPLETED' },
        { title: 'Distributed Systems: Raft Consensus Protocol', subject: 'Systems', targetDuration: 90, priority: 'High', status: 'ACTIVE' }
      ];
      for (const g of sampleGoals) {
        await fetch(`${API_BASE_URL}/goals`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(g)
        });
      }

      const today = new Date();
      const formatYmd = (d: Date) => d.toISOString().split('T')[0];
      const dateToday = formatYmd(today);
      const dateYesterday = formatYmd(new Date(today.getTime() - 86400000));
      const date2DaysAgo = formatYmd(new Date(today.getTime() - 2 * 86400000));

      const sampleActivities = [
        { activityDate: dateToday, subject: 'Algorithms', duration: 50, distractionCount: 1, difficultyRating: 3, studyMethod: 'Pomodoro', completionStatus: 'COMPLETED' },
        { activityDate: dateToday, subject: 'DBMS', duration: 45, distractionCount: 0, difficultyRating: 2, studyMethod: 'Active Recall', completionStatus: 'COMPLETED' },
        { activityDate: dateYesterday, subject: 'Systems', duration: 60, distractionCount: 2, difficultyRating: 4, studyMethod: 'Deep Work', completionStatus: 'COMPLETED' },
        { activityDate: date2DaysAgo, subject: 'Networks', duration: 40, distractionCount: 1, difficultyRating: 2, studyMethod: 'Practice Problems', completionStatus: 'COMPLETED' }
      ];
      for (const act of sampleActivities) {
        await fetch(`${API_BASE_URL}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(act)
        });
      }

      await fetch(`${API_BASE_URL}/reflections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekLabel: 'Week 1 Field Log',
          whatWentWell: 'Morning study block worked well when phone was kept in another room. Solved 3 recursive tree problems.',
          whatWasDifficult: 'Hit mental fatigue at around the 45-minute mark on complex state transitions.',
          whatToChange: 'Introduce a 5-minute movement break between 25-minute Pomodoro sessions to stay fresh.',
          aiSuggestionAccepted: true,
          aiSuggestionSnapshot: 'Break marathon sessions into 25-minute sprints to preserve cognitive stamina.'
        })
      });

      await fetchData();
      toast.success('Sample study log loaded! 3 goals, 4 sessions & reflections ready.', { id: toastId });
    } catch {
      toast.error('Failed to generate sample log', { id: toastId });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }
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
        toast.success('Profile image updated');
      } catch {
        toast.error('Failed to update picture.');
      }
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
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Update failed.');
    }
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) {
      toast.error('Goal description cannot be empty');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: goalTitle.trim(),
          subject: goalSubject.trim() || 'General Study',
          targetDuration: parseInt(goalDuration, 10) || 45,
          frequency: 'Weekly',
          priority: goalPriority
        })
      });
      if (!res.ok) throw new Error();
      toast.success('Goal scheduled in your study plan');
      setGoalTitle('');
      fetchData();
    } catch {
      toast.error('Could not save goal.');
    }
  };

  const handleGenerateBreakdown = async (goalId: number) => {
    toast.loading('Creating step-by-step breakdown...', { id: 'breakdown' });
    try {
      const res = await fetch(`${API_BASE_URL}/goals/${goalId}/breakdown`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error();
      toast.success('AI Micro-Goal breakdown generated', { id: 'breakdown' });
      fetchData();
    } catch {
      toast.error('Failed to generate breakdown', { id: 'breakdown' });
    }
  };

  const handleAISuggestGoal = () => {
    const field = profile?.fieldOfStudy || 'Learning Science';
    const topics: Record<string, string[]> = {
      'computer science': ['Data Structures: Red-Black Trees', 'Algorithm Design: Dynamic Programming', 'Distributed Systems: Raft Consensus'],
      'machine learning': ['Transformer Attention Mechanisms', 'Feature Normalization & Preprocessing', 'Hyperparameter Optimization with Optuna'],
      'data science': ['Analytical SQL: Window Functions', 'Exploratory Data Analysis on Parquet', 'Interactive Dashboard Visualization'],
      'mathematics': ['Linear Algebra: Eigenvalue Decomposition', 'Multivariable Calculus: Vector Fields', 'Discrete Mathematics: Graph Isomorphism'],
      'default': ['Active Recall & Flashcard Review', 'Practice Problem Synthesis', 'Chapter Concept Mapping']
    };

    let matched = topics.default;
    for (const [key, val] of Object.entries(topics)) {
      if (field.toLowerCase().includes(key)) {
        matched = val;
        break;
      }
    }
    const activeTitles = goals.map(g => g.title);
    const available = matched.filter(t => !activeTitles.includes(t));
    const title = available.length > 0 ? available[0] : `${field} Deep Dive`;

    setGoalTitle(title);
    setGoalSubject(field);
    setGoalDuration("45");
    toast('Smart target drafted. You can modify before saving.', {
      icon: '🎯'
    });
  };

  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `${API_BASE_URL}/activities${activityGoalId ? `?goalId=${activityGoalId}` : ''}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityDate: new Date().toISOString().split('T')[0],
          subject: activitySubject || 'General Session',
          task: activitySubject || 'Focused Study',
          duration: parseInt(activityDuration, 10) || 25,
          completionStatus: 'Completed',
          difficultyRating: parseInt(activityDifficulty, 10) || 3,
          distractionCount: parseInt(activityDistractions, 10) || 0,
          studyMethod: 'Pomodoro'
        })
      });
      if (!res.ok) throw new Error();
      toast.success('Study session saved successfully');
      setActivitySubject('');
      setActivityDuration('25');
      setActivityDistractions('0');
      setActivityGoalId('');
      fetchData();
    } catch {
      toast.error('Could not record session.');
    }
  };

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionForm.whatWentWell && !reflectionForm.whatWasDifficult && !reflectionForm.whatToChange) {
      toast.error('Provide at least one reflection response.');
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
      toast.success('Self-reflection saved to your study journal');
      setReflectionForm({ whatWentWell: '', whatWasDifficult: '', whatToChange: '' });
      setAiAction(null);
      setIsEditingAISuggestion(false);
      fetchData();
    } catch {
      toast.error('Could not save reflection.');
    }
  };

  const handleAcceptAI = () => {
    setAiAction('accepted');
    setIsEditingAISuggestion(false);
    toast.success('Strategy applied to your study plan');
  };

  const handleEditAI = () => {
    setIsEditingAISuggestion(true);
    setEditedAISuggestion(dashboardData.recommendation);
    setAiAction(null);
  };

  const handleDismissAI = () => {
    setAiAction('dismissed');
    setIsEditingAISuggestion(false);
    toast('Suggestion dismissed. Focus on what fits your current rhythm.');
  };

  const handleDeleteGoal = async (goalId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/goals/${goalId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Goal removed from schedule');
      fetchData();
    } catch {
      toast.error('Could not remove goal.');
    }
  };

  const handleToggleGoalStatus = async (goal: any) => {
    const nextStatus = goal.status === 'COMPLETED' ? 'ACTIVE' : 'COMPLETED';
    try {
      const res = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: goal.id,
          title: goal.title,
          subject: goal.subject,
          targetDuration: goal.targetDuration,
          frequency: goal.frequency,
          priority: goal.priority,
          status: nextStatus
        })
      });
      if (!res.ok) throw new Error();
      toast.success(nextStatus === 'COMPLETED' ? 'Goal marked as complete!' : 'Goal restored to active');
      fetchData();
    } catch {
      toast.error('Failed to update goal state');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    const endpoint = isLoginMode ? '/login' : '/register';
    const body = isLoginMode
      ? { email: authEmail.trim(), password: authPassword }
      : { name: authName.trim(), email: authEmail.trim(), password: authPassword };
    try {
      const res = await fetch(`${AUTH_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(errorMsg || 'Authentication failed');
      }
      const user = await res.json();
      localStorage.setItem('userId', user.id.toString());
      setLoggedInUserId(user.id);
      toast.success(`Welcome back, ${user.name || 'Student'}!`);
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'SR';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatClock = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timerRadius = 78;
  const timerCircumference = 2 * Math.PI * timerRadius;
  const timerRatio = timerSeconds / POMODORO_DURATION;
  const timerStrokeDashoffset = timerCircumference * (1 - timerRatio);

  const getPersonaColorClass = (personaName: string) => {
    if (personaName.includes('Efficient')) return 'bg-[#EAF3EE] text-[#36594A] border-[#36594A]/30';
    if (personaName.includes('Over-Planner')) return 'bg-[#FDF6E8] text-[#A96810] border-[#A96810]/30';
    if (personaName.includes('Distracted')) return 'bg-[#FBECE8] text-[#C83D1B] border-[#C83D1B]/30';
    if (personaName.includes('Under-Estimator')) return 'bg-[#F3EFF8] text-[#5C4574] border-[#5C4574]/30';
    return 'bg-[#F1ECE0] text-[#181B1F] border-[#E8E1D3]';
  };

  if (!loggedInUserId) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center p-4 selection:bg-[#F1ECE0] selection:text-[#181B1F]">
        <Toaster position="top-center" />
        <div className="w-full max-w-md">
          <div className="bg-[#FFFFFF] border border-[#E8E1D3] rounded-lg p-8 shadow-xs relative">
            <div className="absolute top-4 right-4 font-mono text-[10px] text-[#8A919E] uppercase tracking-widest border border-[#E8E1D3] px-2 py-0.5 rounded">
              STUDY JOURNAL
            </div>
            <div className="text-left mb-6">
              <div className="inline-block px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-widest bg-[#FBECE8] text-[#C83D1B] border border-[#C83D1B]/30 font-bold mb-3">
                AIPLC STUDY COMPANION
              </div>
              <h1 className="font-serif text-2xl font-normal text-[#181B1F] tracking-tight">Student Sign In</h1>
              <p className="font-sans text-xs text-[#535965] mt-1">Your personal space for consistent, self-directed daily learning.</p>
              <div className="flex items-center gap-2 mt-3 font-mono text-[11px] text-[#8A919E]">
                <span>Plan</span>
                <span>•</span>
                <span>Focus</span>
                <span>•</span>
                <span>Reflect</span>
              </div>
            </div>

            <div className="grid grid-cols-2 p-1 bg-[#F7F4EB] rounded border border-[#E8E1D3] mb-6 text-xs font-mono">
              <button
                type="button"
                onClick={() => setIsLoginMode(true)}
                className={`py-2 rounded transition-all ${isLoginMode ? 'bg-[#FFFFFF] text-[#181B1F] shadow-xs font-semibold' : 'text-[#8A919E] hover:text-[#181B1F]'}`}
              >
                [ Sign In ]
              </button>
              <button
                type="button"
                onClick={() => setIsLoginMode(false)}
                className={`py-2 rounded transition-all ${!isLoginMode ? 'bg-[#FFFFFF] text-[#181B1F] shadow-xs font-semibold' : 'text-[#8A919E] hover:text-[#181B1F]'}`}
              >
                [ Create Account ]
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLoginMode && (
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#535965] mb-1 font-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    placeholder="e.g. Aman Shakya"
                    className="w-full bg-[#FBF9F4] border border-[#E8E1D3] rounded px-3 py-2 text-xs font-sans text-[#181B1F] placeholder-[#8A919E] focus:outline-none focus:border-[#181B1F] focus:bg-white transition-all"
                  />
                </div>
              )}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#535965] mb-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="name@university.ac.in"
                  className="w-full bg-[#FBF9F4] border border-[#E8E1D3] rounded px-3 py-2 text-xs font-sans text-[#181B1F] placeholder-[#8A919E] focus:outline-none focus:border-[#181B1F] focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#535965] mb-1 font-semibold">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FBF9F4] border border-[#E8E1D3] rounded px-3 py-2 text-xs font-sans text-[#181B1F] placeholder-[#8A919E] focus:outline-none focus:border-[#181B1F] focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full mt-2 bg-[#181B1F] hover:bg-[#2A2E35] text-white font-mono text-xs uppercase tracking-widest py-2.5 rounded transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAuthLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isLoginMode ? 'Open Study Journal' : 'Create My Account'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#181B1F] flex flex-col antialiased selection:bg-[#F1ECE0] selection:text-[#181B1F]">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />

      <header className="sticky top-0 z-40 bg-[#FBF9F4]/95 backdrop-blur-md border-b border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => { setPage('home'); setCurrentPhase('plan'); }}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded bg-[#181B1F] text-white flex items-center justify-center font-mono font-bold tracking-tight shadow-xs group-hover:bg-[#C83D1B] transition-colors">
                <BrainCircuit className="w-5 h-5 text-[#FBF9F4]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-lg font-bold text-[#181B1F] tracking-tight block leading-none">AIPLC</span>
                  {isLoading && <RefreshCw className="w-3 h-3 text-[#C83D1B] animate-spin" />}
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A919E] block mt-0.5">Student Study Journal</span>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-1.5 pl-4 border-l border-[#E8E1D3]">
              <button
                onClick={() => setPage('home')}
                className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-colors ${page === 'home' ? 'bg-[#181B1F] text-white font-semibold' : 'text-[#535965] hover:text-[#181B1F] hover:bg-[#F1ECE0]'}`}
              >
                Overview
              </button>
              <button
                onClick={() => { setPage('app'); setCurrentPhase('plan'); }}
                className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-colors ${page === 'app' ? 'bg-[#181B1F] text-white font-semibold' : 'text-[#535965] hover:text-[#181B1F] hover:bg-[#F1ECE0]'}`}
              >
                Study Space
              </button>
            </nav>
          </div>

          {page === 'app' && (
            <div className="flex items-center bg-[#F7F4EB] p-1 rounded border border-[#E8E1D3]">
              <button
                onClick={() => setCurrentPhase('plan')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-all ${currentPhase === 'plan' ? 'bg-[#FFFFFF] text-[#181B1F] shadow-xs font-bold border border-[#E8E1D3]' : 'text-[#8A919E] hover:text-[#181B1F]'}`}
              >
                <Target className="w-3.5 h-3.5 text-[#A96810]" />
                <span>1. Plan</span>
              </button>
              <button
                onClick={() => setCurrentPhase('act')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-all ${currentPhase === 'act' ? 'bg-[#FFFFFF] text-[#181B1F] shadow-xs font-bold border border-[#E8E1D3]' : 'text-[#8A919E] hover:text-[#181B1F]'}`}
              >
                <Clock className="w-3.5 h-3.5 text-[#36594A]" />
                <span>2. Focus</span>
              </button>
              <button
                onClick={() => setCurrentPhase('reflect')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-all ${currentPhase === 'reflect' ? 'bg-[#FFFFFF] text-[#181B1F] shadow-xs font-bold border border-[#E8E1D3]' : 'text-[#8A919E] hover:text-[#181B1F]'}`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C83D1B]" />
                <span>3. Reflect</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#C83D1B]/30 bg-[#FBECE8] text-[#C83D1B] text-xs font-mono font-bold">
              <Flame className="w-3.5 h-3.5 text-[#C83D1B] fill-[#C83D1B]" />
              <span>STREAK: {dashboardData.currentStreak}D</span>
            </div>

            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 p-1 pl-2.5 rounded border border-[#E8E1D3] bg-[#FFFFFF] hover:bg-[#F7F4EB] transition-colors"
            >
              <span className="text-xs font-mono text-[#535965] hidden sm:inline">
                {profile?.name?.split(' ')[0] || 'Student'}
              </span>
              {profile?.profilePicture ? (
                <img src={profile.profilePicture} alt="Avatar" className="w-7 h-7 rounded object-cover border border-[#E8E1D3]" />
              ) : (
                <div className="w-7 h-7 rounded bg-[#181B1F] text-[#FBF9F4] text-[10px] font-mono font-semibold flex items-center justify-center">
                  {getInitials(profile?.name)}
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {page === 'home' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <section className="bg-[#FFFFFF] border border-[#E8E1D3] rounded-lg p-6 sm:p-8 shadow-xs relative">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#8A919E] mb-2">
                  <Calendar className="w-3.5 h-3.5 text-[#8A919E]" />
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#181B1F] tracking-tight">
                  Welcome, {profile?.name?.split(' ')[0] || 'Student'}
                </h2>
                <p className="font-sans text-xs text-[#535965] mt-1 max-w-xl leading-relaxed">
                  Build consistent study habits through a simple 3-step loop: plan your goals, stay focused with the timer, and reflect on what helped you learn.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => { setPage('app'); setCurrentPhase('plan'); }}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-[#181B1F] hover:bg-[#2A2E35] text-white font-mono text-xs uppercase tracking-wider transition-all shadow-xs"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Plan a Goal</span>
                </button>
                <button
                  onClick={() => { setPage('app'); setCurrentPhase('act'); }}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-[#C83D1B]/40 bg-[#FBECE8] hover:bg-[#F7DDD7] text-[#C83D1B] font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-[#C83D1B]" />
                  <span>Start Focus Timer</span>
                </button>
                {goals.length === 0 && (
                  <button
                    disabled={isSeeding}
                    onClick={handleSeedSampleData}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded border border-[#E8E1D3] bg-[#F7F4EB] hover:bg-[#EFE8D8] text-[#181B1F] font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#A96810]" />
                    <span>{isSeeding ? 'Generating...' : 'Load Sample Log'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#E8E1D3]">
              <div className="p-4 rounded bg-[#FBF9F4] border border-[#E8E1D3]">
                <div className="flex items-center justify-between text-[#8A919E] mb-2 font-mono text-[10px] uppercase tracking-wider font-semibold">
                  <span>Study Streak</span>
                  <Flame className="w-4 h-4 text-[#C83D1B]" />
                </div>
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-2xl font-bold text-[#181B1F]">{dashboardData.currentStreak}</span>
                  <span className="text-xs text-[#8A919E]">days</span>
                </div>
              </div>

              <div className="p-4 rounded bg-[#FBF9F4] border border-[#E8E1D3]">
                <div className="flex items-center justify-between text-[#8A919E] mb-2 font-mono text-[10px] uppercase tracking-wider font-semibold">
                  <span>Total Study Time</span>
                  <Clock className="w-4 h-4 text-[#36594A]" />
                </div>
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-2xl font-bold text-[#181B1F]">
                    {Math.floor(dashboardData.totalLearningTimeMinutes / 60)}h {dashboardData.totalLearningTimeMinutes % 60}m
                  </span>
                  <span className="text-xs text-[#8A919E]">logged</span>
                </div>
              </div>

              <div className="p-4 rounded bg-[#FBF9F4] border border-[#E8E1D3]">
                <div className="flex items-center justify-between text-[#8A919E] mb-2 font-mono text-[10px] uppercase tracking-wider font-semibold">
                  <span>Goals Completed</span>
                  <CheckCircle2 className="w-4 h-4 text-[#A96810]" />
                </div>
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-2xl font-bold text-[#181B1F]">
                    {goals.filter(g => g.status === 'COMPLETED').length} / {goals.length}
                  </span>
                  <span className="text-xs text-[#8A919E]">completed</span>
                </div>
              </div>

              <div className="p-4 rounded bg-[#FBF9F4] border border-[#E8E1D3]">
                <div className="flex items-center justify-between text-[#8A919E] mb-2 font-mono text-[10px] uppercase tracking-wider font-semibold">
                  <span>Learner Type</span>
                  <Award className="w-4 h-4 text-[#C83D1B]" />
                </div>
                <div className="truncate pt-1">
                  <span className={`inline-block px-2 py-0.5 rounded font-mono text-[11px] font-bold border ${getPersonaColorClass(dashboardData.persona)}`}>
                    {dashboardData.persona || 'Calibrating'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8E1D3] pb-3">
                <div>
                  <h3 className="font-serif text-lg font-normal text-[#181B1F]">Curated Study Articles & Guides</h3>
                  <p className="font-sans text-xs text-[#8A919E]">Your Subject: <span className="font-semibold text-[#181B1F]">{profile?.fieldOfStudy || 'General Learning'}</span></p>
                </div>
                <span className="font-mono text-[10px] text-[#8A919E] uppercase tracking-wider">Updated Weekly</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getNewsForField(profile?.fieldOfStudy || '').map((item, i) => (
                  <div key={i} className="bg-[#FFFFFF] border border-[#E8E1D3] rounded-lg p-5 hover:border-[#181B1F] transition-all flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-2.5">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#36594A] bg-[#EAF3EE] border border-[#36594A]/30 px-2 py-0.5 rounded">
                          {item.tag}
                        </span>
                        <span className="font-mono text-[10px] text-[#8A919E]">{item.readTime}</span>
                      </div>
                      <h4 className="font-serif text-sm font-semibold text-[#181B1F] leading-snug mb-2">{item.title}</h4>
                      <p className="font-sans text-xs text-[#535965] leading-relaxed line-clamp-3">{item.summary}</p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-[#F1ECE0] flex items-center justify-between font-mono text-[10px] text-[#8A919E]">
                      <span>Source: {item.source}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#8A919E]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#FFFFFF] border border-[#E8E1D3] rounded-lg p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4 border-b border-[#E8E1D3] pb-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8A919E]">Daily Thought</span>
                  <button
                    onClick={() => setQuoteIndex(i => (i + 1) % QUOTES.length)}
                    className="p-1 rounded text-[#8A919E] hover:text-[#181B1F] hover:bg-[#F1ECE0] transition-colors"
                    title="Next quote"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <blockquote className="font-serif text-sm text-[#181B1F] italic leading-relaxed mb-4">
                  "{QUOTES[quoteIndex].text}"
                </blockquote>
                <p className="font-mono text-[11px] text-[#8A919E] text-right">— {QUOTES[quoteIndex].author}</p>
              </div>

              <div className="bg-[#F7F4EB] border border-[#E8E1D3] rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-[#A96810] mt-0.5 shrink-0" />
                  <div>
                    <h5 className="font-mono text-xs uppercase tracking-wider text-[#181B1F] font-bold mb-1">Quick Study Tip</h5>
                    <p className="font-sans text-xs text-[#535965] leading-relaxed">
                      Taking just 2 minutes to write down specific goals before you begin can increase your focus and retention by up to 30%.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E8E1D3] rounded-lg p-5 space-y-3">
                <h5 className="font-mono text-xs uppercase tracking-wider font-bold text-[#181B1F]">Next Step</h5>
                <p className="font-sans text-xs text-[#535965] leading-relaxed">
                  Pick 1 to 3 manageable goals for today's session before starting your timer.
                </p>
                <button
                  onClick={() => { setPage('app'); setCurrentPhase('plan'); }}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#181B1F] hover:bg-[#2A2E35] text-white font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  <span>Start Planning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {page === 'app' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentPhase === 'plan' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="border-b border-[#E8E1D3] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8A919E] mb-2">
                    <span>Phase 1</span>
                    <span>/</span>
                    <span>Set Your Goals</span>
                  </div>
                  <h2 className="text-3xl font-serif font-normal tracking-tight text-[#181B1F]">
                    Plan Your Study Session
                  </h2>
                  <p className="text-xs font-sans text-[#535965] mt-1.5 max-w-2xl leading-relaxed">
                    Break your work into clear, manageable tasks. Committing to a specific goal and duration before you study keeps you organized and prevents overwhelm.
                  </p>
                </div>
                <div className="font-hand text-lg text-[#C83D1B] shrink-0 transform -rotate-1 hidden sm:block">
                  * Is this goal actually doable today? *
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 bg-[#FFFFFF] border-2 border-[#E8E1D3] rounded-lg p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E8E1D3]">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[#8A919E] font-semibold">
                        Add a Goal
                      </div>
                      <h3 className="font-serif text-lg font-normal text-[#181B1F] mt-0.5">
                        What are you working on?
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleAISuggestGoal}
                      className="px-2.5 py-1 rounded border border-[#E8E1D3] bg-[#F7F4EB] hover:bg-[#EFE8D8] text-[11px] font-mono text-[#181B1F] transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#C83D1B]" />
                      <span>Suggest Idea</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveGoal} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#535965] mb-1.5 font-semibold">
                        Goal Title
                      </label>
                      <input
                        type="text"
                        required
                        value={goalTitle}
                        onChange={e => setGoalTitle(e.target.value)}
                        placeholder="e.g. Solve 5 practice problems or read chapter 3"
                        className="w-full bg-[#FBF9F4] border border-[#E8E1D3] rounded p-2.5 text-xs font-sans text-[#181B1F] placeholder-[#8A919E] focus:outline-none focus:border-[#181B1F] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#535965] mb-1.5 font-semibold">
                        Subject / Topic
                      </label>
                      <input
                        type="text"
                        value={goalSubject}
                        onChange={e => setGoalSubject(e.target.value)}
                        placeholder="e.g. Mathematics, History, Computer Science"
                        className="w-full bg-[#FBF9F4] border border-[#E8E1D3] rounded p-2.5 text-xs font-sans text-[#181B1F] placeholder-[#8A919E] focus:outline-none focus:border-[#181B1F] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#535965] mb-1.5 font-semibold">
                          Target Minutes
                        </label>
                        <input
                          type="number"
                          required
                          min="5"
                          max="240"
                          value={goalDuration}
                          onChange={e => setGoalDuration(e.target.value)}
                          className="w-full bg-[#FBF9F4] border border-[#E8E1D3] rounded p-2.5 text-xs font-mono text-[#181B1F] focus:outline-none focus:border-[#181B1F] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#535965] mb-1.5 font-semibold">
                          Priority
                        </label>
                        <select
                          value={goalPriority}
                          onChange={e => setGoalPriority(e.target.value)}
                          className="w-full bg-[#FBF9F4] border border-[#E8E1D3] rounded p-2.5 text-xs font-sans text-[#181B1F] focus:outline-none focus:border-[#181B1F] focus:bg-white transition-all"
                        >
                          <option value="High">High Priority</option>
                          <option value="Medium">Medium Priority</option>
                          <option value="Low">Low Priority</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A919E] block mb-1.5">
                        Duration Presets (min):
                      </span>
                      <div className="flex gap-2">
                        {[25, 45, 60, 90].map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setGoalDuration(m.toString())}
                            className={`flex-1 py-1 rounded text-[11px] font-mono border transition-colors ${goalDuration === m.toString() ? 'bg-[#181B1F] text-white border-[#181B1F] font-bold' : 'bg-[#F7F4EB] text-[#535965] border-[#E8E1D3] hover:bg-[#EFE8D8]'}`}
                          >
                            {m}m
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-[#181B1F] hover:bg-[#2A2E35] text-white text-xs font-mono uppercase tracking-widest py-3 rounded transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Today's Goals</span>
                      </button>
                    </div>

                    <div className="mt-4 p-3 bg-[#FBF9F4] border border-dashed border-[#E8E1D3] rounded text-[11px] font-sans text-[#535965] leading-relaxed">
                      <strong className="text-[#181B1F] font-mono block mb-0.5">Helpful Reminder:</strong>
                      It is common to underestimate how long a topic takes. Give yourself an extra 10-15 minutes of buffer time.
                    </div>
                  </form>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E8E1D3]">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-lg font-normal text-[#181B1F]">
                        Study Goals ({goals.length})
                      </h3>
                      {goals.length > 0 && (
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                          <button
                            type="button"
                            onClick={() => setGoalFilter('ALL')}
                            className={`px-2 py-0.5 rounded transition-colors ${goalFilter === 'ALL' ? 'bg-[#181B1F] text-white font-bold' : 'bg-[#F7F4EB] text-[#535965] hover:bg-[#EFE8D8]'}`}
                          >
                            All ({goals.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setGoalFilter('ACTIVE')}
                            className={`px-2 py-0.5 rounded transition-colors ${goalFilter === 'ACTIVE' ? 'bg-[#181B1F] text-white font-bold' : 'bg-[#F7F4EB] text-[#535965] hover:bg-[#EFE8D8]'}`}
                          >
                            Active ({goals.filter(g => g.status !== 'COMPLETED').length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setGoalFilter('COMPLETED')}
                            className={`px-2 py-0.5 rounded transition-colors ${goalFilter === 'COMPLETED' ? 'bg-[#181B1F] text-white font-bold' : 'bg-[#F7F4EB] text-[#535965] hover:bg-[#EFE8D8]'}`}
                          >
                            Done ({goals.filter(g => g.status === 'COMPLETED').length})
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="font-mono text-xs text-[#8A919E]">
                      {goals.filter(g => g.status === 'COMPLETED').length} completed / {goals.length} total
                    </span>
                  </div>

                  {goals.length === 0 ? (
                    <div className="bg-[#FFFFFF] border-2 border-dashed border-[#E8E1D3] rounded-lg p-10 text-center text-[#8A919E]">
                      <Target className="w-8 h-8 mx-auto mb-2 text-[#8A919E]" />
                      <p className="font-serif text-base text-[#181B1F]">No goals added yet</p>
                      <p className="text-xs font-sans text-[#535965] mt-1 max-w-sm mx-auto">Add your first goal on the left, or load a realistic sample study log to explore the platform.</p>
                      <button
                        type="button"
                        disabled={isSeeding}
                        onClick={handleSeedSampleData}
                        className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded border border-[#E8E1D3] bg-[#F7F4EB] hover:bg-[#EFE8D8] text-[#181B1F] font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#A96810]" />
                        <span>{isSeeding ? 'Generating Sample Log...' : 'Load Sample Study Log'}</span>
                      </button>
                    </div>
                  ) : filteredGoals.length === 0 ? (
                    <div className="bg-[#FFFFFF] border border-[#E8E1D3] rounded-lg p-8 text-center text-[#8A919E]">
                      <p className="font-serif text-sm text-[#181B1F]">No goals match this filter</p>
                      <button
                        type="button"
                        onClick={() => setGoalFilter('ALL')}
                        className="mt-2 text-xs font-mono text-[#C83D1B] underline hover:opacity-80"
                      >
                        Reset filter to view all
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredGoals.map(goal => {
                        const progressPercent = goal.targetDuration ? Math.min(100, Math.round(((goal.progressMinutes || 0) / goal.targetDuration) * 100)) : 0;
                        let subtasks: string[] = [];
                        if (goal.aiBreakdown) {
                          try {
                            subtasks = JSON.parse(goal.aiBreakdown);
                          } catch {
                            subtasks = [];
                          }
                        }
                        const isDone = goal.status === 'COMPLETED';

                        return (
                          <div
                            key={goal.id}
                            className={`bg-[#FFFFFF] border rounded-lg p-5 transition-all shadow-xs ${isDone ? 'border-[#E8E1D3] bg-[#F7F4EB]/70 opacity-75' : 'border-[#E8E1D3] hover:border-[#D4CBBC]'}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleToggleGoalStatus(goal)}
                                  className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${isDone ? 'bg-[#36594A] border-[#36594A] text-white' : 'border-[#D4CBBC] hover:border-[#181B1F]'}`}
                                  title="Toggle status"
                                >
                                  {isDone && <Check className="w-3 h-3" />}
                                </button>
                                <div>
                                  <h4 className={`text-sm font-serif font-normal text-[#181B1F] ${isDone ? 'line-through text-[#8A919E]' : ''}`}>
                                    {goal.title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#535965] mt-1">
                                    <span className="font-semibold text-[#181B1F]">{goal.subject}</span>
                                    <span>•</span>
                                    <span>{goal.progressMinutes || 0} / {goal.targetDuration}m logged</span>
                                    <span>•</span>
                                    <span className="text-[#8A919E]">{goal.priority} Priority</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {!goal.aiBreakdown && !isDone && (
                                  <button
                                    type="button"
                                    onClick={() => handleGenerateBreakdown(goal.id)}
                                    className="text-[11px] font-mono text-[#C83D1B] hover:text-[#9F2D10] bg-[#FCECE8] border border-[#F6D0C6] px-2 py-0.5 rounded transition-colors flex items-center gap-1"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                    <span>Break Down</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGoal(goal.id)}
                                  className="text-[#8A919E] hover:text-[#C83D1B] p-1 rounded transition-colors"
                                  title="Delete entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="w-full bg-[#F1ECE0] rounded-full h-1 mt-3.5 overflow-hidden">
                              <div
                                className={`h-1 rounded-full transition-all duration-500 ${isDone ? 'bg-[#36594A]' : 'bg-[#181B1F]'}`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>

                            {subtasks.length > 0 && (
                              <div className="mt-3.5 pt-3 border-t border-[#F1ECE0] bg-[#FBF9F4] rounded p-3">
                                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-bold text-[#8A919E] mb-2">
                                  <Layers className="w-3 h-3 text-[#181B1F]" />
                                  <span>Suggested Action Steps</span>
                                </div>
                                <ul className="space-y-1.5">
                                  {subtasks.map((step, idx) => (
                                    <li key={idx} className="text-xs font-sans text-[#535965] flex items-start gap-2">
                                      <span className="font-mono text-[10px] text-[#C83D1B] font-bold mt-0.5">[{idx + 1}]</span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentPhase === 'act' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="border-b border-[#E8E1D3] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8A919E] mb-2">
                    <span>Phase 2</span>
                    <span>/</span>
                    <span>Focus & Timer</span>
                  </div>
                  <h2 className="text-3xl font-serif font-normal tracking-tight text-[#181B1F]">
                    Focus & Study Session
                  </h2>
                  <p className="text-xs font-sans text-[#535965] mt-1.5 max-w-2xl leading-relaxed">
                    Stay focused with timed intervals and avoid multitasking. If you get interrupted, record it freely — tracking distractions helps find your best study schedule.
                  </p>
                </div>
                <div className="font-hand text-lg text-[#C83D1B] shrink-0 transform -rotate-1 hidden sm:block">
                  * Put your phone face down or out of reach *
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 space-y-6">
                  <div className="bg-[#FFFFFF] border-2 border-[#E8E1D3] rounded-lg p-6 sm:p-8 shadow-xs relative">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E1D3]">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[#8A919E] font-semibold">
                          Focus Timer
                        </div>
                        <h3 className="font-serif text-lg font-normal text-[#181B1F] mt-0.5">
                          Timed Focus Session
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 bg-[#F7F4EB] p-1 border border-[#E8E1D3] rounded">
                        {[25, 45, 60].map(mins => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => setTimerPreset(mins)}
                            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${pomodoroTargetMins === mins ? 'bg-[#181B1F] text-white font-bold' : 'text-[#535965] hover:text-[#181B1F]'}`}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-6">
                      <div className="relative flex items-center justify-center">
                        <svg width="190" height="190" className="-rotate-90">
                          <circle cx="95" cy="95" r={timerRadius} fill="none" stroke="#F1ECE0" strokeWidth="6" />
                          <circle
                            cx="95"
                            cy="95"
                            r={timerRadius}
                            fill="none"
                            stroke={isTimerRunning ? '#C83D1B' : '#181B1F'}
                            strokeWidth="6"
                            strokeDasharray={timerCircumference}
                            strokeDashoffset={timerStrokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-300"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="font-mono text-4xl font-bold tracking-tight text-[#181B1F] block tabular-nums">
                            {formatClock(timerSeconds)}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A919E] mt-1 block">
                            {isTimerRunning ? 'Timer Active' : 'Ready to Start'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2.5 w-full sm:w-40">
                        <button
                          type="button"
                          onClick={handleTimerToggle}
                          className={`w-full py-2.5 px-4 rounded text-xs font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors ${isTimerRunning ? 'bg-[#A96810] hover:bg-[#8F560C] text-white' : 'bg-[#181B1F] hover:bg-[#2A2E35] text-white'}`}
                        >
                          {isTimerRunning ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                          <span>{isTimerRunning ? 'Pause Timer' : 'Start Focus'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleTimerStop}
                          className="w-full py-2 px-4 rounded text-xs font-mono text-[#181B1F] bg-[#F7F4EB] hover:bg-[#EFE8D8] border border-[#E8E1D3] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Square className="w-3 h-3" />
                          <span>Finish & Log</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleTimerReset}
                          className="w-full py-1.5 px-4 rounded text-xs font-mono text-[#8A919E] hover:text-[#181B1F] transition-colors flex items-center justify-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Timer</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#F1ECE0] flex items-center justify-between text-xs font-mono text-[#535965]">
                      <span>Guilt-free log:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setActivityDistractions(d => (parseInt(d, 10) + 1).toString());
                          toast('Distraction noted — keep up the good work!', { icon: '📝' });
                        }}
                        className="px-2.5 py-1 rounded bg-[#F7F4EB] hover:bg-[#EFE8D8] border border-[#E8E1D3] text-[11px] text-[#C83D1B] font-semibold transition-colors"
                      >
                        + I Got Distracted
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] border border-[#E8E1D3] rounded-lg p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#C83D1B]" />
                        <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#181B1F]">
                          Energy & Focus Indicator
                        </h4>
                      </div>
                      <span className={`stamp-box text-[10px] ${fatigueRisk > 60 ? 'stamp-red' : 'stamp-green'}`}>
                        {fatigueRisk > 60 ? 'Tired / Break Needed' : 'Good Energy'}
                      </span>
                    </div>

                    <div className="w-full bg-[#F1ECE0] rounded-full h-1.5 mb-3 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${fatigueRisk > 60 ? 'bg-[#C83D1B]' : 'bg-[#36594A]'}`}
                        style={{ width: `${fatigueRisk}%` }}
                      />
                    </div>

                    <div className="border-l-2 border-[#181B1F] pl-3 py-1 bg-[#FBF9F4] rounded-r">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[#8A919E] font-bold">
                        Study Tip
                      </div>
                      <p className="text-xs font-sans text-[#535965] mt-0.5 leading-relaxed">
                        {nudge || "Pace yourself with regular short breaks to maintain good retention."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-[#FFFFFF] border-2 border-[#E8E1D3] rounded-lg p-6 sm:p-8 shadow-xs">
                  <div className="pb-4 mb-4 border-b border-[#E8E1D3] flex items-baseline justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-normal text-[#181B1F]">
                        Log Study Session
                      </h3>
                      <p className="text-xs font-sans text-[#8A919E] mt-0.5">
                        Record your session details to track your study habits and build consistency.
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-[#8A919E] uppercase">Session Form</span>
                  </div>

                  <form onSubmit={handleLogActivity} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#535965] mb-1.5 font-semibold">
                        Connected Goal (Optional)
                      </label>
                      <select
                        value={activityGoalId}
                        onChange={e => setActivityGoalId(e.target.value)}
                        className="w-full bg-[#FBF9F4] border border-[#E8E1D3] rounded p-2.5 text-xs font-sans text-[#181B1F] focus:outline-none focus:border-[#181B1F] focus:bg-white transition-all"
                      >
                        <option value="">— General Study Session (No specific goal) —</option>
                        {goals.filter(g => g.status === 'ACTIVE').map(g => (
                          <option key={g.id} value={g.id}>{g.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#535965] mb-1.5 font-semibold">
                        What did you work on?
                      </label>
                      <input
                        type="text"
                        required
                        value={activitySubject}
                        onChange={e => setActivitySubject(e.target.value)}
                        placeholder="e.g. Solving calculus problems, reading chemistry chapter"
                        className="w-full bg-[#FBF9F4] border border-[#E8E1D3] rounded p-2.5 text-xs font-sans text-[#181B1F] placeholder-[#8A919E] focus:outline-none focus:border-[#181B1F] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#535965] mb-1.5 font-semibold">
                          Study Duration (min)
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={activityDuration}
                          onChange={e => setActivityDuration(e.target.value)}
                          className="w-full bg-[#FBF9F4] border border-[#E8E1D3] rounded p-2.5 text-xs font-mono text-[#181B1F] focus:outline-none focus:border-[#181B1F] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#535965] mb-1.5 font-semibold">
                          How challenging was it?
                        </label>
                        <select
                          value={activityDifficulty}
                          onChange={e => setActivityDifficulty(e.target.value)}
                          className="w-full bg-[#FBF9F4] border border-[#E8E1D3] rounded p-2.5 text-xs font-sans text-[#181B1F] focus:outline-none focus:border-[#181B1F] focus:bg-white transition-all"
                        >
                          <option value="1">Level 1 — Very Easy</option>
                          <option value="2">Level 2 — Easy / Familiar</option>
                          <option value="3">Level 3 — Moderate / Normal</option>
                          <option value="4">Level 4 — Challenging</option>
                          <option value="5">Level 5 — Very Difficult</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#535965] mb-1.5 font-semibold">
                        Distractions / Interruptions
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setActivityDistractions(d => Math.max(0, parseInt(d, 10) - 1).toString())}
                          className="w-8 h-8 rounded bg-[#F7F4EB] hover:bg-[#EFE8D8] border border-[#E8E1D3] flex items-center justify-center text-[#181B1F] font-mono font-bold transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={activityDistractions}
                          onChange={e => setActivityDistractions(e.target.value)}
                          className="w-16 text-center bg-[#FBF9F4] border border-[#E8E1D3] rounded py-1.5 text-xs font-mono font-bold text-[#181B1F]"
                        />
                        <button
                          type="button"
                          onClick={() => setActivityDistractions(d => (parseInt(d, 10) + 1).toString())}
                          className="w-8 h-8 rounded bg-[#F7F4EB] hover:bg-[#EFE8D8] border border-[#E8E1D3] flex items-center justify-center text-[#181B1F] font-mono font-bold transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-sans text-[#8A919E]">notifications or interruptions</span>
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="w-full bg-[#181B1F] hover:bg-[#2A2E35] text-white text-xs font-mono uppercase tracking-widest py-3 rounded transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Study Session</span>
                      </button>
                    </div>
                  </form>

                  {activities.length > 0 && (
                    <div className="pt-5 mt-6 border-t border-[#E8E1D3] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-wider text-[#535965] font-semibold">
                          Logged Sessions ({activities.length})
                        </span>
                        <span className="font-mono text-[10px] text-[#8A919E]">Most recent first</span>
                      </div>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {activities.slice(0, 5).map(act => (
                          <div key={act.id} className="p-3 bg-[#FBF9F4] border border-[#E8E1D3] rounded flex items-center justify-between text-xs">
                            <div className="space-y-0.5">
                              <span className="font-serif font-medium text-[#181B1F] block">{act.subject || act.task}</span>
                              <div className="flex items-center gap-2 font-mono text-[10px] text-[#8A919E]">
                                <span>{act.activityDate}</span>
                                {act.goalTitle && (
                                  <>
                                    <span>•</span>
                                    <span className="text-[#535965]">{act.goalTitle}</span>
                                  </>
                                )}
                                <span>•</span>
                                <span>Lvl {act.difficultyRating || 3}</span>
                              </div>
                            </div>
                            <div className="text-right font-mono text-xs">
                              <span className="font-bold text-[#181B1F]">{act.duration}m</span>
                              <span className="block text-[10px] text-[#8A919E]">{act.distractionCount || 0} dist.</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentPhase === 'reflect' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="hidden print-only mb-6 pb-4 border-b-2 border-[#181B1F]">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="font-serif text-2xl font-bold text-[#181B1F]">AIPLC — Self-Regulated Learning Field Report</h1>
                    <p className="font-sans text-xs text-[#535965] mt-1">Student: {profile?.name || 'Student'} ({profile?.email || '—'}) | {profile?.institution || 'Academic Institute'}</p>
                  </div>
                  <div className="text-right font-mono text-xs text-[#535965]">
                    <div>Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div>Streak: {dashboardData.currentStreak} Days | Total Study: {dashboardData.totalLearningTimeMinutes} mins</div>
                  </div>
                </div>
              </div>

              <div className="border-b border-[#E8E1D3] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8A919E] mb-2">
                    <span>Phase 3</span>
                    <span>/</span>
                    <span>Self-Reflection</span>
                    <span>/</span>
                    <span>Insights</span>
                  </div>
                  <h2 className="text-3xl font-serif font-normal tracking-tight text-[#181B1F]">
                    Your Learning Insights & Style
                  </h2>
                  <p className="text-xs font-sans text-[#535965] mt-1.5 max-w-2xl leading-relaxed">
                    See how your study sessions add up over time. The platform looks at your goal completion, focus time, and pacing to identify your unique study habits and suggest small improvements.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#E8E1D3] bg-[#FFFFFF] hover:bg-[#F7F4EB] text-[#181B1F] font-mono text-xs uppercase tracking-wider transition-colors shadow-xs"
                    title="Print or export as PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#535965]" />
                    <span>Export Field Report</span>
                  </button>
                  <div className="font-hand text-lg text-[#C83D1B] shrink-0 transform -rotate-1 hidden sm:block">
                    * Learn how you learn best *
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#FFFFFF] border border-[#E8E1D3] rounded-lg p-5 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between text-[#8A919E] mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest font-semibold">Study Streak</span>
                    <Flame className="w-3.5 h-3.5 text-[#C83D1B]" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-4xl font-bold tracking-tight text-[#181B1F]">
                      {dashboardData.currentStreak}
                    </span>
                    <span className="text-xs font-mono text-[#535965] uppercase">consecutive days</span>
                  </div>
                  <div className="pt-3 border-t border-[#F1ECE0] flex items-center justify-between text-[11px] text-[#535965]">
                    <span>Daily consistency</span>
                    <span className="font-mono text-[10px] text-[#36594A] font-semibold">Active rhythm</span>
                  </div>
                </div>

                <div className="bg-[#FFFFFF] border border-[#E8E1D3] rounded-lg p-5 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between text-[#8A919E] mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest font-semibold">Study Time</span>
                    <Clock className="w-3.5 h-3.5 text-[#36594A]" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-4xl font-bold tracking-tight text-[#181B1F]">
                      {Math.floor(dashboardData.totalLearningTimeMinutes / 60)}<span className="text-xl font-normal text-[#8A919E]">h</span> {dashboardData.totalLearningTimeMinutes % 60}<span className="text-xl font-normal text-[#8A919E]">m</span>
                    </span>
                  </div>
                  <div className="pt-3 border-t border-[#F1ECE0] flex items-center justify-between text-[11px] text-[#535965]">
                    <span>Time focused</span>
                    <span className="font-mono text-[10px] text-[#535965]">Total logged</span>
                  </div>
                </div>

                <div className="bg-[#FFFFFF] border border-[#E8E1D3] rounded-lg p-5 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between text-[#8A919E] mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest font-semibold">Goal Completion</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A96810]" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-4xl font-bold tracking-tight text-[#181B1F]">
                      {goals.filter(g => g.status === 'COMPLETED').length}
                    </span>
                    <span className="text-xl font-mono text-[#8A919E]">/</span>
                    <span className="font-mono text-2xl text-[#535965]">{goals.length}</span>
                    <span className="text-xs font-mono text-[#535965] uppercase ml-1">goals completed</span>
                  </div>
                  <div className="pt-3 border-t border-[#F1ECE0] flex items-center justify-between text-[11px] text-[#535965]">
                    <span>Completion rate</span>
                    <span className="font-mono text-[10px] font-semibold text-[#181B1F]">
                      {goals.length > 0 ? Math.round((goals.filter(g => g.status === 'COMPLETED').length / goals.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFFFFF] border-2 border-[#E8E1D3] rounded-lg p-6 sm:p-8 shadow-xs relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E8E1D3]">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-[#8A919E]">
                        Your Learner Profile
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[#8A919E]"></span>
                      <span className="font-mono text-[11px] text-[#535965]">Personalized Insights</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-serif text-2xl font-normal text-[#181B1F]">
                        Learner Type:
                      </h3>
                      <div className={`stamp-box ${
                        dashboardData.persona.includes('Efficient') ? 'stamp-green' :
                        dashboardData.persona.includes('Over-Planner') ? 'stamp-amber' :
                        dashboardData.persona.includes('Distracted') ? 'stamp-red' :
                        'stamp-ink'
                      }`}>
                        {dashboardData.persona || 'Calibrating'}
                      </div>
                    </div>
                  </div>

                  {aiAction && (
                    <div className="font-mono text-xs uppercase px-3 py-1 border border-[#E8E1D3] rounded bg-[#F7F4EB] text-[#535965] self-start md:self-center">
                      Tip: {aiAction === 'accepted' ? 'Saved' : 'Dismissed'}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-6">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="border-l-2 border-[#C83D1B] pl-4 py-1 bg-[#FBF9F4] rounded-r-md">
                      <div className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#C83D1B] mb-1">
                        Study Observation
                      </div>
                      {isEditingAISuggestion ? (
                        <div className="space-y-3 pt-1">
                          <textarea
                            rows={3}
                            value={editedAISuggestion}
                            onChange={e => setEditedAISuggestion(e.target.value)}
                            className="w-full bg-[#FFFFFF] border border-[#E8E1D3] rounded p-3 text-xs font-mono text-[#181B1F] focus:outline-none focus:border-[#181B1F]"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => setIsEditingAISuggestion(false)}
                              className="px-3 py-1 rounded text-xs font-mono text-[#535965] hover:bg-[#F1ECE0]"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAcceptAI}
                              className="px-3 py-1 rounded text-xs font-mono bg-[#181B1F] text-white"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm font-serif italic text-[#181B1F] leading-relaxed">
                          "{dashboardData.recommendation || 'You maintain great focus when you set clear goals. Keep up the steady pace and take short breaks when needed.'}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2">
                      <div className="text-[11px] font-mono uppercase tracking-widest text-[#8A919E] mb-2 font-semibold">
                        Recommended Habits to Try Next
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3 p-3 bg-[#F7F4EB] border border-[#E8E1D3] rounded text-xs text-[#181B1F]">
                          <span className="font-mono text-[#C83D1B] font-bold text-xs">01</span>
                          <span className="font-sans leading-relaxed">
                            <strong>Keep Sessions Bite-Sized:</strong> If your focus wanders, cap your session at 35 minutes and take a short 5-minute break.
                          </span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-[#F7F4EB] border border-[#E8E1D3] rounded text-xs text-[#181B1F]">
                          <span className="font-mono text-[#C83D1B] font-bold text-xs">02</span>
                          <span className="font-sans leading-relaxed">
                            <strong>Limit to 3 Goals at a Time:</strong> Plan no more than 3 high-priority study tasks per study block to stay fresh.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-[#F7F4EB] border border-[#E8E1D3] rounded p-4 text-xs font-mono space-y-3">
                    <div className="text-[10px] uppercase tracking-wider text-[#8A919E] font-bold pb-2 border-b border-[#E8E1D3]">
                      Your Study Pattern Summary
                    </div>
                    <div className="space-y-2 text-[11px] text-[#535965]">
                      <div className="flex justify-between">
                        <span>Goal Completion:</span>
                        <span className="font-bold text-[#181B1F]">
                          {goals.length > 0 ? (goals.filter(g => g.status === 'COMPLETED').length / goals.length).toFixed(3) : '0.000'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pacing Factor:</span>
                        <span className="font-bold text-[#181B1F]">1.138×</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Learner Archetype:</span>
                        <span className="font-bold text-[#181B1F]">{dashboardData.persona}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-[#E8E1D3]">
                  <button
                    type="button"
                    onClick={handleDismissAI}
                    className="px-4 py-2 rounded text-xs font-mono text-[#8A919E] hover:text-[#181B1F] transition-colors"
                  >
                    [ Dismiss Tip ]
                  </button>
                  <button
                    type="button"
                    onClick={handleEditAI}
                    className="px-4 py-2 rounded text-xs font-mono text-[#535965] border border-[#E8E1D3] hover:bg-[#F7F4EB] transition-colors"
                  >
                    Edit Tip
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAI}
                    className="px-5 py-2 rounded text-xs font-mono uppercase tracking-wider bg-[#181B1F] hover:bg-[#2A2E35] text-white font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save This Tip</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E8E1D3] rounded-lg p-6 sm:p-8 shadow-xs">
                <div className="mb-6 pb-4 border-b border-[#E8E1D3] flex items-baseline justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-normal text-[#181B1F]">
                      Daily Learning Reflection
                    </h3>
                    <p className="text-xs font-sans text-[#8A919E] mt-0.5">
                      A quick journal to write down what worked, what was difficult, and what you will try next time.
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-[#8A919E] uppercase tracking-wider">
                    Today's Entry
                  </span>
                </div>

                <form onSubmit={handleSaveReflection} className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#535965] mb-2 font-semibold">
                      1. What went well during your study session?
                    </label>
                    <textarea
                      rows={2}
                      value={reflectionForm.whatWentWell}
                      onChange={e => setReflectionForm({ ...reflectionForm, whatWentWell: e.target.value })}
                      placeholder="e.g. Practicing practice problems right after reading helped the concepts stick."
                      className="w-full bg-[#FBF9F4] border border-[#E8E1D3] rounded p-3 text-xs font-sans text-[#181B1F] placeholder-[#8A919E] focus:outline-none focus:border-[#181B1F] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#535965] mb-2 font-semibold">
                      2. What was challenging or caused distractions?
                    </label>
                    <textarea
                      rows={2}
                      value={reflectionForm.whatWasDifficult}
                      onChange={e => setReflectionForm({ ...reflectionForm, whatWasDifficult: e.target.value })}
                      placeholder="e.g. After 40 minutes of studying, I felt tired and checked my phone twice."
                      className="w-full bg-[#FBF9F4] border border-[#E8E1D3] rounded p-3 text-xs font-sans text-[#181B1F] placeholder-[#8A919E] focus:outline-none focus:border-[#181B1F] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#535965] mb-2 font-semibold">
                      3. What will you do differently next time?
                    </label>
                    <textarea
                      rows={2}
                      value={reflectionForm.whatToChange}
                      onChange={e => setReflectionForm({ ...reflectionForm, whatToChange: e.target.value })}
                      placeholder="e.g. Take a planned 5-minute stretch break halfway through and move my phone away."
                      className="w-full bg-[#FBF9F4] border border-[#E8E1D3] rounded p-3 text-xs font-sans text-[#181B1F] placeholder-[#8A919E] focus:outline-none focus:border-[#181B1F] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#181B1F] hover:bg-[#2A2E35] text-white text-xs font-mono uppercase tracking-widest py-3 rounded transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Save Reflection to Journal</span>
                    </button>
                  </div>
                </form>
              </div>

              {reflections.length > 0 && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between border-b border-[#E8E1D3] pb-2">
                    <h3 className="font-serif text-lg font-normal text-[#181B1F]">
                      Past Reflections ({reflections.length})
                    </h3>
                    <span className="font-mono text-[10px] text-[#8A919E] uppercase">Study History</span>
                  </div>
                  <div className="space-y-3">
                    {reflections.map((r, i) => (
                      <div key={r.id || i} className="bg-[#FFFFFF] border border-[#E8E1D3] rounded-lg p-5 shadow-xs">
                        <div className="flex items-center justify-between text-xs font-mono text-[#8A919E] mb-3 pb-2 border-b border-[#F1ECE0]">
                          <span className="font-bold text-[#181B1F]">Journal Entry #{reflections.length - i}</span>
                          <span>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                          <div>
                            <span className="font-mono text-[10px] uppercase font-bold text-[#36594A] block mb-1">What Worked</span>
                            <p className="text-[#535965] leading-relaxed">{r.whatWentWell || '—'}</p>
                          </div>
                          <div>
                            <span className="font-mono text-[10px] uppercase font-bold text-[#C83D1B] block mb-1">What Was Difficult</span>
                            <p className="text-[#535965] leading-relaxed">{r.whatWasDifficult || '—'}</p>
                          </div>
                          <div>
                            <span className="font-mono text-[10px] uppercase font-bold text-[#181B1F] block mb-1">Next Step</span>
                            <p className="text-[#535965] leading-relaxed">{r.whatToChange || '—'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {showProfile && (
        <div className="fixed inset-0 z-50 bg-[#181B1F]/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-[#FBF9F4] h-full shadow-2xl border-l border-[#E8E1D3] flex flex-col p-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D3]">
              <div>
                <h3 className="font-serif text-base font-normal text-[#181B1F]">Student Profile</h3>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A919E]">Learning Account</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);
                  setIsConfirmingSignOut(false);
                }}
                className="p-1 rounded text-[#8A919E] hover:text-[#181B1F] hover:bg-[#F1ECE0] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative group mb-3">
                  {profile?.profilePicture ? (
                    <img src={profile.profilePicture} alt="Profile" className="w-20 h-20 rounded object-cover border border-[#E8E1D3]" />
                  ) : (
                    <div className="w-20 h-20 rounded bg-[#181B1F] text-[#FBF9F4] flex items-center justify-center text-xl font-mono font-bold">
                      {getInitials(profile?.name)}
                    </div>
                  )}
                  <label className="absolute inset-0 rounded bg-[#181B1F]/70 text-white text-[10px] font-mono uppercase flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-4 h-4 mr-1" />
                    <span>Change</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
                  </label>
                </div>
                <h4 className="font-serif text-lg font-normal text-[#181B1F]">{profile?.name || 'Student'}</h4>
                <p className="font-mono text-xs text-[#8A919E]">{profile?.fieldOfStudy || 'Student'}</p>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#535965] mb-1 font-semibold">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-[#FFFFFF] border border-[#E8E1D3] rounded p-2 text-xs font-sans text-[#181B1F] focus:outline-none focus:border-[#181B1F]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#535965] mb-1 font-semibold">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full bg-[#FFFFFF] border border-[#E8E1D3] rounded p-2 text-xs font-sans text-[#181B1F] focus:outline-none focus:border-[#181B1F]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#535965] mb-1 font-semibold">Subject / Major</label>
                    <input
                      type="text"
                      value={editForm.fieldOfStudy}
                      onChange={e => setEditForm({ ...editForm, fieldOfStudy: e.target.value })}
                      className="w-full bg-[#FFFFFF] border border-[#E8E1D3] rounded p-2 text-xs font-sans text-[#181B1F] focus:outline-none focus:border-[#181B1F]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#535965] mb-1 font-semibold">School / College</label>
                    <input
                      type="text"
                      value={editForm.institution}
                      onChange={e => setEditForm({ ...editForm, institution: e.target.value })}
                      className="w-full bg-[#FFFFFF] border border-[#E8E1D3] rounded p-2 text-xs font-sans text-[#181B1F] focus:outline-none focus:border-[#181B1F]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#535965] mb-1 font-semibold">About You / Study Goals</label>
                    <textarea
                      rows={2}
                      value={editForm.bio}
                      onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full bg-[#FFFFFF] border border-[#E8E1D3] rounded p-2 text-xs font-sans text-[#181B1F] focus:outline-none focus:border-[#181B1F]"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 py-2 text-xs font-mono uppercase tracking-wider text-[#535965] bg-[#F7F4EB] rounded border border-[#E8E1D3] hover:bg-[#F1ECE0]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-xs font-mono uppercase tracking-wider text-white bg-[#181B1F] rounded hover:bg-[#2A2E35]"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded bg-[#FFFFFF] border border-[#E8E1D3] space-y-3">
                    <div>
                      <span className="text-[#8A919E] block font-mono text-[10px] uppercase font-bold">Email</span>
                      <span className="font-mono text-xs text-[#181B1F]">{profile?.email || '—'}</span>
                    </div>
                    <div>
                      <span className="text-[#8A919E] block font-mono text-[10px] uppercase font-bold">School / College</span>
                      <span className="font-sans text-xs text-[#181B1F]">{profile?.institution || '—'}</span>
                    </div>
                    {profile?.bio && (
                      <div>
                        <span className="text-[#8A919E] block font-mono text-[10px] uppercase font-bold">About You</span>
                        <p className="font-sans text-xs text-[#535965] leading-relaxed">{profile.bio}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="w-full py-2 rounded border border-[#E8E1D3] bg-[#F7F4EB] hover:bg-[#F1ECE0] text-[#181B1F] font-mono text-xs uppercase tracking-wider transition-colors"
                    >
                      Edit Profile
                    </button>
                    <button
                      type="button"
                      disabled={isSeeding}
                      onClick={handleSeedSampleData}
                      className="w-full py-2 rounded border border-[#E8E1D3] bg-[#FFFFFF] hover:bg-[#F7F4EB] text-[#181B1F] font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#A96810]" />
                      <span>{isSeeding ? 'Generating Log...' : 'Load Sample Study Log'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E8E1D3]">
              {isConfirmingSignOut ? (
                <div className="p-3 bg-[#FBECE8] border border-[#C83D1B]/30 rounded space-y-2">
                  <p className="font-sans text-xs text-[#C83D1B] font-medium text-center">End your study session for today?</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem('userId');
                        setLoggedInUserId(null);
                        setShowProfile(false);
                        setIsConfirmingSignOut(false);
                        toast.success('Logged out successfully');
                      }}
                      className="flex-1 py-1.5 rounded bg-[#C83D1B] text-white font-mono text-[11px] uppercase tracking-wider font-bold hover:bg-[#A93315] transition-colors"
                    >
                      Confirm Sign Out
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmingSignOut(false)}
                      className="flex-1 py-1.5 rounded border border-[#E8E1D3] bg-white text-[#535965] font-mono text-[11px] uppercase tracking-wider hover:bg-[#F7F4EB] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingSignOut(true)}
                  className="w-full py-2.5 rounded border border-[#C83D1B]/40 bg-[#FBECE8] hover:bg-[#F7DDD7] text-[#C83D1B] font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
