const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// User schema and model
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// Registration Route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.send('<p>Registration successful. Redirecting to login page...</p><script>setTimeout(function() { window.location.href = "/"; }, 10000);</script>');
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        res.redirect('/welcome.html');
    } else {
        res.status(401).send('Invalid login'); // Send HTTP 401 status code for invalid login
    }
});

// Serve HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));
app.get('/welcome.html', (req, res) => res.sendFile(path.join(__dirname, 'welcome.html')));
app.get('/non-veg.html', (req, res) => res.sendFile(path.join(__dirname, 'non-veg.html')));
app.get('/veg.html', (req, res) => res.sendFile(path.join(__dirname, 'veg.html')));

// Handle logout
app.get('/logout', (req, res) => {
    // Clear session or handle logout logic if needed
    res.redirect('/');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
