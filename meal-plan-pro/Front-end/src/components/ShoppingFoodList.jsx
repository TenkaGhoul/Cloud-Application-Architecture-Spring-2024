import React from 'react';
import {useLocation, Link} from 'react-router-dom';
import "./ShoppingFoodList.css"

function ShoppingFoodList() {
    useLocation();
    return (
        <div className="sh-body">
            <div className="sh-background"></div>
            <h1 className="sh-title">MealPlanPro</h1>
            <div className="sh-btn">
                <Link to="/shopping-food-list/create"> <button className="sh-btn-create"> Create a new shopping food list </button> </Link>
                <Link to="/shopping-food-list/manage"> <button className="sh-btn-manage"> Manage a shopping food list </button> </Link>
            </div>
        </div>
    )
}

export default ShoppingFoodList;