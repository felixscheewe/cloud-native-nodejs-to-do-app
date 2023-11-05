// Importieren des Moduls '../persistence' und Zuweisen an die Variable 'db'
const db = require('../persistence');

// Exportieren einer Funktion als Modul, die eine HTTP-Anfrage (req) und eine HTTP-Antwort (res) erwartet
module.exports = async (req, res) => {
    // Das 'await' keyword wird verwendet, um auf die Beendigung der 'removeItem' Funktion von 'db' zu warten,
    // bevor mit dem nächsten Schritt fortgefahren wird. 'req.params.id' wird als Argument an 'removeItem' übergeben.
    await db.removeItem(req.params.id);

    // Senden einer HTTP-Antwort mit dem Statuscode 200 (OK) an den Client, um anzuzeigen, dass die Anfrage erfolgreich war.
    res.sendStatus(200);
};
