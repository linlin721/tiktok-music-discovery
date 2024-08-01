import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { AntDesign, Entypo, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import axios from 'axios';

type Props = {
  navigation: NavigationProp<any, any>;
};

const MusicDiscoveryPage: React.FC<Props> = ({ navigation }) => {
  const musicStyles: { [key: string]: string } = {
    "Original": 'Original',
    "Pop": 'Pop',
    "Rock": 'Rock',
    "Jazz": 'Jazz',
    "Classical": 'Classical',
  };

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('Original');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [songInfo, setSongInfo] = useState<{ title: string, artist: string, style: string } | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get('http://localhost:5002/user/dummy');
        const { userId } = res.data;
        setUserId(userId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        console.log('Fetching song...');
        const payload = {
          prompt: "Create a calm and soothing background music",
          tags: selectedStyle,
          title: "Calm Melody",
          artist: "Justin Bieber"
        };
        console.log('Payload:', payload);
        const res = await axios.post('http://localhost:5003/generate_bgm', payload);
        console.log('Response:', res.data);
        const { title, artist, style, audio_url } = res.data;
        setAudioUrl(audio_url);
        setSongInfo({ title, artist, style });
      } catch (error) {
        console.error('Error fetching song:', error);
      }
    };
    fetchSong();
  }, [selectedStyle]);
  

  // const playSound = async () => {
  //   if (isPlaying && sound) {
  //     await sound.stopAsync();
  //     setIsPlaying(false);
  //   } else {
  //     setIsLoading(true);
  //     if (sound) {
  //       await sound.unloadAsync();
  //       setSound(null);
  //     }
  //     try {
  //       const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
  //       setSound(newSound);
  //       await newSound.playAsync();
  //       setIsPlaying(true);
  //     } catch (error) {
  //       console.error('Error playing sound:', error);
  //     }
  //     setIsLoading(false);
  //   }
  // };  
  
  const playSound = async () => {
    try {
      console.log('Loading Sound');
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);

      console.log('Playing Sound');
      await newSound.playAsync();
    } catch (error) {
      console.error('Error handling sound object:', error);
    }
  };

  // Cleanup sound object
  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const addFavoriteBGM = async (musicId: string) => {
    if (!userId) {
      Alert.alert('Error:', 'User ID not found!');
      return;
    }
    try {
      await axios.post('http://localhost:5002/music/favorites', {
        userId,
        musicId
      });
      Alert.alert('Success', 'BGM added to favorites');
    } catch (error) {
      console.error('Error adding favorite BGM:', error);
      Alert.alert('Error', 'Failed to add BGM to favorites');
    }
  };

  const generateAndSaveBGM = async () => {
    try {
      const payload = {
        prompt: "Create a calm and soothing background music",
        tags: selectedStyle,
        title: "Calm Melody",
        artist: "any"
      };

      const response = await axios.post('http://localhost:5003/generate_bgm', payload);
      const { title, artist, style, audio_url } = response.data;

      const musicResponse = await axios.post('http://localhost:5002/music', { title, artist, style, audio_url });
      const musicId = musicResponse.data._id;

      await addFavoriteBGM(musicId);

      Alert.alert('Success', 'BGM generated and saved');
    } catch (error) {
      console.error('Error generating or saving BGM:', error);
      Alert.alert('Error', 'Failed to generate or save BGM');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topNavigation}>
        <TouchableOpacity onPress={() => navigation.navigate('FanClubPage')}>
          <Text style={styles.topButton}>Fan Club</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[styles.topButton, styles.activeButton]}>Discovery</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.videoContainer}>
        <Image source={require('../assets/test.gif')} style={styles.video} />
        <View style={styles.centerContent}>
          <Image source={{ uri: 'https://media.tenor.com/9kC8XJtFYdsAAAAC/frkst-records-music-label-art.gif' }} style={styles.centerGif} />
          <TouchableOpacity onPress={playSound} style={styles.playButton}>
            <Ionicons name="play-circle-outline" size={64} color="white" />
          </TouchableOpacity>
        </View>
        {songInfo && (
          <View style={styles.songInfo}>
            <Text style={styles.songTitle}>{songInfo.title}</Text>
            <Text style={styles.songArtist}>{songInfo.artist}</Text>
            <Text style={styles.songStyle}>{songInfo.style}</Text>
          </View>
        )}
      </View>

      <View style={styles.rightSideButtons}>
        <TouchableOpacity style={styles.iconButton}>
          <AntDesign name="heart" size={24} color="white" />
          <Text style={styles.iconText}>328.7K</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <AntDesign name="message1" size={24} color="white" />
          <Text style={styles.iconText}>578</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <AntDesign name="sharealt" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={generateAndSaveBGM}>
          <SimpleLineIcons name="magic-wand" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.musicStyles}>
        {Object.keys(musicStyles).map(style => (
          <TouchableOpacity
            key={style}
            onPress={() => setSelectedStyle(style)}
            style={[styles.styleButton, selectedStyle === style && styles.selectedStyleButton]}
          >
            <Text style={styles.styleButtonText}>{style}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePage')} style={styles.navItem}>
          <AntDesign name="home" size={24} color="gray" />
          <Text style={styles.bottomButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MusicDiscoveryPage')} style={styles.navItem}>
          <MaterialIcons name="music-note" size={24} color="gray" />
          <Text style={styles.bottomButtonText}>Music</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CreationPage')} style={styles.navItem}>
          <FontAwesome5 name="plus-square" size={24} color="gray" />
          <Text style={styles.bottomButtonText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('InboxPage')} style={styles.navItem}>
          <Ionicons name="mail-outline" size={24} color="gray" />
          <Text style={styles.bottomButtonText}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MePage')} style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="gray" />
          <Text style={styles.bottomButtonText}>Me</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingBottom: 100,
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 55,
  },
  topButton: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 20,
  },
  activeButton: {
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '70%',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerGif: {
    width: 100,
    height: 100,
  },
  playButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songInfo: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  songTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  songArtist: {
    color: 'white',
    fontSize: 16,
  },
  songStyle: {
    color: 'white',
    fontSize: 14,
  },
  audioContainer: {
    position: 'absolute',
    bottom: 250,
    right: 10,
    alignItems: 'center',
  },
  audioButton: {
    alignItems: 'center',
  },
  rightSideButtons: {
    position: 'absolute',
    right: 10,
    bottom: 180,
    alignItems: 'center',
  },
  iconButton: {
    marginBottom: 20,
    alignItems: 'center',
  },
  iconText: {
    color: 'white',
    fontSize: 12,
  },
  musicStyles: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    position: 'absolute',
    bottom: 60,
    width: '100%',
  },
  styleButton: {
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  selectedStyleButton: {
    backgroundColor: '#555',
  },
  styleButtonText: {
    color: 'white',
    fontSize: 14,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#333',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 10,
  },
});
export default MusicDiscoveryPage;
