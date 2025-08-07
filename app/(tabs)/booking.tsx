import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, ExternalLink, User } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { BookingForm } from '@/types/database';

export default function BookingScreen() {
  const [bookingForms, setBookingForms] = useState<BookingForm[]>([]);
  const [selectedCoach, setSelectedCoach] = useState('');

  useEffect(() => {
    fetchBookingForms();
  }, []);

  const fetchBookingForms = async () => {
    try {
      if (!supabase) {
        // Mock data when Supabase is not configured
        setBookingForms([
          {
            id: '1',
            coach_name: 'Rinesh Kumar',
            form_url: 'https://forms.google.com/rinesh-booking',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '2',
            coach_name: 'Harsha Patel',
            form_url: 'https://forms.google.com/harsha-booking',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '3',
            coach_name: 'Divyanshu Singh',
            form_url: 'https://forms.google.com/divyanshu-booking',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        return;
      }

      const { data, error } = await supabase
        .from('booking_forms')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      setBookingForms(data || []);
    } catch (error) {
      console.error('Error fetching booking forms:', error);
    }
  };

  const handleBooking = () => {
    const selectedForm = bookingForms.find(form => form.id === selectedCoach);
    if (selectedForm) {
      Linking.openURL(selectedForm.form_url);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.headerTitle}>Book a Coach</Text>
        <Text style={styles.headerSubtitle}>Schedule your 1-on-1 session</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Coach Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Your Coach</Text>
          {bookingForms.map((form) => (
            <TouchableOpacity
              key={form.id}
              style={[
                styles.coachCard,
                selectedCoach === form.id && styles.selectedCard
              ]}
              onPress={() => setSelectedCoach(form.id)}
              activeOpacity={0.7}>
              <View style={styles.coachInfo}>
                <View style={styles.coachAvatar}>
                  <User size={24} color="#ffffff" />
                </View>
                <View style={styles.coachDetails}>
                  <Text style={styles.coachName}>{form.coach_name}</Text>
                  <Text style={styles.coachSpecialty}>Lean Six Sigma Expert</Text>
                  <View style={styles.formLinkRow}>
                    <ExternalLink size={12} color="#8b5cf6" />
                    <Text style={styles.formLinkText}>Google Form Booking</Text>
                  </View>
                </View>
              </View>
              {selectedCoach === form.id && (
                <View style={styles.selectedIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Book Button */}
        <TouchableOpacity
          style={[
            styles.bookButton,
            !selectedCoach && styles.bookButtonDisabled
          ]}
          onPress={handleBooking}
          disabled={!selectedCoach}
          activeOpacity={0.8}>
          <LinearGradient
            colors={!selectedCoach 
              ? ['#9ca3af', '#6b7280'] 
              : ['#10b981', '#059669']}
            style={styles.bookGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Calendar size={20} color="#ffffff" />
            <Text style={styles.bookButtonText}>Open Booking Form</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Information Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What to Expect</Text>
          <Text style={styles.infoText}>
            • 1-hour personalized coaching session{'\n'}
            • Customized improvement strategies{'\n'}
            • Action plan for your specific challenges{'\n'}
            • Follow-up resources and tools{'\n'}
            • Q&A with industry experts
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
  formLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  formLinkText: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
  },
  bookButton: {
    borderRadius: 16,
    overflow: 'hidden',
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
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
  },
});