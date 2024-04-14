import React from 'react';
import {useLocation, Link} from 'react-router-dom';

function RecipeMealList() {
    useLocation();
    return (
        <div className="RecipeMealList">
            <h1>MealPlanPro</h1>
            <div className="Links">
                <div><Link to="/recipe-meal-list/create"> Create a new recipe meal list </Link></div>
                <div><Link to="/recipe-meal-list/manage"> Manage a recipe meal list </Link></div>
            </div>
        </div>
    )
}

export default RecipeMealList;