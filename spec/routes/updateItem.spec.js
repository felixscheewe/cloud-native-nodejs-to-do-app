// Importiere die erforderlichen Module und Funktionen
const db = require('../../src/persistence'); // Importiere das Modul 'persistence'
const updateItem = require('../../src/routes/updateItem'); // Importiere die Funktion 'updateItem'
const ITEM = { id: 12345 }; // Erstelle ein Testobjekt ITEM mit einer ID

// Mocke das 'persistence'-Modul für Jest-Tests
jest.mock('../../src/persistence', () => ({
    getItem: jest.fn(), // Mocke die 'getItem'-Funktion mit einer Jest-Funktion
    updateItem: jest.fn(), // Mocke die 'updateItem'-Funktion mit einer Jest-Funktion
}));

// Führe den Jest-Test aus
test('it updates items correctly', async () => {
    // Erstelle Testdaten für die Request (req) und Response (res) Objekte
    const req = {
        params: { id: 1234 }, // Definiere Parameter mit einer ID
        body: { name: 'New title', completed: false }, // Definiere den Request-Body mit einem Namen und dem Status 'completed'
    };
    const res = { send: jest.fn() }; // Mocke die 'send'-Funktion im Response-Objekt

    // Setze die Mock-Funktion 'getItem' in 'db' auf eine Promise, die 'ITEM' auflöst
    db.getItem.mockReturnValue(Promise.resolve(ITEM));

    // Rufe die 'updateItem' Funktion mit 'req' und 'res' auf
    await updateItem(req, res);

    // Überprüfe, ob die 'updateItem' und 'getItem' Funktionen wie erwartet aufgerufen wurden
    expect(db.updateItem.mock.calls.length).toBe(1); // Überprüfe, ob 'updateItem' einmal aufgerufen wurde
    expect(db.updateItem.mock.calls[0][0]).toBe(req.params.id); // Überprüfe, ob die erste Argument-ID mit der in 'req' übereinstimmt
    expect(db.updateItem.mock.calls[0][1]).toEqual({
        name: 'New title',
        completed: false,
    }); // Überprüfe, ob das zweite Argument mit den Daten aus 'req.body' übereinstimmt

    expect(db.getItem.mock.calls.length).toBe(1); // Überprüfe, ob 'getItem' einmal aufgerufen wurde
    expect(db.getItem.mock.calls[0][0]).toBe(req.params.id); // Überprüfe, ob die Argument-ID mit der in 'req' übereinstimmt

    // Überprüfe, ob die 'send' Funktion im Response-Objekt einmal aufgerufen wurde und das erwartete ITEM zurückgibt
    expect(res.send.mock.calls[0].length).toBe(1); // Überprüfe die Länge des send-Aufrufs
    expect(res.send.mock.calls[0][0]).toEqual(ITEM); // Überprüfe, ob das zurückgegebene Objekt mit dem erwarteten ITEM übereinstimmt
});
