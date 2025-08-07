import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Play, Lock, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Course, CourseVideo } from '@/types/database';

const { width } = Dimensions.get('window');

// Mock data for when Supabase is not configured
const mockCourses = {
  '1': {
    id: '1',
    title: 'Lean Basics',
    description: 'Master the fundamental principles of Lean methodology. This comprehensive course covers waste elimination, value stream mapping, and continuous improvement techniques that form the foundation of Lean thinking.',
    duration: '2 hours',
    lessons_count: 8,
    is_premium: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    thumbnail_url: null,
    order_index: 1,
  },
  '2': {
    id: '2',
    title: 'Six Sigma Belt Overview',
    description: 'Understand the Six Sigma belt system and methodology. Learn about DMAIC process, statistical tools, and how to drive quality improvements in your organization.',
    duration: '3 hours',
    lessons_count: 12,
    is_premium: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    thumbnail_url: null,
    order_index: 2,
  },
  '3': {
    id: '3',
    title: 'DMAIC Process',
    description: 'Deep dive into the Define, Measure, Analyze, Improve, Control methodology. Learn advanced techniques for process improvement and problem-solving.',
    duration: '4 hours',
    lessons_count: 16,
    is_premium: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    thumbnail_url: null,
    order_index: 3,
  },
};

const mockVideos = {
  '1': [
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
  ],
  '2': [
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
  ],
  '3': [
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
  ],
};
export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);
  const [userSubscription] = useState('free'); // This would come from auth context
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      if (!supabase) {
        // Use mock data when Supabase is not configured
        const mockCourse = mockCourses[id as keyof typeof mockCourses];
        const mockCourseVideos = mockVideos[id as keyof typeof mockVideos] || [];
        
        if (mockCourse) {
          setCourse(mockCourse);
          setVideos(mockCourseVideos);
          
          // Auto-select first video or first preview video
          const firstVideo = mockCourseVideos.find(v => v.is_preview) || mockCourseVideos[0];
          if (firstVideo) {
            setSelectedVideo(firstVideo);
          }
        }
        setLoading(false);
        return;
      }

      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError) {
        // Fallback to mock data
        const mockCourse = mockCourses[id as keyof typeof mockCourses];
        const mockCourseVideos = mockVideos[id as keyof typeof mockVideos] || [];
        
        if (mockCourse) {
          setCourse(mockCourse);
          setVideos(mockCourseVideos);
          
          const firstVideo = mockCourseVideos.find(v => v.is_preview) || mockCourseVideos[0];
          if (firstVideo) {
            setSelectedVideo(firstVideo);
          }
        }
        setLoading(false);
        return;
      }
      
      setCourse(courseData);

      const { data: videosData, error: videosError } = await supabase
        .from('course_videos')
        .select('*')
        .eq('course_id', id)
        .order('order_index');

      if (videosError) {
        // Fallback to mock videos
        const mockCourseVideos = mockVideos[id as keyof typeof mockVideos] || [];
        setVideos(mockCourseVideos);
        
        const firstVideo = mockCourseVideos.find(v => v.is_preview) || mockCourseVideos[0];
        if (firstVideo) {
          setSelectedVideo(firstVideo);
        }
        setLoading(false);
        return;
      }
      
      setVideos(videosData || []);
      
      // Auto-select first video or first preview video
      const firstVideo = videosData?.find(v => v.is_preview) || videosData?.[0];
      if (firstVideo) {
        setSelectedVideo(firstVideo);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const canAccessVideo = (video: CourseVideo) => {
    return video.is_preview || userSubscription === 'premium' || !(course?.is_premium);
  };

  const openVideo = (video: CourseVideo) => {
    if (!canAccessVideo(video)) return;
    
    // Convert embed URL to watch URL for external opening
    let watchUrl = video.video_url;
    if (video.video_url.includes('youtube.com/embed/')) {
      const videoId = video.video_url.split('/embed/')[1]?.split('?')[0];
      watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }
    
    Linking.openURL(watchUrl);
  };

  if (loading || !course) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading course...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#8b5cf6', '#06b6d4']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{course.title}</Text>
        <Text style={styles.headerSubtitle}>{course.duration} • {videos.length} videos</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Video Player */}
        {selectedVideo && canAccessVideo(selectedVideo) && (
          <TouchableOpacity 
            style={styles.videoContainer}
            onPress={() => openVideo(selectedVideo)}
            activeOpacity={0.8}>
            <View style={styles.videoThumbnail}>
              <View style={styles.playButton}>
                <Play size={32} color="#ffffff" fill="#ffffff" />
              </View>
              <View style={styles.videoDuration}>
                <Text style={styles.videoDurationText}>{selectedVideo.duration}</Text>
              </View>
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{selectedVideo.title}</Text>
              <Text style={styles.videoDescription}>{selectedVideo.description}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Course Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>About This Course</Text>
          <Text style={styles.descriptionText}>{course.description}</Text>
        </View>

        {/* Video List */}
        <View style={styles.videosSection}>
          <Text style={styles.sectionTitle}>Course Content</Text>
          <ScrollView style={styles.videosList} showsVerticalScrollIndicator={false}>
            {videos.map((video, index) => (
              <TouchableOpacity
                key={video.id}
                style={[
                  styles.videoItem,
                  selectedVideo?.id === video.id && styles.selectedVideoItem,
                  !canAccessVideo(video) && styles.lockedVideoItem
                ]}
                onPress={() => {
                  if (canAccessVideo(video)) {
                    setSelectedVideo(video);
                  }
                }}
                activeOpacity={0.7}>
                <View style={styles.videoItemContent}>
                  <View style={styles.videoItemLeft}>
                    <View style={styles.videoNumber}>
                      <Text style={styles.videoNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.videoItemInfo}>
                      <Text style={[
                        styles.videoItemTitle,
                        !canAccessVideo(video) && styles.lockedText
                      ]}>
                        {video.title}
                      </Text>
                      <View style={styles.videoItemMeta}>
                        <Clock size={12} color="#6b7280" />
                        <Text style={styles.videoItemDuration}>{video.duration}</Text>
                        {video.is_preview && (
                          <View style={styles.previewBadge}>
                            <Text style={styles.previewText}>Preview</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <View style={styles.videoItemRight}>
                    {canAccessVideo(video) ? (
                      <TouchableOpacity onPress={() => openVideo(video)}>
                        <Play size={20} color="#8b5cf6" />
                      </TouchableOpacity>
                    ) : (
                      <Lock size={20} color="#9ca3af" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Upgrade Banner */}
        {course.is_premium && userSubscription === 'free' && (
          <LinearGradient
            colors={['#f59e0b', '#ef4444']}
            style={styles.upgradeBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Text style={styles.upgradeTitle}>Unlock Full Course</Text>
            <Text style={styles.upgradeSubtitle}>
              Get access to all {videos.length} videos with Premium
            </Text>
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  videoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  videoThumbnail: {
    height: 200,
    backgroundColor: '#8b5cf6',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoDurationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  descriptionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  videosSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  videosList: {
    flex: 1,
  },
  videoItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedVideoItem: {
    borderColor: '#8b5cf6',
    backgroundColor: '#f8fafc',
  },
  lockedVideoItem: {
    opacity: 0.6,
  },
  videoItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  videoNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  videoNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  videoItemInfo: {
    flex: 1,
  },
  videoItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  lockedText: {
    color: '#9ca3af',
  },
  videoItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  videoItemDuration: {
    fontSize: 12,
    color: '#6b7280',
  },
  previewBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  previewText: {
    fontSize: 8,
    color: '#16a34a',
    fontWeight: '600',
  },
  videoItemRight: {
    marginLeft: 12,
  },
  upgradeBanner: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
});