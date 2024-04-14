import React, { useState } from 'react';
import axios from 'axios';

function CreateShoppingList() {
    const [listTitle, setListTitle] = useState('');
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState(1);
    const [itemCategory, setItemCategory] = useState('');

    const categories = [
        "Meat",
        "Fish and Seafood",
        "Fruits",
        "Vegetables",
        "Dairy Products",
        "Dry Goods",
        "Fresh Products",
        "Frozen Foods",
        "Grocery",
        "Beverages",
        "Snacks"
    ];

    const addItemToList = () => {
        if (itemName && /^[a-zA-Z\s]+$/.test(itemName) && itemQuantity > 0 && itemCategory && categories.includes(itemCategory)) {
            const newItem = { name: itemName, quantity: itemQuantity, category: itemCategory };
            setItems([...items, newItem]);
            setItemName('');
            setItemQuantity(1);
            setItemCategory('');
        } else {
            alert('Please fill in all fields correctly!');
        }
    };

    const removeItemFromList = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const saveList = () => {
        // Prepare data to send
        const data = {
            listTitle: listTitle,
            items: items
        };

        // Send data to the server
        axios.post('http://localhost:5000/shopping-list', data)
            .then(response => {
                console.log(response.data);
                alert('Shopping list saved successfully!');
            })
            .catch(error => {
                console.error('Error saving shopping list: ', error);
                alert('Error saving shopping list.');
            });
    };

    return (
        <div>
            <h1>Create a Shopping List</h1>
            <label>
                List Title:
                <input
                    type="text"
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                />
            </label>
            <br />
            <label>
                Product Name:
                <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />
            </label>
            <br />
            <label>
                Quantity:
                <select
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(parseInt(e.target.value))}
                >
                    {[...Array(9).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>{num + 1}</option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                Category:
                <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>
            </label>
            <br />
            <button onClick={addItemToList}>Add to List</button>

            <h2>Shopping List - {listTitle}</h2>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        {item.name} - {item.quantity} - {item.category}
                        <button onClick={() => removeItemFromList(index)}>Remove</button>
                    </li>
                ))}
            </ul>

            <button onClick={saveList}>Save Shopping List</button>
        </div>
    );
}

export default CreateShoppingList;
