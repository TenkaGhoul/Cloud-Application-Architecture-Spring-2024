import React, { useState } from 'react';

function RecherchePlatsPage() {
    const [query, setQuery] = useState('');
    const [resultats, setResultats] = useState([]);

    // Fonction pour gérer la soumission du formulaire de recherche
    const handleSubmit = (e) => {
        e.preventDefault();
        // Ici, vous pouvez implémenter la logique de recherche avec une API de plats
        console.log("Recherche de plats avec la query:", query);
        // Réinitialiser les résultats pour le moment
        setResultats([]);
    };

    return (
        <div>
            <h2>Recherche de plats</h2>
            {/* Formulaire de recherche de plats */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher des plats..."
                />
                <button type="submit">Rechercher</button>
            </form>
            {/* Affichage des résultats de la recherche */}
            <div>
                {resultats.length > 0 ? (
                    <ul>
                        {resultats.map((plat, index) => (
                            <li key={index}>{plat.nom}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucun résultat trouvé.</p>
                )}
            </div>
        </div>
    );
}

export default RecherchePlatsPage;
