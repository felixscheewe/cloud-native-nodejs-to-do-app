# Cloud Native Nodejs To-Do-App
## Table of Contents
1. Einführung
2. Installation
3. Vorgenommene Konfigurationen
4. Vorteile und Nachteile der Cloud-Native-Realisierung
5. Datensicherheit und DSGVO
6. Alternative Realisierungsmöglichkeiten

## 1 Einführung
Mit der Docker-To-Do-App werden folgende Aspekte einer Cloud-Native Application beleuchtet:
- Containerisieren und Ausführen einer Node.js-Anwendung
- Eine lokale Umgebung für die Entwicklung einer Node.js-Anwendung mit Containern einrichten
- Tests für eine Node.js-Anwendung mithilfe von Containern ausführen
- Konfigurieren einer CI/CD-Pipeline für eine containerisierte Node.js-Anwendung mithilfe von GitHub-Actions

## 2 Installation

### 2.1 Ersteinrichtung
Klone das Repository in ein lokales Verzeichnis mit: git clone https://github.com/felixscheewe/cloud-native-nodejs-to-do-app.git

### 2.2 Applikation starten
Innerhalb des docker-nodejs-todo-app Verzeichnisses führe im Terminal folgenden Befehl aus:
docker compose up --build

Rufe anschließend über den Browser folgenden Link auf: http://localhost:3000/

### 2.3 Applikation stoppen
Gib im Terminal Ctrl+c ein

## 3. Vorgenommene Konfigurationen

### 3.1 Eine lokale Datenbank hinzufügen und Daten persistieren
Container können genutzt werden, um lokale Services wie eine Datenbank aufzusetzen.

Hierzu wurde in der Compose.yaml-Datei eine Postgres-Datenbank und ein Volume mit den entsprechenden Umgebungsvariablen definiert. Über ein Secret wird ein Txt-File mit den Zugangsdaten zur Datenbank referenziert. 

Die Persistenz der Daten kann überprüft werden, indem der Container zunächst gelöscht und danach wieder erstellt wird: 
docker compose rm 
docker compose up --build

### 3.2 Konfigurieren und Ausführen eines Entwicklungs-Containers
Das Dockerfile ist sowohl für das testen als auch die Produktion geeignet, da Nodemon konfiguriert wurde. 

- Hierzu wurde im Dockerfile ein Label als Basis für die FROM node:${NODE_VERSION}-alpine-Anweisung hinzugefügt. Dies ermöglicht es, in anderen Build-Stages auf diese Build-Stage zu verweisen. 
- Eine neue Build-Stage wurde mit der Bezeichnung dev hinzugefügt, um die dev-Abhängigkeiten zu installieren und den Container mit npm run dev zu starten. 
- Schließlich wurde eine Stage mit der Bezeichnung prod hinzugefügt, die die dev-Abhängigkeiten auslässt und die Anwendung mit node src/index.js ausführt. 
- Um aus dem Multi-Stage Dockerfile die Dev stage mit Compose auszuführen zu können, wurde in der Compose.yaml die target: dev Anweisung hinzugefügt.  
- Zudem wurde über den Server Service ein neues Volume angebunden. ./src wird hierzu von dem lokalen Rechner nach /usr/src/app/src im Container gemountet.
- Zum Schluss wird der Port 9229 für das Debugging freigegeben.

Überprüft werden kann der Entwicklung-Container durch folgende Schritte:
- Die Applikation wird mit docker compose up --build gestartet und mit http://localhost:3000/ im Browser aufgerufen
- Anschliessen kann docker-nodejs-sample/src/static/js/app.js aufgerufen werden und beispielsweise in Zeile 109 die Bezeichnung "Add Item" auf "Add" geändert werden.
- Nachdem http://localhost:3000/ im Browser aktualisiert wird, wird der geänderte Text direkt angezeigt.

### 3.3 Nodejs Test in einem Container ausführen
Im folgenden wird ein Unit Test für die Nodejs Anwendung durchgeführt.

