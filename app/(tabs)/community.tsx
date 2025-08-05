import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle, Users, ExternalLink, Phone, Mail } from 'lucide-react-native';

const communityOptions = [
  {
    title: 'Telegram Group',
    description: 'Join our active community of 500+ members',
    icon: MessageCircle,
    color: '#06b6d4',
    action: () => Linking.openURL('https://t.me/tcgleancoach'),
  },
  {
    title: 'Discord Server',
    description: 'Real-time discussions and Q&A sessions',
    icon: Users,
    color: '#5865f2',
    action: () => Linking.openURL('https://discord.gg/tcgleancoach'),
  },
  {
    title: 'WhatsApp Support',
    description: 'Direct support for urgent queries',
    icon: Phone,
    color: '#10b981',
    action: () => Linking.openURL('https://wa.me/919876543210'),
  },
  {
    title: 'Email Support',
    description: 'Detailed support and feedback',
    icon: Mail,
    color: '#f59e0b',
    action: () => Linking.openURL('mailto:support@tcgleancoach.com'),
  },
];

const forumTopics = [
  {
    title: 'Lean Implementation in Small Teams',
    replies: 23,
    lastActive: '2 hours ago',
    author: 'Sarah M.',
  },
  {
    title: 'Six Sigma Tools for Beginners',
    replies: 45,
    lastActive: '5 hours ago',
    author: 'Michael R.',
  },
  {
    title: 'Kaizen Event Success Stories',
    replies: 18,
    lastActive: '1 day ago',
    author: 'Jennifer L.',
  },
];

export default function CommunityScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#06b6d4']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Connect with fellow Lean practitioners</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Community Platforms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Join Our Community</Text>
          {communityOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.communityCard}
              onPress={option.action}
              activeOpacity={0.7}>
              <View style={styles.communityHeader}>
                <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                  <option.icon size={24} color={option.color} />
                </View>
                <View style={styles.communityInfo}>
                  <Text style={styles.communityTitle}>{option.title}</Text>
                  <Text style={styles.communityDescription}>{option.description}</Text>
                </View>
                <ExternalLink size={20} color="#6b7280" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Forum Topics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Discussions</Text>
          {forumTopics.map((topic, index) => (
            <TouchableOpacity key={index} style={styles.topicCard} activeOpacity={0.7}>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <View style={styles.topicMeta}>
                <Text style={styles.topicAuthor}>by {topic.author}</Text>
                <Text style={styles.topicReplies}>{topic.replies} replies</Text>
                <Text style={styles.topicTime}>{topic.lastActive}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Community Guidelines */}
        <View style={styles.guidelinesCard}>
          <Text style={styles.guidelinesTitle}>Community Guidelines</Text>
          <Text style={styles.guidelinesText}>
            • Be respectful and professional{'\n'}
            • Share knowledge and experiences{'\n'}
            • No spam or promotional content{'\n'}
            • Help others learn and grow{'\n'}
            • Keep discussions relevant to Lean/Six Sigma
          </Text>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  communityCard: {
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
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  communityInfo: {
    flex: 1,
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  communityDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  topicCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  topicMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicAuthor: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  topicReplies: {
    fontSize: 12,
    color: '#6b7280',
  },
  topicTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  guidelinesCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  guidelinesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 12,
  },
  guidelinesText: {
    fontSize: 14,
    color: '#075985',
    lineHeight: 22,
  },
});