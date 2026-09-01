import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../services/supabaseClient.js';

const AuthContext = createContext(null);
const EMPTY_AUTH = { session: null, user: null, profile: null, roles: [], permissions: [], isAuthenticated: false, accessError: '' };

async function loadUserAccess(client, session) {
  if (!session?.user) return EMPTY_AUTH;
  const [profileResult, rolesResult] = await Promise.all([
    client.from('profiles').select('id, display_name, email, status').eq('id', session.user.id).single(),
    client.from('user_roles').select('role').eq('user_id', session.user.id),
  ]);
  if (profileResult.error || rolesResult.error) {
    return { ...EMPTY_AUTH, session, user: session.user, accessError: 'Akses akun belum dapat diverifikasi.' };
  }
  const roles = (rolesResult.data ?? []).map(({ role }) => role);
  if (profileResult.data.status !== 'active') {
    return { ...EMPTY_AUTH, session, user: session.user, profile: profileResult.data, roles, accessError: 'Akun ini belum aktif. Hubungi administrator.' };
  }
  if (roles.length === 0) {
    return { ...EMPTY_AUTH, session, user: session.user, profile: profileResult.data, accessError: 'Akun ini belum memiliki peran akses.' };
  }
  const [permissionsResult, grantsResult] = await Promise.all([
    client.from('role_permissions').select('permission').in('role', roles),
    client.from('user_permission_grants').select('permission').eq('user_id', session.user.id),
  ]);
  if (permissionsResult.error || grantsResult.error) {
    return { ...EMPTY_AUTH, session, user: session.user, profile: profileResult.data, roles, accessError: 'Izin akun belum dapat diverifikasi.' };
  }
  return {
    session,
    user: session.user,
    profile: profileResult.data,
    roles,
    permissions: [...new Set([
      ...(permissionsResult.data ?? []).map(({ permission }) => permission),
      ...(grantsResult.data ?? []).map(({ permission }) => permission),
    ])],
    isAuthenticated: true,
    accessError: '',
  };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(EMPTY_AUTH);
  const [isLoading, setIsLoading] = useState(true);
  const requestId = useRef(0);

  const applySession = useCallback(async (session) => {
    const currentRequest = ++requestId.current;
    setIsLoading(true);
    const nextAuth = isSupabaseConfigured()
      ? await loadUserAccess(getSupabaseBrowserClient(), session)
      : { ...EMPTY_AUTH, accessError: 'Konfigurasi login belum tersedia.' };
    if (currentRequest === requestId.current) {
      setAuth(nextAuth);
      setIsLoading(false);
    }
    return nextAuth;
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuth({ ...EMPTY_AUTH, accessError: 'Konfigurasi login belum tersedia.' });
      setIsLoading(false);
      return undefined;
    }
    const client = getSupabaseBrowserClient();
    void client.auth.getSession().then(({ data }) => applySession(data.session));
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => void applySession(session), 0);
    });
    return () => listener.subscription.unsubscribe();
  }, [applySession]);

  const signIn = useCallback(async (email, password) => {
    if (!isSupabaseConfigured()) throw new Error('AUTH_NOT_CONFIGURED');
    const { data, error } = await getSupabaseBrowserClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return applySession(data.session);
  }, [applySession]);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured()) await getSupabaseBrowserClient().auth.signOut();
    await applySession(null);
  }, [applySession]);

  return <AuthContext.Provider value={{ ...auth, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
