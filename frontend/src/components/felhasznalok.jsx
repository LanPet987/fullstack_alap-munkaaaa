import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/felhasznalok.css';

function Felhasznalok() {

    // Állapotok (state változók)
    const [users, setUsers] = useState([]); // A felhasználók listáját tárolja
    const [editingId, setEditingId] = useState(null); // Annak az ID-ját tárolja, amelyik felhasználót éppen szerkesztjük
    const [editedName, setEditedName] = useState(''); // A szerkesztett név értékét tárolja
    const [editedEmail, setEditedEmail] = useState(''); // A szerkesztett email értékét tárolja

    // Adatok lekérése az API-ból
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/users'); // HTTP GET kérés az API-hoz
                setUsers(response.data); // A lekért adatokat beállítja a users állapotba
            } catch (error) {
                console.error('Hiba a felhasználók lekérésekor:', error); // Hiba esetén a konzolra írja a hibát
            }
        };

        fetchUsers(); // Az adatok lekérése a komponens betöltésekor
    }, []); 

    // Felhasználó törlése
    const handleDelete = async (id) => {
        if (!window.confirm(`Biztosan törölni szeretnéd a(z) ${id} ID-jű felhasználót?`)) {
            return; // Ha a felhasználó nem erősíti meg, a törlés megszakad
        }
        try {
            await axios.delete(`http://localhost:3001/api/users/${id}`); // HTTP DELETE kérés az API-hoz
            fetchData(); // Az adatok újra lekérése a törlés után
        } catch (err) {
            console.error("Hiba a törléskor:", err); // Hiba esetén a konzolra írja a hibát
            setError("Nem sikerült törölni a felhasználót."); // Hibaüzenet beállítása
        }
    };

    // Szerkesztés elindítása
    const handleEditStart = (user) => {
        setEditingId(user.id); // Beállítja a szerkesztés alatt álló felhasználó ID-ját
        setEditedName(user.name); // Beállítja a szerkesztett név értékét
        setEditedEmail(user.email); // Beállítja a szerkesztett email értékét
    };

    // Módosítás mentése
    const handleUpdate = async (id) => {
        if (!editedName || !editedEmail) {
            alert("A név és az email mező kitöltése kötelező!"); // Ellenőrzi, hogy a mezők ki vannak-e töltve
            return;
        }

        try {
            await axios.patch(`http://localhost:3001/api/users/${id}`, {
                name: editedName, // A szerkesztett név
                email: editedEmail, // A szerkesztett email
            }); 
            setEditingId(null); // Kilép a szerkesztési módból
            fetchData(); // Az adatok újra lekérése a módosítás után
        } catch (err) {
            console.error("Hiba a módosításkor:", err); // Hiba esetén a konzolra írja a hibát
            setError("Nem sikerült módosítani a felhasználót."); // Hibaüzenet beállítása
        }
    };

    // Szerkesztés megszakítása
    const handleEditCancel = () => {
        setEditingId(null); // Kilép a szerkesztési módból
    };

    // Komponens megjelenítése
    return (
        <div>
            <h2>Felhasználók Listája</h2> {/* A táblázat címe */}
            <table>
                <thead>
                    <tr>
                        <th className="table-header">#ID</th> {/* Az ID oszlop fejléc */}
                        <th className="table-header">Név</th> {/* A név oszlop fejléc */}
                        <th className="table-header">Email</th> {/* Az email oszlop fejléc */}
                        <th className="table-header">Regisztráció</th> {/* A regisztráció dátuma oszlop fejléc */}
                        <th className="table-header">Műveletek</th> {/* A műveletek oszlop fejléc */}
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? ( // Ha vannak felhasználók
                        users.map(user => ( // A felhasználók listájának bejárása
                            <tr key={user.id}>
                                <td className="table-cell">{user.id}</td> {/* A felhasználó ID-ja */}

                                {editingId === user.id ? ( // Ha a felhasználó szerkesztés alatt áll
                                    <>
                                        <td className="table-cell">
                                            <input
                                                type="text"
                                                value={editedName} // A szerkesztett név
                                                onChange={e => setEditedName(e.target.value)} // A név frissítése
                                            />
                                        </td>
                                        <td className="table-cell">
                                            <input
                                                type="email"
                                                value={editedEmail} // A szerkesztett email
                                                onChange={e => setEditedEmail(e.target.value)} // Az email frissítése
                                            />
                                        </td>
                                    </>
                                ) : ( // Ha a felhasználó nincs szerkesztés alatt
                                    <>
                                        <td className="table-cell">{user.name}</td> {/* A felhasználó neve */}
                                        <td className="table-cell">{user.email}</td> {/* A felhasználó email címe */}
                                    </>
                                )}

                                <td className="table-cell">{new Date(user.created_at).toLocaleDateString()}</td> {/* A regisztráció dátuma */}

                                <td className="table-cell">
                                    {editingId === user.id ? ( // Ha a felhasználó szerkesztés alatt áll
                                        <>
                                            <button onClick={() => handleUpdate(user.id)} className="save-button">Mentés</button> {/* Módosítás mentése */}
                                            <button onClick={handleEditCancel} className="cancel-button">Mégse</button> {/* Szerkesztés megszakítása */}
                                        </>
                                    ) : ( // Ha a felhasználó nincs szerkesztés alatt
                                        <>
                                            <button onClick={() => handleEditStart(user)} className="edit-button">Szerkesztés</button> {/* Szerkesztés elindítása */}
                                            <button onClick={() => handleDelete(user.id)} className="delete-button">Törlés</button> {/* Felhasználó törlése */}
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : ( 
                        <tr>
                            <td id='cell-column' className="no-users-cell">Nincsenek felhasználók az adatbázisban.</td> {/* Üzenet, ha nincs adat */}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Felhasznalok; // A komponens exportálása