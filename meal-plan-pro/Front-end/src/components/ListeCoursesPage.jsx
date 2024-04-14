import React, { useState } from 'react';
import axios from 'axios';
function ListeCoursesPage() {
    const [listTitle, setListTitle] = useState('');
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState(0);
    const [itemCategory, setItemCategory] = useState('');

    const addItemToList = () => {
        if (itemName && itemQuantity > 0 && itemCategory) {
            const newItem = { name: itemName, quantity: itemQuantity, category: itemCategory };
            setItems([...items, newItem]);
            setItemName('');
            setItemQuantity(0);
            setItemCategory('');
        } else {
            alert('Veuillez remplir tous les champs !');
        }
    };

    const removeItemFromList = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const sauvegarderListe = () => {
        // Préparez les données à envoyer
        const data = {
            listTitle: listTitle,
            items: items
        };

        // Envoyez les données au serveur
        axios.post('http://localhost:5000/shopping-list', data)
            .then(response => {
                console.log(response.data);
                alert('Liste de courses sauvegardée avec succès !');
            })
            .catch(error => {
                console.error('Erreur lors de la sauvegarde de la liste de courses : ', error);
                alert('Erreur lors de la sauvegarde de la liste de courses.');
            });
    };

    return (
        <div>
            <h1>Créer une Liste de Courses</h1>
            <label>
                Titre de la Liste :
                <input
                    type="text"
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                />
            </label>
            <br />
            <label>
                Nom du Produit :
                <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />
            </label>
            <br />
            <label>
                Quantité :
                <select
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(parseInt(e.target.value))}
                >
                    {[...Array(10).keys()].map((num) => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                Catégorie :
                <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Viandes">Viandes</option>
                    <option value="Poissons">Poissons</option>
                    <option value="Fruits & Légumes">Fruits & Légumes</option>
                    <option value="Epices">Epices</option>
                </select>
            </label>
            <br />
            <button onClick={addItemToList}>Ajouter à la Liste</button>

            <h2>Liste de Courses - {listTitle}</h2>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        {item.name} - {item.quantity} - {item.category}
                        <button onClick={() => removeItemFromList(index)}>Supprimer</button>
                    </li>
                ))}
            </ul>

            <button onClick={sauvegarderListe}>Sauvegarder la liste de courses</button>
        </div>
    );
}

export default ListeCoursesPage;
