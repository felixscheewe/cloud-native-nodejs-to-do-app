// Importieren der benötigten Module
const db = require('../../src/persistence'); // Importiert das Modul 'persistence' aus dem angegebenen Pfad
const getItems = require('../../src/routes/getItems'); // Importiert die 'getItems'-Funktion aus dem angegebenen Pfad
const ITEMS = [{ id: 12345 }]; // Eine Beispiel-Datenquelle mit einem Array von Objekten

// Mocken (Überschreiben) des 'getItems'-Moduls, um Testfälle zu isolieren
jest.mock('../../src/persistence', () => ({
    getItems: jest.fn(), // Mockt die 'getItems'-Funktion aus dem 'persistence'-Modul
}));

// Definieren eines Testfalls
test('it gets items correctly', async () => {
    const req = {}; // Ein leeres Anfrage-Objekt
    const res = { send: jest.fn() }; // Ein Antwort-Objekt mit einer mockierten 'send'-Funktion

    // Konfigurieren des Mocks für 'db.getItems' und Rückgabewert
    db.getItems.mockReturnValue(Promise.resolve(ITEMS));

    // Aufruf der 'getItems'-Funktion mit den vorbereiteten Anfrage- und Antwort-Objekten
    await getItems(req, res);

    // Überprüfen, ob die 'getItems'-Funktion aufgerufen wurde
    expect(db.getItems.mock.calls.length).toBe(1);

    // Überprüfen, ob die 'send'-Funktion auf dem Antwort-Objekt aufgerufen wurde
    expect(res.send.mock.calls[0].length).toBe(1);

    // Überprüfen, ob die von 'getItems' zurückgegebenen Daten mit 'ITEMS' übereinstimmen
    expect(res.send.mock.calls[0][0]).toEqual(ITEMS);
});
