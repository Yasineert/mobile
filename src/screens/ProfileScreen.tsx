import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../theme/theme';

interface ProfileOption {
  id: string;
  title: string;
  icon: string;
  screen?: string;
}

const ProfileScreen = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);

  const profileOptions: ProfileOption[] = [
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings-outline',
    },
    {
      id: 'saved',
      title: 'Saved Locations',
      icon: 'bookmark-outline',
    },
    {
      id: 'history',
      title: 'History',
      icon: 'time-outline',
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline',
    },
  ];

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            
          </View>
          <Text style={styles.userName}>Mohammed Alaoui</Text>
          <Text style={styles.userEmail}>mohammed.alaoui@gmail.com</Text>

          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer}>
          {/* Dark Mode Toggle */}
          <View style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <Icon name="moon-outline" size={24} color="#01615f" />
              <Text style={styles.optionText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#D9D9D9', true: '#01615f' }}
              thumbColor={darkMode ? '#ffffff' : '#ffffff'}
            />
          </View>

          {/* Other Options */}
          {profileOptions.map((option) => (
            <TouchableOpacity key={option.id} style={styles.optionItem}>
              <View style={styles.optionLeft}>
                <Icon name={option.icon} size={24} color="#01615f" />
                <Text style={styles.optionText}>{option.title}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#01615f" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Icon name="log-out-outline" size={24} color="#f44336" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF2',
  },
  header: {
    backgroundColor: '#01615f',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  scrollView: {
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#01615f',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  editProfileButton: {
    backgroundColor: '#01615f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editProfileText: {
    color: 'white',
    fontWeight: 'bold',
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#f44336',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;