import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModifiedRecipeMealList from "./ModifiedRecipeMealList";

function ManageRecipeMealList() {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipeId, setSelectedRecipeId] = useState(null); // Nouvel état pour stocker l'ID de la recette sélectionnée

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/recipe-list');
                setRecipes(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des recettes :', error);
            }
        };

        fetchRecipes();
    }, []);

    const handleDeleteRecipe = async (recipeId) => {
        const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette recette ?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/recipe-list/${recipeId}`);
                const updatedRecipes = recipes.filter(recipe => recipe._id !== recipeId);
                setRecipes(updatedRecipes);
                console.log('Recette supprimée avec succès.');
            } catch (error) {
                console.error('Erreur lors de la suppression de la recette :', error);
            }
        }
    };

    const modifierRecette = (recipeId) => {
        setSelectedRecipeId(recipeId); // Mettre à jour l'ID de la recette sélectionnée lors du clic sur "Modifier"
    };

    return (
        <div>
            <h2>Liste des recettes de cuisine</h2>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe._id}>
                        <div>
                            <h3>{recipe.title}</h3>
                            <p>Temps de préparation : {recipe.prepTime} minutes</p>
                            <p>Temps de cuisson : {recipe.cookTime} minutes</p>
                            <button onClick={() => handleDeleteRecipe(recipe._id)}>Supprimer</button>
                            <button onClick={() => modifierRecette(recipe._id)}>Modifier</button> {/* Ajout de l'événement onClick pour modifier la recette */}
                        </div>
                    </li>
                ))}
            </ul>
            {selectedRecipeId && <ModifiedRecipeMealList recipeId={selectedRecipeId} />} {/* Affichage du formulaire de modification de recette si une recette est sélectionnée */}
        </div>
    );
}

export default ManageRecipeMealList;
