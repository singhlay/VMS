import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { Plug, ChevronDown } from 'lucide-react-native';
import Colors from './constants/Colors';

const FEED_OPTIONS = [
  { label: 'Feed 1', value: 'feed1' },
  { label: 'Feed 2', value: 'feed2' },
  { label: 'Feed 3', value: 'feed3' },
  { label: 'Feed 4', value: 'feed4' },
  { label: 'Feed 5', value: 'feed5' },
  { label: 'Feed 6', value: 'feed6' },
];

export default function FeedSelectionScreen() {
  const [selectedFeed, setSelectedFeed] = useState('');
  const [error, setError] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSelectFeed = (value) => {
    setSelectedFeed(value);
    setError('');
    setDropdownVisible(false);
  };

  const handleConnect = () => {
    if (!selectedFeed) {
      setError('Please select a feed');
      return;
    }
    router.replace('/operator');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Plug size={64} color={Colors.primary} style={styles.icon} />
        <Text style={styles.title}>Connect to Feed</Text>
        <Text style={styles.subtitle}>Scan the Feed Id on your Desk!</Text>

        {/* Dropdown Component */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setDropdownVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownText}>
            {selectedFeed
              ? FEED_OPTIONS.find((item) => item.value === selectedFeed)?.label
              : 'Select a feed...'}
          </Text>
          <ChevronDown size={20} color={Colors.black} />
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Scrollable Dropdown Modal */}
        <Modal
          visible={dropdownVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          >
            <View style={styles.modalContainer}>
              <FlatList
                data={FEED_OPTIONS}
                keyExtractor={(item) => item.value}
                style={styles.dropdownList}
                showsVerticalScrollIndicator={true}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleSelectFeed(item.value)}
                  >
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <TouchableOpacity
          style={[styles.button, !selectedFeed && styles.buttonDisabled]}
          onPress={handleConnect}
          disabled={!selectedFeed}
        >
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 32,
    textAlign: 'center',
  },
  dropdown: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.black,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: Colors.gray,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  dropdownList: {
    maxHeight: 200, // Fixed height for scrollability
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.black,
  },
});

