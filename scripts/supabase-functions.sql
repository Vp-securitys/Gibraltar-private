-- Function to create profiles table
CREATE OR REPLACE FUNCTION create_profiles_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    access_code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Set up RLS policies
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  
  -- Policy for users to read their own profile
  CREATE POLICY "Users can read their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);
    
  -- Policy for users to update their own profile
  CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id);
    
  -- Policy for admin to read all profiles
  CREATE POLICY "Admin can read all profiles"
    ON profiles FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE email LIKE '%admin%'));
    
  -- Policy for admin to update all profiles
  CREATE POLICY "Admin can update all profiles"
    ON profiles FOR UPDATE
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE email LIKE '%admin%'));
END;
$$ LANGUAGE plpgsql;

-- Function to create accounts table
CREATE OR REPLACE FUNCTION create_accounts_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    account_type TEXT NOT NULL CHECK (account_type IN ('Checking', 'Business')),
    account_number TEXT NOT NULL UNIQUE,
    balance DECIMAL(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Set up RLS policies
  ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
  
  -- Policy for users to read their own accounts
  CREATE POLICY "Users can read their own accounts"
    ON accounts FOR SELECT
    USING (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));
    
  -- Policy for admin to read all accounts
  CREATE POLICY "Admin can read all accounts"
    ON accounts FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE email LIKE '%admin%'));
    
  -- Policy for admin to update all accounts
  CREATE POLICY "Admin can update all accounts"
    ON accounts FOR UPDATE
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE email LIKE '%admin%'));
END;
$$ LANGUAGE plpgsql;

-- Function to create transactions table
CREATE OR REPLACE FUNCTION create_transactions_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('Debit', 'Credit', 'Deposit')),
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Completed', 'Pending', 'Failed')),
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    related_deposit_id UUID,
    related_transfer_id UUID
  );
  
  -- Set up RLS policies
  ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
  
  -- Policy for users to read their own transactions
  CREATE POLICY "Users can read their own transactions"
    ON transactions FOR SELECT
    USING (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));
    
  -- Policy for users to insert their own transactions
  CREATE POLICY "Users can insert their own transactions"
    ON transactions FOR INSERT
    WITH CHECK (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));
    
  -- Policy for admin to read all transactions
  CREATE POLICY "Admin can read all transactions"
    ON transactions FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE email LIKE '%admin%'));
    
  -- Policy for admin to update all transactions
  CREATE POLICY "Admin can update all transactions"
    ON transactions FOR UPDATE
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE email LIKE '%admin%'));
END;
$$ LANGUAGE plpgsql;

-- Function to create deposits table
CREATE OR REPLACE FUNCTION create_deposits_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    front_image_url TEXT NOT NULL,
    back_image_url TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE
  );
  
  -- Set up RLS policies
  ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
  
  -- Policy for users to read their own deposits
  CREATE POLICY "Users can read their own deposits"
    ON deposits FOR SELECT
    USING (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));
    
  -- Policy for users to insert their own deposits
  CREATE POLICY "Users can insert their own deposits"
    ON deposits FOR INSERT
    WITH CHECK (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));
    
  -- Policy for admin to read all deposits
  CREATE POLICY "Admin can read all deposits"
    ON deposits FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE email LIKE '%admin%'));
    
  -- Policy for admin to update all deposits
  CREATE POLICY "Admin can update all deposits"
    ON deposits FOR UPDATE
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE email LIKE '%admin%'));
END;
$$ LANGUAGE plpgsql;

-- Function to create transfers table
CREATE OR REPLACE FUNCTION create_transfers_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    source_account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    recipient_name TEXT NOT NULL,
    recipient_account_number TEXT NOT NULL,
    recipient_routing_number TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    memo TEXT,
    status TEXT NOT NULL CHECK (status IN ('Completed', 'Pending', 'Failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Set up RLS policies
  ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
  
  -- Policy for users to read their own transfers
  CREATE POLICY "Users can read their own transfers"
    ON transfers FOR SELECT
    USING (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));
    
  -- Policy for users to insert their own transfers
  CREATE POLICY "Users can insert their own transfers"
    ON transfers FOR INSERT
    WITH CHECK (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));
    
  -- Policy for admin to read all transfers
  CREATE POLICY "Admin can read all transfers"
    ON transfers FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE email LIKE '%admin%'));
    
  -- Policy for admin to update all transfers
  CREATE POLICY "Admin can update all transfers"
    ON transfers FOR UPDATE
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE email LIKE '%admin%'));
END;
$$ LANGUAGE plpgsql;

-- Function to create messages table
CREATE OR REPLACE FUNCTION create_messages_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('User', 'Support')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_read BOOLEAN NOT NULL DEFAULT FALSE
  );
  
  -- Set up RLS policies
  ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
  
  -- Policy for users to read their own messages
  CREATE POLICY "Users can read their own messages"
    ON messages FOR SELECT
    USING (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));
    
  -- Policy for users to insert their own messages
  CREATE POLICY "Users can insert their own messages"
    ON messages FOR INSERT
    WITH CHECK (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));
    
  -- Policy for users to update their own messages
  CREATE POLICY "Users can update their own messages"
    ON messages FOR UPDATE
    USING (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));
    
  -- Policy for admin to read all messages
  CREATE POLICY "Admin can read all messages"
    ON messages FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE email LIKE '%admin%'));
    
  -- Policy for admin to update all messages
  CREATE POLICY "Admin can update all messages"
    ON messages FOR UPDATE
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE email LIKE '%admin%'));
END;
$$ LANGUAGE plpgsql;
