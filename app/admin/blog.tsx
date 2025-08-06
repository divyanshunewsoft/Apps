import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Edit, Trash2, Search, ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { BlogPost } from '@/types/database';

export default function AdminBlogScreen() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: 'Divyanshu Singh',
    is_published: false,
    featured_image_url: '',
    tags: '',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async () => {
    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        published_at: formData.is_published ? new Date().toISOString() : null,
      };

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);
        
        if (error) throw error;
        Alert.alert('Success', 'Post updated successfully');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);
        
        if (error) throw error;
        Alert.alert('Success', 'Post created successfully');
      }
      
      setShowModal(false);
      setEditingPost(null);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      Alert.alert('Error', 'Failed to save post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('blog_posts')
                .delete()
                .eq('id', postId);
              
              if (error) throw error;
              Alert.alert('Success', 'Post deleted successfully');
              fetchPosts();
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ]
    );
  };

  const togglePublishStatus = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          is_published: !post.is_published,
          published_at: !post.is_published ? new Date().toISOString() : null
        })
        .eq('id', post.id);
      
      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error updating post status:', error);
      Alert.alert('Error', 'Failed to update post status');
    }
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      is_published: post.is_published,
      featured_image_url: post.featured_image_url || '',
      tags: post.tags.join(', '),
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingPost(null);
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: 'Divyanshu Singh',
      is_published: false,
      featured_image_url: '',
      tags: '',
    });
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#ef4444', '#dc2626']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blog Management</Text>
        <Text style={styles.headerSubtitle}>{posts.length} total posts</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Search and Add */}
        <View style={styles.actionBar}>
          <View style={styles.searchBox}>
            <Search size={20} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search posts..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Posts List */}
        <ScrollView style={styles.postsList} showsVerticalScrollIndicator={false}>
          {filteredPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.postInfo}>
                  <View style={styles.postTitleRow}>
                    <Text style={styles.postTitle} numberOfLines={2}>{post.title}</Text>
                    <View style={[styles.statusBadge, post.is_published ? styles.publishedBadge : styles.draftBadge]}>
                      <Text style={[styles.statusText, post.is_published ? styles.publishedText : styles.draftText]}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.postExcerpt} numberOfLines={2}>{post.excerpt}</Text>
                  <View style={styles.postMeta}>
                    <Text style={styles.metaText}>By {post.author}</Text>
                    <Text style={styles.metaText}>
                      {new Date(post.created_at).toLocaleDateString()}
                    </Text>
                    {post.tags.length > 0 && (
                      <Text style={styles.metaText}>#{post.tags.join(' #')}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.postActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => togglePublishStatus(post)}>
                    {post.is_published ? (
                      <EyeOff size={16} color="#f59e0b" />
                    ) : (
                      <Eye size={16} color="#10b981" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openEditModal(post)}>
                    <Edit size={16} color="#8b5cf6" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeletePost(post.id)}>
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Post Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingPost ? 'Edit Post' : 'Create Post'}
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
                placeholder="Post title"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Excerpt</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.excerpt}
                onChangeText={(text) => setFormData({ ...formData, excerpt: text })}
                placeholder="Brief description of the post"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Content</Text>
              <TextInput
                style={[styles.input, styles.contentArea]}
                value={formData.content}
                onChangeText={(text) => setFormData({ ...formData, content: text })}
                placeholder="Write your post content here..."
                multiline
                numberOfLines={10}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Author</Text>
              <TextInput
                style={styles.input}
                value={formData.author}
                onChangeText={(text) => setFormData({ ...formData, author: text })}
                placeholder="Author name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Featured Image URL</Text>
              <TextInput
                style={styles.input}
                value={formData.featured_image_url}
                onChangeText={(text) => setFormData({ ...formData, featured_image_url: text })}
                placeholder="https://example.com/image.jpg"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tags (comma separated)</Text>
              <TextInput
                style={styles.input}
                value={formData.tags}
                onChangeText={(text) => setFormData({ ...formData, tags: text })}
                placeholder="lean, six sigma, improvement"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Publish Status</Text>
              <TouchableOpacity
                style={[styles.checkbox, formData.is_published && styles.checkboxActive]}
                onPress={() => setFormData({ ...formData, is_published: !formData.is_published })}>
                <Text style={[styles.checkboxText, formData.is_published && styles.checkboxTextActive]}>
                  {formData.is_published ? 'Published' : 'Draft'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSavePost}>
              <Text style={styles.saveButtonText}>
                {editingPost ? 'Update Post' : 'Create Post'}
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
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postsList: {
    flex: 1,
  },
  postCard: {
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postInfo: {
    flex: 1,
    marginRight: 16,
  },
  postTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  postTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  publishedBadge: {
    backgroundColor: '#dcfce7',
  },
  draftBadge: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  publishedText: {
    color: '#16a34a',
  },
  draftText: {
    color: '#ca8a04',
  },
  postExcerpt: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  postMeta: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  postActions: {
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
    height: 80,
    textAlignVertical: 'top',
  },
  contentArea: {
    height: 200,
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
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
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
    backgroundColor: '#ef4444',
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