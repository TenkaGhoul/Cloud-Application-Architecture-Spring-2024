import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

const localizer = momentLocalizer(moment);

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [shoppingLists, setShoppingLists] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [recurringOption, setRecurringOption] = useState('unique');

    useEffect(() => {
        fetchRecipes();
        fetchShoppingLists();
        fetchSavedEvents();
    }, []);

    const fetchRecipes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/recipe-list');
            setRecipes(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des recettes :', error);
        }
    };

    const fetchShoppingLists = async () => {
        try {
            const response = await axios.get('http://localhost:5000/shopping-list');
            setShoppingLists(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des listes de courses :', error);
        }
    };

    const fetchSavedEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/events-saved');
            setEvents(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des événements sauvegardés :', error);
        }
    };

    const handleEventSelect = (event) => {
        setSelectedEvent(null); // Ne rien faire si un événement est déjà sélectionné
        setSelectedDate(null);
    };

    const handleRecurringOptionChange = (event) => {
        setRecurringOption(event.target.value);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!selectedEvent) return;

        let newEvent = {
            title: selectedEvent.title,
            start: selectedDate,
            end: selectedDate,
        };

        if (recurringOption === 'daily') {
            // Gérer la répétition quotidienne
            while (moment(newEvent.start).isSameOrBefore(moment(), 'day')) {
                await saveEvent(newEvent);
                newEvent.start = moment(newEvent.start).add(1, 'day').toDate();
                newEvent.end = moment(newEvent.end).add(1, 'day').toDate();
            }
        } else if (recurringOption === 'weekly') {
            // Gérer la répétition hebdomadaire
            while (moment(newEvent.start).isSameOrBefore(moment(), 'day')) {
                await saveEvent(newEvent);
                newEvent.start = moment(newEvent.start).add(1, 'week').toDate();
                newEvent.end = moment(newEvent.end).add(1, 'week').toDate();
            }
        } else if (recurringOption === 'monthly') {
            // Gérer la répétition mensuelle
            while (moment(newEvent.start).isSameOrBefore(moment(), 'day')) {
                await saveEvent(newEvent);
                newEvent.start = moment(newEvent.start).add(1, 'month').startOf('month').toDate();
                newEvent.end = moment(newEvent.end).add(1, 'month').endOf('month').toDate();
            }
        } else {
            // Gérer un événement unique
            await saveEvent(newEvent);
        }

        setSelectedEvent(null);
        setSelectedDate(null);
        setRecurringOption('unique');
        fetchSavedEvents();
    };

    const saveEvent = async (newEvent) => {
        try {
            await axios.post('http://localhost:5000/events-saved', newEvent);
            console.log('Nouvel événement sauvegardé avec succès:', newEvent);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'événement :', error);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            await axios.delete(`http://localhost:5000/events-saved/${eventId}`);
            console.log('Événement supprimé avec succès:', eventId);
            fetchSavedEvents();
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'événement :', error);
        }
    };

    return (
        <div>
            <h2>Calendrier</h2>
            <div style={{ height: '500px' }}>
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    selectable
                    onSelectEvent={handleEventSelect}
                />
            </div>
            {selectedEvent && (
                <form onSubmit={handleFormSubmit}>
                    <h3>Ajouter {selectedEvent.title} au calendrier</h3>
                    <label>Date et heure:</label>
                    <Datetime
                        value={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="YYYY-MM-DD"
                        timeFormat="HH:mm"
                        inputProps={{ required: true }}
                    />
                    <label>
                        Options de récurrence :
                        <select value={recurringOption} onChange={handleRecurringOptionChange}>
                            <option value="unique">Unique</option>
                            <option value="daily">Quotidienne</option>
                            <option value="weekly">Hebdomadaire</option>
                            <option value="monthly">Mensuelle</option>
                        </select>
                    </label>
                    <button type="submit">Ajouter</button>
                </form>
            )}
            <h3>Événements réservés</h3>
            {events.map((event) => (
                <div key={event._id}>
                    <p>{event.title} - {moment(event.start).format('YYYY-MM-DD HH:mm')}
                        <button onClick={() => deleteEvent(event._id)}>Supprimer</button>
                    </p>
                </div>
            ))}
            <h3>Recettes</h3>
            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe._id}>
                        <div>
                            <h4>{recipe.title}</h4>
                            <button onClick={() => setSelectedEvent(recipe)}>
                                Ajouter au calendrier
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <h3>Listes de courses</h3>
            <ul>
                {shoppingLists.map((list) => (
                    <li key={list._id}>
                        <div>
                            <h4>{list.listTitle}</h4> {/* Afficher le titre de la liste */}
                            <button onClick={() => setSelectedEvent(list)}>
                                Ajouter au calendrier
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Calendar;
