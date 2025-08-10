import { supabase, isSupabaseConnected } from './supabase';
import { BlogPost, Course, CourseVideo, Video } from '@/types/database';

// Generic error handler for database operations
const handleDatabaseError = (error: any, operation: string) => {
  console.error(`Database ${operation} error:`, error);
  throw new Error(`Failed to ${operation}: ${error.message || 'Unknown error'}`);
};

// Blog Posts Operations
export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { data, error } = await supabase!
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleDatabaseError(error, 'fetch blog posts');
    }
  },

  async getPublished(): Promise<BlogPost[]> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { data, error } = await supabase!
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleDatabaseError(error, 'fetch published blog posts');
    }
  },

  async getById(id: string): Promise<BlogPost | null> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { data, error } = await supabase!
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      handleDatabaseError(error, 'fetch blog post');
    }
  },

  async create(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { data, error } = await supabase!
        .from('blog_posts')
        .insert([{
          ...post,
          published_at: post.is_published ? new Date().toISOString() : null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'create blog post');
    }
  },

  async update(id: string, updates: Partial<Omit<BlogPost, 'id' | 'created_at'>>): Promise<BlogPost> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // Set published_at if publishing for the first time
      if (updates.is_published && !updates.published_at) {
        updateData.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase!
        .from('blog_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'update blog post');
    }
  },

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { error } = await supabase!
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      handleDatabaseError(error, 'delete blog post');
    }
  },
};

// Courses Operations
export const courseService = {
  async getAll(): Promise<Course[]> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { data, error } = await supabase!
        .from('courses')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleDatabaseError(error, 'fetch courses');
    }
  },

  async getById(id: string): Promise<Course | null> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { data, error } = await supabase!
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      handleDatabaseError(error, 'fetch course');
    }
  },

  async create(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { data, error } = await supabase!
        .from('courses')
        .insert([course])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'create course');
    }
  },

  async update(id: string, updates: Partial<Omit<Course, 'id' | 'created_at'>>): Promise<Course> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { data, error } = await supabase!
        .from('courses')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'update course');
    }
  },

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      // First delete associated course videos
      await supabase!
        .from('course_videos')
        .delete()
        .eq('course_id', id);

      // Then delete the course
      const { error } = await supabase!
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      handleDatabaseError(error, 'delete course');
    }
  },
};

// Course Videos Operations
export const courseVideoService = {
  async getByCourseId(courseId: string): Promise<CourseVideo[]> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { data, error } = await supabase!
        .from('course_videos')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleDatabaseError(error, 'fetch course videos');
    }
  },

  async create(video: Omit<CourseVideo, 'id' | 'created_at' | 'updated_at'>): Promise<CourseVideo> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { data, error } = await supabase!
        .from('course_videos')
        .insert([video])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'create course video');
    }
  },

  async update(id: string, updates: Partial<Omit<CourseVideo, 'id' | 'created_at'>>): Promise<CourseVideo> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { data, error } = await supabase!
        .from('course_videos')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'update course video');
    }
  },

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { error } = await supabase!
        .from('course_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      handleDatabaseError(error, 'delete course video');
    }
  },
};

// Videos Operations
export const videoService = {
  async getAll(): Promise<Video[]> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { data, error } = await supabase!
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleDatabaseError(error, 'fetch videos');
    }
  },

  async create(video: Omit<Video, 'id' | 'created_at' | 'updated_at'>): Promise<Video> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { data, error } = await supabase!
        .from('videos')
        .insert([video])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'create video');
    }
  },

  async update(id: string, updates: Partial<Omit<Video, 'id' | 'created_at'>>): Promise<Video> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { data, error } = await supabase!
        .from('videos')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'update video');
    }
  },

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConnected()) {
      throw new Error('Database not connected');
    }

    try {
      const { error } = await supabase!
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      handleDatabaseError(error, 'delete video');
    }
  },
};

// Connection status check
export const checkDatabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConnected()) {
    return false;
  }

  try {
    const { data, error } = await supabase!
      .from('courses')
      .select('count')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
};