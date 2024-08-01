import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { AntDesign, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';

type Props = {
  navigation: NavigationProp<any, any>;
};

const videos = [
  { id: '1', thumbnail: require('../assets/v1.jpg') },
  { id: '2', thumbnail: require('../assets/v2.jpg') },
  // Add more video thumbnails as needed
];

const MePage: React.FC<Props> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState<'videos' | 'favorites'>('videos');
  const [favBGM, setFavBGM] = useState([]);
  const [hasFavorites, setHasFavorites] = useState<boolean | null>(null);

  useEffect(() => {
    if (selectedTab === 'favorites') {
      const fetchFavBGM = async () => {
        try {
          const userIdRes = await axios.get('http://localhost:5002/user/dummy');
          const userId = userIdRes.data.userId;

          if (!userId) {
            Alert.alert('Error', 'User ID not found');
            return;
          }
          const response = await axios.get(`http://localhost:5002/music/favorites/${userId}`);
          setFavBGM(response.data);
          setHasFavorites(response.data.length > 0);
        } catch (error) {
          console.error('Error fetching favorite BGMs:', error);
          Alert.alert('Error', 'Failed to fetch favorite BGMs');
          setHasFavorites(false);
        }
      };
      fetchFavBGM();
    }
  }, [selectedTab]);

  const renderVideoItem = ({ item }: { item: any }) => (
    <Image source={item.thumbnail} style={styles.videoThumbnail} />
  );

  const renderBGMItem = ({ item }: { item: any }) => (
    <View style={styles.bgmContainer}>
      <Text style={styles.bgmTitle}>{item.title}</Text>
      <Text style={styles.bgmArtist}>{item.artist}</Text>
      <Text style={styles.bgmStyle}>{item.style}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <AntDesign name="ellipsis1" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <Text style={styles.username}>Jacob West</Text>
        <Image source={require('../assets/avatar3.png')} style={styles.avatar} />
        <Text style={styles.handle}>@jacob_w</Text>
        <View style={styles.badges}>
          <View style={styles.badgeContainer}>
            <Image source={require('../assets/ariana-grande.jpg')} style={styles.badge} />
            <Text style={styles.badgeLevel}>Level 5</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Image source={require('../assets/adele.jpg')} style={styles.badge} />
            <Text style={styles.badgeLevel}>Level 3</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Image source={require('../assets/jay-chou.jpg')} style={styles.badge} />
            <Text style={styles.badgeLevel}>Level 3</Text>
          </View>
        </View>
        <View style={styles.profileStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>14</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>38</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>91</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text>Edit profile</Text>
        </TouchableOpacity>
        <Text style={styles.bio}>Tap to add bio</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setSelectedTab('videos')}>
          <Ionicons name="grid-outline" size={24} color={selectedTab === 'videos' ? 'black' : 'gray'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setSelectedTab('favorites')}>
          <Ionicons name="heart-outline" size={24} color={selectedTab === 'favorites' ? 'black' : 'gray'} />
        </TouchableOpacity>
      </View>

      {selectedTab === 'videos' ? (
        <FlatList
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          key={'videos'}
          style={styles.videoList}
        />
      ) : hasFavorites ? (
        <FlatList
          data={favBGM}
          renderItem={renderBGMItem}
          keyExtractor={(item) => item._id}
          numColumns={1}
          key={'favorites'}
          style={styles.bgmList}
        />
      ) : (
        <View style={styles.noFavoritesContainer}>
          <Text style={styles.noFavoritesText}>No Favorite BGM</Text>
        </View>
      )}

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
    backgroundColor: 'white',
    paddingBottom: 60, // Padding for the navigation bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 15,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    marginTop: 10,
  },
  handle: {
    fontSize: 16,
    color: 'gray',
  },
  badges: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  badgeContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  badge: {
    width: 20,
    height: 20,
  },
  badgeLevel: {
    fontSize: 12,
    color: 'gray',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginVertical: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
  editProfileButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  bio: {
    color: 'gray',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tabItem: {
    alignItems: 'center',
  },
  bgmList: {
    flex: 1,
  },
  bgmContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  bgmTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bgmArtist: {
    fontSize: 14,
    color: 'gray',
  },
  bgmStyle: {
    fontSize: 12,
    color: 'gray',
  },
  videoList: {
    flex: 1,
  },
  videoThumbnail: {
    width: '33%',
    aspectRatio: 1,
  },
  noFavoritesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFavoritesText: {
    fontSize: 18,
    color: 'gray',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30, // Adjusted height
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  bottomButtonText: {
    color: 'gray',
    fontSize: 10,
  },
});

export default MePage;