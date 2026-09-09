import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { Profile, Role } from '../types';

export const ROLE_HOME: Record<Role, string> = {
  admin: '/admin',
  district_officer: '/district-officer',
  field_officer: '/field-officer',
  citizen: '/citizen'
};

interface Toast { id: number; kind: 'ok' | 'err' | 'info'; text: string; }
interface AuthCtx {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: Role | null;
  loading: boolean;
  configured: boolean;
  toasts: Toast[];
  notify: (text: string, kind?: Toast['kind']) => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);
let toastId = 1;

export function friendlyAuthError(message: string): string {
  const m = (message || '').toLowerCase();
  if (m.includes('invalid login credentials') || m.includes('invalid email or password')) return 'Email or password is incorrect.';
  if (m.includes('email not confirmed') || m.includes('not confirmed')) return 'Please verify your email before continuing. Check your inbox for the verification link.';
  if (m.includes('already registered') || m.includes('already exists') || m.includes('user already')) return 'An account with this email already exists. Try logging in instead.';
  if (m.includes('password')) return 'Password does not meet requirements. Use at least 8 characters.';
  if (m.includes('network') || m.includes('fetch')) return 'Unable to connect. Please check your internet connection and try again.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Too many attempts. Please wait a minute and try again.';
  return message || 'Something went wrong. Please try again.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((text: string, kind: Toast['kind'] = 'info') => {
    const id = toastId++;
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  const loadProfile = useCallback(async (uid: string) => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
    setProfile((data as Profile) ?? null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const s = data.session;
    if (s?.user) await loadProfile(s.user.id);
  }, [loadProfile]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!isSupabaseConfigured) return;
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data.session);
        setUser(data.session?.user ?? null);
        if (data.session?.user) await loadProfile(data.session.user.id);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    if (!isSupabaseConfigured) { setLoading(false); return; }
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) await loadProfile(s.user.id);
      else setProfile(null);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    try {
      if (isSupabaseConfigured) {
        const u = user;
        await supabase.auth.signOut();
        if (u) {
          try {
            await supabase.from('audit_logs').insert({
              user_id: u.id, action: 'logout', entity_type: 'session', entity_id: null, details: { at: new Date().toISOString() }
            });
          } catch { /* audit best-effort */ }
        }
      }
    } finally {
      setSession(null); setUser(null); setProfile(null);
    }
  }, [user]);

  const value = useMemo<AuthCtx>(() => ({
    user, session, profile,
    role: (profile?.role as Role) ?? null,
    loading, configured: isSupabaseConfigured,
    toasts, notify, refreshProfile, signOut
  }), [user, session, profile, loading, toasts, notify, refreshProfile, signOut]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
  return (p as Profile) ?? null;
}

export function requireRole(role: Role | null, allowed: Role[]): boolean {
  return !!role && allowed.includes(role);
}
