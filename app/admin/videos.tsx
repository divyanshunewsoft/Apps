import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, CreditCard as Edit, Trash2, Search, Play, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { videoService } from '@/lib/database';
import { isSupabaseConnected } from '@/lib/supabase';
import { Video } from '@/types/database';
import { 
  getLocalVideos, 
  addLocalVideo, 
  updateLocalVideo, 
  deleteLocalVideo,
  LocalVideo,
  refreshLocalData
} from '@/lib/localData';

const categories = ['courses', 'testimonials', 'inspiration'] as const;

export default function AdminVideosScreen() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtube_id: '',
    category: 'courses' as const,
    duration: '',
    is_premium: false,
    thumbnail_url: '',
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      if (!isSupabaseConnected()) {
        // Use local data when Supabase is not configured
        const localVideos = getLocalVideos();
        setVideos(localVideos);
        setLoading(false);
        return;
      }

      const videos = await videoService.getAll();
      setVideos(videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      // Fallback to local data on error
      const localVideos = getLocalVideos();
      setVideos(localVideos);
      Alert.alert('Error', 'Failed to fetch videos from database. Using local data.');
    } finally {
      setLoading(false);
    }
  };

  const extractYouTubeId = (url: string): string => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const handleSaveVideo = async () => {
    try {
      if (!isSupabaseConnected()) {
        // Use local data when Supabase is not configured
        const videoData = {
          title: formData.title,
          description: formData.description,
          youtube_id: extractYouTubeId(formData.youtube_id),
          category: formData.category,
          duration: formData.duration,
          views_count: 0,
          rating: 0.0,
          is_premium: formData.is_premium,
          thumbnail_url: formData.thumbnail_url,
        };

        if (editingVideo) {
          updateLocalVideo(editingVideo.id, videoData);
          Alert.alert('Success', 'Video updated successfully');
        } else {
          addLocalVideo(videoData);
          Alert.alert('Success', 'Video created successfully');
        }
        
        setShowModal(false);
        setEditingVideo(null);
        resetForm();
        refreshLocalData(); // Notify other components to refresh
        fetchVideos();
        return;
      }

      const videoData = {
        title: formData.title,
        description: formData.description,
        youtube_id: extractYouTubeId(formData.youtube_id),
        category: formData.category,
        duration: formData.duration,
        views_count: 0,
        rating: 0.0,
        is_premium: formData.is_premium,
        thumbnail_url: formData.thumbnail_url || null,
      };

      if (editingVideo) {
        await videoService.update(editingVideo.id, videoData);
        Alert.alert('Success', 'Video updated successfully');
      } else {
        await videoService.create(videoData);
        Alert.alert('Success', 'Video created successfully');
      }
      
      setShowModal(false);
      setEditingVideo(null);
      resetForm();
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      Alert.alert('Error', 'Failed to save video');
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!isSupabaseConnected()) {
                // Use local data when Supabase is not configured
                const success = deleteLocalVideo(videoId);
                if (success) {
                  Alert.alert('Success', 'Video deleted successfully');
                  refreshLocalData(); // Notify other components to refresh
                  fetchVideos();
                } else {
                  Alert.alert('Error', 'Video not found');
                }
                return;
              }

              await videoService.delete(videoId);
              Alert.alert('Success', 'Video deleted successfully');
              fetchVideos();
            } catch (error) {
              console.error('Error deleting video:', error);
              Alert.alert('Error', 'Failed to delete video');
            }
          },
        },
      ]
    );
  };

  const openEditModal = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      youtube_id: video.youtube_id,
      category: video.category,
      duration: video.duration,
      is_premium: video.is_premium,
      thumbnail_url: video.thumbnail_url || '',
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingVideo(null);
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      youtube_id: '',
      category: 'courses',
      duration: '',
      is_premium: false,
      thumbnail_url: '',
    });
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#06b6d4', '#8b5cf6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Management</Text>
        <Text style={styles.headerSubtitle}>{videos.length} total videos</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Search and Add */}
        <View style={styles.actionBar}>
          <View style={styles.searchBox}>
            <Search size={20} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search videos..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Videos List */}
        <ScrollView style={styles.videosList} showsVerticalScrollIndicator={false}>
          {filteredVideos.map((video) => (
            <View key={video.id} style={styles.videoCard}>
              <View style={styles.videoThumbnail}>
                <Play size={24} color="#ffffff" />
                <Text style={styles.videoDuration}>{video.duration}</Text>
              </View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                  {video.title}
                </Text>
                <Text style={styles.videoDescription} numberOfLines={2}>
                  {video.description}
                </Text>
                <View style={styles.videoMeta}>
                  <Text style={styles.metaText}>{video.category}</Text>
                  <Text style={styles.metaText}>{video.views_count} views</Text>
                  <Text style={styles.metaText}>⭐ {video.rating}</Text>
                  {video.is_premium && (
                    <View style={styles.premiumBadge}>
                      <Text style={styles.premiumText}>Premium</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.videoActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openEditModal(video)}>
                  <Edit size={16} color="#8b5cf6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteVideo(video.id)}>
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Video Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingVideo ? 'Edit Video' : 'Add Video'}
            </Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                placeholder="Video title"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Video description"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>YouTube URL or ID</Text>
              <TextInput
                style={styles.input}
                value={formData.youtube_id}
                onChangeText={(text) => setFormData({ ...formData, youtube_id: text })}
                placeholder="https://youtube.com/watch?v=... or video ID"
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryContainer}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        formData.category === cat && styles.categoryChipActive
                      ]}
                      onPress={() => setFormData({ ...formData, category: cat })}>
                      <Text style={[
                        styles.categoryText,
                        formData.category === cat && styles.categoryTextActive
                      ]}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Duration</Text>
                <TextInput
                  style={styles.input}
                  value={formData.duration}
                  onChangeText={(text) => setFormData({ ...formData, duration: text })}
                  placeholder="e.g., 15:30"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Thumbnail URL (Optional)</Text>
              <TextInput
                style={styles.input}
                value={formData.thumbnail_url}
                onChangeText={(text) => setFormData({ ...formData, thumbnail_url: text })}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Premium Video</Text>
              <TouchableOpacity
                style={[styles.checkbox, formData.is_premium && styles.checkboxActive]}
                onPress={() => setFormData({ ...formData, is_premium: !formData.is_premium })}>
                <Text style={[styles.checkboxText, formData.is_premium && styles.checkboxTextActive]}>
                  {formData.is_premium ? 'Yes' : 'No'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveVideo}>
              <Text style={styles.saveButtonText}>
                {editingVideo ? 'Update Video' : 'Add Video'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
  backButton: {
    marginBottom: 16,
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
  content: {
    flex: 1,
    padding: 20,
  },
  actionBar: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#06b6d4',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videosList: {
    flex: 1,
  },
  videoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  videoThumbnail: {
    width: 80,
    height: 60,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    fontSize: 10,
    color: '#ffffff',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoInfo: {
    flex: 1,
    marginRight: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  premiumBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumText: {
    fontSize: 8,
    color: '#f59e0b',
    fontWeight: '600',
  },
  videoActions: {
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cancelButton: {
    fontSize: 16,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  formGroupHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryChipActive: {
    backgroundColor: '#8b5cf6',
  },
  categoryText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  checkbox: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  checkboxText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  checkboxTextActive: {
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#06b6d4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});