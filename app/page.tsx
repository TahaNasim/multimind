'use client';
import { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  History,
  Image,
  Lock,           // Here
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
  Crown,          // ADD THIS
  Zap,
  Check, 
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
  locked?: boolean;      // ← shows lock icon + blocks toggle
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
  // PREMIUM MODELS – ₹499/month (locked)
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
    name: 'Google',
    provider: 'Gemini Pro',
    description: 'Multimodal + real-time web',
    icon: <GeminiLogo className="w-8 h-8" />,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500/10',
    isPremium: true,
    locked: true
  },
  {
    id: 'deepseek-pro',
    name: 'DeepSeek',
    provider: 'DeepSeek Pro',
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

  // FREE MODELS – always unlocked
  {
    id: 'google',
    name: 'Google',
    provider: 'Gemini Flash',
    description: 'Fast & free multimodal',
    icon: <GeminiLogo className="w-8 h-8" />,
    color: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    isPremium: false,
    locked: false
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    provider: 'DeepSeek Chat',
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
 
  const [showWebSearch, setShowWebSearch] = useState(false);
  const [webQuery, setWebQuery] = useState("");
  const [webResults, setWebResults] = useState<string | null>(null);
  const [showModelsDropdown, setShowModelsDropdown] = useState(false);
const [showFreeOnly, setShowFreeOnly] = useState(true);   // true = show free only
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/create-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (data.success) {
        console.log("AI-generated project:", data.result);
        alert(`✅ Project created: ${data.result.project_name}`);
        setOpen(false);
        setTitle("");
        setDescription("");
      } else {
        alert("❌ Failed to create project");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to AI");
    }
  };
  async function handleWebSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!webQuery) return;
    try {
      const res = await fetch(`/api/google-search?q=${encodeURIComponent(webQuery)}`);
      const data = await res.json();
      setWebResults(data.answer || "No results found.");
    } catch (err) {
      setWebResults("Error fetching results.");
    }
  }
  const { user, signOut } = useAuth();
  const { darkMode, toggleDarkMode, mounted } = useTheme();
  const [selectedModels, setSelectedModels] = useState<string[]>(AI_MODELS.map(m => m.id));
  const [allowedModels, setAllowedModels] = useState<string[]>(AI_MODELS.map(m => m.id));
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [responses, setResponses] = useState<ModelResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  

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
  // State for file attachments
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
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
  const [prefSelected, setPrefSelected] = useState<string[]>(AI_MODELS.map(m => m.id));
  const [prefError, setPrefError] = useState('');
  const [prefMessage, setPrefMessage] = useState('');
  const [prefSaving, setPrefSaving] = useState(false);
  const togglePrefModel = (id: string) => {
    setPrefSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const savePreferences = async () => {
    setPrefSaving(true);
    setPrefError('');
    try {
      // Persist locally for now; adapt to API call if needed
      setAllowedModels(prefSelected);
      // Update selectedModels to only include allowed ones
      setSelectedModels(prev => prev.filter(id => prefSelected.includes(id)));
      setPrefMessage('Preferences updated');
    } catch (err) {
      setPrefError('Failed to save preferences');
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
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserDropdown) {
        const target = event.target as Element;
        if (!target.closest('[data-dropdown="user-menu"]')) {
          setShowUserDropdown(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown]);
 useEffect(() => {
  if (user) {
    loadRecentSessions();
  } else {
    setRecentSessions([]);
  }
}, [user]);
  // Function to load recent chat sessions
// LOAD RECENT CHATS - BULLETPROOF + AUTO REFRESH ON DELETE
const loadRecentSessions = async () => {
  if (!user) {
    setRecentSessions([]);
    return;
  }

  setRecentSessionsLoading(true);
  setRecentSessionsError(false);

  try {
    const { data: sessions, error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('id, title, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(15);

    if (sessionsError) throw sessionsError;
    if (!sessions || sessions.length === 0) {
      setRecentSessions([]);
      return;
    }

    const sessionsWithPreview = await Promise.all(
      sessions.map(async (session) => {
        const { data: messages } = await supabase
          .from('chat_messages')
          .select('content')
          .eq('session_id', session.id)
          .eq('role', 'user')
          .order('timestamp', { ascending: true })
          .limit(1);

        const firstMessage = messages?.[0]?.content || 'No message';
        const date = new Date(session.updated_at);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        let displayDate: string;
        if (diffMins < 1) displayDate = 'Just now';
        else if (diffMins < 60) displayDate = `${diffMins}m ago`;
        else if (diffHours < 24) displayDate = `${diffHours}h ago`;
        else if (diffDays < 7) displayDate = `${diffDays}d ago`;
        else displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return {
          id: session.id,
          title: session.title || 'New Chat',
          firstMessage: firstMessage.slice(0, 60) + (firstMessage.length > 60 ? '...' : ''),
          date: displayDate
        };
      })
    );

    setRecentSessions(sessionsWithPreview.filter(Boolean) as any);
  } catch (err: any) {
    console.error('Failed to load recent chats:', err);
    setRecentSessionsError(true);
  } finally {
    setRecentSessionsLoading(false);
  }
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
  if (!user) return null;

  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      user_id: user.id,
      title: 'New Chat'
    })
    .select()
    .single();

  if (error) {
    console.error('Create session error:', error);
    return null;
  }

  return data.id; // ← Real UUID
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
    setMessages([]);
    setResponses([]);
    setCurrentInput('');
    setSelectedModels(AI_MODELS.map(m => m.id));
    setCurrentSessionId(null);
    // Refresh recent sessions list
    await loadRecentSessions(); // ← Keeps sidebar in sync
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
    if ((!currentInput.trim() && attachedFiles.length === 0) || selectedModels.length === 0 || !user) return;
    // Create message content - include file information if files are attached
    let messageContent = currentInput;
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map(file => file.name).join(', ');
      messageContent += `\n[Attached: ${fileNames}]`;
    }
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setAttachedFiles([]);
    setIsLoading(true);
    // Create or get session
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = await createNewSession();
      setCurrentSessionId(sessionId);
    }
    // Save user message to database
    let messageId: string | null = null;
    if (sessionId) {
      messageId = await saveMessageToDatabase(userMessage, sessionId);
    }
    // Initialize responses for selected models
    const initialResponses: ModelResponse[] = selectedModels.map(modelId => ({
      modelId,
      content: '',
      isLoading: true
    }));
    setResponses(initialResponses);
    try {
      // Make API call to our backend which will call OpenRouter
      // Note: In a real implementation, you would need to handle file uploads
      // This would typically involve FormData and multipart/form-data
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          models: selectedModels,
          // In a real implementation, you would upload files and include references
          attachedFiles: attachedFiles.length > 0 ? attachedFiles.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size
          })) : []
        })
      });
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      // Map the API responses to our local format
      const results: ModelResponse[] = data.responses.map((resp: { modelId: string; content?: string; error?: string }) => ({
        modelId: resp.modelId,
        content: resp.content || '',
        isLoading: false,
        error: resp.error
      }));
      setResponses(results);
      // Save model responses to database
      if (messageId && sessionId) {
        for (const result of results) {
          if (result.content && !result.error) {
            await saveModelResponseToDatabase(messageId, result.modelId, result.content, result.isBest);
          }
        }
      }
      // Update session title if it's the first message
      if (sessionId && messages.length === 0) {
        const title = currentInput.length > 50 ? currentInput.substring(0, 50) + '...' : currentInput;
        await supabase
          .from('chat_sessions')
          .update({ title, updated_at: new Date().toISOString() })
          .eq('id', sessionId);
        // Refresh recent sessions list
        await loadRecentSessions();
      }
    } catch (error) {
      console.error('Error getting responses:', error);
      setResponses(prev => prev.map(r => ({
        ...r,
        error: error instanceof Error ? error.message : 'Failed to get response',
        isLoading: false
      })));
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
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
      setShowFilePicker(false);
    }
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleImageUpload called, files:', e.target.files);
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
      setShowPhotoOptions(false);
    }
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
      <div className={cn(
        "min-h-screen flex items-center justify-center p-6 transition-colors duration-300",
        darkMode ? "bg-slate-900" : "bg-white"
      )}>
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className={cn(
              "text-3xl font-bold mb-2",
              darkMode ? "text-white" : "text-slate-900"
            )}>MultiMind</h1>
            <p className={cn(
              darkMode ? "text-slate-400" : "text-slate-600"
            )}>Sign in to continue</p>
          </div>
          {/* Auth Form */}
          <div className={cn(
            "rounded-2xl p-8 backdrop-blur-xl border transition-colors duration-300",
            darkMode
              ? "bg-slate-800/80 border-slate-700/50"
              : "bg-white/90 border-slate-200/50"
          )}>
            <div className="text-center">
              <p className={cn(
                "mb-6",
                darkMode ? "text-slate-400" : "text-slate-600"
              )}>Please sign in to use MultiMind</p>
              <Link
                href="/auth"
                className="inline-block bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl py-3 px-6 font-medium hover:from-violet-700 hover:to-purple-800 transition-all duration-200"
              >
                Sign In / Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      darkMode ? "bg-[#202124] text-white" : "bg-[#FBF9F6] text-gray-900"
    )}>
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
      <div className={cn(
        "fixed left-0 top-0 h-full backdrop-blur-xl transition-all duration-300 z-40",
        darkMode
          ? "bg-slate-800/80 border-r border-slate-600"
          : "bg-white/90 border-r border-slate-300",
        sidebarCollapsed ? "w-16" : "w-64",
        isMobile && sidebarCollapsed ? "-translate-x-full" : "translate-x-0"
      )}>
        <div className={cn(
          "h-full transition-all duration-300 overflow-hidden",
          sidebarCollapsed ? "p-3" : "pl-6 pr-0 py-6"
        )}>
          {/* Logo and Dark Mode Toggle */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
                    MultiMind
                  </h1>
                  <p className={cn(
                    "text-sm",
                    darkMode ? "text-slate-400" : "text-slate-600"
                  )}>
                    Compare AI models in real-time
                  </p>
                </div>
              )}
            </div>
            {/* Dark Mode Toggle */}
            {!sidebarCollapsed && (
              <button
                onClick={toggleDarkMode}
                className={cn(
                  "p-2 rounded-lg transition-colors mr-2",
                  darkMode
                    ? "text-gray-400 hover:text-white hover:bg-slate-700/50"
                    : "text-gray-600 hover:text-slate-800 hover:bg-slate-200/50"
                )}
                title={darkMode ? "Light Mode" : "Dark Mode"}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
          </div>
          {/* User Info section removed */}
          {/* New Chat Button */}
          {/* New Chat and History Buttons */}
          <div className={cn(
            "flex gap-2 mb-6",
            sidebarCollapsed ? "flex-col" : "flex-row mr-2"
          )}>
            <button
              onClick={handleNewChat}
              className={cn(
                "bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-lg py-2 flex items-center justify-center gap-2 hover:from-violet-700 hover:to-purple-800 transition-all duration-200 shadow-lg",
                sidebarCollapsed ? "w-full px-2" : "flex-1 px-4"
              )}>
              <Plus className="w-4 h-4" />
              {!sidebarCollapsed && <span>New Chat</span>}
            </button>
            <Link
              href="/history"
              className={cn(
                "bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-lg py-2 flex items-center justify-center gap-2 hover:from-violet-700 hover:to-purple-800 transition-all duration-200 shadow-lg",
                sidebarCollapsed ? "w-full px-2" : "flex-1 px-4"
              )}
            >
              <History className="w-4 h-4" />
              {!sidebarCollapsed && <span>History</span>}
            </Link>
          </div>
          {/* Create Project + Models – Models button = History button size */}
<div className="flex items-center gap-3 mt-4">
  {/* Create Project – unchanged */}
  <button
    onClick={() => setOpen(true)}
    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all shadow-lg text-sm font-medium"
  >
    <Plus className="w-5 h-5" />
    {!sidebarCollapsed && "Create Project"}
  </button>

  {/* MODELS BUTTON – NOW IDENTICAL TO HISTORY BUTTON */}
  <button
    onClick={() => setShowModelsDropdown(prev => !prev)}
    className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white rounded-xl py-3 px-6 flex items-center justify-center gap-2 transition-all shadow-lg text-sm font-medium whitespace-nowrap"
  >
    <Zap className="w-5 h-5" />
    {!sidebarCollapsed && (
      <>
        <span>Models</span>
        <ChevronRight className={cn("w-4 h-4 transition-transform", showModelsDropdown && "rotate-90")} />
      </>
    )}
  </button>
</div>

{/* Dropdown – still perfectly centered & beautiful */}
{showModelsDropdown && !sidebarCollapsed && (
  <div className="mt-3 flex justify-center">
    <div className="w-52 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
      <button
        onClick={() => {
          setShowFreeOnly(true);
          setShowModelsDropdown(false);
        }}
        className={cn(
          "w-full px-5 py-3 text-left flex items-center justify-between text-sm transition-colors",
          showFreeOnly ? "bg-violet-600/70 text-white" : "hover:bg-slate-700/60 text-slate-300"
        )}
      >
        <span className="flex items-center gap-3">
          <SparklesIcon className="w-4 h-4 text-green-400" />
          Free Models
        </span>
        {showFreeOnly && <Check className="w-4 h-4 text-green-400" />}
      </button>

      <button
        onClick={() => {
          setShowFreeOnly(false);
          setShowModelsDropdown(false);
        }}
        className={cn(
          "w-full px-5 py-3 text-left flex items-center justify-between text-sm border-t border-slate-700 transition-colors",
          !showFreeOnly ? "bg-violet-600/70 text-white" : "hover:bg-slate-700/60 text-slate-300"
        )}
      >
        <span className="flex items-center gap-3">
          <Crown className="w-4 h-4 text-yellow-400" />
          Premium Models
        </span>
        <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2.5 py-1 rounded-full">
          ₹499/mo
        </span>
      </button>
    </div>
  </div>
)}
          
{/* Recent Chats - WITH LOADING & ERROR STATE */}
{!sidebarCollapsed && (
  <div className="mb-6 flex flex-col" style={{ height: 'calc(100vh - 300px)' }}>
    <h3 className={cn(
      "text-sm font-medium mb-3 flex-shrink-0 px-3",
      darkMode ? "text-gray-300" : "text-gray-700"
    )}>Recent Chats</h3>

    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50 pr-6">
      <div className="space-y-1">
        {recentSessionsLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-violet-500 border-t-transparent"></div>
            <p className="text-sm text-gray-400 mt-3">Loading your chats...</p>
          </div>
        ) : recentSessionsError ? (
          <div className="text-center py-12">
            <p className="text-sm text-red-400 mb-3">Failed to load chats</p>
            <button onClick={loadRecentSessions} className="text-xs underline text-violet-400 hover:text-violet-300">
              Tap to retry
            </button>
          </div>
        ) : recentSessions.length > 0 ? (
          <>
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "group py-3 px-3 cursor-pointer transition-all duration-200 rounded-lg border-l-2 flex items-center justify-between",
                  darkMode
                    ? currentSessionId === session.id
                      ? "bg-gray-700 border-l-violet-500 shadow-lg"
                      : "hover:bg-gray-800 border-l-transparent"
                    : currentSessionId === session.id
                      ? "bg-gray-100 border-l-violet-600 shadow-lg"
                      : "hover:bg-gray-50 border-l-transparent"
                )}
                onClick={() => loadChatSession(session.id)}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "text-sm font-medium truncate flex-1",
                      darkMode ? "text-gray-100" : "text-gray-800"
                    )}>
                      {session.title}
                    </span>
                    <span className={cn(
                      "text-xs ml-3",
                      darkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      {session.date}
                    </span>
                  </div>
                  <p className={cn(
                    "text-xs truncate",
                    darkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    {session.firstMessage}
                  </p>
                </div>

                {/* DELETE BUTTON - NOW WITH PROPER ERROR HANDLING */}
                {/* DELETE BUTTON - 100% WORKING */}
<button
  onClick={async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this chat forever?')) return;

    try {
      // 1. DELETE SESSION (UUID!)
      const { error: delError } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', session.id);  // ← session.id is now UUID

      if (delError) {
        console.error('Supabase delete error:', delError);
        throw delError;
      }

      // 2. REFRESH UI
      await loadRecentSessions();

      // 3. CLEAR CURRENT CHAT IF DELETED
      if (currentSessionId === session.id) {
        handleNewChat();
        setCurrentSessionId(null);
      }

      alert('Chat deleted');
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert(`Delete failed: ${err.message || 'Unknown error'}`);
    }
  }}
  className={cn(
    "ml-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all",
    darkMode ? "hover:bg-red-500/20 text-red-400" : "hover:bg-red-500/10 text-red-600"
  )}
  title="Delete chat"
>
  <Trash2 className="w-4 h-4" />
</button>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400">No conversations yet</p>
            <p className="text-xs text-gray-500 mt-2">Start a new chat!</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
{showWebSearch && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
                  <div className="w-[600px] max-h-[80vh] rounded-2xl p-6 bg-slate-800 text-white relative shadow-2xl overflow-hidden">
                    {/* Close Button */}
                    <button
                      onClick={() => setShowWebSearch(false)}
                      className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-700"
                    >
                      ✖
                    </button>
                    {/* Header */}
                    <div className="mb-4">
                      <h2 className="text-2xl font-semibold flex items-center gap-2">
                        🌐 Web Search
                      </h2>
                      <p className="text-slate-400 text-sm mt-1">
                        Ask anything and get Google-powered answers instantly
                      </p>
                    </div>
                    {/* Search Form */}
                    <form onSubmit={handleWebSearch} className="flex gap-3 mb-4">
                      <input
                        type="text"
                        value={webQuery}
                        onChange={(e) => {
                          setWebQuery(e.target.value);
                          if (e.target.value.trim() === "") {
                            setWebResults(null); // clear old results when input is empty
                          }
                        }}
                        placeholder="Search the web..."
                        className="flex-1 px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-slate-400"
                      />
                      <button
                        type="submit"
                        className="px-5 py-3 bg-violet-600 hover:bg-violet-500 rounded-lg text-white font-medium transition-all duration-200"
                      >
                        Search
                      </button>
                      {/* 🔍 Icon Button */}
                      <button
                        type="submit"
                        className="absolute right-2 text-gray-300 hover:text-white"
                        title="Search"
                      >
                        🔍
                      </button>
                    </form>
                    {/* Results Area */}
                    <div className="overflow-y-auto bg-slate-700/50 rounded-lg p-4 h-[350px]">
                      {webResults ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {webResults}
                        </p>
                      ) : (
                        <p className="text-slate-400 text-sm italic">Your results will appear here...</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            
          {/* Settings Section */}
          <div className={cn(
            "absolute bottom-6 transition-all duration-300",
            sidebarCollapsed ? "left-3 right-3" : "left-6 right-6"
          )}>
            <div className="space-y-3">
              {/* User Dropdown Button */}
              <div className="flex items-center gap-2 relative" data-dropdown="user-menu">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={cn(
                    "flex items-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-lg hover:from-violet-700 hover:to-purple-800 transition-all duration-200 shadow-lg flex-grow",
                    sidebarCollapsed ? "justify-center px-2" : "px-4"
                  )}
                  title={user?.email || "User Menu"}
                >
                  <User className="w-4 h-4" />
                  {!sidebarCollapsed && <span className="text-sm">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</span>}
                </button>
                {/* User Dropdown Menu */}
                {showUserDropdown && (
                  <div className={cn(
                    "absolute bottom-full mb-2 bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-xl shadow-2xl z-50 min-w-[240px] overflow-hidden",
                    sidebarCollapsed ? "left-0" : "left-0"
                  )}>
                    {/* Email ID Header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/50 border-b border-slate-600/50">
                      <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {user?.email || 'user@example.com'}
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      {/* Settings */}
                      <button
                        onClick={() => {
                          setShowSettings(true);
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-slate-700/50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Settings</span>
                      </button>
                      {/* Logout */}
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-slate-700/50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
                {!sidebarCollapsed && (
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className={cn(
                      "py-3 px-2 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-lg hover:from-violet-700 hover:to-purple-800 transition-all duration-200 shadow-lg"
                    )}
                    title="Collapse Sidebar"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
              {/* Collapse Button - Now below the human button when sidebar is collapsed */}
              {sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className={cn(
                    "w-full py-3 px-2 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-lg hover:from-violet-700 hover:to-purple-800 transition-all duration-200 shadow-lg flex justify-center mt-3"
                  )}
                  title="Expand Sidebar"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
        {open && (
          <div className="fixed inset-0 z-50 flex items-start">
            <div className="fixed inset-0 bg-black/60" onClick={() => setOpen(false)} />
            <div className="m-8 w-[380px] bg-slate-700/50
 text-white rounded-2xl p-6 shadow-2xl border border-[#3d3269]/50 backdrop-blur-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">Create New Project</h3>
                  <p className="text-slate-400 text-sm">Organize your AI tasks in a project workspace.</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-300 hover:text-white rounded p-1"
                  aria-label="Close"
                >
                  ✖
                </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const title = (e.currentTarget.elements.namedItem("title") as HTMLInputElement)?.value;
                  const description = (e.currentTarget.elements.namedItem("description") as HTMLTextAreaElement)?.value;
                  try {
                    const res = await fetch("/api/create-project", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ title, description }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      alert(`✅ Project created: ${data.result.project_name}`);
                    } else {
                      alert("❌ Failed to create project");
                    }
                  } catch (err) {
                    console.error(err);
                    alert("Error connecting to AI");
                  }
                  setOpen(false);
                }}
                className="mt-4 flex flex-col gap-4"
              >
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Project Title</label>
                  <input
                    name="title"
                    placeholder="Enter project title"
                    className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    placeholder="Short project description"
                    className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white focus:outline-none h-28"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    Create Project
                  </button>
                   </div>
              </form>
            </div>
          </div>
        )}
        </div>
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
            {/* Chat Columns */}
            <div className={cn(
              "overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50",
              isMobile ? "h-screen pt-16 pb-24" : "h-[calc(100vh-70px)] pb-20"
            )}>
              <div className="flex h-full">
                {AI_MODELS
  .filter(m => allowedModels.includes(m.id))
  .filter(m => showFreeOnly ? !m.locked : m.locked)   // ← THIS LINE DOES THE MAGIC
  .map((model) => {
                  const modelId = model.id;
                  const isSelected = selectedModels.includes(modelId);
                  const response = responses.find(r => r.modelId === modelId);
                  const hasMessages = messages.length > 0;
                  return (
                    <div
                            key={modelId}
                            className={cn(
                              "relative flex flex-col transition-all duration-300 backdrop-blur-sm border",
                              isSelected
                                ? darkMode
                                  ? isMobile
                                    ? "bg-slate-800 border-slate-600 shadow-2xl w-[90vw] h-full"
                                    : "bg-slate-800 border-slate-600 shadow-2xl w-[600px] h-full"
                                  : isMobile
                                    ? "bg-white border-slate-300 shadow-2xl w-[90vw] h-full"
                                    : "bg-white border-slate-300 shadow-2xl w-[600px] h-full"
                                : darkMode
                                  ? "bg-black/90 border-gray-800 w-[60px]"
                                  : "bg-white/50 border-slate-300/50 w-[60px]"
                            )}
                          >
                            {/* FULL-SCREEN PREMIUM LOCK WHEN COLLAPSED */}
                                                        {model.locked && !isSelected && (
                              <div
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center gap-4"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="w-14 h-14 bg-violet-600/30 rounded-xl flex items-center justify-center">
                                  <Lock className="w-8 h-8 text-violet-300" />
                                </div>
                                <p className="text-white font-semibold text-lg">Premium Locked</p>
                                <p className="text-violet-300 text-3xl font-bold">₹499/mo</p>
                              </div>
                            )}
                            {/* HEADER */}
                            <div className="p-4 border-b border-slate-600 z-10 bg-inherit">
                              {isSelected ? (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10">
                                      {typeof model.icon === 'function' ? model.icon(darkMode) : model.icon}
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-lg text-white flex items-center gap-2">
  {model.name}
  
  {/* FREE BADGE – only for free models */}
  {!model.locked && (
    <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full shadow-lg animate-pulse">
      FREE
    </span>
  )}
  
  {/* PRO BADGE – only for premium (now in violet to match your UI) */}
  {model.locked && (
    <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full shadow-lg">
      Pro · ₹499
    </span>
  )}
</h3>
                                      <p className="text-sm text-gray-400">{model.provider}</p>
                                    </div>
                                  </div>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (model.locked) {
                                        setAttemptedPremiumModel(model.name);
                                        setShowPremiumModal(true);
                                      } else {
                                        handleModelToggle(modelId);
                                      }
                                    }}
                                    className={cn(
                                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                      isSelected ? "bg-violet-600" : "bg-gray-700",
                                      model.locked && "opacity-50 cursor-not-allowed"
                                    )}
                                    disabled={model.locked}
                                  >
                                    <span className={cn(
                                      "inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform",
                                      isSelected ? "translate-x-6" : "translate-x-1"
                                    )} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center py-6">
                                  <div className="w-8 h-8 opacity-60">
                                    {typeof model.icon === 'function' ? model.icon(darkMode) : model.icon}
                                  </div>
                                  {model.locked && <Lock className="w-8 h-8 text-yellow-500 mt-3" />}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (model.locked) {
                                        setAttemptedPremiumModel(model.name);
                                        setShowPremiumModal(true);
                                      } else {
                                        handleModelToggle(modelId);
                                      }
                                    }}
                                    className="mt-4 w-8 h-8 flex items-center justify-center"
                                  >
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* CHAT CONTENT – PREMIUM IS BLOCKED */}
                            <div className={cn("flex-1 overflow-y-auto", isSelected ? "block" : "hidden")}>
                                                            {model.locked ? (
                                <div className="h-full flex items-center justify-center px-6 py-12">
                                  <div className="text-center max-w-sm">
                                    <div className="mx-auto w-16 h-16 mb-6 bg-violet-600/20 rounded-2xl flex items-center justify-center">
                                      <Lock className="w-9 h-9 text-violet-400" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2">
                                      Premium Model Locked
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                      Unlock <span className="text-violet-300 font-semibold">{model.name}</span> and all Pro models
                                    </p>

                                    <div className="mb-8">
                                      <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
                                        ₹499
                                      </p>
                                      <p className="text-gray-500 text-sm mt-1">per month</p>
                                    </div>

                                    <button
                                      onClick={() => {
                                        setAttemptedPremiumModel(model.name);
                                        setShowPremiumModal(true);
                                      }}
                                      className="w-full py-4 px-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-lg rounded-2xl shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
                                    >
                                      Subscribe Now
                                    </button>

                                    <p className="text-xs text-gray-500 mt-6">
                                      Instant access • Cancel anytime
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                /* ←←← YOUR ORIGINAL MESSAGE RENDERING CODE GOES HERE ←←← */
                                <div className="space-y-6 p-6">
                                  {/* Paste your old message rendering code here (the part that was inside the old card) */}
                                  {/* Example from your code: */}
                                  {messages.filter(message =>
                                    message.role === 'user' || message.modelId === modelId
                                  ).map((message, index) => (
                                    <div key={message.id || index}>
                                      {message.role === 'user' ? (
                                        <div className="flex items-start gap-4 mb-6">
                                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <User className="w-4 h-4 text-white" />
                                          </div>
                                          <div className="flex-1">
                                            <p className={cn("text-base leading-relaxed", darkMode ? "text-white" : "text-gray-900")}>
                                              {message.content}
                                            </p>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex items-start gap-4 mb-6">
                                          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                            {typeof model.icon === 'function' ? model.icon(darkMode) : model.icon}
                                          </div>
                                          <div className="flex-1">
                                            <p className={cn("text-base leading-relaxed whitespace-pre-wrap", darkMode ? "text-white" : "text-gray-900")}>
                                              {message.content}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}

                                  {/* Current response / loading */}
                                  {responses.find(r => r.modelId === modelId)?.isLoading && (
                                    <div className="flex items-start gap-4">
                                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                        {typeof model.icon === 'function' ? model.icon(darkMode) : model.icon}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 text-gray-400">
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                                          <span>Thinking...</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
              </div>
            </div>
            {/* Bottom Message Input */}
            <div className={cn(
              "fixed backdrop-blur-xl shadow-2xl transition-all duration-300 border-2 z-10 max-w-4xl mx-auto",
              darkMode
                ? "bg-slate-800/90 border-slate-600"
                : "bg-white/95 border-slate-300",
              isMobile
                ? "bottom-0 left-0 right-0 rounded-t-2xl"
                : sidebarCollapsed ? "bottom-8 left-20 right-6 rounded-2xl" : "bottom-8 left-72 right-6 rounded-2xl"
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
                      🔍
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
                      <Plus className="w-5 h-5" />
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
                    <Paperclip className="w-5 h-5" />
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
                      "w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 border-2 transition-all duration-200",
                      darkMode
                        ? "bg-slate-700/60 text-white placeholder-slate-400 border-slate-600 focus:border-violet-500"
                        : "bg-slate-50 text-slate-800 placeholder-slate-500 border-slate-300 focus:border-violet-500"
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
    <Mic className="w-5 h-5" />
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
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div ref={messagesEndRef} />
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl mx-4 border border-slate-700 max-h-[85vh] overflow-y-auto scrollbar-dark">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Password Change Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Change Password</h3>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordChange.current}
                  onChange={(e) => setPasswordChange(prev => ({ ...prev, current: e.target.value }))}
                  className="w-full bg-slate-700/50 text-white rounded-lg px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 border-2 border-slate-600"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordChange.new}
                  onChange={(e) => setPasswordChange(prev => ({ ...prev, new: e.target.value }))}
                  className="w-full bg-slate-700/50 text-white rounded-lg px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 border-2 border-slate-600"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordChange.confirm}
                  onChange={(e) => setPasswordChange(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full bg-slate-700/50 text-white rounded-lg px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 border-2 border-slate-600"
                />
              </div>
              <button
                onClick={handlePasswordChange}
                disabled={passwordLoading || !passwordChange.current || !passwordChange.new || !passwordChange.confirm}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg py-3 px-4 font-medium hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
              {/* AI Model Preferences */}
              <div className="mt-8 pt-6 border-t border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-1">Customize your chat AI model preferences</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Easily update your selections anytime in the settings
                </p>
                {prefLoading ? (
                  <p className="text-slate-300">Loading...</p>
                ) : (
                  <div className="space-y-5">
                    {AI_MODELS.map((m) => (
                      <div key={m.id} className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-7 h-7 flex items-center justify-center mt-0.5">
                            {typeof m.icon === "function"
                              ? (m.icon(darkMode) as React.ReactNode)
                              : m.icon}
                          </div>
                          <div>
                            <div className="text-white font-medium">{m.name}</div>
                            <div className="text-slate-400 text-sm">
                              {m.description}
                            </div>
                          </div>
                        </div>
                        {/* iOS-style toggle */}
                        <label className="inline-flex items-center cursor-pointer select-none ml-4">
                          <input
                            type="checkbox"
                            checked={prefSelected.includes(m.id)}
                            onChange={() => togglePrefModel(m.id)}
                            className="sr-only peer"
                          />
                          {/* FIX: Removed space in 'peer-checked:bg-violet-600' */}
                          <span className="w-12 h-7 rounded-full transition-colors duration-200
        bg-slate-600 peer-checked:bg-violet-600 relative">
                            <span className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow
            transition-all duration-200 peer-checked:left-6" />
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {prefError && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{prefError}</p>
                  </div>
                )}
                {prefMessage && (
                  <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm">{prefMessage}</p>
                  </div>
                )}
                <button
                  onClick={savePreferences}
                  disabled={prefSaving}
                  className="mt-6 w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg py-3 px-4 font-medium hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-200"
                >
                  {prefSaving ? 'Saving...' : 'Update preferences'}
                </button>
              </div>
              {/* Sign Out Button */}
              <div className="mt-6 pt-6 border-t border-slate-600">
                <button
                  onClick={() => {
                    signOut();
                    setShowSettings(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
     {/* PREMIUM MODAL – VIOLET THEME */}
{showPremiumModal && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
    <div 
      className="relative bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border border-violet-500/30 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        onClick={() => setShowPremiumModal(false)}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all z-10"
      >
        <X className="w-6 h-6 text-gray-300" />
      </button>

      <div className="p-8 text-center">
        {/* Elegant lock icon */}
        <div className="mx-auto w-20 h-20 bg-violet-600/20 rounded-2xl flex items-center justify-center mb-6">
          <Lock className="w-12 h-12 text-violet-400" />
        </div>

        <h2 className="text-3xl font-black text-white mb-3">
          Unlock All Premium Models
        </h2>
        <p className="text-gray-300 text-lg mb-8">
          Get instant access to <span className="text-violet-300 font-bold">{attemptedPremiumModel || "GPT-5, Claude, Gemini Pro"}</span> and more
        </p>

        {/* Price – Violet gradient */}
        <div className="mb-10">
          <p className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400">
            ₹499
          </p>
          <p className="text-gray-400 text-lg">per month • billed monthly</p>
        </div>

        {/* Violet Subscribe Button – matches your app perfectly */}
        <button
          onClick={() => {
            // Your payment logic here
            alert("Payment integration coming soon! 🚀");
          }}
          className="w-full py-5 px-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xl rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Subscribe Now
        </button>

        <div className="mt-8 space-y-3 text-sm text-gray-400">
          <p>Instant activation • No commitment</p>
          <p>Cancel anytime from settings</p>
          <p className="text-violet-300">Made with love in India</p>
        </div>
      </div>
    </div>
  </div>
)}
    </div>

  );
}