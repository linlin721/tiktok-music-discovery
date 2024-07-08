import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<any, any>;
};

const posts = [
  {
    id: '1',
    name: 'Jay Chou',
    time: '1 mins ago',
    content: 'Hi everyone! I am excited to announce that my new album is coming next month! #JayChouNewAlbum',
    avatar: require('../assets/jay-chou.jpg'),
    likes: '15',
    comments: '2',
    shares: '5',
  },
  // Add more posts as needed
];

const FanClubOverviewPage: React.FC<Props> = ({ navigation }) => {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.postContainer}
      onPress={() => navigation.navigate('PostDetailPage', { post: item })}
    >
      <Image source={item.avatar} style={styles.postAvatar} />
      <View style={styles.postContent}>
        <Text style={styles.postHeader}>
          <Text style={styles.postName}>{item.name} </Text>
          <Text style={styles.postTime}>just posted - {item.time}</Text>
        </Text>
        <Text style={styles.postText}>{item.content}</Text>
        <View style={styles.postStats}>
          <View style={styles.postStat}>
            <Ionicons name="chatbubble-outline" size={16} color="gray" />
            <Text style={styles.postStatText}>{item.comments}</Text>
          </View>
          <View style={styles.postStat}>
            <AntDesign name="like2" size={16} color="gray" />
            <Text style={styles.postStatText}>{item.likes}</Text>
          </View>
          <View style={styles.postStat}>
            <Ionicons name="share-social-outline" size={16} color="gray" />
            <Text style={styles.postStatText}>{item.shares}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Avatar and Name at the top */}
      <View style={styles.topContainer}>
        <Image source={require('../assets/jay-chou.jpg')} style={styles.topAvatar} />
        <Text style={styles.topName}>Jay Chou</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer} // Add padding to move the posts lower
      />

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
    backgroundColor: 'white',
    paddingBottom: 60, // Padding for the navigation bar
  },
  topContainer: {
    alignItems: 'center',
    marginVertical: 60, // Decrease this value to move the avatar lower
  },
  topAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  topName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postContainer: {
    marginVertical: -200,
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 20, // Decrease width
    paddingVertical: 20, // Increase height
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  postAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  postContent: {
    flex: 1,
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  postName: {
    fontWeight: 'bold',
  },
  postTime: {
    color: 'gray',
  },
  postText: {
    marginBottom: 10,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStatText: {
    marginLeft: 5,
    color: 'gray',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 30, // Adjusted to match the height of the MusicDiscoveryPage navigation bar
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  bottomButtonText: {
    color: 'gray',
    fontSize: 10,
  },
  listContentContainer: {
    paddingTop: 200, // Adjust this value to move the posts lower
  },
});

export default FanClubOverviewPage;