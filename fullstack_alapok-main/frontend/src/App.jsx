import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
    // --- STATE VÁLTOZÓK ---

    // READ ÉS HIBAKEZELÉS
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // CREATE (HOZZÁADÁS)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

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
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name || !email) {
            alert("A név és az email megadása kötelező!");
            return;
        }
        try {
            await axios.post('http://localhost:3001/api/users', { name, email });
            fetchData(); // Frissítés
            setName('');
            setEmail('');
        } catch (err) {
            console.error('Hiba az adatok küldésekor:', err);
            setError("Hiba történt a felhasználó hozzáadása közben.");
        }
    };

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
            <h1>Felhasználókezelő (Full-Stack CRUD)</h1>
            
            {/* Új felhasználó hozzáadása űrlap */}
            <form onSubmit={handleSubmit} style={{marginBottom: '30px', border: '1px solid #ccc', padding: '15px'}}>
                <h2>Új felhasználó hozzáadása</h2>
                <input
                    type="text"
                    placeholder="Név"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{marginRight: '10px', padding: '5px'}}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{marginRight: '10px', padding: '5px'}}
                />
                <button type="submit" style={{padding: '5px 10px'}}>Hozzádás</button>
            </form>
            
            <hr />
            
            <h2>Felhasználók Listája</h2>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>#ID</th>
                        <th style={tableHeaderStyle}>Név</th>
                        <th style={tableHeaderStyle}>Email</th>
                        <th style={tableHeaderStyle}>Regisztráció</th>
                        <th style={tableHeaderStyle}>Műveletek</th> 
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map(user => (
                            <tr key={user.id}>
                                <td style={tableCellStyle}>{user.id}</td>
                                
                                {/* Szerkesztési mód váltása */}
                                {editingId === user.id ? (
                                    <>
                                        <td style={tableCellStyle}>
                                            <input 
                                                type="text" 
                                                value={editedName} 
                                                onChange={e => setEditedName(e.target.value)} 
                                            />
                                        </td>
                                        <td style={tableCellStyle}>
                                            <input 
                                                type="email" 
                                                value={editedEmail} 
                                                onChange={e => setEditedEmail(e.target.value)} 
                                            />
                                        </td>
                                    </>
                                ) : (
                                    // Normál mód
                                    <>
                                        <td style={tableCellStyle}>{user.name}</td>
                                        <td style={tableCellStyle}>{user.email}</td>
                                    </>
                                )}
                                
                                <td style={tableCellStyle}>{new Date(user.created_at).toLocaleDateString()}</td>

                                {/* MŰVELETI GOMBOK */}
                                <td style={tableCellStyle}>
                                    {editingId === user.id ? (
                                        // Szerkesztési mód gombjai
                                        <>
                                            <button onClick={() => handleUpdate(user.id)} style={saveButtonStyle}>Mentés</button>
                                            <button onClick={handleEditCancel} style={cancelButtonStyle}>Mégse</button>
                                        </>
                                    ) : (
                                        // Normál mód gombjai
                                        <>
                                            <button onClick={() => handleEditStart(user)} style={editButtonStyle}>Szerkesztés</button>
                                            <button onClick={() => handleDelete(user.id)} style={deleteButtonStyle}>Törlés</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={noUsersCellStyle}>Nincsenek felhasználók az adatbázisban.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
} 

// Stílusdefiníciók
const tableHeaderStyle = { border: '1px solid #ccc', padding: '10px', backgroundColor: '#f0f0f0' };
const tableCellStyle = { border: '1px solid #ccc', padding: '10px', textAlign: 'left' };
const noUsersCellStyle = { border: '1px solid #ccc', padding: '10px', textAlign: 'center' };
const saveButtonStyle = { padding: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', marginRight: '5px' };
const cancelButtonStyle = { padding: '5px', backgroundColor: '#9E9E9E', color: 'white', border: 'none', cursor: 'pointer' };
const editButtonStyle = { padding: '5px', backgroundColor: '#2196F3', color: 'white', border: 'none', cursor: 'pointer', marginRight: '5px' };
const deleteButtonStyle = { padding: '5px', backgroundColor: '#F44336', color: 'white', border: 'none', cursor: 'pointer' };

export default App;
