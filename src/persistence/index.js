// Überprüfe, ob die Umgebungsvariable POSTGRES_HOST gesetzt ist.
if (process.env.POSTGRES_HOST) {
  // Wenn POSTGRES_HOST gesetzt ist, importiere und exportiere das Modul './postgres'.
  module.exports = require('./postgres');
} else {
  // Andernfalls, wenn POSTGRES_HOST nicht gesetzt ist, importiere und exportiere das Modul './sqlite'.
  module.exports = require('./sqlite');
}
