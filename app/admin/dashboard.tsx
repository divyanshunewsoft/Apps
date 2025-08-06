import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, BookOpen, Video, Calendar, TrendingUp, Settings, LogOut, FileText } from 'lucide-react-native';
import { router } from 'expo-router';

interface DashboardStats {
  totalUsers: number;
  premiumUsers: number;
  totalCourses: number;
  totalVideos: number;
  activeBookings: number;
  dailyActiveUsers: number;
}

const menuItems = [
  { title: 'User Management', icon: Users, route: '/admin/users', color: '#8b5cf6' },
  { title: 'Course Management', icon: BookOpen, route: '/admin/courses', color: '#06b6d4' },
  { title: 'Video Management', icon: Video, route: '/admin/videos', color: '#10b981' },
  { title: 'Blog Management', icon: FileText, route: '/admin/blog', color: '#ef4444' },
  { title: 'Booking System', icon: Calendar, route: '/admin/bookings', color: '#f59e0b' },
  { title: 'Analytics', icon: TrendingUp, route: '/admin/analytics', color: '#ef4444' },
  { title: 'Settings', icon: Settings, route: '/admin/settings', color: '#6b7280' },
];

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1247,
    premiumUsers: 342,
    totalCourses: 12,
    totalVideos: 45,
    activeBookings: 23,
    dailyActiveUsers: 156,
  });

  const handleLogout = () => {
    router.replace('/admin/login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#1f2937', '#374151']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome, Divyanshu</Text>
          <Text style={styles.titleText}>Admin Dashboard</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={16} color="#ffffff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
              <Text style={styles.statSubtext}>+12% this month</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.premiumUsers}</Text>
              <Text style={styles.statLabel}>Premium Users</Text>
              <Text style={styles.statSubtext}>27% conversion</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.dailyActiveUsers}</Text>
              <Text style={styles.statLabel}>Daily Active</Text>
              <Text style={styles.statSubtext}>+8% yesterday</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.activeBookings}</Text>
              <Text style={styles.statLabel}>Active Bookings</Text>
              <Text style={styles.statSubtext}>This week</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Management Tools</Text>
          <View style={styles.actionsGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}>
                <View style={[styles.actionIcon, { backgroundColor: item.color + '20' }]}>
                  <item.icon size={24} color={item.color} />
                </View>
                <Text style={styles.actionTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>New user registration: sarah.chen@gmail.com</Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Premium subscription: michael.r@company.com</Text>
                <Text style={styles.activityTime}>15 minutes ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Course completed: Lean Basics by jennifer.l@startup.io</Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
            </View>
          </View>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '600',
  },
  actionsContainer: {
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  activityContainer: {
    marginBottom: 20,
  },
  activityList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8b5cf6',
    marginRight: 12,
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
});