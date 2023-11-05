// Importieren der erforderlichen Module
const express = require('express');
const app = express(); // Erstellt eine Express-Anwendung
const db = require('./persistence'); // Importiert ein Modul zur Datenpersistenz
const getItems = require('./routes/getItems'); // Importiert das Modul für das Abrufen von Items
const addItem = require('./routes/addItem'); // Importiert das Modul für das Hinzufügen von Items
const updateItem = require('./routes/updateItem'); // Importiert das Modul für das Aktualisieren von Items
const deleteItem = require('./routes/deleteItem'); // Importiert das Modul für das Löschen von Items

// Konfiguriert die Express-Anwendung
app.use(express.json()); // Aktiviert das Parsen von JSON-Anfragen
app.use(express.static(__dirname + '/static')); // Stellt statische Dateien im "static"-Verzeichnis bereit

// Definiert Endpunkte für die RESTful API
app.get('/items', getItems); // GET-Anfrage an /items ruft die Liste der Items ab
app.post('/items', addItem); // POST-Anfrage an /items fügt ein neues Item hinzu
app.put('/items/:id', updateItem); // PUT-Anfrage an /items/:id aktualisiert ein Item
app.delete('/items/:id', deleteItem); // DELETE-Anfrage an /items/:id löscht ein Item

// Initialisiert die Datenbank und startet den Server
db.init().then(() => {
    app.listen(3000, () => console.log('Listening on port 3000')); // Startet den Server auf Port 3000
}).catch((err) => {
    console.error(err);
    process.exit(1); // Beendet die Anwendung bei einem Fehler während der Initialisierung
});

// Funktion für einen graceful Shutdown
const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {}) // Ignoriert Fehler bei der Aufräumung
        .then(() => process.exit()); // Beendet die Anwendung nach erfolgreicher Aufräumung
};

// Registriert Handler für bestimmte Signale, um einen graceful Shutdown zu ermöglichen
process.on('SIGINT', gracefulShutdown); // Signal bei manueller Beendigung (Strg+C)
process.on('SIGTERM', gracefulShutdown); // Signal bei systematischer Beendigung
process.on('SIGUSR2', gracefulShutdown); // Signal von nodemon, einem Tool zur automatischen Neustart der Anwendung
