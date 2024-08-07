import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, Image, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import axios from 'axios';


interface User {
    userId: string;
    username: string;
}

interface Comment {
    id: string;
    userId: string;
    text: string;
    likes: number;
    liked: boolean;
    replies: number;
    avatar: any;
}

export default function PostDetailPage({ navigation, route }: { navigation: any, route: any }) {
    const postId = route.params?.postId;

    const generateUniqueId = (): string => {
        return (
            new Date().getTime().toString(36) +
            Math.random().toString(36).slice(2)
        );
    };

    const [postLikes, setPostLikes] = useState(15);
    const [postLiked, setPostLiked] = useState(false);
    const [comments, setComments] = useState<Comment[]>([
        { id: generateUniqueId(), userId: 'kiero_d', text: "Can't wait for the new album! Jay never disappoints!", likes: 12, liked: false, replies: 3, avatar: require('../assets/avatar1.png') },
        { id: generateUniqueId(), userId: 'karennne', text: "The Best News of the Year! Can't wait to hear your new tracks, Jay! 🎶❤️", likes: 15, liked: false, replies: 4, avatar: require('../assets/avatar2.png') }
    ]); // Keep the hardcoded comments
    const [inputText, setInputText] = useState('');
    const [user, setUser] = useState<User | null>(null);

    // fetch the userid and post
    useEffect(() => {
        fetchUserId();
    }, []);
    
    // fetch the comments made by the specific userId
    useEffect(() => {
        if(user) {
            fetchPost();
            fetchComments(user.userId);
        }
    }, [user]);

    const fetchUserId = async () => {
        try {
            const response = await axios.get('http://localhost:5002/user/dummy');
            setUser({ ...response.data});
            console.log('userId:', response.data.userId);
            console.log('username:', response.data.username);
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }
    };
    
    const fetchPost = async () => {
        // run this once when start the expo app.
        // you can also run it on ternimal:
        // curl http://localhost:5002/reset-likes
        // curl http://localhost:5002/initialize-post

        // await axios.get('http://localhost:5002/reset-likes');
        // await axios.get('http://localhost:5002/initialize-post');
        try {
            const response = await axios.get('http://localhost:5002/posts/JayChou');
            setPostLikes(response.data.likes);
            setPostLiked(response.data.likedBy.includes(user?.userId)); // Update liked status based on response
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };
    
    const fetchComments = async (userId: string) => {
        try {
            const response = await axios.get(`http://localhost:5002/comments/${userId}`);
            console.log('response:', response.data);
            const fetchedComments = response.data.map((comment: any) => ({
                id: comment._id,
                userId: comment.userId,
                text: comment.text,
                likes: comment.likes || 0,
                liked: comment.likedBy.includes(userId), // Update liked status based on response
                replies: comment.replies || 0,
                avatar: getAvatarForUserId(comment.userId)
            }));
            console.log('fetched comments:', fetchedComments);
            setComments((prevComments) => [
                ...prevComments.filter(c => !fetchedComments.some((fc:any) => fc.id === c.id)), // Prevent duplicates
                ...fetchedComments
            ]);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    
    

    const getAvatarForUserId = (userId: string) => {
        switch (userId) {
            case 'kiero_d':
                return require('../assets/avatar1.png');
            case 'karennne':
                return require('../assets/avatar2.png');
            case 'jacob_w':
                return require('../assets/avatar3.png');
            default:
                return require('../assets/avatar3.png');
        }
    };

    const handleAddComment = useCallback(async () => {
        if (inputText.trim() && user) {
            try {
                console.log('Adding new comment:', {
                    userId: user.userId,
                    username: user.username,
                    text: inputText
                });
                const response = await axios.post('http://localhost:5002/comments', {
                    userId: user.userId,
                    username: user.username,
                    text: inputText
                });
    
                const newComment: Comment = {
                    id: response.data._id,
                    userId: user.userId,
                    text: inputText,
                    avatar: getAvatarForUserId(user.userId),
                    likes: 0,
                    liked: false,
                    replies: 0
                };
    
                console.log('New comment added:', newComment);
                setComments((prevComments) => [...prevComments, newComment]);
                setInputText('');
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    }, [inputText, user]);    

    const handleLikePost = useCallback(async () => {
        if (!user) return;
        try {
            const response = await axios.patch('http://localhost:5002/posts/JayChou', { userId: user.userId });
            setPostLikes(response.data.likes);
            setPostLiked(response.data.likedBy.includes(user.userId)); // Update liked status based on response
        } catch (error) {
            console.error('Error liking post:', error);
        }
    }, [postLiked, postLikes, user]);    
    
  
    const handleLikeComment = useCallback(async (commentId: string) => {
        if (!user) return; // Ensure user is available
        try {
            const response = await axios.patch(`http://localhost:5002/comments/${commentId}`, { userId: user.userId });
            const updatedComment = response.data;
            setComments(prevComments => prevComments.map(comment =>
                comment.id === commentId ? {
                    ...comment,
                    likes: updatedComment.likes,
                    liked: updatedComment.likedBy.includes(user.userId)
                } : comment
            ));
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    }, [user]);      

    const handleDeleteComments = async () => {
        try {
            // Fetch all comments first
            const response = await axios.get('http://localhost:5002/comments');
            const allComments = response.data;
    
            // Filter out comments made by 'jacob_w'
            const commentsByJacobW = allComments.filter((comment:any) => comment.userId === 'jacob_w');
    
            // Delete each comment made by 'jacob_w'
            await Promise.all(commentsByJacobW.map((comment:any) => axios.delete(`http://localhost:5002/comments/${comment._id}`)));
    
            // Remove comments from the state
            setComments(comments.filter(comment => comment.userId !== 'jacob_w'));
        } catch (error) {
            console.error('Error deleting comments:', error);
        }
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('FanClubOverviewPage')}>
                    <AntDesign name="left" size={16} color="black" />
                </TouchableOpacity>
                <Image source={require('../assets/jay-chou.jpg')} style={styles.topAvatar} />
            </View>

            <View style={styles.postContainer}>
                <View style={styles.postHeader}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={require('../assets/jay-chou.jpg')}
                            style={styles.avatar}
                        />
                        <Image
                            source={require('../assets/verified.jpg')}
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
                keyExtractor={(item) => `comment-${item.id}`}
                renderItem={({ item, index }) => {
                    const isFirstJacobWComment = item.userId === 'jacob_w' && comments.findIndex(comment => comment.userId === 'jacob_w') === index;

                    return (
                        <View style={styles.commentContainer}>
                            <Image
                                source={item.avatar}
                                style={styles.avatar}
                            />
                            <View style={styles.commentContent}>
                                <Text style={styles.commentUsername}>{item.userId}</Text>
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
                                    {isFirstJacobWComment && (
                                        <TouchableOpacity onPress={handleDeleteComments} style={styles.iconText}>
                                            <Text style={styles.deleteText}>Delete All</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    );
                }}
                ListEmptyComponent={<Text style={styles.noComments}>No comments yet.</Text>}
            />

        </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Post your comment"
                    value={inputText}
                    onChangeText={setInputText}
                />
                <Button title="Reply" onPress={handleAddComment} />
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
        marginTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    topAvatar: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginBottom: 10,
        position: 'absolute',
        left: '50%',
      },
    postContainer: {
        backgroundColor: '#DCD6E4',
        padding: 16,
        // borderBottomWidth: 1,
        // borderBottomColor: '#ddd',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        // height: 1,
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
        // borderBottomWidth: 1,
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
        // borderWidth: 1,
        marginRight: 8,
        paddingHorizontal: 8,
        // borderRadius: 20,
    },
    bottomNavigation: {
        flexDirection: 'row',
        height: 80,
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
    deleteText: {
        marginLeft: 16,
        color: 'red',
        fontWeight: 'bold'
    },
});