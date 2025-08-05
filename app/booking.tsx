import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

const coaches = [
  { id: '1', name: 'Rinesh Kumar', specialty: 'Lean Six Sigma Master', rating: 4.9 },
  { id: '2', name: 'Harsha Patel', specialty: 'Agile Coach', rating: 4.8 },
  { id: '3', name: 'Divyanshu Singh', specialty: 'Process Improvement', rating: 4.9 },
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const topics = [
  'Lean Basics', 'Six Sigma Implementation', 'DMAIC Process', '5S Methodology', 'Kaizen Events', 'Custom Topic'
];

export default function BookingScreen() {
  const [selectedCoach, setSelectedCoach] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [notes, setNotes] = useState('');

  const handleBooking = () => {
    // Handle booking submission
    console.log('Booking submitted:', {
      coach: selectedCoach,
      date: selectedDate,
      time: selectedTime,
      topic: selectedTopic === 'Custom Topic' ? customTopic : selectedTopic,
      notes,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a Coach</Text>
        <Text style={styles.headerSubtitle}>Schedule your 1-on-1 session</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Coach Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Your Coach</Text>
          {coaches.map((coach) => (
            <TouchableOpacity
              key={coach.id}
              style={[
                styles.coachCard,
                selectedCoach === coach.id && styles.selectedCard
              ]}
              onPress={() => setSelectedCoach(coach.id)}
              activeOpacity={0.7}>
              <View style={styles.coachInfo}>
                <View style={styles.coachAvatar}>
                  <Text style={styles.avatarText}>{coach.name.charAt(0)}</Text>
                </View>
                <View style={styles.coachDetails}>
                  <Text style={styles.coachName}>{coach.name}</Text>
                  <Text style={styles.coachSpecialty}>{coach.specialty}</Text>
                  <Text style={styles.coachRating}>⭐ {coach.rating}/5.0</Text>
                </View>
              </View>
              {selectedCoach === coach.id && (
                <View style={styles.selectedIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Topic Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Topic</Text>
          <View style={styles.topicsGrid}>
            {topics.map((topic, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.topicChip,
                  selectedTopic === topic && styles.selectedChip
                ]}
                onPress={() => setSelectedTopic(topic)}
                activeOpacity={0.7}>
                <Text style={[
                  styles.topicText,
                  selectedTopic === topic && styles.selectedChipText
                ]}>
                  {topic}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {selectedTopic === 'Custom Topic' && (
            <TextInput
              style={styles.customTopicInput}
              placeholder="Describe your specific topic..."
              value={customTopic}
              onChangeText={setCustomTopic}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9ca3af"
            />
          )}
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Time Slots</Text>
          <View style={styles.timeSlotsGrid}>
            {timeSlots.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTimeSlot
                ]}
                onPress={() => setSelectedTime(time)}
                activeOpacity={0.7}>
                <Clock size={16} color={selectedTime === time ? '#ffffff' : '#6b7280'} />
                <Text style={[
                  styles.timeText,
                  selectedTime === time && styles.selectedTimeText
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Any specific requirements or questions..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Book Button */}
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedCoach || !selectedTime || !selectedTopic) && styles.bookButtonDisabled
          ]}
          onPress={handleBooking}
          disabled={!selectedCoach || !selectedTime || !selectedTopic}
          activeOpacity={0.8}>
          <LinearGradient
            colors={(!selectedCoach || !selectedTime || !selectedTopic) 
              ? ['#9ca3af', '#6b7280'] 
              : ['#10b981', '#059669']}
            style={styles.bookGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Calendar size={20} color="#ffffff" />
            <Text style={styles.bookButtonText}>Confirm Booking</Text>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  coachCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#10b981',
  },
  coachInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coachAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  coachDetails: {
    flex: 1,
  },
  coachName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  coachSpecialty: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  coachRating: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectedChip: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  topicText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  selectedChipText: {
    color: '#ffffff',
  },
  customTopicInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    marginTop: 12,
    textAlignVertical: 'top',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  selectedTimeSlot: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  timeText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  selectedTimeText: {
    color: '#ffffff',
  },
  notesInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    textAlignVertical: 'top',
  },
  bookButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 20,
  },
  bookButtonDisabled: {
    opacity: 0.5,
  },
  bookGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});