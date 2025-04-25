import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Text, ActivityIndicator, Button, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, mediaDevices } from 'react-native-webrtc';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme';

export default function VideoConferenceScreen({ route, navigation }) {
  const { meetingId, isHost } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [participants, setParticipants] = useState([]);
  const { user } = useAuth();
  
  const peerConnection = useRef(null);
  const supabaseChannel = useRef(null);
  
  useEffect(() => {
    // Request permissions
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const audioPermission = await Audio.requestPermissionsAsync();
      
      setHasPermission(
        cameraPermission.status === 'granted' && 
        audioPermission.status === 'granted'
      );
      
      if (cameraPermission.status === 'granted' && audioPermission.status === 'granted') {
        setupWebRTC();
      }
    })();
    
    // Set up Supabase channel for signaling
    setupSignalingChannel();
    
    // Clean up on unmount
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      
      if (supabaseChannel.current) {
        supabaseChannel.current.unsubscribe();
      }
    };
  }, []);
  
  const setupWebRTC = async () => {
    try {
      // Get local media stream
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setLocalStream(stream);
      
      // Create RTCPeerConnection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };
      
      const pc = new RTCPeerConnection(configuration);
      peerConnection.current = pc;
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });
      
      // Handle remote stream
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };
      
      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          // Send ICE candidate to remote peer via Supabase
          supabaseChannel.current.send({
            type: 'broadcast',
            event: 'ice-candidate',
            payload: {
              candidate: event.candidate.toJSON(),
              sender: user.id
            }
          });
        }
      };
      
      // Connection state changes
      pc.onconnectionstatechange = () => {
        console.log('Connection state:', pc.connectionState);
      };
      
      // If host, create and send offer
      if (isHost) {
        createAndSendOffer();
      }
      
      setIsConnecting(false);
    } catch (error) {
      console.error('Error setting up WebRTC:', error);
      Alert.alert('Error', 'Failed to set up video call. Please check your camera and microphone permissions.');
    }
  };
  
  const setupSignalingChannel = () => {
    // Create or join Supabase channel for signaling
    const channel = supabase.channel(`meeting-${meetingId}`, {
      config: {
        broadcast: { self: false }
      }
    });
    
    // Handle signaling messages
    channel
      .on('broadcast', { event: 'offer' }, ({ payload }) => {
        if (payload.receiver === user.id || payload.receiver === 'all') {
          handleOffer(payload.offer, payload.sender);
        }
      })
      .on('broadcast', { event: 'answer' }, ({ payload }) => {
        if (payload.receiver === user.id) {
          handleAnswer(payload.answer);
        }
      })
      .on('broadcast', { event: 'ice-candidate' }, ({ payload }) => {
        if (payload.sender !== user.id) {
          handleIceCandidate(payload.candidate);
        }
      })
      .on('broadcast', { event: 'participant-joined' }, ({ payload }) => {
        setParticipants(current => {
          if (!current.some(p => p.id === payload.participant.id)) {
            return [...current, payload.participant];
          }
          return current;
        });
        
        // If host, send offer to new participant
        if (isHost && payload.participant.id !== user.id) {
          createAndSendOffer(payload.participant.id);
        }
      })
      .on('broadcast', { event: 'participant-left' }, ({ payload }) => {
        setParticipants(current => 
          current.filter(p => p.id !== payload.participantId)
        );
      })
      .subscribe();
    
    supabaseChannel.current = channel;
    
    // Announce joining
    channel.send({
      type: 'broadcast',
      event: 'participant-joined',
      payload: {
        participant: {
          id: user.id,
          name: user.user_metadata?.name || 'Unknown User',
          isHost
        }
      }
    });
    
    // Update meeting status in database
    updateMeetingStatus(true);
  };
  
  const updateMeetingStatus = async (isActive) => {
    try {
      await supabase
        .from('video_meetings')
        .update({ is_active: isActive, last_activity: new Date().toISOString() })
        .eq('id', meetingId);
    } catch (error) {
      console.error('Error updating meeting status:', error);
    }
  };
  
  const createAndSendOffer = async (receiverId = 'all') => {
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      
      // Send offer to remote peer via Supabase
      supabaseChannel.current.send({
        type: 'broadcast',
        event: 'offer',
        payload: {
          offer: offer,
          sender: user.id,
          receiver: receiverId
        }
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };
  
  const handleOffer = async (offer, senderId) => {
    try {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };
  
  const handleAnswer = async (answer) => {
    try {
      const desc = new RTCSessionDescription(answer);
      await peerConnection.current.setRemoteDescription(desc);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };
  
  const handleIceCandidate = async (candidate) => {
    try {
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  };
  
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };
  
  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
    }
  };
  
  const endCall = () => {
    // Announce leaving
    if (supabaseChannel.current) {
      supabaseChannel.current.send({
        type: 'broadcast',
        event: 'participant-left',
        payload: {
          participantId: user.id
        }
      });
    }
    
    // Update meeting status if host
    if (isHost) {
      updateMeetingStatus(false);
    }
    
    navigation.goBack();
  };
  
  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Requesting permissions...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialCommunityIcons name="camera-off" size={64} color={theme.colors.error} />
        <Text style={styles.permissionText}>
          Camera and microphone permissions are required for video conferencing.
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={styles.permissionButton}
        >
          Go Back
        </Button>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {isConnecting ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Setting up video call...</Text>
        </View>
      ) : (
        <>
          {/* Remote Stream (Main View) */}
          {remoteStream ? (
            <View style={styles.remoteStreamContainer}>
              <RTCView
                streamURL={remoteStream.toURL()}
                style={styles.remoteStream}
                objectFit="cover"
              />
            </View>
          ) : (
            <View style={styles.waitingContainer}>
              <MaterialCommunityIcons name="account-clock" size={64} color={theme.colors.primary} />
              <Text style={styles.waitingText}>
                Waiting for other participants to join...
              </Text>
            </View>
          )}
          
          {/* Local Stream (Picture-in-Picture) */}
          {localStream && (
            <View style={styles.localStreamContainer}>
              <RTCView
                streamURL={localStream.toURL()}
                style={styles.localStream}
                objectFit="cover"
                zOrder={1}
              />
            </View>
          )}
          
          {/* Controls */}
          <View style={styles.controlsContainer}>
            <IconButton
              icon={isMuted ? "microphone-off" : "microphone"}
              color={isMuted ? theme.colors.error : "white"}
              size={30}
              onPress={toggleMute}
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            />
            
            <IconButton
              icon="phone-hangup"
              color="white"
              size={30}
              onPress={endCall}
              style={[styles.controlButton, styles.endCallButton]}
            />
            
            <IconButton
              icon={isCameraOff ? "camera-off" : "camera"}
              color={isCameraOff ? theme.colors.error : "white"}
              size={30}
              onPress={toggleCamera}
              style={[styles.controlButton, isCameraOff && styles.controlButtonActive]}
            />
          </View>
          
          {/* Participants List */}
          {participants.length > 0 && (
            <View style={styles.participantsContainer}>
              <Text style={styles.participantsTitle}>
                Participants ({participants.length})
              </Text>
              {participants.map((participant, index) => (
                <View key={index} style={styles.participantItem}>
                  <MaterialCommunityIcons 
                    name={participant.isHost ? "account-star" : "account"} 
                    size={20} 
                    color={theme.colors.primary} 
                  />
                  <Text style={styles.participantName}>
                    {participant.name} {participant.id === user.id ? '(You)' : ''}
                    {participant.isHost ? ' (Host)' : ''}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  permissionText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
  permissionButton: {
    marginTop: 20,
  },
  remoteStreamContainer: {
    flex: 1,
  },
  remoteStream: {
    flex: 1,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  waitingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  localStreamContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
  },
  localStream: {
    flex: 1,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    margin: 10,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
  },
  endCallButton: {
    backgroundColor: theme.colors.error,
  },
  participantsContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    padding: 10,
    maxWidth: 200,
  },
  participantsTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  participantName: {
    color: 'white',
    marginLeft: 8,
  },
});

// Add these new functions to your existing VideoConferenceScreen component

const [isScreenSharing, setIsScreenSharing] = useState(false);
const [isRecording, setIsRecording] = useState(false);
const [recordingTime, setRecordingTime] = useState(0);
const recordingTimerRef = useRef(null);

const toggleScreenSharing = async () => {
  if (!peerConnection.current) return;
  
  try {
    if (isScreenSharing) {
      // Stop screen sharing and revert to camera
      const cameraStream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      // Replace tracks in peer connection
      const videoTrack = cameraStream.getVideoTracks()[0];
      const senders = peerConnection.current.getSenders();
      const videoSender = senders.find(sender => 
        sender.track && sender.track.kind === 'video'
      );
      
      if (videoSender) {
        videoSender.replaceTrack(videoTrack);
      }
      
      // Update local stream
      setLocalStream(cameraStream);
      setIsScreenSharing(false);
    } else {
      // Start screen sharing
      // Note: This is a simplified version. In a real app, you would use a proper screen sharing API
      Alert.alert(
        'Screen Sharing',
        'In a real implementation, this would capture your screen. For this demo, we\'ll simulate it.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Share Screen',
            onPress: () => {
              // Simulate screen sharing by changing the background
              setIsScreenSharing(true);
              
              // Notify other participants
              supabaseChannel.current.send({
                type: 'broadcast',
                event: 'screen-sharing-started',
                payload: {
                  participant: {
                    id: user.id,
                    name: user.user_metadata?.name || 'Unknown User'
                  }
                }
              });
            }
          }
        ]
      );
    }
  } catch (error) {
    console.error('Error toggling screen sharing:', error);
    Alert.alert('Error', 'Failed to toggle screen sharing');
  }
};

const startRecording = () => {
  if (isRecording) return;
  
  // In a real app, you would use a proper recording API
  setIsRecording(true);
  setRecordingTime(0);
  
  // Start timer
  recordingTimerRef.current = setInterval(() => {
    setRecordingTime(prev => prev + 1);
  }, 1000);
  
  // Notify participants
  supabaseChannel.current.send({
    type: 'broadcast',
    event: 'recording-started',
    payload: {
      participant: {
        id: user.id,
        name: user.user_metadata?.name || 'Unknown User'
      }
    }
  });
};

const stopRecording = () => {
  if (!isRecording) return;
  
  // Clear timer
  if (recordingTimerRef.current) {
    clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = null;
  }
  
  setIsRecording(false);
  
  // In a real app, you would save the recording
  Alert.alert(
    'Recording Saved',
    `Your recording (${formatTime(recordingTime)}) has been saved.`
  );
  
  // Notify participants
  supabaseChannel.current.send({
    type: 'broadcast',
    event: 'recording-stopped',
    payload: {
      participant: {
        id: user.id,
        name: user.user_metadata?.name || 'Unknown User'
      }
    }
  });
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Add these UI elements to your return statement
{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording ? theme.colors.error : "white"}
  onPress={isRecording ? stopRecording : startRecording}
  style={styles.controlButton}
/>

{/* Recording indicator */}
{isRecording && (
  <View style={styles.recordingIndicator}>
    <Text style={styles.recordingText}>● REC {formatTime(recordingTime)}</Text>
  </View>
)}

{/* Add these buttons to your controls */}
<IconButton
  icon={isScreenSharing ? "monitor-off" : "monitor-share"}
  size={24}
  color={isScreenSharing ? theme.colors.error : "white"}
  onPress={toggleScreenSharing}
  style={styles.controlButton}
/>

<IconButton
  icon={isRecording ? "stop-circle" : "record-circle"}
  size={24}
  color={isRecording