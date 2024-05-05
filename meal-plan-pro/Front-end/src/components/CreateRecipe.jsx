import React, { useState } from 'react';
import axios from "axios";
import "./CreateRecipe.css"

function CreateRecipe() {
    const [recipe, setRecipe] = useState({
        title: '',
        prepTime: '',
        cookTime: '',
        ingredients: [],
        instructions: ''
    });

    const [ingredient, setIngredient] = useState({
        name: '',
        quantity: '',
        unit: ''
    });

    const [isIngredientLocked, setIsIngredientLocked] = useState(false);
    const [customQuantity, setCustomQuantity] = useState('');

    const [quantityOptions] = useState([...Array(8).keys()].map(i => (i + 1) * 25));
    const [unitOptions] = useState(['piece', 'mL', 'cl', 'L', 'g', 'kg', 'teaspoon', 'tablespoon']);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title' || name === 'prepTime' || name === 'cookTime' || name === 'instructions') {
            setRecipe(prevRecipe => ({
                ...prevRecipe,
                [name]: value
            }));
        }
    };

    const handleIngredientChange = (e) => {
        const { name, value } = e.target;
        setIngredient(prevIngredient => ({
            ...prevIngredient,
            [name]: value
        }));
    };

    const addIngredient = (e) => {
        e.preventDefault();
        if (!isIngredientLocked) {
            // Vérifier si les champs obligatoires sont renseignés
            if (!ingredient.name || !ingredient.quantity || !ingredient.unit) {
                alert('Please fill in all fields for the ingredient.');
                return;
            }

            const newIngredient = { ...ingredient };
            if (ingredient.quantity === 'custom') {
                newIngredient.quantity = customQuantity;
            }
            setRecipe(prevRecipe => ({
                ...prevRecipe,
                ingredients: [...prevRecipe.ingredients, newIngredient]
            }));
            setIngredient({
                name: '',
                quantity: '',
                unit: ''
            });
            setCustomQuantity('');
        }
    };

    const saveRecipe = () => {
        // Check if all required fields are filled
        if (
            recipe.title.trim() === '' ||
            recipe.prepTime.trim() === '' ||
            recipe.cookTime.trim() === '' ||
            recipe.ingredients.length === 0 ||
            recipe.instructions.trim() === ''
        ) {
            alert('Please fill in all required fields.');
            return;
        }

        // Prepare data to send
        const data = {
            title: recipe.title,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions
        };

        // Send data to the server
        axios.post('http://localhost:5000/recipe-list', data)
            .then(response => {
                console.log(response.data);
                alert('Recipe saved successfully!');
                // Reset the form after successfully saving
                setRecipe({
                    title: '',
                    prepTime: '',
                    cookTime: '',
                    ingredients: [],
                    instructions: ''
                });
            })
            .catch(error => {
                console.error('Error saving recipe: ', error);
                alert('Error saving recipe.');
            });
    };

    const toggleIngredientLock = () => {
        setIsIngredientLocked(prevLock => !prevLock);
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        if (value === 'custom') {
            setIngredient(prevIngredient => ({
                ...prevIngredient,
                [name]: value
            }));
        } else {
            setIngredient(prevIngredient => ({
                ...prevIngredient,
                [name]: value,
                quantity: value
            }));
        }
    };

    const getQuantityOptions = () => {
        if (ingredient.unit === 'piece' || ingredient.unit === 'teaspoon' || ingredient.unit === 'tablespoon' || ingredient.unit === 'kg' || ingredient.unit === 'L') {
            return [...Array(9).keys()].map(i => i + 1);
        } else {
            return [...Array(8).keys()].map(i => (i + 1) * 25);
        }
    };

    return (
        <div className="cr-body">
            <div className="cr-background"></div>
            <div className="form-container">
                <h2 className="cr-title">Create a new recipe</h2>
                <form className="cr-list" onSubmit={e => e.preventDefault()}>
                    <div className="form-group">
                        <label htmlFor="cr-list-title" className="form-label">Recipe Title:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={recipe.title}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="prepTime" className="form-label">Preparation Time (in minutes):</label>
                        <input
                            type="text"
                            id="prepTime"
                            name="prepTime"
                            value={recipe.prepTime}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cookTime" className="form-label">Cooking Time (in minutes):</label>
                        <input
                            type="text"
                            id="cookTime"
                            name="cookTime"
                            value={recipe.cookTime}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Ingredients List:</label>
                        <div className="ingredients-list">
                            {recipe.ingredients.map((ingredient, index) => (
                                <p key={index}>{ingredient.name}: {ingredient.quantity} {ingredient.unit}</p>
                            ))}
                        </div>
                        <div className="ingredient-inputs">
                            <input
                                type="text"
                                placeholder="Ingredient Name"
                                name="name"
                                value={ingredient.name}
                                onChange={handleIngredientChange}
                                required
                                disabled={isIngredientLocked}
                                className="form-control"
                            />
                            <select
                                name="unit"
                                value={ingredient.unit}
                                onChange={handleSelectChange}
                                required
                                disabled={isIngredientLocked}
                                className="form-control"
                            >
                                <option value="">Select a unit</option>
                                {unitOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <select
                                name="quantity"
                                value={ingredient.quantity}
                                onChange={handleSelectChange}
                                required
                                disabled={isIngredientLocked}
                                className="form-control"
                            >
                                <option value="">Select a quantity</option>
                                {getQuantityOptions().map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                                <option value="custom">Custom</option>
                            </select>
                            {ingredient.quantity === 'custom' && (
                                <input
                                    type="text"
                                    placeholder="Enter quantity"
                                    value={customQuantity}
                                    onChange={e => setCustomQuantity(e.target.value)}
                                    min="0"
                                    className="form-control"
                                />
                            )}
                            <button onClick={addIngredient} disabled={isIngredientLocked} className="btn-add-ingredient">Add Ingredient</button>
                        </div>
                        <div className="lock-ingredient-checkbox">
                            <input
                                type="checkbox"
                                id="lockIngredients"
                                checked={isIngredientLocked}
                                onChange={toggleIngredientLock}
                                className="form-checkbox"
                            />
                            <label htmlFor="lockIngredients" className="form-label">Lock Ingredients</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="instructions" className="form-label">Instructions:</label>
                        <textarea
                            id="instructions"
                            name="instructions"
                            value={recipe.instructions}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <button onClick={saveRecipe} className="btn-save-recipe">Save Recipe</button>
                </form>
            </div>
            <div className="dynamic-content">
                <h3 className="cr-recipe-title">Recipe Preview:</h3>
                <div className="recipe-preview">
                    <h4>{recipe.title}</h4>
                    <p><strong>Preparation Time:</strong> {recipe.prepTime} minutes</p>
                    <p><strong>Cooking Time:</strong> {recipe.cookTime} minutes</p>
                    <p><strong>Ingredients:</strong></p>
                    <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient.name}: {ingredient.quantity} {ingredient.unit}</li>
                        ))}
                    </ul>
                    <p><strong>Instructions:</strong></p>
                    <p>{recipe.instructions}</p>
                </div>
            </div>
        </div>
    );
}

export default CreateRecipe;