- Mit "docker compose run server npm run test" wird das Test-Script in package.json-Datei ausgeführt
- Um Tests während der Entwicklung auszuführen, wurde das Dockerfile entsprechend angepasst. 
- Statt in der Testphase CMD zu nutzen, wird RUN genutzt um die Test auszuführen. Hintergrund ist, dass der CMD-Befehl ausgeführt wird, wenn der Container läuft, während der RUN-Befehl ausgeführt wird, wenn das Abbild erstellt wird und die Erstellung fehlschlägt, wenn die Tests fehlschlagen.
- Folgender Befehl wird ausgeführt, um ein neues Image unter Nutzung der Test Stage zu erstellen und die Testergebnisse einzusehen: " docker build -t node-docker-image-test --progress=plain --no-cache --target test"
- Mit "--progress=plain" kann die Build-Ausgabe angezeigt werden
- Mit "--no-cache" wird sichergestellt, dass die Tests immer ausgeführt werden
- "--target test" verwendet die Test Stage als Ziel.

### 3.4 Konfiguration von CI/ CD für die Nodejs-Anwendung

Im folgenden wurden GitHub-Actions eingerichtet und verwendet, um einen Wokflow zum Erstellen, Testen und Übertragen des Images an Docker-Hub zu verwenden.

- Hierzu wurde ein GitHub Repository eingerichtet.
- In den Einstellungen wurde unter den Einstellungen ein Secret mit dem Namen "DOCKER_USERNAME" und dem Wert der Docker-ID eingerichtet.
- In Docker Hub wurde ein "Personal Access Token (PAT)" mit dem Namen "node-docker" eingerichtet.
- Der PAT wurde als 2. Secret im GitHub Repository mit dem Namen "DOCKERHUB_Token" hinterlegt.
- Das Lokale Repository wurde auf Gihub hochgeladen
- Innerhalb des Repositorys wurde unter GitHub Actions ein eigener Workflow eingerichtet, welcher in der main.yml-Datei beschrieben ist.
- Der Workflow wird automatisch bei neuen Commits in den Main-Branch ausgeführt.
- Im Actions-Tab können die einzelnen Schritte des CI/ CD-Schritte nachvollzogen werden.
- Auf Docker Hub wird im Anschluss das Image gepushed

## 4 Vorteile und Nachteile der Cloud-Native-Realisierung
### 4.1 Vorteile:
- **Skalierbarkeit**: Cloud-Native-Anwendungen können einfach horizontal oder vertikal skaliert werden, um den Anforderungen gerecht zu werden. Dies ermöglicht eine bessere Leistung und Verfügbarkeit.
- **Isolation und Unabhängigkeit**: Durch die Verwendung von Containern können verschiedene Teile der Anwendung isoliert und unabhängig voneinander entwickelt und bereitgestellt werden.
- **Schnelle Bereitstellung**: Mit Kubernetes als Orchestrierungstool können Updates und Bereitstellungen effizienter und schneller durchgeführt werden.
- **Automatisierung**: Automatisierte Workflows, wie CI/CD, können problemlos integriert werden, um den Entwicklungs- und Bereitstellungsprozess zu beschleunigen.

### 4.2 Nachteile:
- **Komplexität**: Die Einführung von Cloud-Native-Technologien kann komplex sein und erfordert eine gewisse Einarbeitung und Schulung.
- **Kosten**: Die Nutzung von Cloud-Ressourcen kann kostspielig sein, wenn die Anwendung nicht effizient optimiert wird.
- **Datensicherheit**: Die Sicherung von Daten und die Gewährleistung der Datensicherheit kann eine Herausforderung sein, insbesondere wenn sensible Daten verarbeitet werden.
- **Kompatibilität**: Die Anwendung muss möglicherweise angepasst werden, um vollständig in einer Cloud-Native-Umgebung zu funktionieren.

