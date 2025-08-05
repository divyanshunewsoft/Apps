import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Plus, Filter, Crown, Mail, Calendar } from 'lucide-react-native';

interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'premium';
  joinDate: string;
  lastActive: string;
  coursesCompleted: number;
  videosWatched: number;
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'sarah.chen@gmail.com',
    name: 'Sarah Chen',
    subscription: 'premium',
    joinDate: '2024-01-15',
    lastActive: '2 hours ago',
    coursesCompleted: 4,
    videosWatched: 12,
  },
  {
    id: '2',
    email: 'michael.r@company.com',
    name: 'Michael Rodriguez',
    subscription: 'premium',
    joinDate: '2024-02-03',
    lastActive: '1 day ago',
    coursesCompleted: 2,
    videosWatched: 8,
  },
  {
    id: '3',
    email: 'jennifer.l@startup.io',
    name: 'Jennifer Lopez',
    subscription: 'free',
    joinDate: '2024-12-01',
    lastActive: '3 hours ago',
    coursesCompleted: 1,
    videosWatched: 5,
  },
];

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'premium'>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || user.subscription === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#8b5cf6', '#06b6d4']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>User Management</Text>
          <Text style={styles.headerSubtitle}>{users.length} total users</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={20} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#8b5cf6" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {(['all', 'free', 'premium'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                filterType === filter && styles.activeFilterTab
              ]}
              onPress={() => setFilterType(filter)}>
              <Text style={[
                styles.filterText,
                filterType === filter && styles.activeFilterText
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Users List */}
        <ScrollView style={styles.usersList} showsVerticalScrollIndicator={false}>
          {filteredUsers.map((user) => (
            <TouchableOpacity key={user.id} style={styles.userCard} activeOpacity={0.7}>
              <View style={styles.userHeader}>
                <View style={styles.userAvatar}>
                  <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>
                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.userName}>{user.name}</Text>
                    {user.subscription === 'premium' && (
                      <View style={styles.premiumBadge}>
                        <Crown size={12} color="#f59e0b" />
                      </View>
                    )}
                  </View>
                  <View style={styles.userEmailRow}>
                    <Mail size={14} color="#6b7280" />
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                  <View style={styles.userDateRow}>
                    <Calendar size={14} color="#6b7280" />
                    <Text style={styles.userDate}>Joined {user.joinDate}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.userStats}>
                <View style={styles.userStatItem}>
                  <Text style={styles.userStatNumber}>{user.coursesCompleted}</Text>
                  <Text style={styles.userStatLabel}>Courses</Text>
                </View>
                <View style={styles.userStatItem}>
                  <Text style={styles.userStatNumber}>{user.videosWatched}</Text>
                  <Text style={styles.userStatLabel}>Videos</Text>
                </View>
                <View style={styles.userStatItem}>
                  <Text style={styles.userStatActive}>Active {user.lastActive}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Add User Button */}
        <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.addGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Plus size={20} color="#ffffff" />
            <Text style={styles.addButtonText}>Add New User</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  headerContent: {
    alignItems: 'center',
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
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
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
  filterButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeFilterTab: {
    backgroundColor: '#8b5cf6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  usersList: {
    flex: 1,
  },
  userCard: {
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
  userHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginRight: 8,
  },
  premiumBadge: {
    backgroundColor: '#fef3c7',
    padding: 4,
    borderRadius: 12,
  },
  userEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  userDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 16,
  },
  userStatItem: {
    alignItems: 'center',
  },
  userStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  userStatLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  userStatActive: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  addButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
  },
  addGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});