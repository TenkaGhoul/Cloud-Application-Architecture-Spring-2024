import React from 'react';
import {useLocation, Link} from 'react-router-dom';
import "./RecipeMealList.css"

function RecipeMealList() {
    useLocation();
    return (
        <div className="RecipeMealList">
            <div className="rm-background"></div>
            <h1 className="rm-title">MealPlanPro</h1>
            <div className="rm-btn">
                <Link to="/recipe-meal-list/create"> <button className="rm-btn-create">Create a new recipe </button> </Link>
                <Link to="/recipe-meal-list/manage"> <button className="rm-btn-manage"> Manage a recipe </button> </Link>
            </div>
        </div>
    )
}

export default RecipeMealList;