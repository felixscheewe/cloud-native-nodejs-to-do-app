// Importieren der benötigten Module und Funktionen
const db = require('../../src/persistence');  // Importiere das Modul für die Datenbank-Persistenz
const addItem = require('../../src/routes/addItem');  // Importiere die Route für das Hinzufügen von Elementen
const ITEM = { id: 12345 };  // Ein Beispiel-Element (wird wahrscheinlich nicht verwendet)
const {v4 : uuid} = require('uuid');  // Importiere die v4-Funktion aus dem 'uuid'-Modul

// Mocken der 'uuid' und 'persistence' Module
jest.mock('uuid', () => ({ v4: jest.fn() }));  // Mocke die 'v4' Funktion aus dem 'uuid'-Modul
jest.mock('../../src/persistence', () => ({  // Mocke das 'persistence'-Modul
    removeItem: jest.fn(),  // Mocke die 'removeItem' Funktion
    storeItem: jest.fn(),  // Mocke die 'storeItem' Funktion
    getItem: jest.fn(),  // Mocke die 'getItem' Funktion
}));

// Testfall für das Hinzufügen eines Elements
test('it stores item correctly', async () => {
    const id = 'something-not-a-uuid';  // Eine Beispiel-ID (keine gültige UUID)
    const name = 'A sample item';  // Der Name des hinzuzufügenden Elements
    const req = { body: { name } };  // Ein simuliertes Anfrageobjekt mit dem Elementnamen
    const res = { send: jest.fn() };  // Ein simuliertes Antwortobjekt mit einer 'send' Funktion

    uuid.mockReturnValue(id);  // Die gemockte 'uuid' Funktion gibt die vordefinierte ID zurück

    await addItem(req, res);  // Führe die 'addItem' Route mit den simulierten Anfragen aus

    const expectedItem = { id, name, completed: false };  // Das erwartete Element, das in der Datenbank gespeichert werden sollte

    // Überprüfe, ob die 'storeItem' Funktion einmal aufgerufen wurde und ob das erwartete Element übergeben wurde
    expect(db.storeItem.mock.calls.length).toBe(1);
    expect(db.storeItem.mock.calls[0][0]).toEqual(expectedItem);

    // Überprüfe, ob die 'send' Funktion des Antwortobjekts einmal aufgerufen wurde und ob das erwartete Element zurückgegeben wurde
    expect(res.send.mock.calls[0].length).toBe(1);
    expect(res.send.mock.calls[0][0]).toEqual(expectedItem);
});
