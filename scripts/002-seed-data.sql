-- Updated demo accounts with simple password "demo123" for easy testing
-- Insert demo accounts (password: demo123)
INSERT INTO users (id, email, password_hash, full_name, user_type, phone, location)
VALUES 
  ('demo-client-001', 'demo-client@stabilisha.com', '$2a$10$YQ98PxSEQzXb5g5Y5Y5Y5eKxKxKxKxKxKxKxKxKxKxKxKxKxKxKxK', 'Demo Client', 'client', '+254712345678', 'Nairobi, Kenya'),
  ('demo-worker-001', 'demo-worker@stabilisha.com', '$2a$10$YQ98PxSEQzXb5g5Y5Y5Y5eKxKxKxKxKxKxKxKxKxKxKxKxKxKxKxK', 'Demo Worker', 'worker', '+254723456789', 'Mombasa, Kenya')
ON CONFLICT (email) DO NOTHING;

-- Insert wallets for demo users
INSERT INTO wallets (user_id, balance_kes, balance_usd, total_earned)
VALUES 
  ('demo-client-001', 50000.00, 350.00, 0),
  ('demo-worker-001', 25000.00, 175.00, 125000.00)
ON CONFLICT (user_id) DO NOTHING;

-- Insert worker profile for demo worker
INSERT INTO worker_profiles (user_id, title, bio, skills, hourly_rate, rating, total_jobs, success_rate)
VALUES 
  ('demo-worker-001', 'Full Stack Developer', 'Experienced developer specializing in React and Node.js with 5+ years of experience building scalable web applications.', 
   ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Next.js'], 2500.00, 4.8, 45, 96.5)
ON CONFLICT (user_id) DO NOTHING;

-- Insert credit score for demo worker
INSERT INTO credit_scores (user_id, score, gig_consistency, payment_history, financial_health)
VALUES 
  ('demo-worker-001', 720, 85.5, 92.0, 78.5)
ON CONFLICT (user_id) DO NOTHING;

-- Insert SACCO account for demo worker
INSERT INTO sacco_accounts (user_id, total_contributions, available_loan_amount, rotation_position)
VALUES 
  ('demo-worker-001', 15000.00, 30000.00, 5)
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample transactions for demo worker
INSERT INTO transactions (wallet_id, user_id, type, category, amount, currency, description, blockchain_hash)
SELECT 
  w.id, 
  'demo-worker-001', 
  'credit', 
  'gig_payment', 
  5000.00, 
  'KES', 
  'Payment for website development', 
  '0x' || md5(random()::text || NOW()::text)
FROM wallets w WHERE w.user_id = 'demo-worker-001'
LIMIT 1;

INSERT INTO transactions (wallet_id, user_id, type, category, amount, currency, description, blockchain_hash)
SELECT 
  w.id, 
  'demo-worker-001', 
  'credit', 
  'gig_payment', 
  8500.00, 
  'KES', 
  'Mobile app UI design', 
  '0x' || md5(random()::text || NOW()::text)
FROM wallets w WHERE w.user_id = 'demo-worker-001'
LIMIT 1;

INSERT INTO transactions (wallet_id, user_id, type, category, amount, currency, description, blockchain_hash)
SELECT 
  w.id, 
  'demo-worker-001', 
  'debit', 
  'sacco_contribution', 
  1000.00, 
  'KES', 
  'Monthly SACCO contribution', 
  '0x' || md5(random()::text || NOW()::text)
FROM wallets w WHERE w.user_id = 'demo-worker-001'
LIMIT 1;

-- Insert sample gigs from demo client
INSERT INTO gigs (client_id, title, description, category, budget_min, budget_max, duration, location_type, required_skills, experience_level)
VALUES 
  ('demo-client-001', 'Build E-commerce Website', 'Need a full-featured e-commerce website with payment integration, product catalog, shopping cart, and admin dashboard.', 'Web Development', 50000, 100000, '2-3 months', 'remote', ARRAY['React', 'Node.js', 'Payment Integration', 'PostgreSQL'], 'intermediate'),
  ('demo-client-001', 'Logo Design for Startup', 'Creative and modern logo design for a tech startup in the fintech space. Need multiple concepts and revisions.', 'Graphic Design', 5000, 15000, '1-2 weeks', 'remote', ARRAY['Adobe Illustrator', 'Branding', 'Logo Design'], 'beginner'),
  ('demo-client-001', 'Content Writing for Blog', 'Need 10 SEO-optimized blog posts about digital marketing and social media trends.', 'Content Writing', 15000, 25000, '1 month', 'remote', ARRAY['SEO Writing', 'Content Strategy', 'Digital Marketing'], 'intermediate');

-- Insert sample insurance policy for demo worker
INSERT INTO insurance_policies (user_id, policy_type, policy_number, coverage_amount, premium_amount, start_date, end_date)
VALUES 
  ('demo-worker-001', 'income_protection', 'IP-2025-001', 100000.00, 500.00, NOW(), NOW() + INTERVAL '1 year'),
  ('demo-worker-001', 'equipment_coverage', 'EQ-2025-001', 50000.00, 300.00, NOW(), NOW() + INTERVAL '1 year');

-- Insert sample AI insights for demo worker
INSERT INTO ai_insights (user_id, insight_type, title, description, confidence)
VALUES 
  ('demo-worker-001', 'income_prediction', 'Income Forecast', 'Based on your current gig pattern, you are likely to earn KES 35,000 - 42,000 next month', 87.5),
  ('demo-worker-001', 'recommendation', 'Diversify Your Skills', 'Consider learning mobile development to access 23% more gig opportunities in your area', 92.0),
  ('demo-worker-001', 'warning', 'Income Dip Alert', 'Your income has decreased by 15% this month. Consider applying to more gigs or adjusting your rates.', 78.5),
  ('demo-worker-001', 'opportunity', 'High Demand Skills', 'React and TypeScript skills are in high demand. You could increase your rate by 20%.', 85.0);
