// Importiere das 'db'-Modul aus dem Verzeichnis '../persistence'
const db = require('../persistence');

// Exportiere eine async-Funktion, die auf HTTP-Anfragen reagiert
module.exports = async (req, res) => {
    // Aktualisiere ein Element in der Datenbank mit der angegebenen ID
    // basierend auf den Daten im Anfragekörper (req.body)
    await db.updateItem(req.params.id, {
        name: req.body.name,
        completed: req.body.completed,
    });

    // Lade das aktualisierte Element aus der Datenbank
    const item = await db.getItem(req.params.id);

    // Sende das geladene Element als Antwort auf die HTTP-Anfrage
    res.send(item);
};
