import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/felhasznalok.css';

function Felhasznalok() {
    // State változók
    const [users, setUsers] = useState([]); // Felhasználók listája
    const [editingId, setEditingId] = useState(null); // Szerkesztés alatt álló felhasználó ID
    const [editedName, setEditedName] = useState(''); // Szerkesztett név
    const [editedEmail, setEditedEmail] = useState(''); // Szerkesztett email

    // Adatok lekérése az API-ból
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/users');
                setUsers(response.data); // Felhasználók beállítása
            } catch (error) {
                console.error('Hiba a felhasználók lekérésekor:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h2>Felhasználók Listája</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th className="table-header">#ID</th>
                        <th className="table-header">Név</th>
                        <th className="table-header">Email</th>
                        <th className="table-header">Regisztráció</th>
                        <th className="table-header">Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map(user => (
                            <tr key={user.id}>
                                <td className="table-cell">{user.id}</td>

                                {editingId === user.id ? (
                                    <>
                                        <td className="table-cell">
                                            <input
                                                type="text"
                                                value={editedName}
                                                onChange={e => setEditedName(e.target.value)}
                                            />
                                        </td>
                                        <td className="table-cell">
                                            <input
                                                type="email"
                                                value={editedEmail}
                                                onChange={e => setEditedEmail(e.target.value)}
                                            />
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="table-cell">{user.name}</td>
                                        <td className="table-cell">{user.email}</td>
                                    </>
                                )}

                                <td className="table-cell">{new Date(user.created_at).toLocaleDateString()}</td>

                                <td className="table-cell">
                                    {editingId === user.id ? (
                                        <>
                                            <button onClick={() => handleUpdate(user.id)} className="save-button">Mentés</button>
                                            <button onClick={handleEditCancel} className="cancel-button">Mégse</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditStart(user)} className="edit-button">Szerkesztés</button>
                                            <button onClick={() => handleDelete(user.id)} className="delete-button">Törlés</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="no-users-cell">Nincsenek felhasználók az adatbázisban.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Felhasznalok;