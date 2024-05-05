const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const url = 'mongodb://localhost:27017';
const dbName = 'MealPlanPro';

async function connectDatabase(collectionName) {
    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connection to the database successful");
        const db = client.db(dbName);
        const collections = await db.collections();
        const collectionExists = collections.some(col => col.collectionName === collectionName);
        if (!collectionExists) {
            await db.createCollection(collectionName);
            console.log(`Collection ${collectionName} created successfully`);
        }
        return db.collection(collectionName);
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.send('Welcome to your backend server!');
});

app.get('/recipe-list', async (req, res) => {
    try {
        const collection = await connectDatabase('recipe-list');
        const recipes = await collection.find({}).toArray();
        res.json(recipes);
    } catch (err) {
        console.error('Error retrieving recipes:', err);
        res.status(500).send('Error retrieving recipes.');
    }
});

app.get('/shopping-list', async (req, res) => {
    try {
        const collection = await connectDatabase('shopping-list');
        const shoppingLists = await collection.find({}).toArray();
        res.json(shoppingLists);
    } catch (err) {
        console.error('Error retrieving shopping lists:', err);
        res.status(500).send('Error retrieving shopping lists.');
    }
});

app.get('/events-saved', async (req, res) => {
    try {
        const collection = await connectDatabase('events-saved');
        const events = await collection.find({}).toArray();
        res.json(events);
    } catch (err) {
        console.error('Error retrieving saved events:', err);
        res.status(500).send('Error retrieving saved events.');
    }
});

app.post('/recipe-list', async (req, res) => {
    const data = req.body;

    try {
        const collection = await connectDatabase('recipe-list');
        await collection.insertOne(data);
        console.log('Recipe saved in MongoDB');
        res.status(200).send('Recipe saved successfully.');
    } catch (err) {
        console.error('Error saving recipe:', err);
        res.status(500).send('Error saving recipe.');
    }
});

app.post('/shopping-list', async (req, res) => {
    const data = req.body;

    try {
        const collection = await connectDatabase('shopping-list');
        await collection.insertOne(data);
        console.log('Shopping list saved in MongoDB');
        res.status(200).send('Shopping list saved successfully.');
    } catch (err) {
        console.error('Error saving shopping list:', err);
        res.status(500).send('Error saving shopping list.');
    }
});

app.post('/events-saved', async (req, res) => {
    const eventData = req.body;

    try {
        const collection = await connectDatabase('events-saved');
        await collection.insertOne(eventData);
        console.log('Event saved in MongoDB');
        res.status(200).send('Event saved successfully.');
    } catch (err) {
        console.error('Error saving event:', err);
        res.status(500).send('Error saving event.');
    }
});

app.delete('/recipe-list/:id', async (req, res) => {
    const recipeId = req.params.id;

    try {
        const collection = await connectDatabase('recipe-list');
        const result = await collection.deleteOne({ _id: new ObjectId(recipeId) });
        if (result.deletedCount === 1) {
            console.log('Recipe deleted successfully');
            res.status(200).send('Recipe deleted successfully.');
        } else {
            console.error('Recipe with provided ID not found');
            res.status(404).send('Recipe with provided ID not found.');
        }
    } catch (err) {
        console.error('Error deleting recipe:', err);
        res.status(500).send('Error deleting recipe.');
    }
});

// Add this delete route
app.delete('/shopping-list/:id', async (req, res) => {
    const listId = req.params.id;

    try {
        const collection = await connectDatabase('shopping-list');
        const result = await collection.deleteOne({ _id: new ObjectId(listId) });
        if (result.deletedCount === 1) {
            console.log('Shopping list deleted successfully');
            res.status(200).send('Shopping list deleted successfully.');
        } else {
            console.error('Shopping list with provided ID not found');
            res.status(404).send('Shopping list with provided ID not found.');
        }
    } catch (err) {
        console.error('Error deleting shopping list:', err);
        res.status(500).send('Error deleting shopping list.');
    }
});

app.delete('/events-saved/:id', async (req, res) => {
    const eventId = req.params.id;

    try {
        const collection = await connectDatabase('events-saved');
        const result = await collection.deleteOne({ _id: new ObjectId(eventId) });
        if (result.deletedCount === 1) {
            console.log('Event deleted successfully');
            res.status(200).send('Event deleted successfully.');
        } else {
            console.error('Event with provided ID not found');
            res.status(404).send('Event with provided ID not found.');
        }
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).send('Error deleting event.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
