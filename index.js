const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./firebase-config');



const app = express();
app.use(cors()); // <== Add this
app.use(express.json());
app.use(express.static('public'));

const usersCollection = db.collection('users');

// CREATE
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const docRef = await usersCollection.add({ name, email });
    res.status(201).json({ id: docRef.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL
app.get('/users', async (req, res) => {
  try {
    const snapshot = await usersCollection.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
app.get('/users/:id', async (req, res) => {
  try {
    const doc = await usersCollection.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
// UPDATE
app.put('/users/:id', async (req, res) => {
  try {
    const userDoc = usersCollection.doc(req.params.id);
    const userSnapshot = await userDoc.get();

    if (!userSnapshot.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    await userDoc.update({ name, email });
    res.status(200).json({ message: 'User updated', id: req.params.id });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: err.message });
  }
});


// DELETE
app.delete('/users/:id', async (req, res) => {
  try {
    await usersCollection.doc(req.params.id).delete();
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
