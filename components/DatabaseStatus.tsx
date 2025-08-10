import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Database, Wifi, WifiOff, RefreshCw } from 'lucide-react-native';
import { isSupabaseConnected, testConnection } from '@/lib/supabase';

interface DatabaseStatusProps {
  onStatusChange?: (connected: boolean) => void;
}

export function DatabaseStatus({ onStatusChange }: DatabaseStatusProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const connected = isSupabaseConnected();
      if (connected) {
        const testResult = await testConnection();
        setIsConnected(testResult);
        onStatusChange?.(testResult);
      } else {
        setIsConnected(false);
        onStatusChange?.(false);
      }
    } catch (error) {
      setIsConnected(false);
      onStatusChange?.(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Database size={20} color={isConnected ? '#10b981' : '#ef4444'} />
          <Text style={[styles.statusText, { color: isConnected ? '#10b981' : '#ef4444' }]}>
            Database: {isConnected ? 'Connected' : 'Offline'}
          </Text>
          <TouchableOpacity onPress={checkConnection} disabled={isLoading}>
            <RefreshCw 
              size={16} 
              color="#6b7280" 
              style={isLoading ? styles.spinning : undefined} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statusDetails}>
          {isConnected ? (
            <View style={styles.detailRow}>
              <Wifi size={14} color="#10b981" />
              <Text style={styles.detailText}>Real-time sync enabled</Text>
            </View>
          ) : (
            <View style={styles.detailRow}>
              <WifiOff size={14} color="#ef4444" />
              <Text style={styles.detailText}>Using local data only</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  spinning: {
    transform: [{ rotate: '45deg' }],
  },
  statusDetails: {
    paddingLeft: 28,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
  },
});