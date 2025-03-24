import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
    TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
  DrawerLayoutAndroid,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { CameraView } from 'expo-camera';
import { AlertTriangle, Info, Menu as MenuIcon, Eye, Camera as CameraIcon, CircleStop as StopCircle, House as Home, Settings as SettingsIcon, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from './constants/Colors';
import SettingsScreen from './settings';
import LogsScreen from './logs';

const RECORDING_DURATION = 30; // seconds

export default function OperatorScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showLogs, setShowLogs] = useState(false);
   const [scanMode, setScanMode] = useState<'auto' | 'manual'>('auto');
    const [scanType, setScanType] = useState<'F' | 'R'>('F');
    const [awbId, setAwbId] = useState('');
    const [logType,setLogType] = useState("live")
  const [showSettings, setShowSettings] = useState(false);
  const [hasWebcam, setHasWebcam] = useState(false);

  const drawerRef = useRef<DrawerLayoutAndroid>(null);
  const cameraRef = useRef(null);
  const logsAnimation = useRef(new Animated.Value(0)).current; // For logs drawer animation
  const scannerAnimation = useRef(new Animated.Value(1)).current;

  // Toggle logs drawer
 const toggleLogs = (logTypeNew) => {
   if (logType !== logTypeNew) {
     setLogType(logTypeNew);
     if (!showLogs) {
       Animated.timing(logsAnimation, {
         toValue: 1,
         duration: 300,
         useNativeDriver: false,
       }).start(() => setShowLogs(true));
     }
   } else {
     Animated.timing(logsAnimation, {
       toValue: showLogs ? 0 : 1,
       duration: 300,
       useNativeDriver: false,
     }).start(() => setShowLogs(!showLogs));
   }
 };


  // Calculate logs drawer height
  const logsDrawerHeight = logsAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Dimensions.get('window').height * 0.8], // 80% of screen height
  });

  useEffect(() => {
    // Check for webcam
    if (Platform.OS === 'web') {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          setHasWebcam(devices.some(device => device.kind === 'videoinput'));
        });
    }

    // Start scanner animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scannerAnimation, {
          toValue: 0.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scannerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const renderNavigationView = () => (
    <View style={styles.drawer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Menu</Text>
      </View>
      <TouchableOpacity style={styles.drawerItem} onPress={() => drawerRef.current?.closeDrawer()}>
        <Home size={24} color={Colors.primary} />
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          drawerRef.current?.closeDrawer();
          setShowSettings(true);
        }}
      >
        <SettingsIcon size={24} color={Colors.primary} />
        <Text style={styles.drawerItemText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.replace('/login')}
      >
        <LogOut size={24} color={Colors.error} />
        <Text style={[styles.drawerItemText, { color: Colors.error }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  const MainContent = () => (
    <SafeAreaView style={styles.safeContainer}>
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header Buttons */}
      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={[styles.headerButton, styles.menuButton]}
          onPress={() => drawerRef.current?.openDrawer()}
          disabled={isRecording}
        >
          <MenuIcon size={28} color={Colors.gray} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerButton, styles.errorButton]}
          onPress={()=>toggleLogs('error')}
           disabled={!isRecording}
        >
          <AlertTriangle size={24} color={Colors.white} />
          <View><Text style={styles.badgeText}>{0}</Text></View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerButton, styles.pendingButton]}
           onPress={()=>toggleLogs('pending')}
           disabled={!isRecording}
        >
          <Info size={24} color={Colors.white} />
          <View><Text style={styles.badgeText}>{0}</Text></View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerButton, styles.liveButton]}
          onPress={()=>toggleLogs('live')}
           disabled={!isRecording}
        >
          <Eye size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Logs Drawer */}
   {showLogs && (
     <Animated.View style={[styles.logsDrawer, { height: logsDrawerHeight }]}>
       <LogsScreen logType={logType} />
     </Animated.View>
   )}

      {/* Camera Feed */}
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera}>
          {!isRecording ? (
            <View style={styles.cameraOverlay}>
              <View style={styles.cameraControls}>
                <View style={styles.cameraStatus}>
                  <CameraIcon size={24} color={Colors.white} />
                  {hasWebcam && <Text style={styles.webcamIndicator}>c</Text>}
                </View>
                 <Text style={styles.scanTypeIndicator}>{scanType}</Text>
              </View>
              <View style={styles.inputContainer}>
                                  <TextInput
                                    style={styles.input}
                                    placeholder="Enter AWB ID"
                                    value={awbId}
                                    onChangeText={setAwbId}
                                    placeholderTextColor={Colors.gray}
                                  />
                                  {scanMode === 'manual' && (
                                     <View style={styles.buttonGroup}>
                                       <TouchableOpacity style={[styles.button, styles.cancelButton]}>
                                         <Text style={styles.buttonText}>Cancel</Text>
                                       </TouchableOpacity>
                                       <TouchableOpacity style={[styles.button, styles.proceedButton]}>
                                         <Text style={styles.buttonText}>Proceed</Text>
                                       </TouchableOpacity>
                                     </View>
                                   )}
                                </View>
            </View>
          ) : (
            <View style={styles.recordingOverlay}>
              <StopCircle size={32} color={Colors.error} />
              <View style={styles.recordingOverlayTimeandButton}>
                <Text style={styles.recordingTimer}>{RECORDING_DURATION - recordingDuration}s</Text>
                <TouchableOpacity style={styles.stopButton} onPress={() => setIsRecording(false)}>
                  <Text style={styles.stopButtonText}>Stop Video</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </CameraView>
      </View>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsScreen visible={showSettings} onClose={() => setShowSettings(false)} />
      )}
    </SafeAreaView>
  );

  if (Platform.OS === 'android') {
    return (
      <DrawerLayoutAndroid
        ref={drawerRef}
        drawerWidth={300}
        drawerPosition="left"
        renderNavigationView={renderNavigationView}
      >
        <MainContent />
      </DrawerLayoutAndroid>
    );
  }

  return <MainContent />;
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    zIndex: 100, // Ensure header stays above logs drawer
  },
  headerButton: {
    width: 60,
    height: 60,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  menuButton: {
    backgroundColor: Colors.lightGray,
  },
  liveButton: { backgroundColor: Colors.blue },
  pendingButton: { backgroundColor: Colors.orange },
  errorButton: { backgroundColor: Colors.red },
  cameraContainer: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 16,
    justifyContent : 'space-between'
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cameraStatus: {
    position: 'relative',
  },
webcamIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    color: Colors.white,
    fontSize: 12,
  },
  scanTypeIndicator: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
      padding: 16,
      gap: 8,
    },
    input: {
      backgroundColor: Colors.white,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
    },
    buttonGroup: {
      flexDirection: 'row',
      gap: 8,
    },
    button: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: Colors.error,
    },
    proceedButton: {
      backgroundColor: Colors.primary,
    },
    buttonText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
  recordingOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  recordingTimer: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '600',
    marginTop: 16,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
  },
  stopButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

  drawer: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
  drawerHeader: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    marginBottom: 16,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  drawerItemText: {
    fontSize: 16,
    color: Colors.black,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});