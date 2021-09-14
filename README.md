# kickstart-GREP
InDesign script to automate a standard GREP paragraph style with user-defined values.

***********************
Projekt: Absatzformat mit benötigten GREP erstellen

Datei: kickstartGREP_custom.js

Entwickler: Nicolas Nater, Topix AG, topix.ch
***********************

***********************
1. INSTALLATION
***********************

Die Skript-Palette wird über das Fenster => Hilfsprogramme => Skripte aufgerufen. Mit einem Rechtsklick auf den Ordner «Benutzer» erscheint die Option «Im Finder anzeigen». Diese verweist auf ein Verzeichnis in der User-Library. Die Skripts, die im Ordner «Scripts Panel» abgelegt werden, werden künftig im Ordner «Benutzer» in der Skripts-Palette angezeigt.

***********************
2. FUNKTIONALITÄT
***********************

Das Skript erfragt über ein Eingabefeld die gewünschten mikrotypografischen Korrekturen. Es wird ein Absatzformat «_Master_GREP» mit der im Dokument festgelegten Schrift und Spracheinstellung angelegt. Basierend auf den Angaben aus dem Eingabefeld werden in diesem Absatzformat GREP-Stile und die dazu passenden Zeichenformate angelegt. Danach wird, ebenfalls basierend auf den Eingaben, ein Textfeld erzeugt und mit Beispieltext gefüllt, sodass die angewendete Mikrotypografie kontrolliert werden kann.

***********************
3. GREPs
***********************

Spatium bei Interpunktionen:
.(?=[!?;:\»\›\)\]\}])
=> Zeichen wird gefunden, wenn danach eines der aufgeführten Zeichen gefunden wird. Das Zeichenformat wird auf das Zeichen vor der Interpunktion angewendet.
[\‹\«\(\{\[]
=> Zeichen wird gefunden. Das Zeichenformat wird auf das Interpunktionszeichen angewendet.
2021-08-06: Deutsch ergänzt mit umgekehrten Anführungen

Zahlen- und Versalgruppen kleiner setzen:
([A-Z]{3,})|(\d{3,4}|\d{1,2}(?=[~<|’]\d{3}))
=> Es werden Versalgruppen ab drei Zeichen (vor dem |) und Zahlengruppen ab drei Zeichen (nach dem |) gefunden. Bei den Zahlengruppen werden ein- oder zweistellige Gruppen gefunden, wenn danach ein Achtelgeviert oder Apostroph, gefolgt von einer Dreiergruppe gefunden wird. Das Zeichenformat wird auf die Gruppe angewandt und skaliert die Glyphen um den gewünschten Prozentsatz.

1 ausgleichen:
1|.(?=1)
=> Es werden 1 oder Zeichen, auf die eine 1 folgt, gefunden. Das Zeichenformat wird auf das gefundene Zeichen angewandt.

Klammern höher setzen:
[\(\)\[\]\{\}]
=> Es werden alle Klammern gefunden und um den gewünschten Grundlinienversatz verschoben.

Vertikallinie höher setzen:
\|
=> Es werden alle Vertikallinien gefunden und um den gewünschten Grundlinienversatz verschoben.

Copyright-, Registered-Zeichen und Potenzen hochstellen
[®©]|(\s[cmk]?m)\K\d
=> Es werden ® oder © gefunden. Ausserdem werden Zahlen gefunden, wenn davor ein Abstand sowie entweder mm, cm, m oder km steht.

Raum vor Grad-Zeichen verringern
\s(?=°C)
=> Es werden Abstände gefunden, wenn darauf °C folgt.
