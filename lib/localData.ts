// Local data store for when Supabase is not configured
// This allows admin operations to work and be visible to all users

export interface LocalBlogPost {
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

export interface LocalCourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons_count: number;
  is_premium: boolean;
  thumbnail_url?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface LocalVideo {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  category: 'courses' | 'testimonials' | 'inspiration';
  duration: string;
  views_count: number;
  rating: number;
  is_premium: boolean;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface LocalCourseVideo {
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

// Initial data
let localBlogPosts: LocalBlogPost[] = [
  {
    id: '1',
    title: 'The Future of Lean Manufacturing',
    content: 'Exploring how Industry 4.0 technologies are revolutionizing lean manufacturing practices. Digital transformation is creating new opportunities for implementing traditional lean methodologies with modern tools and techniques.',
    excerpt: 'Discover how digital transformation is enhancing traditional lean methodologies.',
    author: 'Divyanshu Singh',
    is_published: true,
    featured_image_url: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['lean', 'manufacturing', 'industry-4.0'],
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z',
    published_at: '2024-12-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Six Sigma Success Stories',
    content: 'Real-world case studies of successful Six Sigma implementations across various industries. Learn from companies that have achieved remarkable results using Six Sigma methodologies.',
    excerpt: 'Learn from companies that have achieved remarkable results using Six Sigma methodologies.',
    author: 'Rinesh Kumar',
    is_published: true,
    featured_image_url: 'https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['six-sigma', 'case-studies', 'success'],
    created_at: '2024-11-28T14:30:00Z',
    updated_at: '2024-11-28T14:30:00Z',
    published_at: '2024-11-28T14:30:00Z',
  },
  {
    id: '3',
    title: 'Kaizen in Remote Work Environments',
    content: 'Adapting continuous improvement principles for distributed teams and remote work settings. How to implement Kaizen practices when your team is working from different locations.',
    excerpt: 'How to implement Kaizen practices when your team is working from different locations.',
    author: 'Harsha Patel',
    is_published: true,
    featured_image_url: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['kaizen', 'remote-work', 'teams'],
    created_at: '2024-11-25T09:15:00Z',
    updated_at: '2024-11-25T09:15:00Z',
    published_at: '2024-11-25T09:15:00Z',
  },
];

let localCourses: LocalCourse[] = [
  {
    id: '1',
    title: 'Lean Basics',
    description: 'Master the fundamental principles of Lean methodology. This comprehensive course covers waste elimination, value stream mapping, and continuous improvement techniques that form the foundation of Lean thinking.',
    duration: '2 hours',
    lessons_count: 8,
    is_premium: false,
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Six Sigma Belt Overview',
    description: 'Understand the Six Sigma belt system and methodology. Learn about DMAIC process, statistical tools, and how to drive quality improvements in your organization.',
    duration: '3 hours',
    lessons_count: 12,
    is_premium: false,
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'DMAIC Process',
    description: 'Deep dive into the Define, Measure, Analyze, Improve, Control methodology. Learn advanced techniques for process improvement and problem-solving.',
    duration: '4 hours',
    lessons_count: 16,
    is_premium: true,
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let localVideos: LocalVideo[] = [
  {
    id: '1',
    title: 'Introduction to Lean Methodology',
    description: 'Basic introduction to Lean principles',
    youtube_id: 'dQw4w9WgXcQ',
    category: 'courses',
    duration: '15:30',
    views_count: 2300,
    rating: 4.8,
    is_premium: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Client Success Story - Manufacturing',
    description: 'Real-world implementation case study',
    youtube_id: 'dQw4w9WgXcQ',
    category: 'testimonials',
    duration: '8:45',
    views_count: 1800,
    rating: 4.9,
    is_premium: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Daily Motivation - Mystic Myra Speaks',
    description: 'Inspirational content for continuous improvement',
    youtube_id: 'dQw4w9WgXcQ',
    category: 'inspiration',
    duration: '5:20',
    views_count: 3100,
    rating: 4.7,
    is_premium: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let localCourseVideos: LocalCourseVideo[] = [
  {
    id: '1',
    course_id: '1',
    title: 'Introduction to Lean Thinking',
    description: 'Overview of Lean principles and philosophy',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '12:30',
    order_index: 0,
    is_preview: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    course_id: '1',
    title: 'Identifying Waste in Processes',
    description: 'Learn to spot the 8 types of waste in any process',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '15:45',
    order_index: 1,
    is_preview: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    course_id: '1',
    title: 'Value Stream Mapping',
    description: 'Create effective value stream maps',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '18:20',
    order_index: 2,
    is_preview: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    course_id: '2',
    title: 'Six Sigma Overview',
    description: 'Introduction to Six Sigma methodology',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '14:15',
    order_index: 0,
    is_preview: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    course_id: '2',
    title: 'Belt System Explained',
    description: 'Understanding White, Yellow, Green, Black belts',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '16:40',
    order_index: 1,
    is_preview: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    course_id: '3',
    title: 'DMAIC Introduction',
    description: 'Overview of the DMAIC process',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '10:30',
    order_index: 0,
    is_preview: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Blog Posts Management
export const getLocalBlogPosts = (): LocalBlogPost[] => {
  return [...localBlogPosts];
};

export const addLocalBlogPost = (post: Omit<LocalBlogPost, 'id' | 'created_at' | 'updated_at'>): LocalBlogPost => {
  const newPost: LocalBlogPost = {
    ...post,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  localBlogPosts.unshift(newPost);
  return newPost;
};

export const updateLocalBlogPost = (id: string, updates: Partial<LocalBlogPost>): LocalBlogPost | null => {
  const index = localBlogPosts.findIndex(post => post.id === id);
  if (index === -1) return null;
  
  localBlogPosts[index] = {
    ...localBlogPosts[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return localBlogPosts[index];
};

export const deleteLocalBlogPost = (id: string): boolean => {
  const index = localBlogPosts.findIndex(post => post.id === id);
  if (index === -1) return false;
  
  localBlogPosts.splice(index, 1);
  return true;
};

// Courses Management
export const getLocalCourses = (): LocalCourse[] => {
  return [...localCourses];
};

export const addLocalCourse = (course: Omit<LocalCourse, 'id' | 'created_at' | 'updated_at'>): LocalCourse => {
  const newCourse: LocalCourse = {
    ...course,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  localCourses.push(newCourse);
  return newCourse;
};

export const updateLocalCourse = (id: string, updates: Partial<LocalCourse>): LocalCourse | null => {
  const index = localCourses.findIndex(course => course.id === id);
  if (index === -1) return null;
  
  localCourses[index] = {
    ...localCourses[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return localCourses[index];
};

export const deleteLocalCourse = (id: string): boolean => {
  const index = localCourses.findIndex(course => course.id === id);
  if (index === -1) return false;
  
  localCourses.splice(index, 1);
  // Also delete associated course videos
  localCourseVideos = localCourseVideos.filter(video => video.course_id !== id);
  return true;
};

// Videos Management
export const getLocalVideos = (): LocalVideo[] => {
  return [...localVideos];
};

export const addLocalVideo = (video: Omit<LocalVideo, 'id' | 'created_at' | 'updated_at'>): LocalVideo => {
  const newVideo: LocalVideo = {
    ...video,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  localVideos.push(newVideo);
  return newVideo;
};

export const updateLocalVideo = (id: string, updates: Partial<LocalVideo>): LocalVideo | null => {
  const index = localVideos.findIndex(video => video.id === id);
  if (index === -1) return null;
  
  localVideos[index] = {
    ...localVideos[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return localVideos[index];
};

export const deleteLocalVideo = (id: string): boolean => {
  const index = localVideos.findIndex(video => video.id === id);
  if (index === -1) return false;
  
  localVideos.splice(index, 1);
  return true;
};

// Course Videos Management
export const getLocalCourseVideos = (courseId?: string): LocalCourseVideo[] => {
  if (courseId) {
    return localCourseVideos.filter(video => video.course_id === courseId);
  }
  return [...localCourseVideos];
};

export const addLocalCourseVideo = (video: Omit<LocalCourseVideo, 'id' | 'created_at' | 'updated_at'>): LocalCourseVideo => {
  const newVideo: LocalCourseVideo = {
    ...video,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  localCourseVideos.push(newVideo);
  return newVideo;
};

export const updateLocalCourseVideo = (id: string, updates: Partial<LocalCourseVideo>): LocalCourseVideo | null => {
  const index = localCourseVideos.findIndex(video => video.id === id);
  if (index === -1) return null;
  
  localCourseVideos[index] = {
    ...localCourseVideos[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return localCourseVideos[index];
};

export const deleteLocalCourseVideo = (id: string): boolean => {
  const index = localCourseVideos.findIndex(video => video.id === id);
  if (index === -1) return false;
  
  localCourseVideos.splice(index, 1);
  return true;
};