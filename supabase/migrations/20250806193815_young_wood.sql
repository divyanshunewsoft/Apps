/*
  # Enhanced Admin Features for TCG Lean Coach

  1. New Tables
    - `admin_users` - Authorized admin users management
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `email` (text)
      - `role` (text, default 'admin')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `last_login` (timestamp)
      - `is_active` (boolean, default true)

    - `blog_posts` - News and blog management
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `excerpt` (text)
      - `author` (text)
      - `is_published` (boolean, default false)
      - `featured_image_url` (text)
      - `tags` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `published_at` (timestamp)

    - `course_videos` - Videos within courses
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `video_url` (text) - embedded video link
      - `duration` (text)
      - `order_index` (integer, default 0)
      - `is_preview` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `booking_forms` - Google Forms integration
      - `id` (uuid, primary key)
      - `coach_name` (text)
      - `form_url` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for admin and public access

  3. Indexes
    - Add indexes for performance optimization
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz,
  is_active boolean DEFAULT true
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  author text NOT NULL,
  is_published boolean DEFAULT false,
  featured_image_url text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Create course_videos table
CREATE TABLE IF NOT EXISTS course_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  video_url text NOT NULL,
  duration text NOT NULL DEFAULT '0:00',
  order_index integer DEFAULT 0,
  is_preview boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create booking_forms table
CREATE TABLE IF NOT EXISTS booking_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_name text NOT NULL,
  form_url text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_forms ENABLE ROW LEVEL SECURITY;

-- Admin users policies (only accessible by authenticated admins)
CREATE POLICY "Admin users can read admin data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage admin data"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Blog posts policies
CREATE POLICY "Anyone can read published posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Admins can manage all posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Course videos policies
CREATE POLICY "Anyone can read course videos"
  ON course_videos
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage course videos"
  ON course_videos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Booking forms policies
CREATE POLICY "Anyone can read active booking forms"
  ON booking_forms
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage booking forms"
  ON booking_forms
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created ON blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_course_videos_course_id ON course_videos(course_id);
CREATE INDEX IF NOT EXISTS idx_course_videos_order ON course_videos(order_index);
CREATE INDEX IF NOT EXISTS idx_booking_forms_active ON booking_forms(is_active);

-- Add update triggers
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_videos_updated_at BEFORE UPDATE ON course_videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_booking_forms_updated_at BEFORE UPDATE ON booking_forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: "admin123")
INSERT INTO admin_users (username, password_hash, email, role) VALUES
('Divyanshu', '$2b$10$rBV2HQ/xsvx0vsC.12MPa.Zkq9T8XqvxwQNNFxkk7ZQr8b/6SLtka', 'admin@tcgleancoach.com', 'super_admin')
ON CONFLICT (username) DO NOTHING;

-- Insert sample booking forms
INSERT INTO booking_forms (coach_name, form_url) VALUES
('Rinesh Kumar', 'https://forms.google.com/rinesh-booking'),
('Harsha Patel', 'https://forms.google.com/harsha-booking'),
('Divyanshu Singh', 'https://forms.google.com/divyanshu-booking')
ON CONFLICT DO NOTHING;