import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeleteShoppingFoodList() {
    const [lists, setLists] = useState([]);
    const [selectedList, setSelectedList] = useState('');
    const [confirmation, setConfirmation] = useState('');

    useEffect(() => {
        // Récupérer la liste des courses depuis la base de données lors du chargement du composant
        axios.get('http://localhost:5000/listes')
            .then(response => {
                setLists(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des listes de courses : ', error);
            });
    }, []);

    const supprimerListe = () => {
        if (selectedList) {
            // Envoyer une requête DELETE pour supprimer la liste sélectionnée
            axios.delete(`http://localhost:5000/supprimer/${selectedList}`)
                .then(response => {
                    console.log(response.data);
                    setConfirmation('Liste de courses supprimée avec succès !');
                    // Mettre à jour la liste des courses après la suppression
                    setLists(lists.filter(list => list._id !== selectedList));
                    setSelectedList('');
                })
                .catch(error => {
                    console.error('Erreur lors de la suppression de la liste de courses : ', error);
                    setConfirmation('Erreur lors de la suppression de la liste de courses.');
                });
        } else {
            setConfirmation('Veuillez sélectionner une liste à supprimer.');
        }
    };

    return (
        <div>   
            <h1>Supprimer une Liste de Courses</h1>
            <select
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
            >
                <option value="">Sélectionner une liste à supprimer</option>
                {lists.map(list => (
                    <option key={list._id} value={list._id}>{list.listTitle}</option>
                ))}
            </select>
            <br />
            <button onClick={supprimerListe}>Supprimer la Liste</button>
            {confirmation && <p>{confirmation}</p>}
        </div>
    );
}

export default DeleteShoppingFoodList;
