"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase, type Profile } from "@/lib/supabase";
import type { Session, User, AuthError } from "@supabase/supabase-js"

export interface Account {
  id: string;
  account_type: "Checkings" | "Business" | "Savings";
  account_number: string;
  routing_number: string;
  balance: number;
  user_id: string;
  firstName: string;
  lastName: string;
};

export interface Transaction {
  id: string;
  transaction_date: string;
  description: string;
  amount: number;
  type: "Credit" | "Debit";
  status: "Pending" | "Completed" | "Failed";
  user_id: string;
  account_type: "Personal" | "Business" | "Checkings" | "Savings";
}

// Update to include ALL dashboard routes - this will ensure any new dashboard routes are also protected
const protectedDashboardRoutes = [
  "/dashboard",
];

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  accounts: Account[];
  accountsLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ data: { user: User | null, session: Session | null } | null, error: AuthError | null }>;
  signIn: (email: string, password: string, accessCode: string) => Promise<{ error: AuthError | { message: string } | null }>;
  signOut: () => Promise<void>;
  fetchAccounts: () => Promise<Account[]>;
  getAccountById: (accountId: string) => Account | undefined;
  calculateTotalBalance: () => number;
  transactions: Transaction[];
  transactionsLoading: boolean;
  fetchTransactions: () => Promise<Transaction[]>;
  fetchTransactionById: (transactionId: string) => Transaction | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [accountsLoading, setAccountsLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const router = useRouter()
  const pathname = usePathname()

  // --- useEffect for setting up auth state listener (keep as is) ---
  useEffect(() => {
    const setupAuth = async () => {
      try {
        console.log("Setting up authentication...");
        setLoading(true);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }
        
        // Set the session first
        setSession(session);
        
        // Get current user from session
        const currentUser = session?.user ?? null;
        
        if (currentUser) {
          console.log("User authenticated:", currentUser.id);
          
          // IMPORTANT: Set the user state and wait for it to be updated
          setUser(currentUser);
          
          // Fetch profile data
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", currentUser.id)
            .single();
            
          if (!profileError) {
            setProfile(profileData as Profile ?? null);
            console.log("Profile loaded");
          } else {
            console.error("Error fetching profile:", profileError);
            setProfile(null);
          }
          
          // Since setState doesn't immediately update, we'll pass the user directly
          await fetchAccountsWithUser(currentUser);
          await fetchTransactionsWithUser(currentUser);
        } else {
          console.log("No authenticated user");
          setUser(null);
          setProfile(null);
          setAccounts([]);
          setTransactions([]);
        }
      } catch (err) {
        console.error("Authentication setup error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    // Helper functions that take user as a parameter to avoid state timing issues
    const fetchAccountsWithUser = async (user: User) => {
      try {
        const { data, error } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", user.id);
          
        if (error) {
          console.error("Error fetching accounts:", error);
          return [];
        }
        
        setAccounts(data || []);
        return data || [];
      } catch (err) {
        console.error("Error fetching accounts:", err);
        return [];
      }
    };
    
    const fetchTransactionsWithUser = async (user: User) => {
      try {
        setTransactionsLoading(true);
        
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("transaction_date", { ascending: false });
        
        if (error) {
          console.error("Error fetching transactions:", error);
          return [];
        }

        setTransactions(data as Transaction[] || []);
        return data as Transaction[] || [];
      } catch (err) {
        console.error("Unexpected error fetching transactions:", err);
        return [];
      } finally {
        setTransactionsLoading(false);
      }
    };
    
    setupAuth(); // Run initial setup
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          console.log("Auth state changed:", _event);
          setSession(session);
          
          const currentUser = session?.user ?? null;
          
          if (currentUser) {
            console.log("User authenticated after state change:", currentUser.id);
            
            // Set user state
            setUser(currentUser);
            
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", currentUser.id)
              .single();
              
            setProfile(profileError ? null : profileData as Profile ?? null);
            
            // Use the user directly rather than depending on state
            await fetchAccountsWithUser(currentUser);
            await fetchTransactionsWithUser(currentUser);
            
          } else {
            console.log("No authenticated user after state change");
            setUser(null);
            setProfile(null);
            setAccounts([]);
            setTransactions([]);
          }
        } catch (err) {
          console.error("Auth state change error:", err);
        } finally {
          setLoading(false);
        }
      }
    );
    
    // Cleanup function
    return () => {
      subscription?.unsubscribe();
    };
  }, []);   // Include dependencies in the dependency array

  // --- ENHANCED useEffect for route protection ---
  useEffect(() => {
    if (loading) return; // Skip during initial load

    // Check if the current path is any dashboard route
    const isDashboardRoute = pathname?.startsWith('/dashboard');
    
    if (isDashboardRoute && !user) {
      console.log("Unauthenticated user detected on dashboard route. Redirecting to login.");
      router.push("/login");
    }
  
    if ((pathname === "/login" || pathname === "/signup") && user) {
      console.log("Authenticated user on login/signup page. Redirecting to dashboard.");
      router.push("/dashboard");
    }
  }, [loading, user, pathname, router]);

  // --- SIGN UP Function ---
  const signUp = async (email: string, password: string) => {
    console.log(`Attempting sign up for ${email}`);
    setAuthError(null); // Clear previous errors
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        // Add options here if needed (e.g., emailRedirectTo)
      });

      if (error) {
        console.error(`Sign up error for ${email}:`, error);
        setAuthError(error); // Store error
        // Don't throw here, return the error object
      } else {
        console.log(`Sign up successful for ${email} (Confirmation might be needed):`, data);
        // Don't redirect here. User needs to confirm email (usually).
        // onAuthStateChange will handle the user state once confirmed/logged in.
        // You might want to show a message in the UI: "Please check your email..."
      }
      setLoading(false);
      return { data, error }; // Return the result

    } catch (err) {
      console.error("Unexpected error during signUpUser:", err);
      const unexpectedError = { message: (err as Error).message || 'An unexpected error occurred during signup.' } as AuthError;
      setAuthError(unexpectedError);
      setLoading(false);
      return { data: null, error: unexpectedError };
    }
  }

  // --- SIGN IN Function (Using your original logic structure) ---
  const signIn = async (email: string, password: string, accessCode: string) => {
    setLoading(true);
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("access_code", accessCode)
      
    if (profileError) {
      setAuthError({ message: "Invalid credentials or access code" } as AuthError);
      setLoading(false);
      return { error: { message: "Invalid credentials or access code" } };
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { error: signInError ?? null };
  };

  // --- SIGN OUT Function (keep as is) ---
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    setAccounts([]);
    // Force redirect to login after sign out
    router.push("/login");
  };

  // Fetch accounts from Supabase
  const fetchAccounts = async (): Promise<any[]> => {
    const currentUser = user; // Capture the current user value
    
    if (!currentUser) {
      console.log("fetchAccounts: No user found, skipping account fetch");
      return [];
    }
    
    console.log("fetchAccounts: User found, fetching accounts for", currentUser.id);
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", currentUser.id);
        
      if (error) {
        console.error("Error fetching accounts:", error);
        return [];
      }
      
      setAccounts(data || []);
      return data || [];
    } catch (err) {
      console.error("Error fetching accounts:", err);
      return [];
    }
  };

  const getAccountById = (accountId: string): Account | undefined => {
    return accounts.find(account => account.id === accountId)
  }

  // Calculate total balance
  const calculateTotalBalance = (): number => {
    return accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);
  };

  const fetchTransactions = async (): Promise<Transaction[]> => {
    const currentUser = user; // Capture the current user value
    
    if (!currentUser) {
      console.log("fetchTransactions: No user found, skipping transaction fetch");
      return [];
    }
    
    console.log("fetchTransactions: User found, ID =", currentUser.id);
    
    try {
      setTransactionsLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("transaction_date", { ascending: false });
      
      console.log("fetchTransactions: Raw data received:", data);
      
      if (error) {
        console.error("Error fetching transactions:", error);
        return [];
      }

      console.log("fetchTransactions: Setting transactions state with", data?.length || 0, "items");
      setTransactions(data as Transaction[] || []);
      return data as Transaction[] || [];
    } catch (err) {
      console.error("Unexpected error fetching transactions:", err);
      return [];
    } finally {
      setTransactionsLoading(false);
    }
  };

  const fetchTransactionById = (transactionId: string): Transaction | undefined => {
    return transactions.find(transaction => transaction.id === transactionId)
  }

  useEffect(() => {
    if (user?.id && !loading) {
      fetchAccounts()
    } else {
      setAccounts([])
    }
  }, [user?.id, loading])

  // Provide the correctly named functions in the context value
  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      accounts,
      accountsLoading,
      signUp,
      signIn,
      signOut,
      fetchAccounts,
      getAccountById,
      calculateTotalBalance,
      transactions,
      transactionsLoading,
      fetchTransactions,
      fetchTransactionById  
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// --- useAuth Hook (keep as is) ---
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}