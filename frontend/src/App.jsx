import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 
import Navbar from './components/navbar';
import Felhasznalok from './components/felhasznalok';
import HozzaAd from './components/HozzaAd';


function App() {

    // READ ÉS HIBAKEZELÉS
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Adatok lekérdezésének funkciója
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3001/api/users');
            setUsers(response.data);
            setError(null);
        } catch (err) {
            console.error("Hiba az adatok lekérésekor:", err);
            setError("Nem sikerült betölteni az adatokat. Ellenőrizze, hogy a backend szerver fut-e a 3001-es porton.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); 
    }, []);

    // Feltételes renderelés: Betöltés és Hiba
    if (loading) {
        return <div className="App"><p>Adatok betöltése...</p></div>;
    }
    if (error) {
        return <div className="App"><p style={{ color: 'red' }}>{error}</p></div>;
    }

    // JSX Visszatérés
    return (
        <div className="App">
            <Navbar />
            <HozzaAd/>
            <Felhasznalok />

        </div>
    );
} 
export default App;