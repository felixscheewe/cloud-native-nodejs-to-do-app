# Verwende die Docker Build-Syntax Version 1
# Dies ist die erforderliche Zeile für die Verwendung des Syntaxes

ARG NODE_VERSION=18.0.0
# Definiere eine Build-Argument (NODE_VERSION) mit einem Standardwert von 18.0.0.

FROM node:${NODE_VERSION}-alpine as base
# Verwende das offizielle Node.js-Base-Image mit der angegebenen Node-Version und dem Alpine-Linux-Unterbau.
# Benenne diese Stufe als "base".
WORKDIR /usr/src/app
# Setze das Arbeitsverzeichnis innerhalb des Containers auf "/usr/src/app".
EXPOSE 3000
# Deklariere, dass der Container den Port 3000 nach außen freigibt.

# Erstelle eine separate Build-Stufe für die Entwicklungsumgebung
FROM base as dev
# Erbe von der vorherigen Stufe "base" und nenne diese Stufe "dev".
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
# Führe einen "npm ci" Befehl aus, um die Abhängigkeiten zu installieren.
# Hier werden die Dateien package.json und package-lock.json von der Host-Maschine in den Container gebunden,
# und der Node.js-Modulcache wird für den Build optimiert.
USER node
# Setze den Benutzer im Container auf "node".
COPY . .
# Kopiere alle Dateien aus dem aktuellen Verzeichnis in den Container.
CMD npm run dev
# Starte die Anwendung im Entwicklungsumgebung mit dem Befehl "npm run dev".

# Erstelle eine separate Build-Stufe für die Produktionsumgebung
FROM base as prod
# Erbe von der vorherigen Stufe "base" und nenne diese Stufe "prod".
ENV NODE_ENV production
# Setze die Umgebungsvariable NODE_ENV auf "production".
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
# Führe einen "npm ci" Befehl aus, um die Produktionsabhängigkeiten zu installieren.
# Hier werden die Dateien package.json und package-lock.json von der Host-Maschine in den Container gebunden,
# und der Node.js-Modulcache wird für den Build optimiert.
USER node
# Setze den Benutzer im Container auf "node".
COPY . .
# Kopiere alle Dateien aus dem aktuellen Verzeichnis in den Container.
CMD node src/index.js
# Starte die Anwendung in der Produktionsumgebung mit dem Befehl "node src/index.js".

# Erstelle eine separate Build-Stufe für die Testumgebung
FROM base as test
# Erbe von der vorherigen Stufe "base" und nenne diese Stufe "test".
ENV NODE_ENV test
# Setze die Umgebungsvariable NODE_ENV auf "test".
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
# Führe einen "npm ci" Befehl aus, um die Testabhängigkeiten zu installieren.
# Hier werden die Dateien package.json und package-lock.json von der Host-Maschine in den Container gebunden,
# und der Node.js-Modulcache wird für den Build optimiert.
USER node
# Setze den Benutzer im Container auf "node".
COPY . .
# Kopiere alle Dateien aus dem aktuellen Verzeichnis in den Container.
RUN npm run test
# Führe den Befehl "npm run test" aus, um Tests in der Testumgebung auszuführen.
