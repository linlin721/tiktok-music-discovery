import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AntDesign, Entypo, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';

type Props = {
  navigation: NavigationProp<any, any>;
};

const MusicDiscoveryPage: React.FC<Props> = ({ navigation }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('Original');

  const changeMusicStyle = (style: string) => {
    console.log(`Changing music style to: ${style}`);
    setSelectedStyle(style);
    // Add logic to change music style here
  };

  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://audiopipe.suno.ai/?item_id=a47acae7-d812-48cd-9d06-84e13f50b107' } // URL to the song
      );
      setSound(sound);
      await sound.playAsync();
    };

    playSound();

    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, []);

  return (
    <View style={styles.container}>
      {/* Top navigation buttons */}
      <View style={styles.topNavigation}>
        <TouchableOpacity onPress={() => navigation.navigate('FanClubPage')}>
          <Text style={styles.topButton}>Fan Club</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[styles.topButton, styles.activeButton]}>Discovery</Text>
        </TouchableOpacity>
      </View>

      {/* Main video view */}
      <View style={styles.videoContainer}>
        <Image
          source={require('../assets/test.gif')} // Replace with your video thumbnail URL
          style={styles.video}
        />
        {/* Center GIF and Play button */}
        <View style={styles.centerContent}>
          <Image
            source={{ uri: 'https://media.tenor.com/9kC8XJtFYdsAAAAC/frkst-records-music-label-art.gif' }} // URL to your GIF
            style={styles.centerGif}
          />
          <TouchableOpacity onPress={() => {}} style={styles.playButton}>
            <Ionicons name="play-circle-outline" size={64} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Right side buttons */}
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
        <TouchableOpacity style={styles.iconButton}>
          <Entypo name="dots-three-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.musicStyles}>
        <TouchableOpacity
          onPress={() => changeMusicStyle('Original')}
          style={[
            styles.styleButton,
            selectedStyle === 'Original' && styles.selectedStyleButton
          ]}
        >
          <Text style={styles.styleButtonText}>Original</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeMusicStyle('Pop')}
          style={[
            styles.styleButton,
            selectedStyle === 'Pop' && styles.selectedStyleButton
          ]}
        >
          <Text style={styles.styleButtonText}>Pop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeMusicStyle('Rock')}
          style={[
            styles.styleButton,
            selectedStyle === 'Rock' && styles.selectedStyleButton
          ]}
        >
          <Text style={styles.styleButtonText}>Rock</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeMusicStyle('Jazz')}
          style={[
            styles.styleButton,
            selectedStyle === 'Jazz' && styles.selectedStyleButton
          ]}
        >
          <Text style={styles.styleButtonText}>Jazz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeMusicStyle('Classical')}
          style={[
            styles.styleButton,
            selectedStyle === 'Classical' && styles.selectedStyleButton
          ]}
        >
          <Text style={styles.styleButtonText}>Classical</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom navigation bar */}
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