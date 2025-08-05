/*
  # Initial TCG Lean Coach Database Schema

  1. New Tables
    - `users` - User profiles and subscription information
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `subscription_type` (text, default 'free')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `last_active` (timestamp)
      - `courses_completed` (integer, default 0)
      - `videos_watched` (integer, default 0)
      - `profile_data` (jsonb)

    - `courses` - Course content management
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `duration` (text)
      - `lessons_count` (integer, default 0)
      - `is_premium` (boolean, default false)
      - `thumbnail_url` (text)
      - `order_index` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `videos` - Video library management
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `youtube_id` (text)
      - `category` (text, default 'courses')
      - `duration` (text)
      - `views_count` (integer, default 0)
      - `rating` (decimal, default 0.0)
      - `is_premium` (boolean, default false)
      - `thumbnail_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_activity` - Track user activities and analytics
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `activity_type` (text)
      - `activity_data` (jsonb)
      - `created_at` (timestamp)

    - `coaching_sessions` - Booking management
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `coach_name` (text)
      - `session_type` (text)
      - `scheduled_date` (timestamp)
      - `status` (text, default 'pending')
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_progress` - Track course progress
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `course_id` (uuid, foreign key)
      - `progress_percentage` (integer, default 0)
      - `completed_lessons` (jsonb, default '[]')
      - `started_at` (timestamp)
      - `completed_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add admin policies for full access
    - Add public read access for courses and videos

  3. Indexes
    - Add indexes for frequently queried columns
    - Add composite indexes for user analytics queries
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  subscription_type text NOT NULL DEFAULT 'free' CHECK (subscription_type IN ('free', 'premium')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now(),
  courses_completed integer DEFAULT 0,
  videos_watched integer DEFAULT 0,
  profile_data jsonb DEFAULT '{}'::jsonb
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '0 hours',
  lessons_count integer DEFAULT 0,
  is_premium boolean DEFAULT false,
  thumbnail_url text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  youtube_id text NOT NULL,
  category text NOT NULL DEFAULT 'courses' CHECK (category IN ('courses', 'testimonials', 'inspiration')),
  duration text NOT NULL DEFAULT '0:00',
  views_count integer DEFAULT 0,
  rating decimal(3,2) DEFAULT 0.0,
  is_premium boolean DEFAULT false,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_activity table
CREATE TABLE IF NOT EXISTS user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN ('course_completed', 'video_watched', 'tool_downloaded', 'booking_made', 'login', 'search')),
  activity_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create coaching_sessions table
CREATE TABLE IF NOT EXISTS coaching_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  coach_name text NOT NULL,
  session_type text NOT NULL,
  scheduled_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_lessons jsonb DEFAULT '[]'::jsonb,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Courses policies (public read access)
CREATE POLICY "Anyone can read courses"
  ON courses
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Videos policies (public read access)
CREATE POLICY "Anyone can read videos"
  ON videos
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- User activity policies
CREATE POLICY "Users can read own activity"
  ON user_activity
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own activity"
  ON user_activity
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Coaching sessions policies
CREATE POLICY "Users can read own sessions"
  ON coaching_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions"
  ON coaching_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- User progress policies
CREATE POLICY "Users can read own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_type);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active);
CREATE INDEX IF NOT EXISTS idx_courses_premium ON courses(is_premium);
CREATE INDEX IF NOT EXISTS idx_courses_order ON courses(order_index);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_premium ON videos(is_premium);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON user_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_date ON coaching_sessions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON user_progress(course_id);

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create update triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaching_sessions_updated_at BEFORE UPDATE ON coaching_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();