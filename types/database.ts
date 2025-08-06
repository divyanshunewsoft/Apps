export interface User {
  id: string;
  email: string;
  name: string;
  subscription_type: 'free' | 'premium';
  created_at: string;
  updated_at: string;
  last_active: string;
  courses_completed: number;
  videos_watched: number;
  profile_data: any;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons_count: number;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
  order_index: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  category: 'courses' | 'testimonials' | 'inspiration';
  duration: string;
  views_count: number;
  rating: number;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'course_completed' | 'video_watched' | 'tool_downloaded' | 'booking_made';
  activity_data: any;
  created_at: string;
}

export interface CoachingSession {
  id: string;
  user_id: string;
  coach_name: string;
  session_type: string;
  scheduled_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  progress_percentage: number;
  completed_lessons: number[];
  started_at: string;
  completed_at?: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  is_published: boolean;
  featured_image_url?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface CourseVideo {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string;
  duration: string;
  order_index: number;
  is_preview: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingForm {
  id: string;
  coach_name: string;
  form_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}