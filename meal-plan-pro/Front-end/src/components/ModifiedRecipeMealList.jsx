import React, { useState, useEffect } from 'react';
import axios from "axios";

function ModifiedRecetteMealPage({ recipeId }) {
    const [recipe, setRecipe] = useState({
        title: '',
        prepTime: '',
        cookTime: '',
        ingredients: [],
        instructions: ''
    });

    useEffect(() => {
        // Chargez les détails de la recette à modifier à partir du serveur lorsque le composant est monté
        if (recipeId) {
            axios.get(`http://localhost:5000/recipe/${recipeId}`)
                .then(response => {
                    setRecipe(response.data);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération de la recette à modifier : ', error);
                });
        }
    }, [recipeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe(prevRecipe => ({
            ...prevRecipe,
            [name]: value
        }));
    };

    const sauvegarderRecette = () => {
        if (recipeId) {
            // Effectuez une requête PUT pour mettre à jour la recette existante
            axios.put(`http://localhost:5000/recipe/${recipeId}`, recipe)
                .then(response => {
                    console.log(response.data);
                    alert('Recette mise à jour avec succès !');
                })
                .catch(error => {
                    console.error('Erreur lors de la mise à jour de la recette : ', error);
                    alert('Erreur lors de la mise à jour de la recette.');
                });
        } else {
            // Effectuez une requête POST pour ajouter une nouvelle recette
            axios.post('http://localhost:5000/recipe-list', recipe)
                .then(response => {
                    console.log(response.data);
                    alert('Recette sauvegardée avec succès !');
                })
                .catch(error => {
                    console.error('Erreur lors de la sauvegarde de la recette : ', error);
                    alert('Erreur lors de la sauvegarde de la recette.');
                });
        }
    };

    return (
        <div>
            <h2>Modifier une recette</h2>
            <form onSubmit={e => e.preventDefault()}>
                {/* Votre formulaire existant */}
                {/* ... */}
                <button onClick={sauvegarderRecette}>Valider et sauvegarder la recette</button>
            </form>
        </div>
    );
}

export default ModifiedRecetteMealPage;
