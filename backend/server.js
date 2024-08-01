require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import the path module
const { stringify } = require('querystring');
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tiktokCommunity', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const musicSchema = new mongoose.Schema({
    title: String,
    artist: String,
    style: String,
    audio_url: String,
    createdAt: { type: Date, default: Date.now }
});

const userFavoritesSchema = new mongoose.Schema({
    userId: String,
    music: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Music' }]
});

const userSchema = new mongoose.Schema({
    username: String,
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    _id: String,
    content: String,
    likes: { type: Number, default: 0 },
    liked: { type: Boolean, default: false },
    likedBy: { type: [String], default: [] },
    timestamp: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
    userId: String,
    username: String,
    text: String,
    likes: { type: Number, default: 0 },
    // liked: { type: Boolean, default: false },
    likedBy: { type: [String], default: [] },
    replies: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Create MongoDB Models
const Music = mongoose.model('Music', musicSchema);
const UserFavorites = mongoose.model('UserFavorites', userFavoritesSchema);
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Create a dummy user if not exist and return userId
app.get('/user/dummy', async (req, res) => {
    res.json({ userId: 'jacob_w', username: 'Jacob West' });
});

// Setup the routes for add BGM Operations
app.post('/music', async (req, res) => {
    const { title, artist, style, audio_url } = req.body;
    const newMusic = new Music({ title, artist, style, audio_url });
    await newMusic.save();
    res.json(newMusic);
});

// Update the /music/favorites route to prevent duplicates
app.post('/music/favorites', async (req, res) => {
    const { userId, musicId } = req.body;
    let userFavorites = await UserFavorites.findOne({ userId });
    if (!userFavorites) {
        userFavorites = new UserFavorites({ userId, music: [musicId] });
    } else if (!userFavorites.music.includes(musicId)) {
        userFavorites.music.push(musicId);
    }
    await userFavorites.save();
    res.json(userFavorites);
});


app.get('/music/favorites/:userId', async (req, res) => {
    const { userId } = req.params;
    const userFavorites = await UserFavorites.findOne({ userId }).populate('music');
    res.json(userFavorites ? userFavorites.music : []);
});

// Comment routes
app.post('/comments', async (req, res) => {
    const { userId, username, text } = req.body;
    console.log(`Received new comment: userId=${userId}, username=${username}, text=${text}`);
    const newComment = new Comment({ userId, username, text });
    await newComment.save();
    console.log(`Comment saved: ${newComment}`);
    res.status(201).send(newComment);
});

app.get('/comments', async (req, res) => { // Route to fetch all comments
    const comments = await Comment.find();
    console.log(`Fetched all comments: ${comments}`);
    res.status(200).send(comments);
});

// route to fetch comments by userId
app.get('/comments/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(`Fetching comments for userId=${userId}`);
    try {
        const comments = await Comment.find({ userId });
        console.log(`Fetched comments for userId=${userId}:`, comments);
        res.status(200).send(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).send({ error: 'Error fetching comments' });
    }
});

//Route to delete all comments
app.delete('/comments', async (req, res) => {
    try {
        await Comment.deleteMany({});
        res.status(200).send({ message: 'All comments deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting comments', error });
    }
});

// Delete a comment by ID
app.delete('/comments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Comment.findByIdAndDelete(id);
        res.status(200).send({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting comment', error });
    }
});


// Initialize the hardcoded post
app.get('/initialize-post', async (req, res) => {
    try {
        const post = await Post.findById('JayChou');
        if (!post) {
            const newPost = new Post({
                _id: 'JayChou',
                content: 'Hi everyone! I am excited to announce that my new album is coming next month! #JayChouNewAlbum',
                likes: 15,
                // liked: false,
                likedBy: [],
                timestamp: new Date('2024-06-25T18:28:00')
            });
            await newPost.save();
            return res.status(201).send(newPost);
        }
        res.status(200).send(post);
    } catch (error) {
        console.error('Error initializing post:', error);
        res.status(500).send({ error: 'Error initializing post' });
    }
});

// route to reset likes
app.get('/reset-likes', async (req, res) => {
    try {
        const post = await Post.findById('JayChou');
        if (post) {
            post.likes = 0;
            // post.liked = false;
            post.likedBy = []; // Clear the likedBy array
            await post.save();
            return res.status(200).send(post);
        }
        res.status(404).send({ error: 'Post not found' });
    } catch (error) {
        console.error('Error resetting likes:', error);
        res.status(500).send({ error: 'Error resetting likes' });
    }
});


// Fetch the hardcoded post
app.get('/posts/JayChou', async (req, res) => {
    try {
        const post = await Post.findById('JayChou');
        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }
        res.status(200).send(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send({ error: 'Error fetching post' });
    }
});

// Update likes for the hardcoded post
app.patch('/posts/JayChou', async (req, res) => {
    const { userId } = req.body;
    try {
        const post = await Post.findById('JayChou');
        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }
        if (post.likedBy.includes(userId)) {
            // If the user has already liked the post, remove their like
            post.likes -= 1;
            post.likedBy = post.likedBy.filter(id => id !== userId);
        } else {
            // If the user has not liked the post, add their like
            post.likes += 1;
            post.likedBy.push(userId);
        }
        await post.save();
        res.status(200).send(post);
    } catch (error) {
        console.error('Error updating likes for post:', error);
        res.status(500).send({ error: 'Error updating likes for post' });
    }
});

// route for like a comment
app.patch('/comments/:commentId', async (req, res) => {
    const { userId } = req.body;
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }
        if (comment.likedBy.includes(userId)) {
            // If the user has already liked the comment, remove their like
            comment.likes -= 1;
            comment.likedBy = comment.likedBy.filter(id => id !== userId);
        } else {
            // If the user has not liked the comment, add their like
            comment.likes += 1;
            comment.likedBy.push(userId);
        }
        await comment.save();
        res.status(200).send(comment);
    } catch (error) {
        console.error('Error updating likes for comment:', error);
        res.status(500).send({ error: 'Error updating likes for comment' });
    }
});



// Basic Routes for Testing
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
