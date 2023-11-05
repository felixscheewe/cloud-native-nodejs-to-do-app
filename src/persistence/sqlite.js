// Importieren der erforderlichen Node.js-Module
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Bestimmen des Speicherortes der SQLite-Datenbank
const location = process.env.SQLITE_DB_LOCATION || '/tmp/todo.db';

// Deklarieren von Variablen zur Speicherung der SQLite-Datenbank und Promisify-Funktionen
let db, dbAll, dbRun;

// Initialisierungsfunktion für die SQLite-Datenbank
function init() {
    // Überprüfen, ob das Verzeichnis existiert, andernfalls erstellen
    const dirName = require('path').dirname(location);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    // Rückgabe einer Promise für die Datenbankinitialisierung
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(location, err => {
            if (err) return reject(err);

            if (process.env.NODE_ENV !== 'test')
                console.log(`Using sqlite database at ${location}`);

            // Erstellen der "todo_items"-Tabelle, wenn sie nicht existiert
            db.run(
                'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean)',
                (err, result) => {
                    if (err) return reject(err);
                    resolve();
                },
            );
        });
    });
}

// Funktion zum Beenden der Datenbankverbindung
async function teardown() {
    return new Promise((resolve, reject) => {
        db.close(err => {
            if (err) reject(err);
            else resolve();
        });
    });
}

// Funktionen zur Abfrage von Aufgaben aus der Datenbank
async function getItems() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM todo_items', (err, rows) => {
            if (err) return reject(err);
            resolve(
                rows.map(item =>
                    Object.assign({}, item, {
                        completed: item.completed === 1,
                    }),
                ),
            );
        });
    });
}

async function getItem(id) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM todo_items WHERE id=?', [id], (err, rows) => {
            if (err) return reject(err);
            resolve(
                rows.map(item =>
                    Object.assign({}, item, {
                        completed: item.completed === 1,
                    }),
                )[0],
            );
        });
    });
}

// Funktionen zum Hinzufügen, Aktualisieren und Löschen von Aufgaben in der Datenbank
async function storeItem(item) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)',
            [item.id, item.name, item.completed ? 1 : 0],
            err => {
                if (err) return reject(err);
                resolve();
            },
        );
    });
}

async function updateItem(id, item) {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE todo_items SET name=?, completed=? WHERE id = ?',
            [item.name, item.completed ? 1 : 0, id],
            err => {
                if (err) return reject(err);
                resolve();
            },
        );
    });
}

async function removeItem(id) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM todo_items WHERE id = ?', [id], err => {
            if (err) return reject(err);
            resolve();
        });
    });
}

// Exportieren der Funktionen für den externen Gebrauch
module.exports = {
    init,
    teardown,
    getItems,
    getItem,
    storeItem,
    updateItem,
    removeItem,
};
