import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function Home() {
    const location = useLocation();

    return (
        <div className="Home">
            <h1>MealPlanPro</h1>
            <div className="Links">
                <div><Link to="/shopping-food-list">Shopping Food Lists</Link></div>
                <div><Link to="/recipe-meal-list">Recipe Meal Lists</Link></div>
                <div><Link to="/calendar">Calendar</Link></div>
            </div>
        </div>
    );
}

export default Home;
