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
    const [recurringTimes, setRecurringTimes] = useState(2); // Default recurring times for monthly

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
            console.error('Error retrieving recipes:', error);
        }
    };

    const fetchShoppingLists = async () => {
        try {
            const response = await axios.get('http://localhost:5000/shopping-list');
            setShoppingLists(response.data);
        } catch (error) {
            console.error('Error retrieving shopping lists:', error);
        }
    };

    const fetchSavedEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/events-saved');
            setEvents(response.data);
        } catch (error) {
            console.error('Error retrieving saved events:', error);
        }
    };

    const handleEventSelect = (event) => {
        setSelectedEvent(null); // Do nothing if an event is already selected
        setSelectedDate(null);
    };

    const handleRecurringOptionChange = (event) => {
        setRecurringOption(event.target.value);
    };

    const handleRecurringTimesChange = (event) => {
        setRecurringTimes(parseInt(event.target.value));
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
            // Handle daily recurrence
            for (let i = 0; i < recurringTimes; i++) {
                await saveEvent(newEvent);
                newEvent.start = moment(newEvent.start).add(1, 'day').toDate();
                newEvent.end = moment(newEvent.end).add(1, 'day').toDate();
            }
        } else if (recurringOption === 'weekly') {
            // Handle weekly recurrence
            for (let i = 0; i < recurringTimes; i++) {
                await saveEvent(newEvent);
                newEvent.start = moment(newEvent.start).add(1, 'week').toDate();
                newEvent.end = moment(newEvent.end).add(1, 'week').toDate();
            }
        } else if (recurringOption === 'monthly') {
            // Handle monthly recurrence
            let monthCounter = 0;
            while (monthCounter < recurringTimes) {
                await saveEvent(newEvent);
                newEvent.start = moment(newEvent.start).add(1, 'month').toDate();
                newEvent.end = moment(newEvent.end).add(1, 'month').toDate();
                monthCounter++;
            }
        } else {
            // Handle a single event
            await saveEvent(newEvent);
        }

        setSelectedEvent(null);
        setSelectedDate(null);
        setRecurringOption('unique');
        setRecurringTimes(2); // Reset recurring times for monthly
        fetchSavedEvents();
    };

    const saveEvent = async (newEvent) => {
        try {
            await axios.post('http://localhost:5000/events-saved', newEvent);
            console.log('New event saved successfully:', newEvent);
        } catch (error) {
            console.error('Error saving event:', error);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            await axios.delete(`http://localhost:5000/events-saved/${eventId}`);
            console.log('Event deleted successfully:', eventId);
            fetchSavedEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <div>
            <h2>Calendar</h2>
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
                    <h3>Add {selectedEvent.title} to the calendar</h3>
                    <label>Date and time:</label>
                    <Datetime
                        value={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="YYYY-MM-DD"
                        timeFormat="HH:mm"
                        inputProps={{ required: true }}
                    />
                    <label>
                        Recurrence options:
                        <select value={recurringOption} onChange={handleRecurringOptionChange}>
                            <option value="unique">Unique</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </label>
                    {recurringOption === 'daily' && (
                        <label>
                            Number of repetitions:
                            <select value={recurringTimes} onChange={handleRecurringTimesChange}>
                                {[2, 3, 4, 5, 6, 7].map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </label>
                    )}
                    {recurringOption === 'weekly' && (
                        <label>
                            Number of repetitions:
                            <select value={recurringTimes} onChange={handleRecurringTimesChange}>
                                {[2, 3, 4].map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </label>
                    )}

                    {recurringOption === 'monthly' && (
                        <label>
                            Number of repetitions:
                            <select value={recurringTimes} onChange={handleRecurringTimesChange}>
                                {[2, 3, 4].map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </label>
                    )}
                    <button type="submit">Add</button>
                </form>
            )}
            <h3>Reserved Events</h3>
            {events.map((event) => (
                <div key={event._id}>
                    <p>{event.title} - {moment(event.start).format('YYYY-MM-DD HH:mm')}
                        <button onClick={() => deleteEvent(event._id)}>Delete</button>
                    </p>
                </div>
            ))}
            <h3>Recipes</h3>
            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe._id}>
                        <div>
                            <h4>{recipe.title}</h4>
                            <button onClick={() => setSelectedEvent(recipe)}>
                                Add to calendar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <h3>Shopping Lists</h3>
            <ul>
                {shoppingLists.map((list) => (
                    <li key={list._id}>
                        <div>
                            <h4>{list.listTitle}</h4> {/* Display list title */}
                            <button onClick={() => setSelectedEvent(list)}>
                                Add to calendar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Calendar;
