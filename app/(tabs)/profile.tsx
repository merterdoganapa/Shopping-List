import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Profil için tip tanımı
type UserProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
  };
};

// Storage anahtarı
const PROFILE_STORAGE_KEY = '@user_profile';

// Varsayılan profil
const defaultProfile: UserProfile = {
  name: '',
  email: '',
  phone: '',
  address: '',
  preferences: {
    notifications: true,
    darkMode: false,
  },
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (jsonValue != null) {
        setProfile(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error('Profil yüklenirken hata oluştu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const jsonValue = JSON.stringify(profile);
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, jsonValue);
      Alert.alert('Başarılı', 'Profil bilgileriniz kaydedildi');
      setIsEditing(false);
    } catch (error) {
      console.error('Profil kaydedilirken hata oluştu:', error);
      Alert.alert('Hata', 'Profil bilgileriniz kaydedilemedi');
    }
  };

  const togglePreference = (preference: 'notifications' | 'darkMode') => {
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        [preference]: !profile.preferences[preference],
      },
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[
      styles.container,
      {
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      },
    ]}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{profile.name ? profile.name.charAt(0).toUpperCase() : '?'}</Text>
        </View>
        <Text style={styles.profileName}>{profile.name || 'İsim belirtilmedi'}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editButton}>{isEditing ? 'İptal' : 'Düzenle'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Ad Soyad</Text>
          <TextInput 
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profile.name}
            onChangeText={(text) => setProfile({...profile, name: text})}
            placeholder="Adınızı girin"
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>E-posta</Text>
          <TextInput 
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profile.email}
            onChangeText={(text) => setProfile({...profile, email: text})}
            placeholder="E-posta adresinizi girin"
            editable={isEditing}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Telefon</Text>
          <TextInput 
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profile.phone}
            onChangeText={(text) => setProfile({...profile, phone: text})}
            placeholder="Telefon numaranızı girin"
            editable={isEditing}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Adres</Text>
          <TextInput 
            style={[styles.input, !isEditing && styles.inputDisabled, styles.textArea]}
            value={profile.address}
            onChangeText={(text) => setProfile({...profile, address: text})}
            placeholder="Adresinizi girin"
            editable={isEditing}
            multiline
            numberOfLines={3}
          />
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tercihler</Text>
        
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>Bildirimler</Text>
          <TouchableOpacity 
            style={[styles.toggle, profile.preferences.notifications && styles.toggleActive]}
            onPress={() => togglePreference('notifications')}
          >
            <View style={[styles.toggleCircle, profile.preferences.notifications && styles.toggleCircleActive]} />
          </TouchableOpacity>
        </View>

        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>Karanlık Mod</Text>
          <TouchableOpacity 
            style={[styles.toggle, profile.preferences.darkMode && styles.toggleActive]}
            onPress={() => togglePreference('darkMode')}
          >
            <View style={[styles.toggleCircle, profile.preferences.darkMode && styles.toggleCircleActive]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uygulama Hakkında</Text>
        <Text style={styles.aboutText}>Shopping List App v1.0</Text>
        <Text style={styles.aboutText}>Bu uygulama React Native ile geliştirilmiştir.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 15,
    padding: 15,
    borderRadius: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  editButton: {
    color: '#007bff',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputDisabled: {
    backgroundColor: '#f9f9f9',
    color: '#555',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  preferenceText: {
    fontSize: 16,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#007bff',
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
  },
  toggleCircleActive: {
    transform: [{ translateX: 20 }],
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});