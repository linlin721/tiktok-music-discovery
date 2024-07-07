import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AntDesign, Entypo, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<any, any>;
};

const MusicDiscoveryPage: React.FC<Props> = ({ navigation }) => {
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
          source={{ uri: 'https://example.com/your-video-thumbnail.jpg' }} // Replace with your video thumbnail URL
          style={styles.video}
        />
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

      {/* Bottom navigation bar */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePage')} style={styles.navItem}>
          <AntDesign name="home" size={24} color="white" />
          <Text style={styles.bottomButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MusicDiscoveryPage')} style={styles.navItem}>
          <MaterialIcons name="music-note" size={24} color="white" />
          <Text style={styles.bottomButtonText}>Music</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CreationPage')} style={styles.navItem}>
          <FontAwesome5 name="plus-square" size={24} color="white" />
          <Text style={styles.bottomButtonText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('InboxPage')} style={styles.navItem}>
          <Ionicons name="mail-outline" size={24} color="white" />
          <Text style={styles.bottomButtonText}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MePage')} style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="white" />
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
    paddingBottom: 60, // Increased padding to make space for the navigation bar
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 55, // Further increased margin to move the buttons lower
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
    height: '100%',
  },
  rightSideButtons: {
    position: 'absolute',
    right: 10,
    bottom: 110, // Adjusted to move the buttons higher
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
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#333',
    position: 'absolute',
    bottom: 30, // Adjusted to move the navigation bar higher
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