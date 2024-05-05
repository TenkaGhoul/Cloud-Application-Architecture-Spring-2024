import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./Calendar.css";

const localizer = momentLocalizer(moment);

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [shoppingLists, setShoppingLists] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [recurringOption, setRecurringOption] = useState('unique');
    const [recurringTimes, setRecurringTimes] = useState(2); // Default recurring times for monthly
    const [selectedItemType, setSelectedItemType] = useState('recipe');
    const [currentListIndex, setCurrentListIndex] = useState(0);

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
        deleteEventConfirmation(event._id); // Delete the selected event when clicked
    };

    const handleRecurringOptionChange = (event) => {
        setRecurringOption(event.target.value);
        setRecurringTimes(2); // Reset recurring times when changing option
    };

    const handleRecurringTimesChange = (event) => {
        setRecurringTimes(parseInt(event.target.value));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!selectedEvent) return;

        let newEvent = {
            title: selectedEvent.listTitle || selectedEvent.title, // Use listTitle if available, otherwise use title
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
            for (let i = 0; i < recurringTimes; i++) {
                await saveEvent(newEvent);
                newEvent.start = moment(newEvent.start).add(1, 'month').toDate();
                newEvent.end = moment(newEvent.end).add(1, 'month').toDate();
            }
        } else {
            // Handle a single event
            await saveEvent(newEvent);
        }

        setSelectedEvent(null);
        setSelectedDate(null);
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

    const deleteEventConfirmation = (eventId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this event?');
        if (confirmDelete) {
            deleteEvent(eventId);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            await axios.delete(`http://localhost:5000/events-saved/${eventId}`);
            console.log('Event deleted successfully:', eventId);
            setEvents(events.filter(event => event._id !== eventId));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleItemTypeChange = (event) => {
        setSelectedItemType(event.target.value);
        setCurrentListIndex(0); // Reset current index when changing item type
    };

    const handleNextList = () => {
        setCurrentListIndex(prevIndex => prevIndex + 1);
    };

    const handlePreviousList = () => {
        setCurrentListIndex(prevIndex => prevIndex - 1);
    };

    const totalItems = selectedItemType === 'recipe' ? recipes.length : shoppingLists.length;
    const currentList = selectedItemType === 'recipe' ? recipes[currentListIndex] : shoppingLists[currentListIndex];

    return (
        <div className="cal-body">
            <div className="cal-background"></div>
            <div className="cal-section">
                <div className="cal-form">
                    <h2 className="cal-title">Calendar</h2>
                    <div style={{ height: '500px' }}>
                        <BigCalendar
                            localizer={localizer}
                            events={events}
                            selectable
                            onSelectEvent={handleEventSelect}
                        />
                    </div>
                    {selectedEvent && (
                        <form onSubmit={handleFormSubmit} className="form-group">
                            <h3>Add {selectedEvent.listTitle || selectedEvent.title} to the calendar</h3> {/* Display list title */}
                            <label>Date:</label>
                            <input
                                type="date"
                                value={moment(selectedDate).format('YYYY-MM-DD')}
                                onChange={(event) => setSelectedDate(moment(event.target.value).toDate())}
                                required
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
                            {recurringOption !== 'unique' && (
                                <label>
                                    Number of repetitions:
                                    <select value={recurringTimes} onChange={handleRecurringTimesChange}>
                                        {recurringOption === 'daily' && Array.from({ length: 3 }, (_, i) => i + 2).map((num) => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                        {recurringOption !== 'daily' && Array.from({ length: 3 }, (_, i) => i + 2).map((num) => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </label>
                            )}
                            <button type="submit" id="add-btn">Add</button>
                        </form>
                    )}
                </div>
                <div className="cal-list">
                    <h3>Select Item Type</h3>
                    <select value={selectedItemType} onChange={handleItemTypeChange}>
                        <option value="recipe">Recipes</option>
                        <option value="shopping">Shopping Lists</option>
                    </select>
                    {totalItems > 0 && (
                        <>
                            <button className="cal-previous-btn" onClick={handlePreviousList} disabled={currentListIndex === 0}>Previous</button>
                            <button className="cal-next-btn" onClick={handleNextList} disabled={currentListIndex === totalItems - 1}>Next</button>
                            <p>{currentListIndex + 1} of {totalItems}</p>
                        </>
                    )}
                    <ul>
                        {totalItems > 0 && currentList && (
                            <li>
                                <div>
                                    <h4>{selectedItemType === 'recipe' ? currentList.title : currentList.listTitle}</h4>
                                    <button onClick={() => setSelectedEvent(currentList)} id="add-btn">
                                        Add to calendar
                                    </button>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
