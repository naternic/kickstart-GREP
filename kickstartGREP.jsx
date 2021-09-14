/* *********************** */
/* Projekt: Absatzformat mit benötigten GREP erstellen */
/* Datei: kickstartGREP_custom.js */
/* Entwickler: Nicolas Nater, Topix AG, topix.ch */

/* Changelog:
    2021-08-06 - Sprache/Wörterbuch ergänzt
/* *********************** */

function main() {

    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;

    if (app.documents.length == 0) {
        alert("Es ist kein Dokument geöffnet!");
        return;
    }

    /* *********************** */
    /* 1. DIALOGFENSTER ERSTELLEN */
    /* *********************** */

    var IstOkay = false;
    while (IstOkay == false) {
        var _window = new Window("dialog", "GREPs auswählen und definieren");
        _window.alignChildren = 'left';

        //Wörterbuch definieren
        var _langGroup = _window.add("group");
        _langGroup.add("statictext", undefined, "Wörterbuch: ");
        var _langCH = _langGroup.add("radiobutton", undefined, "CH");
        var _langDE = _langGroup.add("radiobutton", undefined, "DE");
        _langCH.value = true;

        //Spatium bei Interpunktionen
        var _spatiumGroup = _window.add("group");
        var _spatiumIntCheck = _spatiumGroup.add("checkbox", undefined);
        var _spatiumText = _spatiumGroup.add("statictext", undefined, "Spatium bei Interpunktionen mit Laufweite ");
        _spatiumIntCheck.value = true;
        var _spatiumValue = _spatiumGroup.add("edittext", undefined, "50");
        _spatiumValue.characters = 5;
        _spatiumValue.enabled = true;
        _spatiumIntCheck.onClick = function () {
            _spatiumValue.enabled = _spatiumIntCheck.value;
        };

        //Zahlen und Versalgruppen
        var _zahlenVersalienGroup = _window.add("group");
        var _zahlenVersalienCheck = _zahlenVersalienGroup.add("checkbox", undefined);
        var _zahlenVersalienText = _zahlenVersalienGroup.add("statictext", undefined, "Zahlen und Versalgruppen kleiner setzen mit Faktor (in %) ");
        _zahlenVersalienCheck.value = true;
        var _zahlenVersalienValue = _zahlenVersalienGroup.add("edittext", undefined, "97");
        _zahlenVersalienValue.characters = 5;
        _zahlenVersalienValue.enabled = true;
        _zahlenVersalienCheck.onClick = function () {
            _zahlenVersalienValue.enabled = _zahlenVersalienCheck.value;
        };

        //1 ausgleichen
        var _einerGroup = _window.add("group");
        var _einerCheck = _einerGroup.add("checkbox", undefined);
        var _einerText = _einerGroup.add("statictext", undefined, "Einer ausgleichen mit Laufweite ");
        _einerCheck.value = true;
        var _einerValue = _einerGroup.add("edittext", undefined, "-50");
        _einerValue.characters = 5;
        _einerValue.enabled = true;
        _einerCheck.onClick = function () {
            _einerValue.enabled = _einerCheck.value;
        };

        //Klammern höher setzen
        var _klammernGroup = _window.add("group");
        var _klammernCheck = _klammernGroup.add("checkbox", undefined);
        var _klammernText = _klammernGroup.add("statictext", undefined, "Klammern höher setzen mit Grundlinienversatz (in pt) ");
        _klammernCheck.value = true;
        var _klammernValue = _klammernGroup.add("edittext", undefined, "0.5");
        _klammernValue.characters = 5;
        _klammernValue.enabled = true;
        _klammernCheck.onClick = function () {
            _klammernValue.enabled = _klammernCheck.value;
        };

        //| höher setzen
        var _linieGroup = _window.add("group");
        var _linieCheck = _linieGroup.add("checkbox", undefined);
        var _linieText = _linieGroup.add("statictext", undefined, "| höher setzen mit Grundlinienversatz (in pt) ");
        _linieCheck.value = true;
        var _linieValue = _linieGroup.add("edittext", undefined, "0.75");
        _linieValue.characters = 5;
        _linieValue.enabled = true;
        _linieCheck.onClick = function () {
            _linieValue.enabled = _linieCheck.value;
        };

        //Raum vor Grad-Zeichen verringern
        var _gradGroup = _window.add("group");
        var _gradCheck = _gradGroup.add("checkbox", undefined);
        var _gradText = _gradGroup.add("statictext", undefined, "Raum vor Grad-Zeichen verringern mit Laufweite ");
        _gradCheck.value = true;
        var _gradValue = _gradGroup.add("edittext", undefined, "-150");
        _gradValue.characters = 5;
        _gradValue.enabled = true;
        _gradCheck.onClick = function () {
            _gradValue.enabled = _gradCheck.value;
        };

        //®, © und Potenzen hochstellen
        var _copyrightGroup = _window.add("group");
        var _copyrightCheck = _copyrightGroup.add("checkbox", undefined);
        var _copyrightText = _copyrightGroup.add("statictext", undefined, "®, © und Potenzen hochstellen");
        _copyrightCheck.value = true;

        //Buttons
        var _buttonGroup = _window.add("group");
        _buttonGroup.alignment = "center";
        _buttonGroup.add("button", undefined, "OK");
        _buttonGroup.add("button", undefined, "Cancel");

        var res = _window.show();

        if (res == 2) //Abbrechen
        {
            return;
        }

        //Ungültiges abfangen
        if (_spatiumIntCheck.value === false && _zahlenVersalienCheck.value === false && _einerCheck.value === false && _klammernCheck.value === false && _linieCheck.value === false && _gradCheck.value === false && _copyrightCheck.value === false) {
            alert("Bitte wähle mindestens einen GREP aus.");
        } else if (!_nanCheck(_spatiumValue) || !_nanCheck(_zahlenVersalienValue) || !_nanCheck(_einerValue) || !_nanCheck(_klammernValue) || !_nanCheck(_linieValue) || !_nanCheck(_gradValue)) {
            alert("Bitte bei allen angewählten Feldern eine gültige Zahl eingeben (Ganzzahlen, negative Zahlen und Dezimalstellen sind erlaubt).")
        }
        else {
            IstOkay = true;
        }

        function _nanCheck(val) {
            if (/^-?\d+([\.\,]\d+)?$/.test(val.text.toString())) {
                return true;
            } else {
                return false;
            }
        }
    }
    /* *********************** */
    /* 2. FORMATE ERSTELLEN */
    /* *********************** */

    //Variablen definieren
    var _absatzformat = "_Master_GREP";
    var _zeichenformate = [];
    var _textTests = [];
    var _doc = app.activeDocument;

    //Properties von gewählten Formaten in Array ablegen
    if (_spatiumIntCheck.value) {
        _zeichenformate.push(_spatiumText.text.replace(/(.+)( mit.+)/, "$1"))
        if (_langCH.value) {
            _textTests.push("Interpunktion/Klammern: «Anführungen» ‹Einfache Anführungen› Ausrufezeichen! Fragezeichen? Doppelpunkt: Semikolon; (Runde Klammern) {Geschwungene Klammern} [Eckige Klammern]\r")
        }
        else if (_langDE.value) {
            _textTests.push("Interpunktion/Klammern: »Anführungen« ›Einfache Anführungen‹ Ausrufezeichen! Fragezeichen? Doppelpunkt: Semikolon; (Runde Klammern) {Geschwungene Klammern} [Eckige Klammern]\r")
        }
    }
    if (_zahlenVersalienCheck.value) {
        _zeichenformate.push(_zahlenVersalienText.text.replace(/(.+)( mit.+)/, "$1"))
        _textTests.push("Zahlen- und Versalgruppen: USA EU FIFA UNESCO 10 200 1000 10 000 1 000 000 000 000\r")
    }
    if (_einerCheck.value) {
        _zeichenformate.push(_einerText.text.replace(/(.+)( mit.+)/, "$1"))
        _textTests.push("1 ausgleichen: 1212\r")
    }
    if (_klammernCheck.value) {
        _zeichenformate.push(_klammernText.text.replace(/(.+)( mit.+)/, "$1"))
    }
    if (_linieCheck.value) {
        _zeichenformate.push(_linieText.text.replace(/(.+)( mit.+)/, "$1"))
        _textTests.push("| höher setzen: In|Design\r")
    }
    if (_gradCheck.value) {
        _zeichenformate.push(_gradText.text.replace(/(.+)( mit.+)/, "$1"))
        _textTests.push("Grad-Zeichen: 100 °C\r")
    }
    if (_copyrightCheck.value) {
        _zeichenformate.push(_copyrightText.text.replace(/(.+)( mit.+)/, "$1"))
        _textTests.push("Hochstellen: Copyright©® cm2 mm2 km3 m2\r")
    }

    //Formate erstellen
    var _appliedLang;
    if (_langDE.value) {
        _appliedLang = "Deutsch: 2006 Rechtschreibreform"
    } else if (_langCH.value) {
        _appliedLang = "Deutsch: Schweiz 2006 Rechtschreibreform"
    }
    _doc.paragraphStyles.add({ name: _absatzformat, appliedFont: _doc.textDefaults.appliedFont.name, appliedLanguage: _appliedLang });
    for (var y = 0; y < _zeichenformate.length; y++) {
        _doc.characterStyles.add().name = "0" + (y + 1) + "_" + _zeichenformate[y];
    }

    /* *********************** */
    /* 3. TEXTFELD PLATZIEREN UND BEFÜLLEN */
    /* *********************** */

    var _dw = _doc.pages.firstItem().bounds[3];
    var _dh = _doc.pages.firstItem().bounds[2];
    var _textTestFrame = _doc.textFrames.add({ geometricBounds: [(_dh / 2) - 45, (_dw / 2) - 70, (_dh / 2) + 45, (_dw / 2) + 70], contents: _textTests.join("") });
    _textTestFrame.paragraphs.everyItem().appliedParagraphStyle = _absatzformat;

    /* *********************** */
    /* 4. FORMATE MIT PROPERTIES VERSEHEN */
    /* *********************** */

    for (var i = 0; i < _zeichenformate.length; i++) {
        //Spatien bei Interpunktion setzen (Laufweite 50)
        if (/Interpunktion/.test(_zeichenformate[i])) {
            _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]).tracking = +_spatiumValue.text;
            if (_langCH.value) {
                _doc.paragraphStyles.item(_absatzformat).nestedGrepStyles.add({ grepExpression: ".(?=[!?;:\\»\\›\\)\\]\\}])" }).appliedCharacterStyle = _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]);
                _doc.paragraphStyles.item(_absatzformat).nestedGrepStyles.add({ grepExpression: "[\\‹\\«\\(\\{\\[]" }).appliedCharacterStyle = _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]);
            } else if (_langDE.value) {
                _doc.paragraphStyles.item(_absatzformat).nestedGrepStyles.add({ grepExpression: ".(?=[!?;:\\«\\‹\\)\\]\\}])" }).appliedCharacterStyle = _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]);
                _doc.paragraphStyles.item(_absatzformat).nestedGrepStyles.add({ grepExpression: "[\\›\\»\\(\\{\\[]" }).appliedCharacterStyle = _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]);
            }

            //Zahlen und Versalien kleiner setzen und ausgleichen (Glyphenskalierung 97%)
        } else if (/Versal/.test(_zeichenformate[i])) {
            _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]).verticalScale = +_zahlenVersalienValue.text;
            _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]).horizontalScale = +_zahlenVersalienValue.text;
            _doc.paragraphStyles.item(_absatzformat).nestedGrepStyles.add({ grepExpression: "([A-Z]{3,})|(\\d{3,4}|\\d{1,2}(?=[~<|’]\\d{3}))" }).appliedCharacterStyle = _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]);
            //1 ausgleichen (Laufweite -50)
        } else if (/Einer/.test(_zeichenformate[i])) {
            _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]).tracking = +_einerValue.text;
            _doc.paragraphStyles.item(_absatzformat).nestedGrepStyles.add({ grepExpression: "1|.(?=1)" }).appliedCharacterStyle = _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]);
            //Klammern höher setzen (Grundlinienversatz 0.5pt)
        } else if (/Klammern/.test(_zeichenformate[i])) {
            _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]).baselineShift = _klammernValue.text;
            _doc.paragraphStyles.item(_absatzformat).nestedGrepStyles.add({ grepExpression: "[\\(\\)\\[\\]\\{\\}]" }).appliedCharacterStyle = _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]);
            //Vertikallinie höher setzen (Grundlinienversatz 0.75pt)
        } else if (/\|/.test(_zeichenformate[i])) {
            _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]).baselineShift = _linieValue.text;
            _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]).otfFraction = false;
            _doc.paragraphStyles.item(_absatzformat).nestedGrepStyles.add({ grepExpression: "\\|" }).appliedCharacterStyle = _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]);
            //®, © und Potenzen hochstellen (Position hochgestellt)
        } else if (/Potenzen/.test(_zeichenformate[i])) {
            _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]).position = Position.SUPERSCRIPT;
            _doc.paragraphStyles.item(_absatzformat).nestedGrepStyles.add({ grepExpression: "[®©]|(\\s[cmk]?m)\\K\\d" }).appliedCharacterStyle = _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]);
            //Raum vor Grad-Zeichen verringern (Laufweite -150)
        } else if (/Grad/.test(_zeichenformate[i])) {
            _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]).tracking = +_gradValue.text;
            _doc.paragraphStyles.item(_absatzformat).nestedGrepStyles.add({ grepExpression: "\\s(?=°C)" }).appliedCharacterStyle = _doc.characterStyles.item("0" + (i + 1) + "_" + _zeichenformate[i]);
        }
    }

    //Zeichenformate in Ordner verschieben
    var _grepGroup = _doc.characterStyleGroups.add({ name: "GREP" });
    for (var z = _zeichenformate.length - 1; z >= 0; z--) {
        _doc.characterStyles.item("0" + (z + 1) + "_" + _zeichenformate[z]).move(LocationOptions.AT_BEGINNING, _grepGroup);
    }

}

app.doScript(main, ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT);