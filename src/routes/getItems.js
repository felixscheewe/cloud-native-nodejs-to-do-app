// Importiere das 'db'-Modul aus dem Verzeichnis '../persistence'
const db = require('../persistence');

// Exportiere eine asynchrone Funktion, die auf HTTP-Anfragen reagiert
module.exports = async (req, res) => {
    // Rufe die Funktion 'getItems' aus dem 'db'-Modul asynchron auf und warte auf das Ergebnis
    const items = await db.getItems();
    
    // Sende die zurückgegebenen 'items' als HTTP-Antwort zurück
    res.send(items);
};
