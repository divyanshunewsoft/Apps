import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Clock, Users, Star } from 'lucide-react-native';
import { getLocalVideos } from '@/lib/localData';

const videoCategories = [
  { id: 'all', title: 'All Videos', active: true },
  { id: 'courses', title: 'Course Content', active: false },
  { id: 'testimonials', title: 'Testimonials', active: false },
  { id: 'inspiration', title: 'Inspiration', active: false },
];

const videos = [
];

export default function VideosScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [videoList, setVideoList] = useState(videos);

  useEffect(() => {
    // Load videos from local data
    const localVideos = getLocalVideos();
    const formattedVideos = localVideos.map(video => ({
      id: parseInt(video.id),
      title: video.title,
      category: video.category,
      duration: video.duration,
      views: `${(video.views_count / 1000).toFixed(1)}k`,
      rating: video.rating,
      youtubeId: video.youtube_id,
      thumbnail: video.thumbnail_url || 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=800',
    }));
    setVideoList(formattedVideos);
  }, []);

  const filteredVideos = activeCategory === 'all' 
    ? videoList 
    : videoList.filter(video => video.category === activeCategory);

  const openVideo = (youtubeId: string) => {
    const url = `https://www.youtube.com/watch?v=${youtubeId}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#06b6d4', '#8b5cf6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.headerTitle}>Video Library</Text>
        <Text style={styles.headerSubtitle}>Learn from our expert coaches</Text>
      </LinearGradient>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        style={styles.categoryContainer}
        showsHorizontalScrollIndicator={false}>
        {videoCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              activeCategory === category.id && styles.activeCategoryButton
            ]}
            onPress={() => setActiveCategory(category.id)}>
            <Text style={[
              styles.categoryText,
              activeCategory === category.id && styles.activeCategoryText
            ]}>
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Videos List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredVideos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            onPress={() => openVideo(video.youtubeId)}
            activeOpacity={0.7}>
            
            {/* Thumbnail */}
            <View style={styles.thumbnailContainer}>
              <View style={styles.thumbnail}>
                <View style={styles.playButton}>
                  <Play size={24} color="#ffffff" fill="#ffffff" />
                </View>
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{video.duration}</Text>
              </View>
            </View>

            {/* Video Info */}
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              
              <View style={styles.videoMeta}>
                <View style={styles.metaItem}>
                  <Users size={14} color="#6b7280" />
                  <Text style={styles.metaText}>{video.views} views</Text>
                </View>
                <View style={styles.metaItem}>
                  <Star size={14} color="#f59e0b" />
                  <Text style={styles.metaText}>{video.rating}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Clock size={14} color="#6b7280" />
                  <Text style={styles.metaText}>{video.duration}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* YouTube Channel Link */}
        <TouchableOpacity 
          style={styles.channelCard}
          onPress={() => Linking.openURL('https://youtube.com/@tcgleancoach')}>
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            style={styles.channelGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Text style={styles.channelTitle}>📺 Visit Our YouTube Channel</Text>
            <Text style={styles.channelSubtitle}>Subscribe for weekly updates</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  categoryContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 12,
  },
  activeCategoryButton: {
    backgroundColor: '#8b5cf6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeCategoryText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  videoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 200,
    backgroundColor: '#e5e7eb',
  },
  thumbnail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
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
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  channelCard: {
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  channelGradient: {
    padding: 24,
    alignItems: 'center',
  },
  channelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  channelSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
});