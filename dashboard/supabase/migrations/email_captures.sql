CREATE TABLE IF NOT EXISTS email_captures (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  source text DEFAULT 'public_page',
  created_at timestamptz DEFAULT now(),
  welcome_sent boolean DEFAULT false
);

ALTER TABLE email_captures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON email_captures
  USING (auth.role() = 'service_role');
