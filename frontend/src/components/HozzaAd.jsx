import React from "react";
import { useState } from 'react';
import axios from 'axios';
import '../css/HozzaAd.css';

function HozzaAd() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name || !email) {
            alert("A név és az email megadása kötelező!");
            return;
        }
        try {
            await axios.post('http://localhost:3001/api/users', { name, email });
            fetchData(); 
            setName('');
            setEmail('');
        } catch (err) {
            console.error('Hiba az adatok küldésekor:', err);
            setError("Hiba történt a felhasználó hozzáadása közben.");
        }
    };
     return (
    <div>
        <h1>Felhasználókezelő (Full-Stack CRUD)</h1>
        
        <form onSubmit={handleSubmit} className="form-class">
            <h2>Új felhasználó hozzáadása</h2>
            <input
                type="text"
                placeholder="Név"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-class"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-class"
            />
            <button type="submit" className="button-class">Hozzádás</button>
        </form>
        
        <hr />
        
    </div>
);
}
export default HozzaAd;