const mongoose = require('mongoose');
require('dotenv').config();

const express = require('express');
const User = require('./models/User');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));



// GET all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new user
app.post('/users', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update a user by ID
app.put('/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE remove a user by ID
app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));