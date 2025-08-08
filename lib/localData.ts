// Local data storage for offline functionality
let localBlogPosts: any[] = [];
let localCourses: any[] = [];
let localCourseVideos: any[] = [];
let localVideos: any[] = [];

// Subscription mechanism for data changes
type DataChangeListener = () => void;
let dataChangeListeners: DataChangeListener[] = [];

export const subscribeToDataChanges = (listener: DataChangeListener) => {
  dataChangeListeners.push(listener);
  return () => {
    dataChangeListeners = dataChangeListeners.filter(l => l !== listener);
  };
};

const refreshLocalData = () => {
  dataChangeListeners.forEach(listener => listener());
};

// Blog Posts
export const getLocalBlogPosts = () => localBlogPosts;

export const addLocalBlogPost = (post: any) => {
  localBlogPosts.push(post);
  refreshLocalData();
};

export const updateLocalBlogPost = (id: string, updates: any) => {
  const index = localBlogPosts.findIndex(post => post.id === id);
  if (index !== -1) {
    localBlogPosts[index] = { ...localBlogPosts[index], ...updates };
    refreshLocalData();
    return true;
  }
  return false;
};

export const deleteLocalBlogPost = (id: string) => {
  const index = localBlogPosts.findIndex(post => post.id === id);
  if (index === -1) return false;
  
  localBlogPosts.splice(index, 1);
  refreshLocalData();
  return true;
};

// Courses
export const getLocalCourses = () => localCourses;

export const addLocalCourse = (course: any) => {
  localCourses.push(course);
  refreshLocalData();
};

export const updateLocalCourse = (id: string, updates: any) => {
  const index = localCourses.findIndex(course => course.id === id);
  if (index !== -1) {
    localCourses[index] = { ...localCourses[index], ...updates };
    refreshLocalData();
    return true;
  }
  return false;
};

export const deleteLocalCourse = (id: string) => {
  const index = localCourses.findIndex(course => course.id === id);
  if (index === -1) return false;
  
  localCourses.splice(index, 1);
  refreshLocalData();
  return true;
};

// Course Videos
export const getLocalCourseVideos = () => localCourseVideos;

export const addLocalCourseVideo = (video: any) => {
  localCourseVideos.push(video);
  refreshLocalData();
};

export const updateLocalCourseVideo = (id: string, updates: any) => {
  const index = localCourseVideos.findIndex(video => video.id === id);
  if (index !== -1) {
    localCourseVideos[index] = { ...localCourseVideos[index], ...updates };
    refreshLocalData();
    return true;
  }
  return false;
};

export const deleteLocalCourseVideo = (id: string) => {
  const index = localCourseVideos.findIndex(video => video.id === id);
  if (index === -1) return false;
  
  localCourseVideos.splice(index, 1);
  refreshLocalData(); // Trigger refresh for all subscribers
  return true;
};

// General Videos
export const getLocalVideos = () => localVideos;

export const addLocalVideo = (video: any) => {
  localVideos.push(video);
  refreshLocalData();
};

export const updateLocalVideo = (id: string, updates: any) => {
  const index = localVideos.findIndex(video => video.id === id);
  if (index !== -1) {
    localVideos[index] = { ...localVideos[index], ...updates };
    refreshLocalData();
    return true;
  }
  return false;
};

export const deleteLocalVideo = (id: string) => {
  const index = localVideos.findIndex(video => video.id === id);
  if (index === -1) return false;
  
  localVideos.splice(index, 1);
  refreshLocalData();
  return true;
};