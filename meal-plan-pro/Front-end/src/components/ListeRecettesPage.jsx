import React, { useState } from 'react';
import axios from "axios";

function ListeRecettesPage() {
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

    const [quantityptions] = useState([...Array(8).keys()].map(i => (i + 1) * 25));
    const [unitOptions] = useState(['pièce', 'mL', 'cl', 'L', 'g', 'kg', 'cuillère à café', 'cuillère à soupe']);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe(prevRecipe => ({
            ...prevRecipe,
            [name]: value
        }));
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

    const sauvegarderRecette = () => {
        // Préparez les données à envoyer
        const data = {
            title: recipe.title,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions
        };

        // Envoyez les données au serveur
        axios.post('http://localhost:5000/recipe-list', data)
            .then(response => {
                console.log(response.data);
                alert('Recette sauvegardée avec succès !');
                // Réinitialisez le formulaire après avoir sauvegardé avec succès
                setRecipe({
                    title: '',
                    prepTime: '',
                    cookTime: '',
                    ingredients: [],
                    instructions: ''
                });
            })
            .catch(error => {
                console.error('Erreur lors de la sauvegarde de la recette : ', error);
                alert('Erreur lors de la sauvegarde de la recette.');
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
        if (ingredient.unit === 'pièce' || ingredient.unit === 'cuillère à café' || ingredient.unit === 'cuillère à soupe') {
            return [...Array(9).keys()].map(i => i + 1);
        } else {
            return [...Array(8).keys()].map(i => (i + 1) * 25);
        }
    };

    return (
        <div>
            <h2>Créer une nouvelle recette</h2>
            <form onSubmit={e => e.preventDefault()}>
                <div>
                    <label htmlFor="title">Titre de la recette:</label>
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
                    <label htmlFor="prepTime">Temps de préparation (en minutes):</label>
                    <input
                        type="number"
                        id="prepTime"
                        name="prepTime"
                        value={recipe.prepTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="cookTime">Temps de cuisson (en minutes):</label>
                    <input
                        type="number"
                        id="cookTime"
                        name="cookTime"
                        value={recipe.cookTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Liste des ingrédients:</label>
                    <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{`${ingredient.name}: ${ingredient.quantity} ${ingredient.unit}`}</li>
                        ))}
                    </ul>
                    <div>
                        <input
                            type="text"
                            placeholder="Nom de l'ingrédient"
                            name="name"
                            value={ingredient.name}
                            onChange={handleIngredientChange}
                            required
                            disabled={isIngredientLocked}
                        />
                        <select
                            name="quantity"
                            value={ingredient.quantity}
                            onChange={handleSelectChange}
                            required
                            disabled={isIngredientLocked}
                        >
                            <option value="">Sélectionner une quantité</option>
                            {getQuantityOptions().map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                            <option value="custom">Autre</option>
                        </select>
                        {ingredient.quantity === 'custom' && (
                            <input
                                type="number"
                                placeholder="Entrez la quantité"
                                value={customQuantity}
                                onChange={e => setCustomQuantity(e.target.value)}
                                min="0"
                            />
                        )}
                        <select
                            name="unit"
                            value={ingredient.unit}
                            onChange={handleIngredientChange}
                            required
                            disabled={isIngredientLocked}
                        >
                            <option value="">Sélectionner une unité</option>
                            {unitOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <button onClick={addIngredient} disabled={isIngredientLocked}>Ajouter l'ingrédient</button>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="lockIngredients"
                            checked={isIngredientLocked}
                            onChange={toggleIngredientLock}
                        />
                        <label htmlFor="lockIngredients">Verrouiller les ingrédients</label>
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
                <button onClick={sauvegarderRecette}>Valider et sauvegarder la recette</button>
            </form>
        </div>
    );
}

export default ListeRecettesPage;
