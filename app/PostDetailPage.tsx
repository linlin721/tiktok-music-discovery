import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, RouteProp } from '@react-navigation/native';

type Post = {
  id: string;
  name: string;
  time: string;
  content: string;
  avatar: any;
  likes: string;
  comments: string;
  shares: string;
};

type Comment = {
  id: string;
  user: string;
  avatar: any;
  comment: string;
  time: string;
  likes: string;
  replies: string;
};

type Props = {
  navigation: NavigationProp<any, any>;
  route: RouteProp<{ params: { post: Post } }, 'params'>;
};

const comments: Comment[] = [
  {
    id: '1',
    user: 'martini_rond',
    avatar: require('../assets/adele.jpg'),
    comment: 'How neatly I write the date in my book',
    time: '22h',
    likes: '8098',
    replies: '4',
  },
  {
    id: '2',
    user: 'maxjacobson',
    avatar: require('../assets/adele.jpg'),
    comment: 'Now that’s a skill very talented',
    time: '22h',
    likes: '8098',
    replies: '1',
  },
  {
    id: '3',
    user: 'zackjohn',
    avatar: require('../assets/adele.jpg'),
    comment: 'Doing this would make me so anxious',
    time: '22h',
    likes: '8098',
    replies: '2',
  },
  // Add more comments as needed
];

const PostDetailPage: React.FC<Props> = ({ navigation, route }) => {
  const { post } = route.params;

  const renderItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <Image source={item.avatar} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={styles.commentUser}>{item.user}</Text>
        <Text style={styles.commentText}>{item.comment}</Text>
        <View style={styles.commentFooter}>
          <Text style={styles.commentTime}>{item.time}</Text>
          <Text style={styles.commentLikes}>{item.likes}</Text>
          <Ionicons name="heart-outline" size={16} color="gray" />
        </View>
        <Text style={styles.commentReplies}>View replies ({item.replies})</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Avatar and Name at the top */}
      <View style={styles.topContainer}>
        <Image source={post.avatar} style={styles.topAvatar} />
        <Text style={styles.topName}>{post.name}</Text>
      </View>

      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListHeaderComponent={
          <View style={styles.postHeader}>
            <Image source={post.avatar} style={styles.postAvatar} />
            <View style={styles.postContent}>
              <Text style={styles.postHeaderText}>
                <Text style={styles.postName}>{post.name} </Text>
                <Text style={styles.postTime}>just posted - {post.time}</Text>
              </Text>
              <Text style={styles.postText}>{post.content}</Text>
              <View style={styles.postStats}>
                <View style={styles.postStat}>
                  <Ionicons name="chatbubble-outline" size={16} color="gray" />
                  <Text style={styles.postStatText}>{post.comments}</Text>
                </View>
                <View style={styles.postStat}>
                  <AntDesign name="like2" size={16} color="gray" />
                  <Text style={styles.postStatText}>{post.likes}</Text>
                </View>
                <View style={styles.postStat}>
                  <Ionicons name="share-social-outline" size={16} color="gray" />
                  <Text style={styles.postStatText}>{post.shares}</Text>
                </View>
              </View>
            </View>
          </View>
        }
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
    marginVertical: 55, // Decrease this value to move the avatar lower
  },
  topAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  topName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postHeader: {
    flexDirection: 'row',
    margin: 20,
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
  postHeaderText: {
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
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStatText: {
    marginLeft: 5,
    color: 'gray',
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 20, // Decrease width
    paddingVertical: 20, // Increase height
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    marginBottom: 10,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentTime: {
    marginRight: 10,
    color: 'gray',
  },
  commentLikes: {
    marginRight: 5,
    color: 'gray',
  },
  commentReplies: {
    color: 'gray',
    marginTop: 5,
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
    paddingTop: 10, // Adjust this value to move the posts higher or lower
  },
});

export default PostDetailPage;