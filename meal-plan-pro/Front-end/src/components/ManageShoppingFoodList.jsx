import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDrumstickBite, faFish, faAppleAlt, faCarrot, faCheese, faShoppingBag, faLeaf, faSnowflake, faBoxes, faWineBottle, faCandyCane } from '@fortawesome/free-solid-svg-icons';
import "./ManageShoppingFoodList.css";

const ManageShoppingFoodList = () => {
    const [shoppingLists, setShoppingLists] = useState([]);
    const [currentListIndex, setCurrentListIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchShoppingLists();
    }, []);

    const fetchShoppingLists = async () => {
        try {
            const response = await axios.get('http://localhost:5000/shopping-list');
            setShoppingLists(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching shopping lists:', error);
            setIsLoading(false);
        }
    };

    const handleDeleteList = async (listId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this shopping list?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/shopping-list/${listId}`);
                const updatedLists = shoppingLists.filter(list => list._id !== listId);
                setShoppingLists(updatedLists);

                // Adjust the current list index if the current list is deleted
                if (currentListIndex >= updatedLists.length) {
                    setCurrentListIndex(updatedLists.length - 1);
                }
            } catch (error) {
                console.error('Error deleting shopping list:', error);
            }
        }
    };

    const toggleDetails = () => {
        setShowDetails(prevState => !prevState);
    };

    const nextList = () => {
        setCurrentListIndex(prevIndex => prevIndex + 1);
        setShowDetails(false); // Reset showDetails when changing the list
    };

    const previousList = () => {
        setCurrentListIndex(prevIndex => prevIndex - 1);
        setShowDetails(false); // Reset showDetails when changing the list
    };

    const toggleExpandList = () => {
        setShowDetails(prevState => !prevState);
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Meat':
                return faDrumstickBite;
            case 'Fish and Seafood':
                return faFish;
            case 'Fruits':
                return faAppleAlt;
            case 'Vegetables':
                return faCarrot;
            case 'Dairy Products':
                return faCheese;
            case 'Dry Goods':
                return faShoppingBag;
            case 'Fresh Products':
                return faLeaf;
            case 'Frozen Foods':
                return faSnowflake;
            case 'Grocery':
                return faBoxes;
            case 'Beverages':
                return faWineBottle;
            case 'Snacks':
                return faCandyCane;
            default:
                return null;
        }
    };

    return (
        <div className="ms-body">
            <div className="ms-background"></div>
            <h1 className="ms-title">Shopping Lists</h1>
            <div className="ms-section">
                {isLoading ? (
                    <p>Loading...</p>
                ) : shoppingLists.length === 0 ? (
                    <div className="ms-list">
                        <p className="ms-empty-message">No shopping lists found. Create your own shopping lists!</p>
                    </div>
                ) : (
                    <div className="ms-list">
                        <h3 className="ms-list-title">{shoppingLists[currentListIndex].listTitle}</h3>
                        <ul className="ms-items">
                            {shoppingLists[currentListIndex].items.slice(0, 4).map((item, itemIndex) => (
                                <li key={`${shoppingLists[currentListIndex]._id}-${itemIndex}`} className="ms-item">
                                    <div className="ms-item-info">
                                        <div className="ms-item-icon">
                                            {getCategoryIcon(item.category) &&
                                                <FontAwesomeIcon icon={getCategoryIcon(item.category)} />}
                                        </div>
                                        <div className="ms-item-details">
                                            <p className="ms-item-name">{item.name}</p>
                                            <p className="ms-item-quantity">Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {showDetails && shoppingLists[currentListIndex].items.length > 4 && (
                                shoppingLists[currentListIndex].items.slice(4).map((item, itemIndex) => (
                                    <li key={`${shoppingLists[currentListIndex]._id}-${itemIndex}`} className="ms-item">
                                        <div className="ms-item-info">
                                            <div className="ms-item-icon">
                                                {getCategoryIcon(item.category) &&
                                                    <FontAwesomeIcon icon={getCategoryIcon(item.category)} />}
                                            </div>
                                            <div className="ms-item-details">
                                                <p className="ms-item-name">{item.name}</p>
                                                <p className="ms-item-quantity">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                        {shoppingLists[currentListIndex].items.length > 4 && (
                            <button className="custom-btn ms-show-more-btn" onClick={toggleExpandList}>
                                {showDetails ? 'Show Less Details' : 'Show More Details'}
                            </button>
                        )}
                        <button className="custom-btn ms-remove-btn" onClick={() => handleDeleteList(shoppingLists[currentListIndex]._id)}>Delete</button>
                        <div>
                            <button className="custom-btn ms-previous-btn" disabled={currentListIndex === 0} onClick={previousList}>
                                &#8592; Previous List
                            </button>
                            <button className="custom-btn ms-next-btn" disabled={currentListIndex === shoppingLists.length - 1} onClick={nextList}>
                                Next List &#8594;
                            </button>
                        </div>
                        <p>List {currentListIndex + 1} of {shoppingLists.length}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageShoppingFoodList;
