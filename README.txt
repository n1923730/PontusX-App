////////////////////////////////////////////////////////////////Disclaimer////////////////////////////////////////////////////////////////////////////

Bei diesem Programm handelt es sich um ein im Rahmen meiner Bachelorarbeit entwickeltes Node-JS Projekt, welches mit dem Dev-Net des Pontus-X Ökosystems interagiert.
Es können Datensätze erworben und dargestellt werden, sowie C2D-Prozesse gestartet werden.
Zudem gibt es eine Funktion, um bereits veröffentlichte Algorithmen auf die Whitelist bereits (selbst) veröffentlichter Datensätze zu setzen.

Dazu wird der Zugang der Firma neogramm genutzt. 

//////////////////////////////////////////////////////////////////SetUp/////////////////////////////////////////////////////////////////////////////////

Bisher getestet unter WSL2.0.

- Installationen der Dependencies (bsplw. mit "npm install ..."):
    "@deltadao/nautilus": "^1.0.2",
        "@types/express": "^4.17.21",
        "@types/node": "^22.5.0",
        "chart.js": "^4.4.4",
        "ejs": "^3.1.10",
        "ethers": "^5.0.0",
        "express": "^4.19.2",
        "typescript": "^5.5.4"

-> Beachte: höhere 'ethers' Versionen sind nicht mehr vollständig kompatibel, und beeinträchtigen die Lauffähigkeit des Codes. 

- Builden und Starten mit "npm run start".
    Daraufhin sollte die Console etwas anzeigen wie: 

        > pontusx-app@1.0.0 prestart
        > npm run build


        > pontusx-app@1.0.0 build
        > rimraf dist && npx tsc


        > pontusx-app@1.0.0 start
        > node ./dist

        now listening on port 8000
        No config found for given network '32456'
        initialisation done


    Die Fehlermeldung "No config found for given network '32456'" ist Teil der Nautilus-Bibliothek, und nur relevant, wenn Assets im Ökosystem veröffentlicht werden sollen. 
    Dies ist in der aktuellen Version des Programms nicht gegeben. 

- Öffnen eines Javascript-kompatibeln Browsers und Aufrufen von 'http://localhost:8000'


///////////////////////////////////////////////////////Interaktion mit dem Programm/////////////////////////////////////////////////////////////////////////////////////

Das Programm unterstützt in der aktuellen Version drei zentrale Funktionen (Use-Cases): 
- Das Erwerben und Darstellen eines Datensatzes aus dem Pontus-X Devnet. Dazu wird die DID des Datensatzes benötigt, eine Suchfunktion der verfügbaren Assets ist nicht implementiert.
- Ein bereits veröffentlichter Algorithmus kann auf die Whitelist eines bereits veröffentlichten Datensatzes gesetzt werden, wodurch die Verarbeitung über C2D möglich wird.
    Diese Funktion ist von entscheidender Bedeutung, da sie im Marketplace von Pontus-X nicht verfügbar ist, und ohne sie kein C2D möglich ist.
- Das Starten eines C2D-Prozesses unter Angabe der DIDs des Datensatzes und des Algorithmus, sowie das Abfragen des Status der Berechnungen und des Ergebnisses. 

Zu Testzwecken kann der im Rahmen dieser Arbeit erstellte und veröffentlichte C2D Algorithmus 'TestC2DWithNautilus' (DID = did:op:7e36f8d3c52faaa2f5aa9336b05ce9d9e499188b1408ebdeb9c0834c9b94c450)
mit dem Datensat 'DataForC2D' (DID = did:op:ea6890f851252e0646ab4887c40603182e42ab684f597f5731f02cfe9efe5be0) genutzt werden. #
Der Algorithmus berechnet den Mittelwert der 4 im Datensatz enthaltenen Datenpunkte.
-> Beachte: der Datensatz ist nur für C2D geeignet! Ein Datensatz kann nicht gleichermaßen zum Download und für C2D freigegeben werden.

Zur Darstellung der Datenpunkte muss ein weiterer Asset verwendet werden: 'DataTransfer-Test' (DID = did:op:0fa5657f7382ef32a82325160a5430b79be701a361dfa0f27e1c3f22a96ddaf3).
Dieser beinhaltet die selben Daten, ist aber zum Download freigegeben.

-> Beachte: alle Transaktionen kosten Netzwer-Gebühren. Im Devnet handelt es sich um fiktive EUROe. Neue Tokens können alle 12 Stunden unter https://portal.pontus-x.eu/faucet
angefragt werden. Der private Schlüssel zur Testwallet steht im File helperFunktions.ts.