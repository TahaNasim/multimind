'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { Sparkles, Mail, Lock, User, ChevronRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth();
  const { mounted } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setMessage('Check your email for the reset link');
      } else if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
        setMessage('Check your email to confirm your account');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Cosmic Background – same as AI Fiesta */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-32 right-10 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-ping" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm"> {/* ← Smaller card */}

          {/* Logo + Title on the same line */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-600 blur-2xl opacity-70 animate-pulse" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Sparkles className="w-7 h-7 text-white" strokeWidth={3} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome to MultiMind</h1>
          </div>

          {/* Compact Glass Card */}
          <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">
            
            {/* Google Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl py-4 px-6 text-white font-medium transition-all group mb-7"
            >
              <FcGoogle className="w-6 h-6" />
              Continue with Google
              <ChevronRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Divider with Mail icon */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-5 bg-white/5 text-white/50 text-sm flex items-center gap-2 uppercase tracking-wider">
                  <Mail className="w-4 h-4" />
                  or continue with your email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && !isForgotPassword && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full pl-12 pr-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                />
              
              </div>

              {!isForgotPassword && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required={!isForgotPassword}
                    className="w-full pl-12 pr-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-center text-center">
                  {error}
                </div>
              )}
              {message && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-green-400 text-center font-medium">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/30 disabled:opacity-60"
              >
                {loading
                  ? 'Please wait...'
                  : isForgotPassword
                  ? 'Send Reset Link'
                  : isLogin
                  ? 'Sign In'
                  : 'Create Account'}
              </button>
            </form>

            {/* Bottom Links */}
            <div className="text-center mt-7 space-y-3 text-white/70">
              {isLogin && !isForgotPassword && (
                <button onClick={() => setIsForgotPassword(true)} className="text-cyan-400 hover:text-white">
                  Forgot password?
                </button>
              )}
              {isForgotPassword && (
                <button
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError('');
                    setMessage('');
                  }}
                  className="text-cyan-400 hover:text-white"
                >
                  Back to Sign In
                </button>
              )}

              <p className="text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setMessage('');
                    setIsForgotPassword(false);
                  }}
                  className="text-cyan-400 font-medium hover:text-white"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-white/40 text-xs mt-8">
            By continuing, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </div>
    </>
  );
}