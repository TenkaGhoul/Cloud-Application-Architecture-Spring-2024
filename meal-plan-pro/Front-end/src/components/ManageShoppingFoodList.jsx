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
            console.error('Error fetching shopping lists:', error);
        }
    };

    const handleDeleteList = async (listId) => {
        try {
            await axios.delete(`http://localhost:5000/shopping-list/${listId}`);
            // Refresh the list after deletion
            fetchShoppingLists();
        } catch (error) {
            console.error('Error deleting shopping list:', error);
        }
    };

    return (
        <div>
            <h1>Shopping Lists</h1>
            <ul>
                {shoppingLists.map(list => (
                    <li key={list._id}>
                        <h3>{list.listTitle}</h3>
                        <button onClick={() => handleDeleteList(list._id)}>Delete</button>
                        <ul>
                            {list.items.map(item => (
                                <li key={`${list._id}-${item.name}`}>
                                    <p>Name: {item.name}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Category: {item.category}</p>
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
