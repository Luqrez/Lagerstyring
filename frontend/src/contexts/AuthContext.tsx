import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider sikrer, at kun autoriserede brugere har adgang til virksomhedens lagerstyringssystem og beskytter dermed følsomme data mod uautoriseret adgang.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Henter initial session og brugeroplysninger ved opstart, hvilket giver brugerne en gnidningsfri login-oplevelse uden gentagne login-forespørgsler.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Abonnerer på ændringer i brugerens autentificeringsstatus, så systemet straks reagerer på logins og logouts, hvilket sikrer en sikker brugeroplevelse.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Giver medarbejdere mulighed for hurtigt at logge ind med deres virksomhedsmail og password, hvilket reducerer barrierer ved daglig brug.
  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  // Opretter nye brugere og beskytter mod oprettelse med test- eller eksempel-mails, så systemet kun indeholder gyldige virksomhedskonti og forhindrer misbrug.
  const signUp = async (email: string, password: string) => {
    if (email.endsWith('@test.com') || email.endsWith('@example.com')) {
      return {
        error: new Error('Please use a valid email address. Test emails are not accepted.'),
        data: null
      };
    }

    // Sender nye brugere tilbage til login-siden efter bekræftelse, så nye medarbejdere nemt kan starte med at bruge systemet uden forvirring.
    const redirectTo = window.location.origin + '/login';
    return supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: redirectTo
      }
    });
  };

  // Logger brugeren sikkert ud af systemet, så virksomhedens data ikke eksponeres ved afslutning af brugersessionen.
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook der gør det let for udviklere at tilgå brugerens autentificeringsstatus og funktioner, hvilket forenkler integration af autorisation på tværs af systemet.
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
