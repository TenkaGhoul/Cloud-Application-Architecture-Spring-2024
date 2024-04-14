import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ListeCoursesPage from "./components/ListeCoursesPage";
import ListeRecettesPage from "./components/ListeRecettesPage";
import RecherchePlatsPage from "./components/RecherchePlatsPage";
import Home from "./components/Home"
import ShoppingFoodList from "./components/ShoppingFoodList";
import RecipeMealList from "./components/RecipeMealList";
import ManageRecipeMealList from "./components/ManageRecipeMealList";
import ManageShoppingFoodList from "./components/ManageShoppingFoodList";
import Calendar from "./components/Calendar";



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shopping-food-list" element={<ShoppingFoodList />} />
                <Route path="/recipe-meal-list" element={<RecipeMealList />} />
                <Route path="/shopping-food-list/create" element={<ListeCoursesPage />} />
                <Route path="/shopping-food-list/manage" element={<ManageShoppingFoodList />} />
                <Route path="/recipe-meal-list/create" element={<ListeRecettesPage />} />
                <Route path="/recipe-meal-list/manage" element={<ManageRecipeMealList />} />
                <Route path="/recherche-plats" element={<RecherchePlatsPage />} />
                <Route path="/calendar" element={<Calendar/>} />
            </Routes>
        </Router>
    );
}

export default App;
