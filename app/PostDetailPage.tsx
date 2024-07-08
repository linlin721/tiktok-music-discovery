import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, Image, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons'; // Import Feather for icons

export default function PostDetailPage({ navigation }) {
    const [postLikes, setPostLikes] = useState(15);
    const [postLiked, setPostLiked] = useState(false);
    const [comments, setComments] = useState([
        { id: '1', username: 'kiero_d', text: "Can't wait for the new album! Jay never disappoints!", likes: 12, liked: false, replies: 3 },
        { id: '2', username: 'karennne', text: "The Best News of the Year! Can't wait to hear your new tracks, Jay! 🎶❤️", likes: 15, liked: false, replies: 4 }
    ]);
    const [inputText, setInputText] = useState('');

    const handleAddComment = () => {
        if (inputText.trim()) {
            setComments([...comments, { id: (comments.length + 1).toString(), username: 'Jacob West', text: inputText, likes: 0, liked: false, replies: 0 }]);
            setInputText('');
        }
    };

    const handleLikePost = () => {
        setPostLiked(!postLiked);
        setPostLikes(postLiked ? postLikes - 1 : postLikes + 1);
    };

    const handleLikeComment = (id: string) => {
        setComments(comments.map(comment => {
            if (comment.id === id) {
                const updatedComment = { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 };
                return updatedComment;
            }
            return comment;
        }));
    };

    const getAvatarSource = (index: number) => {
      return index % 3 === 0
          ? require('../assets/avatar1.png') // If index is divisible by 3
          : index % 3 === 1
          ? require('../assets/avatar2.png') // If the remainder is 1
          : require('../assets/avatar3.png'); // Otherwise
  };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Post Detail</Text>
            </View>

            <View style={styles.postContainer}>
                <View style={styles.postHeader}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={require('../assets/jay-chou.jpg')} // Update the path to your avatar
                            style={styles.avatar}
                        />
                        <Image
                            source={require('../assets/verified.jpg')} // Update the path to your verified icon
                            style={styles.verifiedIcon}
                        />
                    </View>
                    <View>
                        <Text style={styles.username}>Jay Chou</Text>
                    </View>
                </View>
                <Text style={styles.postContent}>Hi everyone! I am excited to announce that my new album is coming next month! #JayChouNewAlbum</Text>
                <Text style={styles.postTimestamp}>06:28PM · 6/25/24 </Text>
                <View style={styles.postStats}>
                    <TouchableOpacity onPress={handleLikePost} style={styles.iconText}>
                        <AntDesign name="hearto" size={16} color={postLiked ? 'red' : 'gray'} />
                        <Text style={styles.iconTextLabel}>{postLikes}</Text>
                    </TouchableOpacity>
                    <View style={styles.iconText}>
                        <Feather name="share" size={16} color="gray" />
                        <Text style={styles.iconTextLabel}>6</Text>
                    </View>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.commentsSection}>
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <View style={styles.commentContainer}>
                            <Image
                                source={getAvatarSource(index)}
                                style={styles.avatar}
                            />
                            <View style={styles.commentContent}>
                                <Text style={styles.commentUsername}>{item.username}</Text>
                                <Text style={styles.comment}>{item.text}</Text>
                                <View style={styles.commentStats}>
                                    <TouchableOpacity onPress={() => handleLikeComment(item.id)} style={styles.iconText}>
                                        <AntDesign name="hearto" size={14} color={item.liked ? 'red' : 'gray'} />
                                        <Text style={styles.iconTextLabel}>{item.likes}</Text>
                                    </TouchableOpacity>
                                    <View style={styles.iconText}>
                                        <Feather name="message-square" size={14} color="gray" />
                                        <Text style={styles.iconTextLabel}>{item.replies}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.noComments}>No comments yet.</Text>}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Tweet your reply"
                    value={inputText}
                    onChangeText={setInputText}
                />
                <Button title="Reply" onPress={handleAddComment} />
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    postContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    verifiedIcon: {
      width: 16,
      height: 16,
      position: 'absolute',
      right: 0,
      bottom: 0,
  },
    username: {
        fontWeight: 'bold',
    },
    userHandle: {
        color: 'gray',
    },
    postContent: {
        fontSize: 16,
        marginBottom: 8,
    },
    postTimestamp: {
        color: 'gray',
        marginBottom: 8,
    },
    postStats: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
    },
    iconTextLabel: {
        marginLeft: 4,
        color: 'gray',
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 8,
    },
    commentsSection: {
        flex: 1,
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    commentContent: {
        flex: 1,
    },
    commentUsername: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    comment: {
        fontSize: 14,
    },
    commentStats: {
        flexDirection: 'row',
        marginTop: 4,
    },
    noComments: {
        textAlign: 'center',
        marginTop: 16,
        color: 'gray',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginRight: 8,
      paddingHorizontal: 8,
      borderRadius: 20,
  },
  bottomNavigation: {
      flexDirection: 'row',
      height: 80, // Increased height for the navigation bar
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      justifyContent: 'space-around',
      alignItems: 'center',
  },
  navItem: {
      alignItems: 'center',
  },
  bottomButtonText: {
      fontSize: 12,
      color: 'gray',
  },
});