## 5 Datensicherheit und DSGVO
Die Gewährleistung der Datensicherheit ist in einer Cloud-Native-Umgebung von entscheidender Bedeutung, insbesondere im Hinblick auf die Einhaltung der Datenschutz-Grundverordnung (DSGVO). Hier sind einige Schritte und Überlegungen:
- **Datenverschlüsselung**: Sensible Daten sollten verschlüsselt werden, sowohl im Ruhezustand als auch während der Übertragung. Dies ist entscheidend, um Datenschutzanforderungen zu erfüllen. Durch die Verwendung eines Secrets (Siehe Abschnitt 3.1) wurde diesem Aspekt rechnung getragen.
- **Zugriffskontrolle**: Die Berechtigungen für den Zugriff auf Daten und Ressourcen sollten streng kontrolliert und überwacht werden, um sicherzustellen, dass nur autorisierte Benutzer auf sensible Daten zugreifen können.
- **Auditing und Protokollierung**: Die Anwendung sollte Protokolle führen und Ereignisse aufzeichnen, um die Nachvollziehbarkeit und Compliance zu gewährleisten. Die Unterteilung in eine Prod- und eine Testumgebung sowie die Einrichtung von Continous Integration und Continous Development über GitHub-Actions (Abschnitt 3.2, 3.3 und 3.4) dokumentiert und testet Anpassungen automatisiert.
- **DSGVO-Konformität**: Die Anwendung sollte so gestaltet sein, dass sie die Anforderungen der DSGVO erfüllt. Dies kann die Einwilligung der Benutzer, das Recht auf Löschung und das Recht auf Datenübertragbarkeit umfassen. Die in der Datenbank gespeicherten Daten (Abschnit 3.1) können gelöscht sowie einzelne To-Dos erledigt werden.
- **Sicherheitsbewertungen**: Regelmäßige Sicherheitsbewertungen und Penetrationstests sind notwendig, um potenzielle Schwachstellen aufzudecken und zu beheben. Dies wurde durch die eingerichteten Test (Abschnitt 3.2, 3.3 und 3.4) berücksichtigt.

Es ist wichtig zu beachten, dass die DSGVO für die Anwendung relevant sein kann, insbesondere wenn sie personenbezogene Daten verarbeitet. Die Implementierung von Sicherheitsmaßnahmen und die Einhaltung der DSGVO sind entscheidend, um Datenschutzverletzungen zu verhindern und rechtliche Konsequenzen zu vermeiden.

## 6 Alternative Realisierungsmöglichkeiten
Die Realisierung als Cloud-Native-Anwendung bietet zahlreiche Vorteile, aber es gibt auch alternative Ansätze, die in Betracht gezogen werden können:
- **Monolithische Anwendung**: Statt einer Microservices-Architektur kann die Anwendung als ein großer monolithischer Block entwickelt werden. Dies erleichtert die Verwaltung, kann jedoch zu Problemen bei der Skalierbarkeit und Wartbarkeit führen.
- **Traditionelle Server-Bereitstellung**: Anstelle der Verwendung von Containern und Orchestrierungstools wie Kubernetes könnte die Anwendung auf herkömmlichen Servern oder virtuellen Maschinen gehostet werden. Dies bietet weniger Automatisierung und Skalierbarkeit.
- **Keine Cloud-Native Technologien**: Die Anwendung könnte ohne den Einsatz von Cloud-Native-Technologien entwickelt werden. In diesem Fall wären die Vorteile der Skalierbarkeit und Automatisierung möglicherweise eingeschränkt.



Um eine erfolgreiche Cloud-Native-Anwendung zu entwickeln und bereitzustellen, ist es entscheidend, die Sicherheit der Daten zu gewährleisten und die Datenschutzanforderungen zu erfüllen. Gleichzeitig sollten die Vorteile der Skalierbarkeit, Automatisierung und Effizienz genutzt werden, die die Cloud-Native-Technologien bieten.


