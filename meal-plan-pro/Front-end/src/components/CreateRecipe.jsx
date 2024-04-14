    import React, { useState } from 'react';
    import axios from "axios";

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
            if (name === 'title') {
                // Validation for title: only alphabet letters
                const regex = /^[a-zA-Z\s]*$/;
                if (regex.test(value) || value === '') {
                    setRecipe(prevRecipe => ({
                        ...prevRecipe,
                        [name]: value
                    }));
                }
            } else if ((name === 'prepTime' || name === 'cookTime') && /^\d+$/.test(value)) {
                // Check if the field is prepTime or cookTime and the value is an integer
                setRecipe(prevRecipe => ({
                    ...prevRecipe,
                    [name]: value
                }));
            } else if (name === 'instructions') {
                // Validation for instructions: only alphabet letters
                const regex = /^[a-zA-Z\s]*$/;
                if (regex.test(value) || value === '') {
                    setRecipe(prevRecipe => ({
                        ...prevRecipe,
                        [name]: value
                    }));
                }
            }
        };

        const handleIngredientChange = (e) => {
            const { name, value } = e.target;
            if (name === 'name') {
                // Validation for ingredient name: only alphabet letters
                const regex = /^[a-zA-Z\s]*$/;
                if (regex.test(value) || value === '') {
                    setIngredient(prevIngredient => ({
                        ...prevIngredient,
                        [name]: value
                    }));
                }
            } else {
                setIngredient(prevIngredient => ({
                    ...prevIngredient,
                    [name]: value
                }));
            }
        };

        const addIngredient = (e) => {
            e.preventDefault();
            if (!isIngredientLocked) {
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
            <div>
                <h2>Create a new recipe</h2>
                <form onSubmit={e => e.preventDefault()}>
                    <div>
                        <label htmlFor="title">Recipe Title:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={recipe.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="prepTime">Preparation Time (in minutes):</label>
                        <input
                            type="text"
                            id="prepTime"
                            name="prepTime"
                            value={recipe.prepTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="cookTime">Cooking Time (in minutes):</label>
                        <input
                            type="text"
                            id="cookTime"
                            name="cookTime"
                            value={recipe.cookTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Ingredients List:</label>
                        <ul>
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index}>{`${ingredient.name}: ${ingredient.quantity} ${ingredient.unit}`}</li>
                            ))}
                        </ul>
                        <div>
                            <input
                                type="text"
                                placeholder="Ingredient Name"
                                name="name"
                                value={ingredient.name}
                                onChange={handleIngredientChange}
                                required
                                disabled={isIngredientLocked}
                            />
                            <select
                                name="unit"
                                value={ingredient.unit}
                                onChange={handleSelectChange}
                                required
                                disabled={isIngredientLocked}
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
                                />
                            )}
                            <button onClick={addIngredient} disabled={isIngredientLocked}>Add Ingredient</button>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="lockIngredients"
                                checked={isIngredientLocked}
                                onChange={toggleIngredientLock}
                            />
                            <label htmlFor="lockIngredients">Lock Ingredients</label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="instructions">Instructions:</label>
                        <textarea
                            id="instructions"
                            name="instructions"
                            value={recipe.instructions}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button onClick={saveRecipe}>Save Recipe</button>
                </form>
            </div>
        );
    }

    export default CreateRecipe;
