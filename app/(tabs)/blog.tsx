import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FileText, Calendar, User, ExternalLink, Search } from 'lucide-react-native';
import { blogService } from '@/lib/database';
import { isSupabaseConnected } from '@/lib/supabase';
import { BlogPost } from '@/types/database';
import { getLocalBlogPosts, subscribeToDataChanges } from '@/lib/localData';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

export default function BlogScreen() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
    
    // Subscribe to data changes for real-time updates
    const unsubscribe = subscribeToDataChanges(() => {
      fetchPosts();
    });
    
    return unsubscribe;
  }, []);

  const fetchPosts = async () => {
    try {
      setError(null);
      
      if (!isSupabaseConnected()) {
        // Use local data when Supabase is not configured
        const localPosts = getLocalBlogPosts().filter(post => post.is_published);
        setPosts(localPosts);
        setLoading(false);
        return;
      }

      const publishedPosts = await blogService.getPublished();
      setPosts(publishedPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to load blog posts');
      
      // Fallback to local data
      const localPosts = getLocalBlogPosts().filter(post => post.is_published);
      setPosts(localPosts);
    } finally {
      setLoading(false);
    }
  };

  const openExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchPosts} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#ef4444', '#dc2626']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.headerTitle}>News & Blog</Text>
        <Text style={styles.headerSubtitle}>Latest insights and updates</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {posts.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>No Posts Yet</Text>
            <Text style={styles.emptySubtitle}>
              Check back soon for the latest news and insights from our team.
            </Text>
          </View>
        ) : (
          posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              {/* Featured Image */}
              {post.featured_image_url && (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: post.featured_image_url }}
                    style={styles.featuredImage}
                    resizeMode="cover"
                  />
                </View>
              )}

              {/* Post Content */}
              <View style={styles.postContent}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postExcerpt}>{post.excerpt}</Text>

                {/* Post Meta */}
                <View style={styles.postMeta}>
                  <View style={styles.metaItem}>
                    <User size={14} color="#6b7280" />
                    <Text style={styles.metaText}>{post.author}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Calendar size={14} color="#6b7280" />
                    <Text style={styles.metaText}>
                      {formatDate(post.published_at || post.created_at)}
                    </Text>
                  </View>
                </View>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Read More Button */}
                <TouchableOpacity
                  style={styles.readMoreButton}
                  onPress={() => {
                    // For now, we'll just show an alert since we don't have individual post pages
                    // In a real app, you'd navigate to a detailed post view
                    alert('Full article view coming soon!');
                  }}
                  activeOpacity={0.7}>
                  <Text style={styles.readMoreText}>Read More</Text>
                  <ExternalLink size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* External Links Section */}
        <View style={styles.externalSection}>
          <Text style={styles.sectionTitle}>More Resources</Text>
          
          <TouchableOpacity
            style={styles.externalCard}
            onPress={() => openExternalLink('https://blog.tcgleancoach.com')}
            activeOpacity={0.7}>
            <View style={styles.externalContent}>
              <Text style={styles.externalTitle}>📝 Visit Our Full Blog</Text>
              <Text style={styles.externalSubtitle}>
                Access our complete collection of articles and insights
              </Text>
            </View>
            <ExternalLink size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.externalCard}
            onPress={() => openExternalLink('https://newsletter.tcgleancoach.com')}
            activeOpacity={0.7}>
            <View style={styles.externalContent}>
              <Text style={styles.externalTitle}>📧 Subscribe to Newsletter</Text>
              <Text style={styles.externalSubtitle}>
                Get weekly updates and exclusive content
              </Text>
            </View>
            <ExternalLink size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    height: 200,
    backgroundColor: '#e5e7eb',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  postContent: {
    padding: 20,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  postExcerpt: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  postMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    color: '#f59e0b',
    fontWeight: '600',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
  externalSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  externalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  externalContent: {
    flex: 1,
  },
  externalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  externalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
});