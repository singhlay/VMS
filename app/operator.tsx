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
  StatusBar
} from 'react-native';
import { CameraView } from 'expo-camera';
import  {AlertTriangle, Info, Menu as MenuIcon, Eye, Camera as CameraIcon, CircleStop as StopCircle, Timer, X as CloseIcon, House  as Home, Settings as SettingsIcon, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from './constants/Colors';
import SettingsScreen from './settings';

const RECORDING_DURATION = 30; // seconds

export default function OperatorScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [awbId, setAwbId] = useState('');
  const [scanMode, setScanMode] = useState<'auto' | 'manual'>('manual');
  const [scanType, setScanType] = useState<'F' | 'R'>('F');
  const [showLogs, setShowLogs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasWebcam, setHasWebcam] = useState(false);

  const drawerRef = useRef(DrawerLayoutAndroid);
  const cameraRef = useRef(null);
  const logsAnimation = useRef(new Animated.Value(0)).current;
  const scannerAnimation = useRef(new Animated.Value(1)).current;

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

  const toggleLogs = () => {
    if (!isRecording) return;

    Animated.timing(logsAnimation, {
      toValue: showLogs ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setShowLogs(!showLogs);
  };

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
      <View style={[styles.headerButtons]}>
        <TouchableOpacity
          style={[styles.headerButton, styles.menuButton]}
          onPress={() => drawerRef.current?.openDrawer()}

        >
          <MenuIcon size={28} color={Colors.gray} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerButton, styles.errorButton, !isRecording && styles.disabledButton]}
          onPress={() => setShowLogs(!showLogs)}
          disabled={isRecording}
        >
          <AlertTriangle size={24} color={Colors.white} />
          <View><Text style={styles.badgeText}>{0}</Text></View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerButton, styles.pendingButton, !isRecording && styles.disabledButton]}
          onPress={() => setShowLogs(!showLogs)}
          disabled={isRecording}
        >
          <Info size={24} color={Colors.white} />
          <View><Text style={styles.badgeText}>{0}</Text></View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerButton, styles.liveButton, !isRecording && styles.disabledButton]}
          onPress={() => setShowLogs(!showLogs)}
          disabled={isRecording}
        >
          <Eye size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Camera Feed */}
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera}>
          {/* Camera Overlay */}
          {!isRecording ? (
            <View style={styles.cameraOverlay}>
              <View style={styles.cameraControls}>
                <View style={styles.cameraStatus}>
                  <CameraIcon size={24} color={Colors.white} />
                  {hasWebcam && <Text style={styles.webcamIndicator}>c</Text>}
                </View>
                <Text style={styles.scanTypeIndicator}>{scanType}</Text>
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
//         paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Avoids overlap with status bar
      },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    height : 'fit-content',
    position: 'relative', // Keeps it in normal document flow
    zIndex: 100, // Ensures it stays above other elements
//     backgroundColor : Colors.primary
  },
  headerButton: {
         width : 60,
            height: 60,
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
            padding : 12,
            paddingTop: Platform.OS === 'ios' ? 50 : 20, // Ensure header does not overlap status bar
            position: 'relative',
    },
  menuButton : {
      backgroundColor : Colors.lightGray
      },
    liveButton: { backgroundColor: Colors.blue },
        pendingButton: { backgroundColor: Colors.orange },
        errorButton: { backgroundColor: Colors.red },
  disabledButton: {
    opacity: 0.5,
  },
  cameraContainer: {
    height: '90%',
    backgroundColor: Colors.black,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 16,
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
  scannerBorder: {
    flex: 1,
    margin: 32,
    position: 'relative',
  },
  scannerCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: Colors.white,
    borderWidth: 2,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
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
    padding : 16
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
  recordingOverlayTimeandButton:{
      display : 'flex',
      justifyContent : "center",
      alignItems: 'center',
      },
  logsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  logsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.black,
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