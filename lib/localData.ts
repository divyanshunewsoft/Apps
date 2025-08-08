if (index === -1) return false;
  
  localCourseVideos.splice(index, 1);
  refreshLocalData(); // Trigger refresh for all subscribers
  return true;
};