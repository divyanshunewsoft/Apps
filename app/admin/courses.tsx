import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, CreditCard as Edit, Trash2, Search, DollarSign, Users, ArrowLeft, Video, Play } from 'lucide-react-native';
import { router } from 'expo-router';
import { courseService, courseVideoService } from '@/lib/database';
import { isSupabaseConnected } from '@/lib/supabase';
import { Course, CourseVideo } from '@/types/database';
import { 
  getLocalCourses, 
  addLocalCourse, 
  updateLocalCourse, 
  deleteLocalCourse,
  getLocalCourseVideos,
  addLocalCourseVideo,
  updateLocalCourseVideo,
  deleteLocalCourseVideo,
  LocalCourse,
  LocalCourseVideo,
  refreshLocalData
} from '@/lib/localData';

export default function AdminCoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseVideos, setCourseVideos] = useState<CourseVideo[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<CourseVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    lessons_count: 0,
    is_premium: false,
    price: 0,
    thumbnail_url: '',
  });
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    duration: '',
    is_preview: false,
  });

  useEffect(() => {
    fetchCourses();
    if (selectedCourse) {
      fetchCourseVideos(selectedCourse.id);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      if (!isSupabaseConnected()) {
        // Use local data when Supabase is not configured
        const localCourses = getLocalCourses();
        setCourses(localCourses);
        setLoading(false);
        return;
      }

      const courses = await courseService.getAll();
      setCourses(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback to local data on error
      const localCourses = getLocalCourses();
      setCourses(localCourses);
      Alert.alert('Error', 'Failed to fetch courses from database. Using local data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async () => {
    try {
      if (!isSupabaseConnected()) {
        // Use local data when Supabase is not configured
        if (editingCourse) {
          updateLocalCourse(editingCourse.id, formData);
          Alert.alert('Success', 'Course updated successfully');
        } else {
          addLocalCourse(formData);
          Alert.alert('Success', 'Course created successfully');
        }
        
        setShowModal(false);
        setEditingCourse(null);
        resetForm();
        refreshLocalData(); // Notify other components to refresh
        fetchCourses();
        return;
      }

      if (editingCourse) {
        await courseService.update(editingCourse.id, formData);
        Alert.alert('Success', 'Course updated successfully');
      } else {
        await courseService.create(formData);
        Alert.alert('Success', 'Course created successfully');
      }
      
      setShowModal(false);
      setEditingCourse(null);
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      Alert.alert('Error', 'Failed to save course');
    }
  };

  const fetchCourseVideos = async (courseId: string) => {
    try {
      if (!isSupabaseConnected()) {
        // Use local data when Supabase is not configured
        const localVideos = getLocalCourseVideos(courseId);
        setCourseVideos(localVideos);
        return;
      }

      const videos = await courseVideoService.getByCourseId(courseId);
      setCourseVideos(videos);
    } catch (error) {
      console.error('Error fetching course videos:', error);
      // Fallback to local data on error
      const localVideos = getLocalCourseVideos(courseId);
      setCourseVideos(localVideos);
    }
  };

  const handleSaveVideo = async () => {
    if (!selectedCourse) return;

    try {
      if (!isSupabaseConnected()) {
        // Use local data when Supabase is not configured
        const videoData = {
          ...videoFormData,
          course_id: selectedCourse.id,
          order_index: courseVideos.length,
        };

        if (editingVideo) {
          updateLocalCourseVideo(editingVideo.id, videoData);
          Alert.alert('Success', 'Video updated successfully');
        } else {
          addLocalCourseVideo(videoData);
          Alert.alert('Success', 'Video added successfully');
        }
        
        setShowVideoModal(false);
        setEditingVideo(null);
        resetVideoForm();
        refreshLocalData(); // Notify other components to refresh
        fetchCourseVideos(selectedCourse.id);
        return;
      }

      const videoData = {
        title: videoFormData.title,
        description: videoFormData.description,
        video_url: videoFormData.video_url,
        duration: videoFormData.duration,
        is_preview: videoFormData.is_preview,
        course_id: selectedCourse.id,
        order_index: courseVideos.length,
      };

      if (editingVideo) {
        await courseVideoService.update(editingVideo.id, videoData);
        Alert.alert('Success', 'Video updated successfully');
      } else {
        await courseVideoService.create(videoData);
        Alert.alert('Success', 'Video added successfully');
      }
      
      setShowVideoModal(false);
      setEditingVideo(null);
      resetVideoForm();
      fetchCourseVideos(selectedCourse.id);
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
                const success = deleteLocalCourseVideo(videoId);
                if (success) {
                  Alert.alert('Success', 'Video deleted successfully');
                  refreshLocalData(); // Notify other components to refresh
                  if (selectedCourse) {
                    fetchCourseVideos(selectedCourse.id);
                  }
                } else {
                  Alert.alert('Error', 'Video not found');
                }
                return;
              }

              await courseVideoService.delete(videoId);
              Alert.alert('Success', 'Video deleted successfully');
              if (selectedCourse) {
                fetchCourseVideos(selectedCourse.id);
              }
            } catch (error) {
              console.error('Error deleting video:', error);
              Alert.alert('Error', 'Failed to delete video');
            }
          },
        },
      ]
    );
  };

  const handleDeleteCourse = async (courseId: string) => {
    Alert.alert(
      'Delete Course',
      'Are you sure you want to delete this course?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!isSupabaseConnected()) {
                // Use local data when Supabase is not configured
                const success = deleteLocalCourse(courseId);
                if (success) {
                  Alert.alert('Success', 'Course deleted successfully');
                  refreshLocalData(); // Notify other components to refresh
                  fetchCourses();
                } else {
                  Alert.alert('Error', 'Course not found');
                }
                return;
              }

              await courseService.delete(courseId);
              Alert.alert('Success', 'Course deleted successfully');
              fetchCourses();
            } catch (error) {
              console.error('Error deleting course:', error);
              Alert.alert('Error', 'Failed to delete course');
            }
          },
        },
      ]
    );
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      lessons_count: course.lessons_count,
      is_premium: course.is_premium,
      price: (course as any).price || 0,
      thumbnail_url: course.thumbnail_url || '',
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      lessons_count: 0,
      is_premium: false,
      price: 0,
      thumbnail_url: '',
    });
  };

  const openVideoModal = (course: Course) => {
    setSelectedCourse(course);
    setEditingVideo(null);
    resetVideoForm();
    setShowVideoModal(true);
  };

  const openEditVideoModal = (video: CourseVideo) => {
    setEditingVideo(video);
    setVideoFormData({
      title: video.title,
      description: video.description,
      video_url: video.video_url,
      duration: video.duration,
      is_preview: video.is_preview,
    });
    setShowVideoModal(true);
  };

  const resetVideoForm = () => {
    setVideoFormData({
      title: '',
      description: '',
      video_url: '',
      duration: '',
      is_preview: false,
    });
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text style={styles.headerTitle}>Course Management</Text>
        <Text style={styles.headerSubtitle}>{courses.length} total courses</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Search and Add */}
        <View style={styles.actionBar}>
          <View style={styles.searchBox}>
            <Search size={20} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search courses..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Courses List */}
        <ScrollView style={styles.coursesList} showsVerticalScrollIndicator={false}>
          {filteredCourses.map((course) => (
            <View key={course.id} style={styles.courseCard}>
              <View style={styles.courseHeader}>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseDescription} numberOfLines={2}>
                    {course.description}
                  </Text>
                  <View style={styles.courseMeta}>
                    <Text style={styles.metaText}>{course.duration}</Text>
                    <Text style={styles.metaText}>{course.lessons_count} lessons</Text>
                    {course.is_premium && (
                      <View style={styles.premiumBadge}>
                        <DollarSign size={12} color="#f59e0b" />
                        <Text style={styles.premiumText}>Premium</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.courseActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openVideoModal(course)}>
                    <Video size={16} color="#10b981" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openEditModal(course)}>
                    <Edit size={16} color="#8b5cf6" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteCourse(course.id)}>
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Course Modal */}
      {/* Course Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingCourse ? 'Edit Course' : 'Create Course'}
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
                placeholder="Course title"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Course description"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Duration</Text>
                <TextInput
                  style={styles.input}
                  value={formData.duration}
                  onChangeText={(text) => setFormData({ ...formData, duration: text })}
                  placeholder="e.g., 2 hours"
                />
              </View>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Lessons</Text>
                <TextInput
                  style={styles.input}
                  value={formData.lessons_count.toString()}
                  onChangeText={(text) => setFormData({ ...formData, lessons_count: parseInt(text) || 0 })}
                  placeholder="Number of lessons"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Thumbnail URL</Text>
              <TextInput
                style={styles.input}
                value={formData.thumbnail_url}
                onChangeText={(text) => setFormData({ ...formData, thumbnail_url: text })}
                placeholder="https://example.com/image.jpg"
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Price ($)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price.toString()}
                  onChangeText={(text) => setFormData({ ...formData, price: parseFloat(text) || 0 })}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Premium Course</Text>
                <TouchableOpacity
                  style={[styles.checkbox, formData.is_premium && styles.checkboxActive]}
                  onPress={() => setFormData({ ...formData, is_premium: !formData.is_premium })}>
                  <Text style={[styles.checkboxText, formData.is_premium && styles.checkboxTextActive]}>
                    {formData.is_premium ? 'Yes' : 'No'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveCourse}>
              <Text style={styles.saveButtonText}>
                {editingCourse ? 'Update Course' : 'Create Course'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Video Management Modal */}
      <Modal visible={showVideoModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedCourse?.title} - Videos
            </Text>
            <TouchableOpacity onPress={() => setShowVideoModal(false)}>
              <Text style={styles.cancelButton}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Add Video Button */}
            <TouchableOpacity style={styles.addVideoButton} onPress={() => {
              setEditingVideo(null);
              resetVideoForm();
            }}>
              <Plus size={16} color="#ffffff" />
              <Text style={styles.addVideoText}>Add New Video</Text>
            </TouchableOpacity>

            {/* Video Form */}
            {(!editingVideo || editingVideo) && (
              <View style={styles.videoForm}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Video Title</Text>
                  <TextInput
                    style={styles.input}
                    value={videoFormData.title}
                    onChangeText={(text) => setVideoFormData({ ...videoFormData, title: text })}
                    placeholder="Video title"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={videoFormData.description}
                    onChangeText={(text) => setVideoFormData({ ...videoFormData, description: text })}
                    placeholder="Video description"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Embedded Video URL</Text>
                  <TextInput
                    style={styles.input}
                    value={videoFormData.video_url}
                    onChangeText={(text) => setVideoFormData({ ...videoFormData, video_url: text })}
                    placeholder="https://www.youtube.com/embed/VIDEO_ID or Vimeo embed URL"
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Duration</Text>
                    <TextInput
                      style={styles.input}
                      value={videoFormData.duration}
                      onChangeText={(text) => setVideoFormData({ ...videoFormData, duration: text })}
                      placeholder="e.g., 15:30"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Preview Video</Text>
                    <TouchableOpacity
                      style={[styles.checkbox, videoFormData.is_preview && styles.checkboxActive]}
                      onPress={() => setVideoFormData({ ...videoFormData, is_preview: !videoFormData.is_preview })}>
                      <Text style={[styles.checkboxText, videoFormData.is_preview && styles.checkboxTextActive]}>
                        {videoFormData.is_preview ? 'Yes' : 'No'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveVideo}>
                  <Text style={styles.saveButtonText}>
                    {editingVideo ? 'Update Video' : 'Add Video'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Existing Videos */}
            <View style={styles.videosSection}>
              <Text style={styles.sectionTitle}>Course Videos ({courseVideos.length})</Text>
              {courseVideos.map((video, index) => (
                <View key={video.id} style={styles.videoCard}>
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle}>{video.title}</Text>
                    <Text style={styles.videoDescription} numberOfLines={2}>
                      {video.description}
                    </Text>
                    <View style={styles.videoMeta}>
                      <Text style={styles.metaText}>#{index + 1}</Text>
                      <Text style={styles.metaText}>{video.duration}</Text>
                      {video.is_preview && (
                        <View style={styles.previewBadge}>
                          <Text style={styles.previewText}>Preview</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.videoActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => openEditVideoModal(video)}>
                      <Edit size={14} color="#8b5cf6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteVideo(video.id)}>
                      <Trash2 size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
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
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coursesList: {
    flex: 1,
  },
  courseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseInfo: {
    flex: 1,
    marginRight: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  premiumText: {
    fontSize: 10,
    color: '#f59e0b',
    fontWeight: '600',
  },
  courseActions: {
    flexDirection: 'row',
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
    backgroundColor: '#8b5cf6',
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
  addVideoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  addVideoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  videoForm: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  videosSection: {
    marginTop: 20,
  },
  videoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
  videoActions: {
    flexDirection: 'row',
    gap: 4,
  },
});