import React, { useEffect, useState } from 'react';
import { Button, View, PermissionsAndroid, Alert, Text, StyleSheet, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';

export default function GoogleSignIn() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Request notification permission
    const requestNotificationPermission = async () => {
      try {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    };

    requestNotificationPermission();

    // Initialize Google Sign-In
    GoogleSignin.configure({
      webClientId: '280208526296-bjbk1upgj1nn2fjnrstq1qcunuab9bsn.apps.googleusercontent.com',
    });

    // Subscribe to FCM messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      setLoading(true);

      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);

      setLoading(false);
    } catch (error) {
      console.error('Google sign-in error:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in with Google</Text>
      <GoogleSigninButton
        style={styles.googleButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={onGoogleButtonPress}
      />
      {loading && <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  googleButton: {
    width: 192,
    height: 48,
    marginTop: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});
