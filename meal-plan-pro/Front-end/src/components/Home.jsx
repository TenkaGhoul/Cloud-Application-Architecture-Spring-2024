import React from 'react';
import { Link } from 'react-router-dom';
import "./Home.css"
function Home() {

    return (
        <div className="h-body">
            <div className="h-background"></div>
            <h1 className="h-title">MealPlanPro</h1>
            <div className="h-btn">
                <Link to="/shopping-food-list"> <button className="h-btn-shopping">Shopping Food List</button></Link>
                <Link to="/recipe-meal-list"> <button className="h-btn-recipe">Recipe Meal List </button> </Link>
                <Link to="/calendar"> <button className="h-btn-calendar"> Calendar </button> </Link>
            </div>
        </div>
    );
}

export default Home;
