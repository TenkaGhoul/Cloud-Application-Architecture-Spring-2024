import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageRecipeMealList() {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipeId, setSelectedRecipeId] = useState(null); // New state to store the ID of the selected recipe

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/recipe-list');
                setRecipes(response.data);
            } catch (error) {
                console.error('Error loading recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    const handleDeleteRecipe = async (recipeId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/recipe-list/${recipeId}`);
                const updatedRecipes = recipes.filter(recipe => recipe._id !== recipeId);
                setRecipes(updatedRecipes);
                console.log('Recipe deleted successfully.');
            } catch (error) {
                console.error('Error deleting recipe:', error);
            }
        }
    };

    const modifyRecipe = (recipeId) => {
        setSelectedRecipeId(recipeId); // Update the ID of the selected recipe when clicking "Modify"
    };

    return (
        <div>
            <h2>List of Recipes</h2>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe._id}>
                        <div>
                            <h3>{recipe.title}</h3>
                            <p>Preparation Time: {recipe.prepTime} minutes</p>
                            <p>Cooking Time: {recipe.cookTime} minutes</p>
                            <button onClick={() => handleDeleteRecipe(recipe._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ManageRecipeMealList;
