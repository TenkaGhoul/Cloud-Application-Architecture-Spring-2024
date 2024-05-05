import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./ManageRecipeMealList.css"

function ManageRecipeMealList() {
    const [recipes, setRecipes] = useState([]);
    const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [loading, setLoading] = useState(true); // New state for loading indicator

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/recipe-list');
                setRecipes(response.data);
                setLoading(false); // Set loading to false once data is fetched
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

                // Adjust the current recipe index if the current recipe is deleted
                if (currentRecipeIndex >= updatedRecipes.length) {
                    setCurrentRecipeIndex(updatedRecipes.length - 1);
                }
            } catch (error) {
                console.error('Error deleting recipe:', error);
            }
        }
    };

    const toggleDetails = () => {
        setShowDetails(prevState => !prevState);
    };

    const nextRecipe = () => {
        setCurrentRecipeIndex(prevIndex => prevIndex + 1);
    };

    const previousRecipe = () => {
        setCurrentRecipeIndex(prevIndex => prevIndex - 1);
    };

    return (
        <div className="mr-body">
            <div className="mr-background"></div>
            <h2 className="mr-title">List of Recipes</h2>
            <div className="mr-section">
                <div className="mr-list">
                    {loading ? ( // Show loading indicator while fetching data
                        <p>Loading...</p>
                    ) : recipes.length === 0 ? ( // If no recipes available, show message
                        <p className="mr-no-recipes">No recipes available. Create your own recipes!</p>
                    ) : (
                        <>
                            <h3 className="mr-list-title">{recipes[currentRecipeIndex].title}</h3>
                            <p className="mr-list-time">Preparation Time: {recipes[currentRecipeIndex].prepTime} minutes</p>
                            <p className="mr-list-time">Cooking Time: {recipes[currentRecipeIndex].cookTime} minutes</p>
                            {showDetails && (
                                <div className={`mr-details ${showDetails ? 'mr-details-show' : ''}`}>
                                    <div className="mr-details-section">
                                        <h4 className="mr-title">Ingredients</h4>
                                        <ul>
                                            {recipes[currentRecipeIndex].ingredients.map((ingredient, index) => (
                                                <li key={index}>
                                                    <strong>.</strong> {ingredient.quantity} {ingredient.unit} of {ingredient.name}
                                                </li>
                                            ))}
                                        </ul>
                                        <h4 className="mr-title">Instructions</h4>
                                        <ol>
                                            {recipes[currentRecipeIndex].instructions.split('\n').map((instruction, index) => {
                                                if (instruction.trim() !== "") {
                                                    return <li key={index}>{instruction.trim()}</li>;
                                                } else {
                                                    return null;
                                                }
                                            })}
                                        </ol>
                                    </div>
                                </div>
                            )}
                            <button className="mr-show-more-btn" onClick={toggleDetails}>
                                {showDetails ? "Hide Details" : "Show More Details"}
                            </button>
                            <button className="mr-remove-btn"
                                    onClick={() => handleDeleteRecipe(recipes[currentRecipeIndex]._id)}>Delete
                            </button>
                            <div>
                                <button className="mr-previous-btn" disabled={currentRecipeIndex === 0}
                                        onClick={previousRecipe}>
                                    &#8592; Previous Recipe
                                </button>
                                <button className="mr-next-btn" disabled={currentRecipeIndex === recipes.length - 1}
                                        onClick={nextRecipe}>
                                    Next Recipe &#8594;
                                </button>
                            </div>
                            <p>Recipe {currentRecipeIndex + 1} of {recipes.length}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManageRecipeMealList;
