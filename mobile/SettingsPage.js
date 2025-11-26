import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
} from 'react-native';

export default function SettingsPage({ navigation }) {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [newReleases, setNewReleases] = useState(true);
  const [priceDrops, setPriceDrops] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const SettingSection = ({ icon, title, children }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const SettingItem = ({ label, value, onPress, icon, rightElement }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingItemLeft}>
        {icon && <Text style={styles.settingIcon}>{icon}</Text>}
        <View style={styles.settingItemText}>
          <Text style={styles.settingLabel}>{label}</Text>
          {value && <Text style={styles.settingValue}>{value}</Text>}
        </View>
      </View>
      {rightElement || (onPress && <Text style={styles.chevron}>›</Text>)}
    </TouchableOpacity>
  );

  const ToggleItem = ({ label, description, value, onValueChange }) => (
    <View style={styles.toggleItem}>
      <View style={styles.toggleItemLeft}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {description && <Text style={styles.toggleDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#4285F4' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <SettingSection icon="🔔" title="Notifications">
          <ToggleItem
            label="Push Notifications"
            description="Receive app notifications"
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />
          <ToggleItem
            label="New Releases"
            description="Get notified about new books"
            value={newReleases}
            onValueChange={setNewReleases}
          />
          <ToggleItem
            label="Price Drops"
            description="Alert me when prices drop"
            value={priceDrops}
            onValueChange={setPriceDrops}
          />
        </SettingSection>

        <SettingSection icon="📚" title="Preferences">
          <SettingItem
            label="Language"
            value="English"
            icon="🌍"
            onPress={() => {}}
          />
          <SettingItem
            label="Default Region"
            value="Korea (KOR)"
            icon="🌍"
            onPress={() => {}}
          />
          <SettingItem
            label="Appearance"
            value={darkMode ? 'Dark Mode' : 'Light Mode'}
            icon="🌙"
            onPress={() => setDarkMode(!darkMode)}
          />
        </SettingSection>

        <SettingSection icon="🛡️" title="Privacy & Security">
          <SettingItem label="Privacy Policy" onPress={() => {}} />
          <SettingItem label="Terms of Service" onPress={() => {}} />
          <SettingItem label="Data Management" onPress={() => {}} />
        </SettingSection>

        <SettingSection icon="❓" title="Support">
          <SettingItem label="Support" onPress={() => {}} />
        </SettingSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  sectionContent: {
    backgroundColor: '#fff',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    fontSize: 18,
  },
  settingItemText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: '#999',
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  toggleItemLeft: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
  },
  toggleDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

