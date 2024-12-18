import {Text, View, PermissionsAndroid} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNSoundLevel from 'react-native-sound-level';

const App = () => {
  const [volume, setVolume] = useState('');

  const requestMicrophonePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'This app needs access to your microphone to record audio',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the microphone');
        RNSoundLevel.start(200);
        RNSoundLevel.onNewFrame = data => {
          console.log('Sound level info', data);
          setVolume(JSON.stringify(data));
        };
      } else {
        console.log('Microphone permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestMicrophonePermission();
    return () => {
      RNSoundLevel.stop();
    };
  }, []);
  return (
    <View>
      <Text>Current Microphone Volume: {volume}</Text>
    </View>
  );
};

export default App;
