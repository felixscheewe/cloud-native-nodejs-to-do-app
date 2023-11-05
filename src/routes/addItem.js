// Importieren von erforderlichen Modulen
const db = require('../persistence'); // Importieren eines Moduls namens 'persistence' aus dem übergeordneten Verzeichnis
const {v4 : uuid} = require('uuid'); // Importieren der Funktion 'v4' aus dem 'uuid'-Modul und Umbenennen in 'uuid'

// Exportieren eines asynchronen Funktionenmoduls
module.exports = async (req, res) => {
    // Erstellen eines neuen Datenobjekts mit einer eindeutigen UUID, dem Namen aus der Anfrage und 'completed' auf 'false' gesetzt
    const item = {
        id: uuid(),          // Erzeugt eine eindeutige UUID
        name: req.body.name, // Nimmt den Namen aus der Anfrage
        completed: false,    // Setzt 'completed' auf 'false'
    };

    // Speichern des Datenobjekts in der Datenbank (Annahme: 'db.storeItem' ist eine asynchrone Funktion)
    await db.storeItem(item);

    // Senden des gespeicherten Datenobjekts als Antwort auf die HTTP-Anfrage
    res.send(item);
};
