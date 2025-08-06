import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Play, Lock, CheckCircle, Clock } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Course, CourseVideo } from '@/types/database';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

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
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      const { data: videosData, error: videosError } = await supabase
        .from('course_videos')
        .select('*')
        .eq('course_id', id)
        .order('order_index');

      if (videosError) throw videosError;
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
    return video.is_preview || userSubscription === 'premium' || !course?.is_premium;
  };

  const getEmbedUrl = (url: string) => {
    // Convert various video URLs to embed format
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url; // Assume it's already an embed URL
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
          <View style={styles.videoContainer}>
            <WebView
              source={{ uri: getEmbedUrl(selectedVideo.video_url) }}
              style={styles.webView}
              allowsFullscreenVideo
              mediaPlaybackRequiresUserAction={false}
            />
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{selectedVideo.title}</Text>
              <Text style={styles.videoDescription}>{selectedVideo.description}</Text>
            </View>
          </View>
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
                onPress={() => canAccessVideo(video) && setSelectedVideo(video)}
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
                      <Play size={20} color="#8b5cf6" />
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
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  webView: {
    height: 200,
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