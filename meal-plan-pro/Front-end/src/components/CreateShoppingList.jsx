import React, { useState } from 'react';
import axios from 'axios';
import "./CreateShoppingList.css"

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

    const handleListTitleChange = (e) => {
        const inputTitle = e.target.value;
        if (inputTitle.length <= 20) {
            setListTitle(inputTitle);
        } else {
            alert('List title must be 20 characters or less!');
        }
    };

    return (
        <div className="cs-body">
            <div className="cs-background"></div>
            <h1 className="cs-title">Create a Shopping List</h1>
            <div className="cs-section">
                <div className="cs-form">
                    <div className="form-group">
                        <label>List Title :</label>
                        <input type="text" value={listTitle} onChange={handleListTitleChange}/>
                    </div>
                    <div className="form-group">
                        <label>Product Name :</label>
                        <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label>Quantity :</label>
                        <select value={itemQuantity} onChange={(e) => setItemQuantity(parseInt(e.target.value))}>
                            {[...Array(9).keys()].map((num) => (
                                <option key={num + 1} value={num + 1}>{num + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Category :</label>
                        <select value={itemCategory} onChange={(e) => setItemCategory(e.target.value)}>
                            <option value="">Select a category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <button id="add-btn" onClick={addItemToList}>Add to List</button>
                </div>

                <div className="cs-shopping-list">
                    <h2 className="cs-shopping-list-title">{listTitle}</h2>
                    <ul>
                        {items.map((item, index) => (
                            <li key={index}>
                                {item.name} - {item.quantity} - {item.category}
                                <button id="remove-btn" onClick={() => removeItemFromList(index)}> X</button>
                            </li>
                        ))}
                    </ul>
                    <button id="save-btn" onClick={saveList}>Save Shopping List</button>
                </div>
            </div>
        </div>
    );
}

export default CreateShoppingList;