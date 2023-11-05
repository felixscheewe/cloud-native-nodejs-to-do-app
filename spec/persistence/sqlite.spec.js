// Importieren der erforderlichen Module
const db = require('../../src/persistence/sqlite'); // Importieren der SQLite-Datenbankbibliothek
const fs = require('fs'); // Importieren des Dateisystems-Moduls
const location = process.env.SQLITE_DB_LOCATION || '/tmp/todo.db'; // Festlegen des Dateipfads der SQLite-Datenbank

// Definieren eines Beispiel-Elements (ITEM), das für Tests verwendet wird
const ITEM = {
    id: '7aef3d7c-d301-4846-8358-2a91ec9d6be3',
    name: 'Test',
    completed: false,
};

// Vor jedem Testfall wird die SQLite-Datenbank-Datei, sofern vorhanden, gelöscht
beforeEach(() => {
    if (fs.existsSync(location)) {
        fs.unlinkSync(location);
    }
});

// Testfall 1: Überprüfung der Initialisierung der Datenbank
test('it initializes correctly', async () => {
    await db.init(); // Initialisiert die SQLite-Datenbank
});

// Testfall 2: Überprüfung des Speicherns und Abrufens von Elementen in der Datenbank
test('it can store and retrieve items', async () => {
    await db.init(); // Initialisiert die SQLite-Datenbank

    // Speichert ein ITEM in der Datenbank
    await db.storeItem(ITEM);

    // Ruft alle Elemente aus der Datenbank ab
    const items = await db.getItems();

    // Überprüft, ob die Anzahl der abgerufenen Elemente 1 ist und ob das abgerufene Element gleich ITEM ist
    expect(items.length).toBe(1);
    expect(items[0]).toEqual(ITEM);
});

// Testfall 3: Überprüfung der Aktualisierung eines vorhandenen Elements in der Datenbank
test('it can update an existing item', async () => {
    await db.init(); // Initialisiert die SQLite-Datenbank

    // Ruft initial alle Elemente aus der Datenbank ab (sollte leer sein)
    const initialItems = await db.getItems();
    expect(initialItems.length).toBe(0);

    // Speichert ein ITEM in der Datenbank
    await db.storeItem(ITEM);

    // Aktualisiert das Element in der Datenbank, indem der Wert von "completed" umgekehrt wird
    await db.updateItem(
        ITEM.id,
        Object.assign({}, ITEM, { completed: !ITEM.completed }),
    );

    // Ruft die aktualisierten Elemente aus der Datenbank ab
    const items = await db.getItems();

    // Überprüft, ob die Anzahl der abgerufenen Elemente 1 ist und ob "completed" umgekehrt wurde
    expect(items.length).toBe(1);
    expect(items[0].completed).toBe(!ITEM.completed);
});

// Testfall 4: Überprüfung des Entfernens eines vorhandenen Elements aus der Datenbank
test('it can remove an existing item', async () => {
    await db.init(); // Initialisiert die SQLite-Datenbank
    await db.storeItem(ITEM); // Speichert ein ITEM in der Datenbank

    // Entfernt das ITEM aus der Datenbank
    await db.removeItem(ITEM.id);

    // Ruft alle Elemente aus der Datenbank ab und überprüft, ob die Datenbank leer ist
    const items = await db.getItems();
    expect(items.length).toBe(0);
});

// Testfall 5: Überprüfung des Abrufens eines einzelnen Elements aus der Datenbank
test('it can get a single item', async () => {
    await db.init(); // Initialisiert die SQLite-Datenbank
    await db.storeItem(ITEM); // Speichert ein ITEM in der Datenbank

    // Ruft ein einzelnes Element aus der Datenbank ab und überprüft, ob es gleich ITEM ist
    const item = await db.getItem(ITEM.id);
    expect(item).toEqual(ITEM);
});
