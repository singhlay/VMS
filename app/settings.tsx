import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal } from 'react-native';
import { LogOut, Timer } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from './constants/Colors';

export default function SettingsScreen({ visible, onClose }) {
  const [scanType, setScanType] = useState('forward');
  const [autoScan, setAutoScan] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [autoStopTimer, setAutoStopTimer] = useState(30);

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Settings</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scan Settings</Text>

            <View style={styles.setting}>
              <Text style={styles.settingLabel}>Scan Type</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.typeButton, scanType === 'forward' && styles.activeTypeButton]}
                  onPress={() => setScanType('forward')}
                >
                  <Text style={[styles.typeButtonText, scanType === 'forward' && styles.activeTypeButtonText]}>Forward</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, scanType === 'return' && styles.activeTypeButton]}
                  onPress={() => setScanType('return')}
                >
                  <Text style={[styles.typeButtonText, scanType === 'return' && styles.activeTypeButtonText]}>Return</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.setting}>
              <Text style={styles.settingLabel}>Auto Scan</Text>
              <Switch
                value={autoScan}
                onValueChange={setAutoScan}
                trackColor={{ false: Colors.gray, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>

            <View style={styles.setting}>
              <Text style={styles.settingLabel}>Show Video</Text>
              <Switch
                value={showVideo}
                onValueChange={setShowVideo}
                trackColor={{ false: Colors.gray, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>

            <View style={styles.setting}>
              <Text style={styles.settingLabel}>Auto Stop Timer</Text>
              <View style={styles.timerContainer}>
                <Timer size={20} color={Colors.primary} />
                <Text style={styles.timerText}>{autoStopTimer} seconds</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.black,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: Colors.black,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.black,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  activeTypeButton: {
    backgroundColor: Colors.primary,
  },
  typeButtonText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  activeTypeButtonText: {
    color: Colors.white,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    padding: 16,
    borderRadius: 8,
    gap: 8,
    justifyContent: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: Colors.gray,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
