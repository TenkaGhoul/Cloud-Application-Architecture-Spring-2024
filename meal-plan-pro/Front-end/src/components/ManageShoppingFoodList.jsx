import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageShoppingFoodList = () => {
    const [shoppingLists, setShoppingLists] = useState([]);

    useEffect(() => {
        fetchShoppingLists();
    }, []);

    const fetchShoppingLists = async () => {
        try {
            const response = await axios.get('http://localhost:5000/shopping-list');
            setShoppingLists(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des listes de courses :', error);
        }
    };

    const handleDeleteList = async (listId) => {
        try {
            await axios.delete(`http://localhost:5000/shopping-list/${listId}`);
            // Rafraîchir la liste après suppression
            fetchShoppingLists();
        } catch (error) {
            console.error('Erreur lors de la suppression de la liste de courses :', error);
        }
    };

    return (
        <div>
            <h1>Listes de courses</h1>
            <ul>
                {shoppingLists.map(list => (
                    <li key={list._id}>
                        <h3>{list.listTitle}</h3>
                        <button onClick={() => handleDeleteList(list._id)}>Supprimer</button>
                        <ul>
                            {list.items.map(item => (
                                <li key={`${list._id}-${item.name}`}>
                                    <p>Nom: {item.name}</p>
                                    <p>Quantité: {item.quantity}</p>
                                    <p>Catégorie: {item.category}</p>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageShoppingFoodList;
