import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from './constants/Colors';
import { TriangleAlert as AlertTriangle, Eye, Info } from 'lucide-react-native';

type LogType = 'pending' | 'error' | 'live';

interface Log {
  id: string;
  message: string;
  timestamp: string;
  type: LogType;
}

const SAMPLE_LOGS: Log[] = [
  {
    id: '1',
    message: 'Feed Connection status updated successfully!',
    timestamp: '2024-01-20 10:30:00',
    type: 'live',
  },
  {
    id: '2',
    message: 'Error scanning barcode AWB123456',
    timestamp: '2024-01-20 10:29:00',
    type: 'error',
  },
  {
    id: '3',
    message: 'Pending scan: AWB789012',
    timestamp: '2024-01-20 10:28:00',
    type: 'pending',
  },
];

export default function LogsScreen({ logType }: { logType: LogType }) {
  const [activeTab, setActiveTab] = useState<LogType>(logType || 'pending');

  const getTabStyle = (tab: LogType) => [
    styles.tab,
    activeTab === tab && styles.activeTab,
  ];

  const getTabTextStyle = (tab: LogType) => [
    styles.tabText,
    activeTab === tab && styles.activeTabText,
  ];

  const getIconColor = (tab: LogType) =>
    activeTab === tab ? Colors.white : Colors.primary;

  const filteredLogs = SAMPLE_LOGS.filter((log) => log.type === activeTab);

  const getLogStyle = (type: LogType) => {
    switch (type) {
      case 'error':
        return styles.errorLog;
      case 'pending':
        return styles.pendingLog;
      default:
        return styles.liveLog;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>System Logs</Text>
      <ScrollView style={styles.logContainer}>
        {filteredLogs.map((log) => (
          <View key={log.id} style={[styles.logEntry, getLogStyle(log.type)]}>
            <Text style={styles.timestamp}>{log.timestamp}</Text>
            <Text style={styles.logMessage}>{log.message}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    color: Colors.black,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    backgroundColor: Colors.lightGray,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  activeTabText: {
    color: Colors.white,
  },
  logContainer: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  logEntry: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  errorLog: {
    backgroundColor: Colors.error + '20',
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  pendingLog: {
    backgroundColor: Colors.pending + '20',
    borderLeftWidth: 4,
    borderLeftColor: Colors.pending,
  },
  liveLog: {
    backgroundColor: Colors.info + '20',
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  logMessage: {
    fontSize: 14,
    color: Colors.black,
  },
});