export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
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
        };
        Insert: {
          id?: string;
          email: string;
          name?: string;
          subscription_type?: 'free' | 'premium';
          created_at?: string;
          updated_at?: string;
          last_active?: string;
          courses_completed?: number;
          videos_watched?: number;
          profile_data?: any;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          subscription_type?: 'free' | 'premium';
          created_at?: string;
          updated_at?: string;
          last_active?: string;
          courses_completed?: number;
          videos_watched?: number;
          profile_data?: any;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          duration: string;
          lessons_count: number;
          is_premium: boolean;
          thumbnail_url: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          duration?: string;
          lessons_count?: number;
          is_premium?: boolean;
          thumbnail_url?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          duration?: string;
          lessons_count?: number;
          is_premium?: boolean;
          thumbnail_url?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          title: string;
          description: string;
          youtube_id: string;
          category: 'courses' | 'testimonials' | 'inspiration';
          duration: string;
          views_count: number;
          rating: number;
          is_premium: boolean;
          thumbnail_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          youtube_id: string;
          category?: 'courses' | 'testimonials' | 'inspiration';
          duration?: string;
          views_count?: number;
          rating?: number;
          is_premium?: boolean;
          thumbnail_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          youtube_id?: string;
          category?: 'courses' | 'testimonials' | 'inspiration';
          duration?: string;
          views_count?: number;
          rating?: number;
          is_premium?: boolean;
          thumbnail_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          excerpt: string;
          author: string;
          is_published: boolean;
          featured_image_url: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          excerpt?: string;
          author: string;
          is_published?: boolean;
          featured_image_url?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          excerpt?: string;
          author?: string;
          is_published?: boolean;
          featured_image_url?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      course_videos: {
        Row: {
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
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string;
          video_url: string;
          duration?: string;
          order_index?: number;
          is_preview?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          description?: string;
          video_url?: string;
          duration?: string;
          order_index?: number;
          is_preview?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      booking_forms: {
        Row: {
          id: string;
          coach_name: string;
          form_url: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          coach_name: string;
          form_url: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          coach_name?: string;
          form_url?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          email: string;
          role: 'admin' | 'super_admin';
          created_at: string;
          updated_at: string;
          last_login: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          email: string;
          role?: 'admin' | 'super_admin';
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          email?: string;
          role?: 'admin' | 'super_admin';
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          is_active?: boolean;
        };
      };
    };
  };
}