const waitPort = require('wait-port'); // Ein Modul zum Warten auf das Verfügbarwerden eines Netzwerk-Ports
const fs = require('fs'); // Das Modul "fs" wird zum Lesen von Dateien verwendet.
const { Client } = require('pg'); // Ein Modul, das den PostgreSQL-Client bereitstellt.

// Die folgenden Zeilen destrukturieren Umgebungsvariablen und weisen sie Variablen zu.
const {
    POSTGRES_HOST: HOST,
    POSTGRES_HOST_FILE: HOST_FILE,
    POSTGRES_USER: USER,
    POSTGRES_USER_FILE: USER_FILE,
    POSTGRES_PASSWORD: PASSWORD,
    POSTGRES_PASSWORD_FILE: PASSWORD_FILE,
    POSTGRES_DB: DB,
    POSTGRES_DB_FILE: DB_FILE,
} = process.env;

let client; // Eine Variable, die den PostgreSQL-Client speichert.

// Die "init" Funktion wird verwendet, um die Verbindung zur PostgreSQL-Datenbank herzustellen.
async function init() {
    const host = HOST_FILE ? fs.readFileSync(HOST_FILE) : HOST; // Host aus Umgebungsvariablen oder aus einer Datei lesen.
    const user = USER_FILE ? fs.readFileSync(USER_FILE) : USER; // Benutzername aus Umgebungsvariablen oder aus einer Datei lesen.
    const password = PASSWORD_FILE ? fs.readFileSync(PASSWORD_FILE, 'utf8') : PASSWORD; // Passwort aus Umgebungsvariablen oder aus einer Datei lesen.
    const database = DB_FILE ? fs.readFileSync(DB_FILE) : DB; // Datenbankname aus Umgebungsvariablen oder aus einer Datei lesen.

    // Auf das Bereitwerden des PostgreSQL-Ports warten.
    await waitPort({ 
        host, 
        port: 5432, // Der Standard-PostgreSQL-Port ist 5432.
        timeout: 10000, // Ein Timeout von 10 Sekunden.
        waitForDns: true,
    });

    // Einen neuen PostgreSQL-Client erstellen und Verbindung zur Datenbank herstellen.
    client = new Client({
        host,
        user,
        password,
        database
    });

    return client.connect().then(async () => {
        console.log(`Connected to postgres db at host ${HOST}`);
        // Führe SQL-Anweisungen aus, um die Tabelle "todo_items" zu erstellen, falls sie nicht existiert.
        await client.query('CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean)');
        console.log('Connected to db and created table todo_items if it did not exist');
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });
}

// Die folgenden Funktionen führen verschiedene Operationen auf der Tabelle "todo_items" aus, wie das Abrufen von Einträgen, Speichern, Aktualisieren und Löschen.

// Die "getItems" Funktion gibt alle Einträge aus der Tabelle zurück.
// Die "getItem" Funktion gibt einen bestimmten Eintrag anhand seiner ID zurück.
// Die "storeItem" Funktion speichert einen neuen Eintrag.
// Die "updateItem" Funktion aktualisiert einen Eintrag.
// Die "removeItem" Funktion löscht einen Eintrag.

// Die "teardown" Funktion wird verwendet, um die Verbindung zum PostgreSQL-Client zu beenden.

module.exports = {
  init,
  teardown,
  getItems,
  getItem,
  storeItem,
  updateItem,
  removeItem,
};
