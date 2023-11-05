// Importiere notwendige Module und Funktionen
const db = require('../../src/persistence'); // Importiere das persistence-Modul
const deleteItem = require('../../src/routes/deleteItem'); // Importiere die Funktion deleteItem
const ITEM = { id: 12345 }; // Definiere ein Beispiel-ITEM-Objekt mit einer ID

// Mocke das persistence-Modul, um die removeItem- und getItem-Funktionen zu fälschen
jest.mock('../../src/persistence', () => ({
    removeItem: jest.fn(), // Fälsche die removeItem-Funktion mit einer Jest-Funktion
    getItem: jest.fn(), // Fälsche die getItem-Funktion mit einer Jest-Funktion
}));

// Definiere einen Testfall
test('it removes item correctly', async () => {
    // Erstelle Mock-Objekte für Anfrage (req) und Antwort (res)
    const req = { params: { id: 12345 } }; // Erstelle eine Mock-Anfrage mit einer Parameter-ID
    const res = { sendStatus: jest.fn() }; // Erstelle eine Mock-Antwort mit einer sendStatus-Funktion

    // Rufe die deleteItem-Funktion mit der Mock-Anfrage und Mock-Antwort auf
    await deleteItem(req, res);

    // Überprüfe, ob die removeItem-Funktion aus der Mock-Datenbank einmal aufgerufen wurde
    expect(db.removeItem.mock.calls.length).toBe(1);
    // Überprüfe, ob die removeItem-Funktion mit der richtigen ID aufgerufen wurde
    expect(db.removeItem.mock.calls[0][0]).toBe(req.params.id);
    // Überprüfe, ob die sendStatus-Funktion der Antwort einmal aufgerufen wurde
    expect(res.sendStatus.mock.calls[0].length).toBe(1);
    // Überprüfe, ob die sendStatus-Funktion der Antwort mit dem Statuscode 200 aufgerufen wurde
    expect(res.sendStatus.mock.calls[0][0]).toBe(200);
});
