import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft, Key, Users } from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { hashPassword, generateSecurePassword } from '@/lib/auth';
import { AdminUser } from '@/types/database';

export default function AdminSettingsScreen() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'super_admin',
  });

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, username, email, role, created_at, last_login, is_active')
        .order('created_at');
      
      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      const hashedPassword = await hashPassword(newPassword);
      
      const { error } = await supabase
        .from('admin_users')
        .update({ password_hash: hashedPassword })
        .eq('username', 'Divyanshu'); // Current user

      if (error) throw error;
      
      Alert.alert('Success', 'Password changed successfully');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password');
    }
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        const { error } = await supabase
          .from('admin_users')
          .update({
            username: userForm.username,
            email: userForm.email,
            role: userForm.role,
          })
          .eq('id', editingUser.id);
        
        if (error) throw error;
        Alert.alert('Success', 'User updated successfully');
      } else {
        const hashedPassword = await hashPassword(userForm.password);
        
        const { error } = await supabase
          .from('admin_users')
          .insert([{
            username: userForm.username,
            email: userForm.email,
            password_hash: hashedPassword,
            role: userForm.role,
          }]);
        
        if (error) throw error;
        Alert.alert('Success', 'User created successfully');
      }
      
      setShowUserModal(false);
      setEditingUser(null);
      resetUserForm();
      fetchAdminUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Error', 'Failed to save user');
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (username === 'Divyanshu') {
      Alert.alert('Error', 'Cannot delete the main admin user');
      return;
    }

    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('admin_users')
                .delete()
                .eq('id', userId);
              
              if (error) throw error;
              Alert.alert('Success', 'User deleted successfully');
              fetchAdminUsers();
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const openEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
    });
    setShowUserModal(true);
  };

  const openCreateUser = () => {
    setEditingUser(null);
    resetUserForm();
    setShowUserModal(true);
  };

  const resetUserForm = () => {
    setUserForm({
      username: '',
      email: '',
      password: '',
      role: 'admin',
    });
  };

  const generatePassword = () => {
    const password = generateSecurePassword();
    setUserForm({ ...userForm, password });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#6b7280', '#374151']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Settings</Text>
        <Text style={styles.headerSubtitle}>Manage system configuration</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Password Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => setShowPasswordModal(true)}
            activeOpacity={0.7}>
            <View style={styles.settingHeader}>
              <Key size={20} color="#ef4444" />
              <Text style={styles.settingTitle}>Change Password</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Admin Users Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Authorized Users</Text>
            <TouchableOpacity style={styles.addButton} onPress={openCreateUser}>
              <Plus size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          {adminUsers.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.userMeta}>
                  <View style={[styles.roleBadge, user.role === 'super_admin' && styles.superAdminBadge]}>
                    <Text style={[styles.roleText, user.role === 'super_admin' && styles.superAdminText]}>
                      {user.role.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.lastLogin}>
                    Last login: {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </Text>
                </View>
              </View>
              <View style={styles.userActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openEditUser(user)}>
                  <Edit size={16} color="#8b5cf6" />
                </TouchableOpacity>
                {user.username !== 'Divyanshu' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteUser(user.id, user.username)}>
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Password Change Modal */}
      <Modal visible={showPasswordModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  secureTextEntry={!showPasswords.current}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}>
                  {showPasswords.current ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  secureTextEntry={!showPasswords.new}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}>
                  {showPasswords.new ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry={!showPasswords.confirm}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}>
                  {showPasswords.confirm ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
              <Text style={styles.saveButtonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* User Management Modal */}
      <Modal visible={showUserModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingUser ? 'Edit User' : 'Add Admin User'}
            </Text>
            <TouchableOpacity onPress={() => setShowUserModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={userForm.username}
                onChangeText={(text) => setUserForm({ ...userForm, username: text })}
                placeholder="Enter username"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={userForm.email}
                onChangeText={(text) => setUserForm({ ...userForm, email: text })}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {!editingUser && (
              <View style={styles.formGroup}>
                <View style={styles.passwordHeader}>
                  <Text style={styles.label}>Password</Text>
                  <TouchableOpacity style={styles.generateButton} onPress={generatePassword}>
                    <Text style={styles.generateText}>Generate</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.input}
                  value={userForm.password}
                  onChangeText={(text) => setUserForm({ ...userForm, password: text })}
                  placeholder="Enter password"
                  secureTextEntry
                />
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Role</Text>
              <View style={styles.roleContainer}>
                {(['admin', 'super_admin'] as const).map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleChip,
                      userForm.role === role && styles.activeRoleChip
                    ]}
                    onPress={() => setUserForm({ ...userForm, role })}>
                    <Text style={[
                      styles.roleChipText,
                      userForm.role === role && styles.activeRoleChipText
                    ]}>
                      {role.replace('_', ' ').toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveUser}>
              <Text style={styles.saveButtonText}>
                {editingUser ? 'Update User' : 'Create User'}
              </Text>
            </TouchableOpacity>
          </View>
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
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#10b981',
    borderRadius: 20,
    padding: 8,
  },
  settingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  superAdminBadge: {
    backgroundColor: '#fef3c7',
  },
  roleText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
  },
  superAdminText: {
    color: '#f59e0b',
  },
  lastLogin: {
    fontSize: 10,
    color: '#9ca3af',
  },
  userActions: {
    flexDirection: 'row',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  eyeButton: {
    padding: 12,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  generateButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  generateText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roleChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeRoleChip: {
    backgroundColor: '#8b5cf6',
  },
  roleChipText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  activeRoleChipText: {
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#8b5cf6',
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