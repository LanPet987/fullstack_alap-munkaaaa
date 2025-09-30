import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 
import Felhasznalok from './components/felhasznalok';
import HozzaAd from './components/HozzaAd';


function App() {
    // --- STATE VÁLTOZÓK ---

    // READ ÉS HIBAKEZELÉS
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // CREATE (HOZZÁADÁS)


    // UPDATE (SZERKESZTÉS)
    const [editingId, setEditingId] = useState(null); 
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');

    // --- FUNKCIÓK ---

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

    // Adatok lekérése a komponens betöltésekor
    useEffect(() => {
        fetchData(); 
    }, []);

    // CREATE: Új felhasználó hozzáadása
   

    // DELETE: Felhasználó törlése
    const handleDelete = async (id) => {
        if (!window.confirm(`Biztosan törölni szeretnéd a(z) ${id} ID-jű felhasználót?`)) {
            return;
        }
        try {
            await axios.delete(`http://localhost:3001/api/users/${id}`);
            fetchData();
        } catch (err) {
            console.error("Hiba a törléskor:", err);
            setError("Nem sikerült törölni a felhasználót.");
        }
    };
    
    // UPDATE: Szerkesztési mód elindítása
    const handleEditStart = (user) => {
        setEditingId(user.id);
        setEditedName(user.name);
        setEditedEmail(user.email);
    };

    // UPDATE: Módosítás elküldése
    const handleUpdate = async (id) => {
        if (!editedName || !editedEmail) {
            alert("A név és az email mező kitöltése kötelező!");
            return;
        }

        try {
            await axios.patch(`http://localhost:3001/api/users/${id}`, {
                name: editedName,
                email: editedEmail,
            });
            setEditingId(null);
            fetchData();
        } catch (err) {
            console.error("Hiba a módosításkor:", err);
            setError("Nem sikerült módosítani a felhasználót.");
        }
    };
    
    // Szerkesztés megszakítása
    const handleEditCancel = () => {
        setEditingId(null);
    };


    // --- RENDERELÉS ---

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
            <HozzaAd/>
            <Felhasznalok />

        </div>
    );
} 

// Stílusdefiníciók


export default App;
