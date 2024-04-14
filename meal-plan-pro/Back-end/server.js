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
        console.log("Connexion à la base de données réussie");
        const db = client.db(dbName);
        const collections = await db.collections();
        const collectionExists = collections.some(col => col.collectionName === collectionName);
        if (!collectionExists) {
            await db.createCollection(collectionName);
            console.log(`Collection ${collectionName} créée avec succès`);
        }
        return db.collection(collectionName);
    } catch (error) {
        console.error('Erreur lors de la connexion à la base de données :', error);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.send('Bienvenue sur votre serveur back-end !');
});

app.get('/recipe-list', async (req, res) => {
    try {
        const collection = await connectDatabase('recipe-list');
        const recipes = await collection.find({}).toArray();
        res.json(recipes);
    } catch (err) {
        console.error('Erreur lors de la récupération des recettes de cuisine :', err);
        res.status(500).send('Erreur lors de la récupération des recettes de cuisine.');
    }
});

app.get('/shopping-list', async (req, res) => {
    try {
        const collection = await connectDatabase('shopping-list');
        const shoppingLists = await collection.find({}).toArray();
        res.json(shoppingLists);
    } catch (err) {
        console.error('Erreur lors de la récupération des listes de courses :', err);
        res.status(500).send('Erreur lors de la récupération des listes de courses.');
    }
});

app.get('/events-saved', async (req, res) => {
    try {
        const collection = await connectDatabase('events-saved');
        const events = await collection.find({}).toArray();
        res.json(events);
    } catch (err) {
        console.error('Erreur lors de la récupération des événements sauvegardés :', err);
        res.status(500).send('Erreur lors de la récupération des événements sauvegardés.');
    }
});

app.post('/recipe-list', async (req, res) => {
    const data = req.body;

    try {
        const collection = await connectDatabase('recipe-list');
        await collection.insertOne(data);
        console.log('Recette de cuisine sauvegardée dans MongoDB');
        res.status(200).send('Recette de cuisine sauvegardée avec succès.');
    } catch (err) {
        console.error('Erreur lors de la sauvegarde de la recette de cuisine :', err);
        res.status(500).send('Erreur lors de la sauvegarde de la recette de cuisine.');
    }
});

app.post('/shopping-list', async (req, res) => {
    const data = req.body;

    try {
        const collection = await connectDatabase('shopping-list');
        await collection.insertOne(data);
        console.log('Liste de courses sauvegardée dans MongoDB');
        res.status(200).send('Liste de courses sauvegardée avec succès.');
    } catch (err) {
        console.error('Erreur lors de la sauvegarde de la liste de courses :', err);
        res.status(500).send('Erreur lors de la sauvegarde de la liste de courses.');
    }
});

app.post('/events-saved', async (req, res) => {
    const eventData = req.body;

    try {
        const collection = await connectDatabase('events-saved');
        await collection.insertOne(eventData);
        console.log('Événement sauvegardé dans MongoDB');
        res.status(200).send('Événement sauvegardé avec succès.');
    } catch (err) {
        console.error('Erreur lors de la sauvegarde de l\'événement :', err);
        res.status(500).send('Erreur lors de la sauvegarde de l\'événement.');
    }
});

app.delete('/recipe-list/:id', async (req, res) => {
    const recipeId = req.params.id;

    try {
        const collection = await connectDatabase('recipe-list');
        const result = await collection.deleteOne({ _id: new ObjectId(recipeId) });
        if (result.deletedCount === 1) {
            console.log('Recette supprimée avec succès');
            res.status(200).send('Recette supprimée avec succès.');
        } else {
            console.error('La recette avec l\'identifiant fourni n\'a pas été trouvée');
            res.status(404).send('La recette avec l\'identifiant fourni n\'a pas été trouvée.');
        }
    } catch (err) {
        console.error('Erreur lors de la suppression de la recette :', err);
        res.status(500).send('Erreur lors de la suppression de la recette.');
    }
});
// Ajoutez cette route de suppression
app.delete('/shopping-list/:id', async (req, res) => {
    const listId = req.params.id;

    try {
        const collection = await connectDatabase('shopping-list');
        const result = await collection.deleteOne({ _id: new ObjectId(listId) });
        if (result.deletedCount === 1) {
            console.log('Liste de courses supprimée avec succès');
            res.status(200).send('Liste de courses supprimée avec succès.');
        } else {
            console.error('La liste de courses avec l\'identifiant fourni n\'a pas été trouvée');
            res.status(404).send('La liste de courses avec l\'identifiant fourni n\'a pas été trouvée.');
        }
    } catch (err) {
        console.error('Erreur lors de la suppression de la liste de courses :', err);
        res.status(500).send('Erreur lors de la suppression de la liste de courses.');
    }
});

app.delete('/events-saved/:id', async (req, res) => {
    const eventId = req.params.id;

    try {
        const collection = await connectDatabase('events-saved');
        const result = await collection.deleteOne({ _id: new ObjectId(eventId) });
        if (result.deletedCount === 1) {
            console.log('Événement supprimé avec succès');
            res.status(200).send('Événement supprimé avec succès.');
        } else {
            console.error('L\'événement avec l\'identifiant fourni n\'a pas été trouvé');
            res.status(404).send('L\'événement avec l\'identifiant fourni n\'a pas été trouvé.');
        }
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'événement :', err);
        res.status(500).send('Erreur lors de la suppression de l\'événement.');
    }
});

app.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});
