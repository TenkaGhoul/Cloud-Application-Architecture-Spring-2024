import React from 'react';
import {useLocation, Link} from 'react-router-dom';

function ShoppingFoodList() {
    useLocation();
    return (
        <div className="ShoppingFoodList">
            <h1>MealPlanPro</h1>
            <div className="Links">
                <div><Link to="/shopping-food-list/create"> Create a new shopping food list </Link></div>
                <div><Link to="/shopping-food-list/manage"> Manage a shopping food list </Link></div>
            </div>
        </div>
    )
}

export default ShoppingFoodList;