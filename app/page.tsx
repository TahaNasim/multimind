'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  History,
  Image,
  Lock,
  LogOut,
  Menu,
  Mic,
  Moon,
  Paperclip,
  Plus,
  Send,
  Sparkles as SparklesIcon,
  Sun,
  Trash2,
  User,
  X,
  Crown,
  Zap,
  Check,
  Brain,           // ← for features
  MessageSquare,   // ← for features
  Globe,           // ← for features
  Shield,          // ← for features
  ArrowRight,      // ← THIS FIXES YOUR ERROR
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
// Custom SVG Logo Components
const GPTLogo = ({ className = "w-8 h-8", darkMode = false }: { className?: string; darkMode?: boolean }) => (
  <div
    className={className}
    style={{
      backgroundImage: `url(/svg-logos/${darkMode ? 'chatgpt-white.svg' : 'gpt-5.svg'})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minWidth: '32px',
      minHeight: '32px'
    }}
  />
);
const ClaudeLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div
    className={className}
    style={{
      backgroundImage: 'url(/svg-logos/claude.svg)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minWidth: '32px',
      minHeight: '32px'
    }}
  />
);
const GeminiLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div
    className={className}
    style={{
      backgroundImage: 'url(/svg-logos/gemini.svg)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minWidth: '32px',
      minHeight: '32px'
    }}
  />
);
const DeepSeekLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div
    className={className}
    style={{
      backgroundImage: 'url(/svg-logos/deepseek.svg)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minWidth: '32px',
      minHeight: '32px'
    }}
  />
);
// Add these above AI_MODELS in your page.tsx
const PerplexityLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div
    className={className}
    style={{
      backgroundImage: 'url(/svg-logos/perplexity.svg)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minWidth: '32px',
      minHeight: '32px'
    }}
  />
);
const GrokLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div
    className={className}
    style={{
      backgroundImage: 'url(/svg-logos/grok.svg)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minWidth: '32px',
      minHeight: '32px'
    }}

  />

);
// Add these with your other logo components (after GrokLogo or before AI_MODELS)

const MetaLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div
    className={className}
    style={{
      backgroundImage: 'url(/svg-logos/meta.svg)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }}
  />
);

const QwenLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div
    className={className}
    style={{
      backgroundImage: 'url(/svg-logos/qwen.svg)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }}
  />
);

const MistralLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div
    className={className}
    style={{
      backgroundImage: 'url(/svg-logos/mistral.svg)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }}
  />
);
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: React.ReactNode | ((darkMode: boolean) => React.ReactNode);
  color: string;
  bgColor: string;
  isPremium?: boolean;   // ← makes it optional (safe for old models)
  locked: boolean; // ← REQUIRED, not optional!     // ← shows lock icon + blocks toggle
}
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  modelId?: string;
  isBest?: boolean;
}
interface ModelResponse {
  modelId: string;
  content: string;
  isLoading: boolean;
  error?: string;
  isBest?: boolean;
}
const AI_MODELS: AIModel[] = [
  // ==================== PREMIUM MODELS (Locked) ====================
  {
    id: 'gpt-5',
    name: 'ChatGPT',
    provider: 'GPT-5',
    description: 'Most advanced reasoning & vision',
    icon: (darkMode: boolean) => <GPTLogo className="w-8 h-8" darkMode={darkMode} />,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-500/10',
    isPremium: true,
    locked: true
  },
  {
    id: 'claude-4-sonnet',
    name: 'Claude',
    provider: 'Sonnet 4',
    description: 'Best reasoning & safety',
    icon: <ClaudeLogo className="w-8 h-8" />,
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-500/10',
    isPremium: true,
    locked: true
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',           // ← Clear name
    provider: 'Google',
    description: 'Multimodal + real-time web',
    icon: <GeminiLogo className="w-8 h-8" />,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500/10',
    isPremium: true,
    locked: true
  },
  {
    id: 'deepseek-pro',
    name: 'DeepSeek Pro',          // ← Clear name
    provider: 'DeepSeek',
    description: 'Top-tier coding & math',
    icon: <DeepSeekLogo className="w-8 h-8" />,
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-500/10',
    isPremium: true,
    locked: true
  },
  {
    id: 'perplexity-pro',
    name: 'Perplexity',
    provider: 'Perplexity Pro',
    description: 'Live web search + sources',
    icon: <PerplexityLogo className="w-8 h-8" />,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-500/10',
    isPremium: true,
    locked: true
  },
  {
    id: 'grok-2',
    name: 'Grok',
    provider: 'Grok 2',
    description: 'Real-time X data + humor',
    icon: <GrokLogo className="w-8 h-8" />,
    color: 'from-orange-500 to-yellow-600',
    bgColor: 'bg-orange-500/10',
    isPremium: true,
    locked: true
  },

  // ==================== FREE MODELS (Unlocked) ====================
  {
    id: 'google',
    name: 'Gemini Flash',          // ← Free version clearly named
    provider: 'Google',
    description: 'Fast & free multimodal',
    icon: <GeminiLogo className="w-8 h-8" />,
    color: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    isPremium: false,
    locked: false
  },
  {
    id: 'deepseek',
    name: 'DeepSeek Chat',         // ← Free version clearly named
    provider: 'DeepSeek',
    description: 'Free advanced reasoning',
    icon: <DeepSeekLogo className="w-8 h-8" />,
    color: 'from-rose-400 to-pink-500',
    bgColor: 'bg-rose-500/10',
    isPremium: false,
    locked: false
  },
  {
    id: 'meta-llama',
    name: 'Meta',
    provider: 'Llama 3.3 70B',
    description: 'Open-source 70B – free',
    icon: <MetaLogo className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10',
    isPremium: false,
    locked: false
  },
  {
    id: 'qwen',
    name: 'Qwen',
    provider: 'Qwen 2.5 72B',
    description: 'Free & powerful',
    icon: <QwenLogo className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-500/10',
    isPremium: false,
    locked: false
  },
  {
    id: 'mistralai',
    name: 'Mistral',
    provider: 'Mistral Small 3.1',
    description: 'Fast & free European model',
    icon: <MistralLogo className="w-8 h-8" />,
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-500/10',
    isPremium: false,
    locked: false
  }
];
export default function Home() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const [showWebSearch, setShowWebSearch] = useState(false);
  const [webQuery, setWebQuery] = useState("");
  const [webResults, setWebResults] = useState<string | null>(null);
  const [showModelPreferences, setShowModelPreferences] = useState(false);
  //const [showModelsDropdown, setShowModelsDropdown] = useState(false);
  // Add this with your other useStates (near the top of Home())
  const [showFirstTimePreferences, setShowFirstTimePreferences] = useState(false);
  const [hasSavedPreferences, setHasSavedPreferences] = useState<boolean | null>(null);
  const [showFreeOnly, setShowFreeOnly] = useState(true);   // true = show free only
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  async function handleWebSearch(e: React.FormEvent) {
  e.preventDefault();
  if (!webQuery.trim()) return;
  // Add loading state if desired: setIsWebLoading(true);
  try {
    const res = await fetch(`/api/google-search?q=${encodeURIComponent(webQuery)}`);
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    setWebResults(data.answer || data.error || "No results found.");
  } catch (err) {
    setWebResults("Error: Could not fetch from Google. Check console.");
    console.error(err);
  } finally {
    // setIsWebLoading(false);
  }
}
  const { user, signOut } = useAuth();
  const { darkMode, toggleDarkMode, mounted } = useTheme();
  // ADD THIS — NO RED LINES, WORKS IMMEDIATELY
useEffect(() => {
  if (!user) {
    console.log("No user logged in");
    return;
  }

  console.log("USER DEBUG (FINAL):");
  console.log("• user object:", user);
  console.log("• user.id:", user.id);
  console.log("• user.email:", user.email);
  console.log("• user.user_metadata:", user.user_metadata);
}, [user]);
  const [selectedModels, setSelectedModels] = useState<string[]>(AI_MODELS.map(m => m.id));
  const [allowedModels, setAllowedModels] = useState<string[]>(AI_MODELS.map(m => m.id));
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [responses, setResponses] = useState<ModelResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  

useEffect(() => {
  if (!user) {
    setIsPremiumUser(false);
    return;
  }
  supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single()
    .then(({ data }) => setIsPremiumUser(data?.is_premium === true));
}, [user]);


  // These are the 5 REAL free models on OpenRouter (2025)
  const [freeModelIds] = useState<string[]>([
    'google',      // Gemini Flash / 2.0
    'meta-llama',  // Llama 3.3 70B (free tier)
    'qwen',        // Qwen 2.5 72B
    'mistralai',   // Mistral Small 3.1 / Nemo
    'deepseek',    // DeepSeek Chat
  ]);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [attemptedPremiumModel, setAttemptedPremiumModel] = useState<string | null>(null);
  const [recentSessions, setRecentSessions] = useState<{ id: string, title: string, firstMessage: string, date: string }[]>([]);
  const [recentSessionsLoading, setRecentSessionsLoading] = useState(true);
  const [recentSessionsError, setRecentSessionsError] = useState(false);
  const filteredSessions = recentSessions.filter((session) => {
  const q = searchQuery.toLowerCase();

  return (
    session.title.toLowerCase().includes(q) ||
    session.firstMessage?.toLowerCase().includes(q)
  );
});

  // State for file attachments
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  // Check for mobile screen size and collapse sidebar by default
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768; // Standard mobile breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    // Set initial state
    handleResize();
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [passwordChange, setPasswordChange] = useState({ current: '', new: '', confirm: '' });
  // VOICE RECOGNITION SETUP - SILENT & CLEAN
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = 'en-US';

    recog.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCurrentInput(prev => prev + ' ' + transcript.trim());
      setIsRecording(false);
    };

    recog.onerror = (event: any) => {
      // SILENT LOG — NO CONSOLE.ERROR → NO RED LINE
      console.log('[Voice] Recognition failed:', event.error);

      // Only alert on real issues
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        alert('Microphone access denied. Please allow mic in browser settings.');
      }
      setIsRecording(false);
    };

    recog.onend = () => {
      setIsRecording(false);
    };

    setRecognition(recog);
  }, []);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Preferences state (used in Settings modal)
  const [prefLoading, setPrefLoading] = useState(false);
  // REPLACE your current prefSelected line with this:
  const [prefSelected, setPrefSelected] = useState<string[]>(
    AI_MODELS.filter(m => !m.locked).map(m => m.id)  // ← all free models pre-selected
  );
  const [prefError, setPrefError] = useState('');
  const [prefMessage, setPrefMessage] = useState('');
  const [prefSaving, setPrefSaving] = useState(false);
 const togglePrefModel = (id: string) => {
  setPrefSelected(prev =>
    prev.includes(id)
      ? prev.filter(x => x !== id)
      : [...prev, id]
  );
};



  const savePreferences = async () => {
    if (!user || prefSelected.length === 0) return;

    setPrefSaving(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ user_id: user.id, selected_models: prefSelected }, { onConflict: 'user_id' });

      if (error) throw error;

      setAllowedModels(prefSelected);
      setSelectedModels(prev => prev.filter(id => prefSelected.includes(id)));
      setHasSavedPreferences(true);

      // Show success message inside modal
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowModelPreferences(false);
        setShowFirstTimePreferences(false);
      }, 2500); // Auto-close after 2.5 seconds

    } catch (err) {
      console.error(err);
    } finally {
      setPrefSaving(false);
    }
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, responses]);

  // Auto-load recent chats when user logs in
useEffect(() => {
  if (user) {
    loadRecentSessions();
  } else {
    setRecentSessions([]);
  }
}, [user]);
// THIS MAKES LIGHT MODE ACTUALLY WORK (add this once)
useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }
}, [darkMode]);
  // Check if user has saved preferences → show first-time modal
  // FIRST-TIME MODEL PREFERENCE POPUP – 100% WORKING VERSION
  useEffect(() => {
    if (!user) {
      // User not logged in → hide popup
      setShowFirstTimePreferences(false);
      return;
    }

    const check = async () => {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('selected_models')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Supabase error:', error);
        }

        // NO saved preferences → FIRST TIME USER
        if (!data || !data.selected_models || data.selected_models.length === 0) {
          console.log('FIRST TIME USER → SHOWING POPUP');
          setPrefSelected(AI_MODELS.filter(m => !m.locked).map(m => m.id));
          setShowFirstTimePreferences(true);
        } else {
          console.log('User has preferences → no popup');
          setPrefSelected(data.selected_models);
          setAllowedModels(data.selected_models);
          setShowFirstTimePreferences(false);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    check();
  }, [user]);
  // Function to load recent chat sessions
  // LOAD RECENT CHATS - BULLETPROOF + AUTO REFRESH ON DELETE
  // In page.tsx — REPLACE loadRecentSessions ENTIRELY
  const deleteChatSession = async (sessionId: string) => {
  if (!user) return;

  // Confirmation
  if (!confirm("Delete this chat permanently? This cannot be undone.")) return;

  try {
    // 1. Delete model responses
    const { data: messageIds } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('session_id', sessionId);

    if (messageIds && messageIds.length > 0) {
      await supabase
        .from('model_responses')
        .delete()
        .in('message_id', messageIds.map(m => m.id));
    }

    // 2. Delete messages
    await supabase
      .from('chat_messages')
      .delete()
      .eq('session_id', sessionId);

    // 3. Delete the session itself
    await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    // 4. If this was the active chat → reset UI
    if (currentSessionId === sessionId) {
      handleNewChat();
    }

    // 5. FORCE REFRESH: Optimistically remove from state + refetch
    setRecentSessions(prev => prev.filter(s => s.id !== sessionId));
    
    // Then re-fetch from DB to be 100% sure (prevents ghost entries)
    await loadRecentSessions();

  } catch (err: any) {
    console.error("Delete failed:", err);
    alert("Failed to delete chat: " + (err.message || "Unknown error"));
    // Even on error, refetch to sync UI with reality
    await loadRecentSessions();
  }
};
const loadRecentSessions = async () => {
  if (!user?.id) {
    setRecentSessions([]);
    setRecentSessionsLoading(false);
    return;
  }

  setRecentSessionsLoading(true);
  setRecentSessionsError(false);

  try {
    // 1. Get all sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('id, title, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(20);

    if (sessionsError) throw sessionsError;
    if (!sessions || sessions.length === 0) {
      setRecentSessions([]);
      setRecentSessionsLoading(false);
      return;
    }

    // 2. Get the FIRST user message from each session (to show preview)
    const sessionIds = sessions.map(s => s.id);
    const { data: messages, error: msgError } = await supabase
      .from('chat_messages')
      .select('session_id, content')
      .in('session_id', sessionIds)
      .eq('role', 'user')
      .order('timestamp', { ascending: true })
      .limit(1000); // safe limit

    if (msgError) throw msgError;

    // Create map: sessionId → first message content
    const firstMsgMap = new Map<string, string>();
    messages?.forEach(msg => {
      if (!firstMsgMap.has(msg.session_id)) {
        firstMsgMap.set(msg.session_id, msg.content);
      }
    });

    // 3. Build final list
    const formatted = sessions.map(session => ({
      id: session.id,
      title: session.title || "New Chat",
      firstMessage: firstMsgMap.get(session.id) || "No messages yet",
      date: formatRelativeTime(new Date(session.updated_at))
    }));

    setRecentSessions(formatted);
  } catch (err) {
    console.error("Failed to load recent chats:", err);
    setRecentSessionsError(true);
  } finally {
    setRecentSessionsLoading(false);
  }
};

// Helper function — put this anywhere outside the component
const formatRelativeTime = (date: Date) => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};
  const loadChatSession = async (sessionId: string) => {
    if (!user) return;
    try {
      // Validate session ID
      if (!sessionId) {
        throw new Error('Invalid session ID');
      }
      // Set current session ID
      setCurrentSessionId(sessionId);
      // Clear current messages and responses
      setMessages([]);
      setResponses([]);
      // Load messages for this session
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('id, content, role, timestamp')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });
      if (messagesError) {
        console.log('Error fetching messages:', messagesError);
        throw new Error(`Failed to fetch messages: ${messagesError.message}`);
      }
      if (!messagesData) {
        throw new Error('No message data returned from database');
      }
      if (messagesData) {
        // Load all model responses for all user messages
        const userMessages = messagesData.filter(msg => msg.role === 'user');
        const allResponses = new Map();
        // For each user message, load its model responses
        for (const userMsg of userMessages) {
          if (userMsg.id) {
            const { data: responsesData, error: responsesError } = await supabase
              .from('model_responses')
              .select('model_id, content, is_best')
              .eq('message_id', userMsg.id);
            if (!responsesError && responsesData) {
              allResponses.set(userMsg.id, responsesData);
            }
          }
        }
        // Create proper conversational flow: user → AI responses → user → AI responses
        const formattedMessages = [];
        // Get only user messages and sort them chronologically
        const userMessagesOnly = messagesData.filter(msg => msg.role === 'user')
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        for (const userMsg of userMessagesOnly) {
          // Add user message
          formattedMessages.push({
            id: userMsg.id,
            content: userMsg.content,
            role: 'user' as const,
            timestamp: new Date(userMsg.timestamp)
          });
          // Add AI responses for this user message
          if (allResponses.has(userMsg.id)) {
            const responses = allResponses.get(userMsg.id);
            for (const response of responses as Array<{ model_id: string, content: string, is_best?: boolean }>) {
              formattedMessages.push({
                id: `${userMsg.id}-${response.model_id}`,
                content: response.content,
                role: 'assistant' as const,
                timestamp: new Date(userMsg.timestamp),
                modelId: response.model_id,
                isBest: response.is_best
              });
            }
          }
        }
        setMessages(formattedMessages);
        // Set responses for the last user message (for current interaction)
        if (userMessages.length > 0) {
          const lastUserMessage = userMessages[userMessages.length - 1];
          if (lastUserMessage && allResponses.has(lastUserMessage.id)) {
            const lastResponses = allResponses.get(lastUserMessage.id);
            const formattedResponses = lastResponses.map((resp: { model_id: string, content: string, is_best?: boolean }) => ({
              modelId: resp.model_id,
              content: resp.content,
              isLoading: false,
              isBest: resp.is_best
            }));
            setResponses(formattedResponses);
            // Update selected models based on responses
            const modelIds = lastResponses.map((resp: { model_id: string, content: string, is_best?: boolean }) => resp.model_id);
            setSelectedModels(modelIds);
          }
        }
      }
    } catch (error) {
      // Improved error logging with more details
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorDetails = error instanceof Error ? (error.stack || '') : JSON.stringify(error);
      console.error(`Error loading chat session: ${errorMessage}`, { error, details: errorDetails });
      // Show a user-friendly message
      alert('Failed to load chat session. Please try again.');
    }
  };
  // Don't render until theme is mounted to prevent hydration issues
  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-gray-900"></div>;
  }
  const handleModelToggle = (modelId: string) => {
  setSelectedModels(prev =>
    prev.includes(modelId)
      ? prev.filter(id => id !== modelId)
      : [...prev, modelId]
  );
};

const createNewSession = async () => {
  if (!user) {
    console.log("❌ No user found when creating session");
    return null;
  }

  console.log("🟡 Creating session for user:", user.id);

  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert([
        {
          user_id: user.id,
          title: "New Chat",
        },
      ])
      .select();

    console.log("🟢 SESSION INSERT RESULT:", { data, error });

    if (error) {
      console.error("❌ Failed to create session:", error);
      return null;
    }

    return data?.[0] ?? null;
  } catch (error) {
    console.error("❌ Unexpected error creating session:", error);
    return null;
  }
};

  const saveMessageToDatabase = async (message: Message, sessionId: string) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          content: message.content,
          role: message.role
        })
        .select()
        .single();
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  };
  const saveModelResponseToDatabase = async (messageId: string, modelId: string, content: string, isBest: boolean = false) => {
    try {
      const { error } = await supabase
        .from('model_responses')
        .insert({
          message_id: messageId,
          model_id: modelId,
          content,
          is_best: isBest
        });
      if (error) throw error;
    } catch (error) {
      console.error('Error saving model response:', error);
    }
  };
  const handleNewChat = async () => {
  if (!user) return;

  // 1. Create the session
  const newSession = await createNewSession();

  if (!newSession) {
    console.error("Failed to create a new session");
    return;
  }

  // 2. Set state AFTER session is created
  setCurrentSessionId(newSession.id);
  setMessages([]);
  setResponses([]);
  setCurrentInput('');
  setSelectedModels(AI_MODELS.map(m => m.id));

  // 3. WAIT a little for Supabase to update
  await new Promise((res) => setTimeout(res, 150));

  // 4. Refresh sidebar
  await loadRecentSessions();
};

  const handlePasswordChange = async () => {
    if (passwordChange.new !== passwordChange.confirm) {
      alert('New passwords do not match');
      return;
    }
    if (passwordChange.new.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordChange.new
      });
      if (error) throw error;
      alert('Password updated successfully!');
      setPasswordChange({ current: '', new: '', confirm: '' });
      setShowSettings(false);
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };
  
const handleSendMessage = async () => {
  // ensure there is something to send and user is present
  if ((!currentInput.trim() && attachedFiles.length === 0) || !user) return;

  const messageText = currentInput.trim();

  // Check if user is premium
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single();
  const isPremiumUserLocal = profile?.is_premium === true;

  // Only send to allowed models
  const modelsToSend = selectedModels.filter(id => {
    const model = AI_MODELS.find(m => m.id === id);
    return !!model && (!model.locked || isPremiumUserLocal);
  });

  if (modelsToSend.length === 0) {
    setShowPremiumModal(true);
    return;
  }

  // Add user message to UI
  const userMessage: Message = {
    id: Date.now().toString(),
    content: messageText + (attachedFiles.length > 0 ? `\n[Attached: ${attachedFiles.map(f => f.name).join(', ')}]` : ''),
    role: 'user',
    timestamp: new Date()
  };
  setMessages(prev => [...prev, userMessage]);

  // Clear input
  setCurrentInput('');
  setAttachedFiles([]);
  setIsLoading(true);

  // Create session if needed
  let sessionId = currentSessionId;
  if (!sessionId) {
    sessionId = await createNewSession();
    setCurrentSessionId(sessionId);
  }

  const messageId = sessionId ? await saveMessageToDatabase(userMessage, sessionId) : null;

  // THIS IS THE FIX – refresh recent chats immediately
  if (sessionId) {
    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    await loadRecentSessions(); // THIS LINE FIXES YOUR BUG
  }

  // Show loading indicators
  setResponses(modelsToSend.map(id => ({
    modelId: id,
    content: '',
    isLoading: true,
    error: undefined
  })));

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = (sessionData as any)?.session;

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        message: messageText,
        models: modelsToSend,
        attachedFiles: attachedFiles.length > 0
          ? attachedFiles.map(f => ({ name: f.name, type: f.type, size: f.size }))
          : []
      })
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const results = (data.responses || []).map((r: any) => ({
      modelId: r.modelId,
      content: (r.content || '').trim() || 'No response',
      isLoading: false,
      error: r.error
    }));

    setResponses(results.map((item: any) => {
      const r = item as { modelId: string; content?: string; error?: string };
      return {
        modelId: r.modelId,
        content: r.error ? "" : (r.content?.trim() || "No response received"),
        isLoading: false,
        error: r.error,
        isBest: false
      };
    }));

    // Save responses to DB
    if (messageId) {
      for (const r of results) {
        if (r.content && !r.error) {
          await saveModelResponseToDatabase(messageId, r.modelId, r.content);
        }
      }
    }

    // Update title on first message
    if (sessionId && !currentSessionId) {
      const title = messageText.slice(0, 50) + (messageText.length > 50 ? '...' : '');
      await supabase
        .from('chat_sessions')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', sessionId);
      await loadRecentSessions();
    }
  } catch (err: any) {
    console.error("Send message failed:", err);
    setResponses(prev => prev.map(r => ({ ...r, error: err.message || 'Failed', isLoading: false })));
  } finally {
    setIsLoading(false);
  }
};

  // Removed unused functions: handleCopyResponse and handleMarkBest
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  // Handle file attachment
  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;
  const newFiles = Array.from(e.target.files);
  setAttachedFiles(prev => [...prev, ...newFiles]);
  setShowFilePicker(false);
};

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log('handleImageUpload called, files:', e.target.files);
  if (!e.target.files) return;
  const newFiles = Array.from(e.target.files);
  setAttachedFiles(prev => [...prev, ...newFiles]);
  setShowPhotoOptions(false);
};

  // Remove attached file
  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };
  // Trigger file input click
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };
  // Handle photo options
  const handleTakePhoto = () => {
    // TODO: Implement camera functionality
    setShowPhotoOptions(false);
  };
  const handleSelectPhoto = () => {
    imageInputRef.current?.click();
    setShowPhotoOptions(false);
  };
  // Show auth form if not logged in
  if (!user) {
    return (
      <>
        <div className="fixed inset-0 bg-black" />

        <div className="relative min-h-screen flex flex-col">
          {/* Navbar */}
          <nav className="relative z-50 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-2xl ring-4 ring-teal-500/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="text-3xl font-black text-white">MultiMind</span>
            </div>

            <a href="/auth" className="group relative overflow-hidden rounded-full px-10 py-4 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 backdrop-blur-xl border border-teal-400/40 hover:border-teal-300/70 transition-all duration-500">
              <span className="relative z-10 flex items-center gap-3 text-white font-semibold">
                Log In
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
            </a>
          </nav>

          {/* Main Content */}
          <div className="relative flex-1 flex flex-col items-center px-6 pt-20 pb-40">

            {/* Headline */}
            <h1 className="text-6xl md:text-8xl font-black text-white text-center leading-tight mb-32">
              World’s Most<br />
              Powerful AIs.<br />
              One{" "}
              <span className="relative inline-block min-w-[400px]">
                <span className="absolute inset-0 text-teal-400 animate-chat">Chat</span>
                <span className="text-cyan-400 opacity-0 animate-subscription">Subscription</span>
              </span>.
            </h1>

            {/* Feature Panels */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
              {[
                { title: "Compare AIs Instantly", desc: "Ask once — get answers from all top models side-by-side." },
                { title: "No Limits, No Paywalls", desc: "Unlimited usage of GPT-5, Claude, Gemini, Grok & more." },
                { title: "One Simple Subscription", desc: "All premium models, one price, cancel anytime." },
              ].map((feature, i) => (
                <div key={i} className="group relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-teal-500/30 p-10 shadow-2xl hover:border-teal-400/70 hover:bg-white/10 hover:scale-105 transition-all duration-500">
                  <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Orbit */}
            <div className="relative w-full h-[1000px] -mt-10">
              {/* Glow + Center + Models – unchanged */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-[900px] h-[900px] bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute inset-0 w-[800px] h-[800px] bg-cyan-500/25 rounded-full blur-3xl animate-pulse delay-700" />
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                <div className="w-72 h-72 bg-black/95 backdrop-blur-2xl rounded-full border-8 border-teal-500/50 flex items-center justify-center shadow-2xl">
                  <div className="w-60 h-60 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full flex items-center justify-center ring-8 ring-teal-500/40">
                    <svg className="w-40 h-40 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
              </div>



              {AI_MODELS.map((model) => {
                const name = model.name.toLowerCase();
                let x = 0, y = 0;
                if (name.includes("mistral")) x = 0, y = -420;
                else if (name.includes("perplexity")) x = -520, y = -300;
                else if (name.includes("chatgpt") || name.includes("gpt")) x = -520, y = -150;
                else if (name.includes("google") || name.includes("gemini")) x = -520, y = 0;
                else if (name.includes("claude")) x = -520, y = 150;
                else if (name.includes("qwen")) x = 520, y = -300;
                else if (name.includes("deepseek")) x = 520, y = -150;
                else if (name.includes("meta") || name.includes("llama")) x = 520, y = 0;
                else if (name.includes("grok")) x = 520, y = 150;

                return (
                  <div key={model.id} className="absolute top-1/2 left-1/2" style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}>
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-70 -z-10" viewBox="0 0 100 100">
                      <path d="M50,50 Q50,0 50,10" fill="none" stroke="url(#glow)" strokeWidth="4" className="animate-pulse" />
                      <defs>
                        <linearGradient id="glow" x1="0%" y1="100%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                          <stop offset="60%" stopColor="#14b8a6" stopOpacity="0.7" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="w-96 bg-white/5 backdrop-blur-2xl rounded-3xl border border-teal-500/30 p-8 shadow-2xl hover:border-teal-400/70 hover:bg-white/10 transition-all duration-500">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-2xl flex items-center justify-center ring-4 ring-teal-400/40 shadow-xl">
                          <div className="w-10 h-10 text-white">
                            {typeof model.icon === "function" ? model.icon(true) : model.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{model.name}</h3>
                          <span className="inline-block mt-2 px-4 py-2 bg-teal-500/20 text-teal-300 text-sm font-semibold rounded-full border border-teal-400/50">
                            {model.provider}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SMALL LIGHT-BLUE GLOWING BUTTON – FINAL VERSION */}
            <div className="relative z-50 -mt-28">
              <a
                href="/auth"
                className="group relative px-12 py-6 rounded-2xl bg-cyan-500/20 backdrop-blur-xl border-2 border-cyan-400 text-white font-bold text-2xl shadow-2xl hover:bg-cyan-500/35 hover:border-cyan-300 hover:scale-110 transition-all duration-500 flex items-center gap-4"
              >
                Get Started Now
                <svg className="w-7 h-7 group-hover:translate-x-3 transition-transform duration-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>

                {/* Glowing effect */}
                <div className="absolute -inset-1 rounded-2xl bg-cyan-400/40 opacity-70 blur-xl group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute -inset-2 rounded-2xl bg-cyan-400/30 opacity-50 blur-2xl animate-pulse" />
              </a>
            </div>

          </div>

          {/* Animations */}
          <style jsx global>{`
  @keyframes chat {
    0%, 45% { opacity: 1; transform: translateY(0); }
    50%, 100% { opacity: 0; transform: translateY(-60px); }
  }
  @keyframes subscription {
    0%, 45% { opacity: 0; transform: translateY(60px); }
    50%, 100% { opacity: 1; transform: translateY(0); }
  }

  .animate-chat {
    animation: chat 5s infinite ease-in-out;
  }
  .animate-subscription {
    animation: subscription 5s infinite ease-in-out;
  }
`}
</style>
        </div>
      </>
    );
  }
  return (
    <div
  className={cn(
    "min-h-screen antialiased transition-colors duration-300",
    darkMode ? "bg-black text-white" : "bg-white text-gray-900"
  )}
>

      {/* Mobile Hamburger Menu */}
      {isMobile && (
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            "fixed top-4 left-4 z-50 p-2 rounded-lg transition-all duration-200",
            darkMode
              ? "bg-slate-800/90 text-white hover:bg-slate-700"
              : "bg-white/90 text-gray-900 hover:bg-gray-100",
            "shadow-lg backdrop-blur-sm"
          )}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
      {/* Sidebar */}
      {/* ==================== ULTIMATE FINAL SIDEBAR – PERFECT COLLAPSED & EXPANDED ==================== */}
      <div
  className={cn(
    "fixed left-0 top-0 h-full backdrop-blur-xl transition-all duration-300 z-40 border-r",
    darkMode
      ? "bg-black border-gray-900 text-white"
      : "bg-white border-gray-200 text-gray-900",
    sidebarCollapsed ? "w-16" : "w-72",
    isMobile && sidebarCollapsed ? "-translate-x-full" : "translate-x-0"
  )}
>

        <div className={cn("h-full flex flex-col text-white", sidebarCollapsed ? "px-3 py-4" : "p-6")}>

          {/* Logo + MultiMind + Theme Toggle */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className="text-2xl font-black text-white tracking-tight">
                  MultiMind
                </span>
              )}
            </div>

            {/* Theme Toggle – only in expanded mode */}
            {!sidebarCollapsed && (
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-lg hover:bg-gray-900 transition-all"
                title={darkMode ? "Light mode" : "Dark mode"}
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-400" />}
              </button>
            )}
          </div>

          {/* ====== EXPANDED CONTENT ====== */}
          {!sidebarCollapsed && (
            <>
              {/* Search */}
              <div className="mb-5">
                <div className="relative">
                 <input
  type="text"
  placeholder="Search"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className={cn(
    "w-full py-3 pl-11 pr-4 rounded-full text-sm border transition-colors focus:border-cyan-500 focus:outline-none",
    darkMode
      ? "bg-gray-900/70 border-gray-800 text-white placeholder-gray-500"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
  )}
/>


                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* New Chat */}
              <button onClick={handleNewChat} className="flex items-center gap-3 w-full py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors mb-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-medium">New chat</span>
              </button>

              {/* Models */}
              <button
                onClick={() => setShowModelPreferences(true)}
                className="flex items-center justify-between w-full py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors text-gray-300"
              >
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  <span>Models</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              {/* Projects */}
              <button
                onClick={() => setShowProjectModal(true)}
                className="flex items-center justify-between w-full py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors mb-6 text-gray-300"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  Projects
                </div>
                <div className="flex items-center gap-2"><Plus className="w-4 h-4" /><ChevronRight className="w-4 h-4" /></div>
              </button>

              {/* Recent Chats */}
  {/* Recent Chats – WITH HEADING + DELETE BUTTON (INSTANTLY WORKING) */}
{/* RECENT CHATS – FINAL WORKING VERSION (WITH HEADING + DELETE + INSTANT SHOW) */}
<div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 pr-2 mt-6">
  {/* Heading – Only show when sidebar is expanded */}
  {!sidebarCollapsed && (
    <h3 className="px-6 mb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
      Recent Chats
    </h3>
  )}

  {/* Loading / Error / Empty States */}
  {recentSessionsLoading ? (
    <div className="flex flex-col items-center py-16 text-gray-500">
      <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3" />
      <span className="text-sm">Loading your chats...</span>
    </div>
  ) : recentSessionsError ? (
    <div className="text-center py-16 text-red-400">
      Failed to load chats.{" "}
      <button onClick={loadRecentSessions} className="underline">
        Retry
      </button>
    </div>
  ) : recentSessions.length === 0 ? (
    <div className="text-center py-16 text-gray-500">
      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
      <p>No conversations yet</p>
      <p className="text-xs mt-2">Start a new chat to see it here</p>
    </div>
  ) : (
    /* Actual Chat List */
    <div className="space-y-1 px-2">
      {filteredSessions.map((session) => (
        <div
          key={session.id}
          className="group relative rounded-lg hover:bg-gray-800/60 transition-all duration-200"
        >
          <button
            onClick={() => loadChatSession(session.id)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-800/80 transition-all"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-cyan-500/30">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate text-sm">
                {session.title}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {session.firstMessage || "New chat"}
              </p>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {session.date}
            </span>
          </button>

          {/* Delete Button – Hover Only */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteChatSession(session.id);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-900/40 rounded-lg"
            title="Delete chat"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ))}
    </div>
  )}
</div>
            </>
          )}

          {/* ====== COLLAPSED MODE: Only 4 Icons + User Avatar ====== */}
          {sidebarCollapsed && (
            <div className="flex-1 flex flex-col items-center justify-start space-y-8 pt-6">
              {/* New Chat */}
              <button onClick={handleNewChat} className="p-3 rounded-xl hover:bg-gray-900 transition-all group" title="New chat">
                <svg className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>

              {/* Models */}
              <button
                onClick={() => setShowProjectModal(true)}
                className="p-3 rounded-xl hover:bg-gray-900 transition-all group"
                title="Projects"
              >
                <svg className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </button>

              {/* Projects */}
              <button onClick={() => setOpen(true)} className="p-3 rounded-xl hover:bg-gray-900 transition-all group" title="Projects">
                <svg className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </button>
            </div>
          )}

          {/* ====== BOTTOM: User + Collapse Button ====== */}
          <div className="mt-auto pt-4 border-t border-gray-900">
            <div className={cn("flex items-center", sidebarCollapsed ? "justify-center" : "justify-between")}>

              {/* User Avatar + Name (only name when expanded) */}
              <button
                onClick={() => setShowUserDropdown(prev => !prev)}
                className={cn(
                  "flex items-center gap-3 rounded-xl transition-all hover:bg-gray-900",
                  sidebarCollapsed ? "p-3" : "px-4 py-3"
                )}
              >
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium truncate max-w-40">
                    {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                  </span>
                )}
              </button>
              {/* Collapse/Expand Toggle */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-3 rounded-xl hover:bg-gray-900 transition-all ml-2"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* PROFILE SETTINGS MODAL – COMPACT & BEAUTIFUL (WITH MORE LANGUAGES) */}
      {showUserDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={() => setShowUserDropdown(false)}
          />

          {/* Compact Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="relative w-full max-w-md bg-black border border-gray-800 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div>
                  <h2 className="text-xl font-bold text-white">Profile Settings</h2>
                  <p className="text-sm text-gray-400 mt-1">Manage your account</p>
                </div>
                <button
                  onClick={() => setShowUserDropdown(false)}
                  className="p-2 rounded-xl hover:bg-gray-900 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-800 rounded-xl text-gray-300 text-sm"
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.user_metadata?.full_name || ""}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-gray-900/80 border border-cyan-500/30 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 py-3 bg-gray-900/80 border border-cyan-500/30 border-r-0 rounded-l-xl text-gray-400 text-sm">
                      India +91
                    </span>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      className="flex-1 px-4 py-3 bg-gray-900/80 border border-cyan-500/30 rounded-r-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Language — NOW 12 LANGUAGES */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Language</label>
                  <select className="w-full px-4 py-3 bg-gray-900/80 border border-cyan-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all">
                    <option>English</option>
                    <option>हिन्दी (Hindi)</option>
                    <option>தமிழ் (Tamil)</option>
                    <option>తెలుగు (Telugu)</option>
                    <option>ಕನ್ನಡ (Kannada)</option>
                    <option>മലയാളം (Malayalam)</option>
                    <option>বাংলা (Bengali)</option>
                    <option>मराठी (Marathi)</option>
                    <option>ગુજરાતી (Gujarati)</option>
                    <option>ਪੰਜਾਬੀ (Punjabi)</option>
                    <option>Español</option>
                    <option>Français</option>
                  </select>
                </div>

                {/* Update Button */}
                <button className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg text-sm">
                  Update Profile
                </button>

                {/* Logout */}
                <div className="pt-4 border-t border-gray-800">
                  <button
                    onClick={async () => {
                      setShowUserDropdown(false);
                      await supabase.auth.signOut();
                      window.location.href = "/auth";
                    }}
                    className="w-full py-3 flex items-center justify-center gap-2.5 text-red-400 font-medium rounded-xl hover:bg-red-900/20 transition-all text-sm"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        isMobile ? "ml-0 p-0" : sidebarCollapsed ? "ml-16 p-6" : "ml-64 p-6"
      )}>
        {selectedModels.length === 0 ? (
          /* Welcome Screen */
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <SparklesIcon className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Welcome to MultiMind</h2>
            <p className="text-slate-400 text-lg mb-8">Click &quot;All&quot; above to start comparing all AI models</p>
            <button
              onClick={() => setSelectedModels(AI_MODELS.map(m => m.id))}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl hover:from-violet-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start with All Models
            </button>
          </div>
        ) : (
          /* Chat Interface */
          
          
          <>
            {/* Header/Partition with Menu - Mobile Only */}
            {isMobile && (
              <div className={cn(
                "fixed top-0 left-0 right-0 z-30 backdrop-blur-xl border-b transition-all duration-300",
                darkMode
                  ? "bg-slate-900/90 border-slate-700"
                  : "bg-white/90 border-slate-200"
              )}>
                <div className="flex items-center justify-between px-6 py-4">
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-200",
                      darkMode
                        ? "text-white hover:bg-slate-700/60"
                        : "text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                  <div className={cn(
                    "text-lg font-semibold",
                    darkMode ? "text-white" : "text-gray-900"
                  )}>
                    MultiMind Chat
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            )}
           {/* MODEL HEADER – EXACTLY LIKE YOUR SCREENSHOT (FIXED – NO ERRORS) */}
           {/* CHAT COLUMNS – FINAL, NO ERRORS, EXACTLY LIKE YOUR SCREENSHOT */}
<div
  className={cn(
    "overflow-x-auto scrollbar-thin transition-colors duration-300",
    // Light mode = white bg + black text | Dark mode = black bg + white text
    darkMode
      ? "bg-black text-white scrollbar-thumb-gray-700 scrollbar-track-gray-900"
      : "bg-white text-black scrollbar-thumb-gray-400 scrollbar-track-gray-100",
    isMobile ? "h-screen pt-16 pb-24" : "h-[calc(100vh-70px)] pb-20"
  )}
>

  <div className="flex h-full min-w-fit">
    {AI_MODELS.sort((a, b) => (a.locked ? 1 : -1)).map((model) => {
      const modelId = model.id;
      const isSelected = selectedModels.includes(modelId);

      return (
<div
  key={modelId}
  className={cn(
    "relative flex flex-col transition-all duration-500 border-r",
    darkMode ? "border-gray-900" : "border-gray-200",
    isSelected
      ? cn("flex-1 min-w-[520px]", darkMode ? "bg-black" : "bg-white")
      : cn("w-16 cursor-pointer", darkMode ? "bg-black/70 hover:bg-black/90" : "bg-gray-50 hover:bg-gray-100")
  )}
  onClick={() => !isSelected && handleModelToggle(modelId)}
>
          {/* HEADER */}
          <div
  className={cn(
    "border-b z-20 backdrop-blur-xl",
    isSelected ? "px-4 pt-3 pb-3" : "px-3 pt-6",
    darkMode
      ? "bg-black/95 border-gray-900"
      : "bg-white/90 border-gray-200"
  )}
>
            {isSelected ? (
              /* EXPANDED – Name + Locked + Toggle */
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex-shrink-0">
                    {typeof model.icon === "function" ? model.icon(true) : model.icon}
                  </div>
                  <span className="text-white font-medium text-sm truncate max-w-40">
                    {model.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {model.locked && (
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </div>
                  )}
                  <button
                  
                    disabled={model.locked}
                    onClick={(e) => {
                      e.stopPropagation();
                      !model.locked && handleModelToggle(modelId);
                    }}
                    className={cn(
                      "relative w-9 h-5 rounded-full transition-all duration-200",
                      model.locked ? "bg-gray-800" : isSelected ? "bg-cyan-500" : "bg-gray-700"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200",
                        isSelected && !model.locked ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              </div>
            ) : (
              /* COLLAPSED – ONLY ICON (click to expand) */
              <div className="flex justify-center">
                <div className="w-7 h-7 opacity-70">
                  {typeof model.icon === "function" ? model.icon(true) : model.icon}
                </div>
              </div>
            )}
          </div>

          {/* UPGRADE PILL – ONLY FOR LOCKED MODELS */}
          {isSelected && model.locked && (
            <div className="px-4 py-4 bg-black/95 border-b border-gray-900">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPremiumModal(true);
                }}
                className="w-full py-3.5 bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-medium text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                Upgrade to unlock
              </button>
            </div>
          )}

          {/* MESSAGES */}
{/* MESSAGES + RESPONSE + THINKING + ERROR — FINAL BULLETPROOF VERSION */}
{isSelected && (
  <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7">

    {/* USER & OLD MESSAGES */}
    {messages
      .filter((m) => m.modelId === modelId || m.role === "user")
      .map((msg, i) => (
        <div key={i} className="flex items-start gap-3.5">
          <div className="flex-shrink-0">
            {msg.role === "user" ? (
              <div className="w-9 h-9 bg-cyan-500/20 rounded-full flex items-center justify-center ring-2 ring-cyan-500/30">
                <User className="w-5 h-5 text-cyan-300" />
              </div>
            ) : (
              <div className="w-9 h-9">
                {typeof model.icon === "function" ? model.icon(true) : model.icon}
              </div>
            )}
          </div>
          <p className={msg.role === "user" ? "text-white font-medium" : "text-gray-200 font-light"}>
            {msg.content}
          </p>
        </div>
      ))}

    {/* CURRENT RESPONSE — THINKING / ERROR / ANSWER */}
    {(() => {
      // Find response by exact ID or partial match (fixes Mistral/Google issue)
      const resp = responses.find(r => r.modelId === modelId) ||
                   responses.find(r => r.modelId.includes(modelId)) ||
                   responses.find(r => modelId.includes(r.modelId));

      if (!resp) return null;

      if (resp.isLoading) {
        return (
          <div className="flex items-center gap-3.5 text-gray-400">
            <div className="w-9 h-9">
              {typeof model.icon === "function" ? model.icon(true) : model.icon}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        );
      }

      if (resp.error) {
        return (
          <div className="flex items-start gap-3.5 px-5 py-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
            <div className="w-9 h-9">
              {typeof model.icon === "function" ? model.icon(true) : model.icon}
            </div>
            <div className="text-red-300 text-sm leading-relaxed">
              <strong>Error:</strong> {resp.error}
              <br />
              <a href="https://openrouter.ai/billing" target="_blank" className="underline text-xs">
                Add $10 credits for unlimited access
              </a>
            </div>
          </div>
        );
      }

      if (resp.content) {
        return (
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9">
              {typeof model.icon === "function" ? model.icon(true) : model.icon}
            </div>
            <p className="text-gray-200 font-light whitespace-pre-wrap">
              {resp.content}
            </p>
          </div>
        );
      }

      return null;
    })()}
  </div>
)}
          
        </div>
      );
    })}
  </div>
</div>

            {/* Bottom Message Input */}
            <div className={cn(
  "fixed backdrop-blur-xl shadow-2xl transition-all duration-300 border-2 z-10 max-w-4xl mx-auto rounded-2xl",
  // Dynamic background & border based on theme
  darkMode 
    ? "bg-black/95 border-gray-800" 
    : "bg-white/95 border-gray-300",
  isMobile
    ? "bottom-0 left-0 right-0 rounded-t-2xl"
    : sidebarCollapsed 
      ? "bottom-8 left-20 right-6" 
      : "bottom-8 left-72 right-6"
)}>
              <div className="flex items-center p-2">
                {/* Left Action Buttons */}
                <div className="flex items-center gap-1 mr-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowWebSearch(true)}
                      className="p-2 rounded-full hover:bg-slate-700 transition"
                      title="Web Search"
                    >
                      <Globe className="text-xl sm:text-2xl text-cyan-300" aria-hidden="true" />

                    </button>
                    <button
                      onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                      className={cn(
                        "p-2 transition-all duration-200 rounded-lg hover:scale-105",
                        darkMode
                          ? "text-white hover:bg-slate-700/60"
                          : "text-slate-700 hover:bg-slate-200/80"
                      )}
                      title="Add Photo"
                    >
                     <Plus className="w-5 h-5 text-cyan-300" />

                    </button>
                    {/* Photo Options Dropdown */}
                    {showPhotoOptions && (
                      <div className={cn(
                        "absolute bottom-full mb-2 left-0 rounded-lg shadow-lg border min-w-[140px] z-50",
                        darkMode
                          ? "bg-slate-800 border-slate-600"
                          : "bg-white border-slate-200"
                      )}>
                        <button
                          onClick={handleTakePhoto}
                          className={cn(
                            "w-full px-4 py-2 text-left hover:bg-opacity-80 transition-colors rounded-t-lg flex items-center gap-2",
                            darkMode
                              ? "text-white hover:bg-slate-700"
                              : "text-gray-900 hover:bg-slate-100"
                          )}
                        >
                          Take Photo
                        </button>
                        <button
                          onClick={handleSelectPhoto}
                          className={cn(
                            "w-full px-4 py-2 text-left hover:bg-opacity-80 transition-colors rounded-b-lg flex items-center gap-2",
                            darkMode
                              ? "text-white hover:bg-slate-700"
                              : "text-gray-900 hover:bg-slate-100"
                          )}
                        >
                          Select Photo
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={openFilePicker}
                    className={cn(
                      "p-2 transition-all duration-200 rounded-lg hover:scale-105",
                      darkMode
                        ? "text-white hover:bg-slate-700/60"
                        : "text-slate-700 hover:bg-slate-200/80"
                    )}
                    title="Attach Files"
                  >
                   <Paperclip className="w-5 h-5 text-cyan-300" />

                  </button>
                  {/* Hidden file inputs */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileAttachment}
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.rtf,.csv,.xlsx,.xls,.ppt,.pptx"
                  />
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    multiple
                    accept="image/*"
                  />
                </div>
                {/* Attached Files Display */}
                {attachedFiles.length > 0 && (
                  <div className={cn(
                    "flex flex-wrap gap-2 mb-2 max-w-full overflow-x-auto py-2",
                    darkMode ? "bg-slate-700/60" : "bg-slate-100",
                    "rounded-lg px-2"
                  )}>
                    {attachedFiles.map((file, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-center gap-1 py-1 px-2 rounded-md",
                          darkMode ? "bg-slate-600" : "bg-white border border-slate-200"
                        )}
                      >
                        {file.type.startsWith('image/') ? (
                          <div className="w-5 h-5 flex-shrink-0">
                            <Image className="w-full h-full" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 flex-shrink-0">
                            <Paperclip className="w-full h-full" />
                          </div>
                        )}
                        <span className={cn(
                          "text-xs truncate max-w-[100px]",
                          darkMode ? "text-white" : "text-slate-700"
                        )}>
                          {file.name}
                        </span>
                        <button
                          onClick={() => removeAttachedFile(index)}
                          className={cn(
                            "p-1 rounded-full hover:bg-opacity-80",
                            darkMode ? "hover:bg-slate-500" : "hover:bg-slate-200"
                          )}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Main Input Field */}
                <div className="relative flex-grow">
                  <input
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className={cn(
  "w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/60 border-2 transition-all duration-200",
  darkMode
    ? "bg-slate-800/80 text-white placeholder-slate-400 border-slate-700 focus:border-cyan-400"
    : "bg-white text-black placeholder-gray-500 border-gray-300 focus:border-cyan-500"
)}

                    disabled={selectedModels.length === 0 || isLoading}
                  />
                  {isRecording && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-xs px-2 py-1 rounded-full bg-red-500 text-white animate-pulse">
                        Listening...
                      </span>
                    </div>
                  )}
                  {selectedModels.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        darkMode ? "text-slate-500 bg-slate-600/30" : "text-slate-400 bg-slate-200/50"
                      )}>
                        Select at least one model
                      </span>
                    </div>
                  )}
                </div>
                {/* Right Action Buttons */}
                <div className="flex items-center gap-1 ml-2">
                  {recognition ? (
                    <button
                      onClick={() => {
                        if (isRecording) {
                          recognition.stop();
                          return;
                        }

                        recognition.start();
                        setIsRecording(true);
                      }}
                      className={cn(
                        "p-2.5 transition-all duration-300 rounded-lg shadow-lg hover:scale-110",
                        isRecording
                          ? "bg-red-500 text-white animate-pulse"
                          : currentInput.trim() && selectedModels.length > 0 && !isLoading
                            ? "bg-green-500 text-white"
                            : "bg-slate-600/50 text-slate-400"
                      )}
                      title={isRecording ? "Stop recording" : "Speak"}
                    >
                      <Mic className={cn("w-5 h-5", isRecording && "animate-bounce")} />
                    </button>
                  ) : (
                    <button disabled className="p-2.5 bg-slate-600/50 text-slate-400 rounded-lg">
                     <Mic className="w-5 h-5 text-cyan-300" />

                    </button>
                  )}
                  <button
                    onClick={handleSendMessage}
                    disabled={!currentInput.trim() || selectedModels.length === 0 || isLoading}
                    className={cn(
                      "p-2.5 transition-all duration-200 rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                      currentInput.trim() && selectedModels.length > 0 && !isLoading
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-slate-600/50 text-slate-400"
                    )}
                    title="Send Message"
                  >
                    <Send className="w-5 h-5 text-cyan-300" />

                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Web Search Modal – Add this entire block */}
{showWebSearch && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div className="relative w-full max-w-2xl bg-black rounded-2xl border border-gray-800 shadow-2xl max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
  <Globe className="w-5 h-5" />
  <h2 className="text-lg font-semibold">Web Search</h2>
</div>
        <button
          onClick={() => {
            setShowWebSearch(false);
            setWebQuery('');
            setWebResults(null);
          }}
          className="p-2 hover:bg-gray-800 rounded-lg transition"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleWebSearch} className="p-6 border-b border-gray-800">
        <div className="relative">
          <input
            type="text"
            value={webQuery}
            onChange={(e) => setWebQuery(e.target.value)}
            placeholder="Ask Google anything..."
            className="w-full px-4 py-3 bg-gray-900/70 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
          <button
            type="submit"
            disabled={!webQuery.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-cyan-400 disabled:opacity-50"
          >
            <Search className="w-5 h-5" /> {/* Add import: import { Search } from 'lucide-react'; */}
          </button>
        </div>
      </form>

      {/* Results */}
      {webResults && (
        <div className="p-6 max-h-96 overflow-y-auto space-y-4">
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-2">Answer:</h4>
            <p className="text-gray-300 whitespace-pre-wrap">{webResults}</p>
          </div>
          {/* Optional: Add links if you want full results */}
          {/* {data.items?.map((item: any, i: number) => ( ... ))} */}
        </div>
      )}

      {isLoading && ( // Add a loading state if needed
        <div className="p-6 text-center text-gray-400">Searching Google...</div>
      )}
    </div>
  </div>
)}
      <div ref={messagesEndRef} />

      {/* Settings Modal */}

      {/* PREMIUM MODAL – VIOLET THEME */}
      {/* COMPACT UPGRADE MODAL – MATCHES YOUR UI PERFECTLY */}
{showPremiumModal && (
  <div 
    className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[9999] flex items-center justify-center p-4"
    onClick={() => setShowPremiumModal(false)}
  >
    <div 
      className="relative w-full max-w-md bg-black/95 backdrop-blur-2xl rounded-3xl border border-cyan-500/30 shadow-2xl overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button - Top Right */}
      <button
        onClick={() => setShowPremiumModal(false)}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all"
      >
        <X className="w-5 h-5 text-gray-300" />
      </button>

      {/* Header */}
      <div className="p-8 pt-12 text-center border-b border-gray-800">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
          <Crown className="w-9 h-9 text-white" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2">Upgrade to Premium</h3>
        <p className="text-gray-400 text-sm">Unlock all premium models instantly</p>
      </div>

      {/* Plans */}
      <div className="p-6 space-y-4">
        {/* Monthly */}
        <div className="bg-gray-900/50 rounded-2xl p-5 border border-gray-800 hover:border-cyan-500/50 transition-all">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-3xl font-black text-white">₹999<span className="text-lg text-gray-400">/month</span></p>
            </div>
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold text-sm transition-all">
              Monthly
            </button>
          </div>
        </div>

        {/* Yearly - Highlighted */}
        <div className="relative bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-2xl p-5 border-2 border-cyan-500/60 shadow-lg shadow-cyan-500/20">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-black text-xs font-bold rounded-full">
            BEST VALUE
          </div>
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-3xl font-black text-white">₹8,999<span className="text-lg text-gray-400">/year</span></p>
              <p className="text-cyan-400 text-sm font-semibold">Save ₹2,989/year</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl text-white font-bold text-sm shadow-lg transition-all transform hover:scale-105">
              Get Yearly Plan
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 pb-6">
        <ul className="space-y-3 text-sm">
          {[
            "All premium models (GPT-5, Claude, Gemini Pro, Grok-2)",
            "Unlimited side-by-side comparison",
            "Image generation & voice input",
            "Priority support + future updates free"
          ].map((feat, i) => (
            <li key={i} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <span className="text-gray-300">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-900/50 text-center text-xs text-gray-500 border-t border-gray-800">
        Instant activation • Cancel anytime • Made in India
      </div>
    </div>
  </div>
)}
      
            {/* REUSABLE MODEL PREFERENCES – First Time + Settings (Perfect Match) */}
      {/* NEW BEAUTIFUL MODEL PREFERENCES PANEL – LIKE YOUR SCREENSHOT */}
      {/* FINAL VERSION – EXACTLY LIKE YOUR SCREENSHOT (no badge, smaller everything) */}
      {/* FINAL – BLACK PANEL, ONE-LINE TITLE, X ICON, LIGHT-BLUE BUTTON */}
      {(showFirstTimePreferences || showModelPreferences) && (
  <div
    className="fixed inset-0 bg-transparent z-[9999] flex items-center justify-center p-4"
    onClick={() => {
      setShowModelPreferences(false);
      setShowFirstTimePreferences(false);
    }}
  >
    <div
      className="relative w-full max-w-2xl max-h-[85vh] bg-black rounded-3xl shadow-2xl border border-gray-800 overflow-hidden pointer-events-auto"
      onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
    >

      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white">
          Customize your chat AI model preferences
        </h2>
        <button
          onClick={() => {
            setShowModelPreferences(false);
            setShowFirstTimePreferences(false);
          }}
          className="p-2 hover:bg-gray-800 rounded-lg transition"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {showSuccessMessage && (
        <div className="mx-5 mt-5 p-4 bg-white rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
          <p className="text-green-600 font-semibold">
            Updated model preferences successfully
          </p>
        </div>
      )}

      {/* Model List */}
      <div
  className={cn(
    "p-5 space-y-3 overflow-y-auto max-h-[70vh] custom-scroll",
    showSuccessMessage && "mt-2"
  )}
>
  <style>{`
    .custom-scroll::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scroll::-webkit-scrollbar-thumb {
      background: #555;
      border-radius: 8px;
    }
    .custom-scroll::-webkit-scrollbar-thumb:hover {
      background: #666;
    }

    .dark .custom-scroll::-webkit-scrollbar-thumb {
      background: #444;
    }
    .dark .custom-scroll::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `}</style>
        {AI_MODELS.map((model) => {
          const isFree = !model.locked;
          const isSelected = prefSelected.includes(model.id);

          return (
            <div
              key={model.id}
              className="flex items-center justify-between py-4 px-5 rounded-xl bg-gray-900/40 hover:bg-gray-900/70 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10">
                  {typeof model.icon === "function"
                    ? model.icon(true)
                    : model.icon}
                </div>
                <div>
                  <p className="text-white font-medium text-base">
                    {model.name}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {model.provider}
                  </p>
                </div>
              </div>

              {isFree ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => togglePrefModel(model.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              ) : (
                <div className="w-9 h-5 bg-gray-800 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Button */}
      <div className="p-5 border-t border-gray-800">
        <button
          onClick={savePreferences}
          disabled={prefSaving || prefSelected.length === 0}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold text-base rounded-xl transition-all shadow-lg"
        >
          {prefSaving ? "Saving..." : "Update preferences"}
        </button>
      </div>
    </div>
  </div>
)}

      {/* CREATE NEW PROJECT MODAL – EXACTLY LIKE YOUR DESIGN */}
      {showProjectModal && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={() => setShowProjectModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="relative w-full max-w-2xl bg-[#0f0f0f] rounded-2xl shadow-2xl border border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div>
                  <h2 className="text-2xl font-bold text-white">Create new project</h2>
                  <p className="text-gray-400 text-sm mt-1">Fill in the details below to create a new project.</p>
                </div>
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Project Name */}
                <div>
                  <label className="block text-lg font-medium text-white mb-3">Project name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter a name for your project (max 50 characters)"
                    maxLength={50}
                    className="w-full px-5 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>

                {/* System Prompt */}
                <div>
                  <label className="block text-lg font-medium text-white mb-3">System prompt</label>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Enter a system prompt for chats in this project (max 5000 characters)"
                    maxLength={5000}
                    rows={8}
                    className="w-full px-5 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    All chats in this project will use this as the system prompt sent to the AI model.
                  </p>
                </div>

                {/* Create Button */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => {
                      if (!projectName.trim()) {
                        alert("Please enter a project name");
                        return;
                      }
                      alert(`Project "${projectName}" created successfully!`);
                      setShowProjectModal(false);
                      setProjectName('');
                      setSystemPrompt('');
                    }}
                    disabled={!projectName.trim()}
                    className="px-12 py-4 font-bold text-white rounded-xl transition-all duration-200 shadow-lg bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 active:scale-95 disabled:bg-gray-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Create project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* PERFECT LIGHT MODE – WHITE PAGE + BLACK TEXT */}
<style jsx global>{`
  html.light,
  body.light {
    background-color: #ffffff !important;
    color: #000000 !important;
  }

  html.light *,
  body.light * {
    color: #000000 !important;
    border-color: #e5e5e5 !important;
  }

  /* Keep your beautiful buttons & cyan accents */
  html.light .text-cyan-300,
  html.light .text-cyan-400,
  html.light .text-violet-400,
  html.light .bg-cyan-500,
  html.light .bg-gradient-to-r,
  html.light svg {
    color: inherit !important;
  }

  /* Fix input placeholders */
  html.light input::placeholder,
  html.light textarea::placeholder {
    color: #555 !important;
  }
`}</style>
    </div>

  );
}