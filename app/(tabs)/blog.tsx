import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Calendar, User, Tag } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { BlogPost } from '@/types/database';
import { getLocalBlogPosts } from '@/lib/localData';

export default function BlogScreen() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      if (!supabase) {
        // Use local data when Supabase is not configured
        const localPosts = getLocalBlogPosts().filter(post => post.is_published);
        setPosts(localPosts);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#ef4444', '#dc2626']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.headerTitle}>News & Blog</Text>
        <Text style={styles.headerSubtitle}>Latest updates and insights</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Search */}
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

        {/* Posts List */}
        <ScrollView style={styles.postsList} showsVerticalScrollIndicator={false}>
          {filteredPosts.map((post) => (
            <TouchableOpacity key={post.id} style={styles.postCard} activeOpacity={0.7}>
              {post.featured_image_url && (
                <View style={styles.postImage}>
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imageText}>📰</Text>
                  </View>
                </View>
              )}
              
              <View style={styles.postContent}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postExcerpt} numberOfLines={3}>
                  {post.excerpt}
                </Text>
                
                <View style={styles.postMeta}>
                  <View style={styles.metaItem}>
                    <User size={14} color="#6b7280" />
                    <Text style={styles.metaText}>{post.author}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Calendar size={14} color="#6b7280" />
                    <Text style={styles.metaText}>
                      {new Date(post.published_at || post.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {post.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={styles.tagChip}>
                        <Tag size={10} color="#8b5cf6" />
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {filteredPosts.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No posts found</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Try adjusting your search terms' : 'Check back later for updates'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 20,
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
  postsList: {
    flex: 1,
  },
  postCard: {
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
  postImage: {
    height: 120,
    backgroundColor: '#f3f4f6',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ef4444',
  },
  imageText: {
    fontSize: 32,
  },
  postContent: {
    padding: 20,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  postExcerpt: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
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
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});