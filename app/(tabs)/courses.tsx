import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Clock, CircleCheck as CheckCircle, Lock, Play } from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Course } from '@/types/database';

const mockCourses = [
  {
    id: 1,
    title: 'Lean Basics',
    description: 'Fundamental principles of Lean methodology',
    duration: '2 hours',
    lessons: 8,
    completed: true,
    premium: false,
    progress: 100,
  },
  {
    id: 2,
    title: 'Six Sigma Belt Overview',
    description: 'Understanding the Six Sigma belt system',
    duration: '3 hours',
    lessons: 12,
    completed: false,
    premium: false,
    progress: 60,
  },
  {
    id: 3,
    title: 'DMAIC Process',
    description: 'Define, Measure, Analyze, Improve, Control',
    duration: '4 hours',
    lessons: 16,
    completed: false,
    premium: true,
    progress: 0,
  },
  {
    id: 4,
    title: '5S & Kaizen',
    description: 'Workplace organization and continuous improvement',
    duration: '2.5 hours',
    lessons: 10,
    completed: false,
    premium: true,
    progress: 0,
  },
  {
    id: 5,
    title: 'Agile for Continuous Improvement',
    description: 'Integrating Agile practices with Lean principles',
    duration: '3.5 hours',
    lessons: 14,
    completed: false,
    premium: true,
    progress: 0,
  },
];

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSubscription] = useState('free'); // This would come from Supabase

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      if (!supabase) {
        // Use mock data when Supabase is not configured
        setCourses(mockCourses.map(course => ({
          ...course,
          id: course.id.toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          thumbnail_url: null,
          order_index: course.id,
        })));
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback to mock data
      setCourses(mockCourses.map(course => ({
        ...course,
        id: course.id.toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        thumbnail_url: null,
        order_index: course.id,
      })));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#8b5cf6', '#06b6d4']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.headerTitle}>Courses</Text>
        <Text style={styles.headerSubtitle}>Master Lean Six Sigma principles</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {courses.map((course) => (
          <TouchableOpacity
            key={course.id.toString()}
            style={styles.courseCard}
            onPress={() => router.push(`/course/${course.id}`)}
            activeOpacity={0.7}>
            <View style={styles.courseHeader}>
              {/* Course Thumbnail */}
              <View style={styles.courseThumbnail}>
                <Play size={24} color="#ffffff" />
              </View>
              
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseDescription}>{course.description}</Text>
                
                <View style={styles.courseMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={16} color="#6b7280" />
                    <Text style={styles.metaText}>{course.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <BookOpen size={16} color="#6b7280" />
                    <Text style={styles.metaText}>{course.lessons_count} lessons</Text>
                  </View>
                </View>
              </View>

              <View style={styles.courseStatus}>
                {course.premium && userSubscription === 'free' ? (
                  <View style={styles.premiumBadge}>
                    <Lock size={16} color="#f59e0b" />
                  </View>
                ) : (course as any).completed ? (
                  <CheckCircle size={24} color="#10b981" />
                ) : (
                  <View style={styles.progressCircle}>
                    <Text style={styles.progressText}>{(course as any).progress || 0}%</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Progress Bar */}
            {!course.is_premium || userSubscription === 'premium' ? (
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${(course as any).progress || 0}%` }]} />
                </View>
              </View>
            ) : (
              <View style={styles.premiumOverlay}>
                <Text style={styles.premiumText}>Upgrade to Premium to access</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Upgrade Banner */}
        {userSubscription === 'free' && (
          <LinearGradient
            colors={['#f59e0b', '#ef4444']}
            style={styles.upgradeBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Text style={styles.upgradeTitle}>Unlock Premium Content</Text>
            <Text style={styles.upgradeSubtitle}>Get access to all courses for $9.99/month</Text>
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
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
  courseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  courseThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  courseMeta: {
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
  courseStatus: {
    alignItems: 'center',
    marginLeft: 16,
  },
  premiumBadge: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 20,
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  progressBarContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 2,
  },
  premiumOverlay: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    alignItems: 'center',
  },
  premiumText: {
    fontSize: 12,
    color: '#d97706',
    fontWeight: '600',
  },
  upgradeBanner: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 16,
    textAlign: 'center',
  },
  upgradeButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
});