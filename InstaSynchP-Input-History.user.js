// ==UserScript==
// @name        InstaSynchP Input History
// @namespace   InstaSynchP
// @description Plugin to browse your chat history
// @version     1.0.6
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-Input-History
// @license     GPL-3.0

// @include     http://*.instasynch.com/*
// @include     http://instasynch.com/*
// @include     http://*.instasync.com/*
// @include     http://instasync.com/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js
// ==/UserScript==

function InputHistory(version) {
    "use strict";
    this.version = version;
    this.history = [''];
    this.index = 0;
}

function inputHistoryRef() {
    return window.plugins.inputHistory;
}

InputHistory.prototype = {
    get history() {
        return this._history;
    },
    set history(value) {
        this._history = value;
    },

    get index() {
        return this._index % this._history.length;
    },
    set index(value) {
        this._index = value;
        //disable autocomplete when browsing history
        if (window.plugins.autocomplete) {
            window.plugins.autocomplete.enabled = (this.index === 0);
        }
    }
};

InputHistory.prototype.executeOnce = function () {
    "use strict";
    var th = inputHistoryRef();
    events.on('SendChat', function (event, message) {
        if (th.index !== 0) {
            //remove the string from the array
            th.history.splice(th.index, 1);
        }
        //add the string to the array at position 1
        th.history.splice(1, 0, message);
        th.index = 0;
    });

    function checkAutocomplete() {
        if (window.plugins.autocomplete && window.plugins.autocomplete.menuActive && th.index === 0) {
            return true;
        }
        return false;
    }

    events.on('InputKeydown[38]', function (event, message) {
        if (checkAutocomplete()) {
            return;
        }
        th.index += 1;
        th.writeHistory();
    });
    events.on('InputKeydown[40]', function (event, message) {
        if (checkAutocomplete()) {
            return;
        }
        th.index = (th.index === 0) ? th.history.length - 1 : th.index - 1;
        th.writeHistory();
    });
    events.on('InputKeydown', function (event) {
        if (event.keyCode !== 40 && event.keyCode !== 38) {
            //enable autocomplete when changing stuff in history
            if (window.plugins.autocomplete) {
                window.plugins.autocomplete.enabled = true;
            }
        }
    });
};

InputHistory.prototype.writeHistory = function () {
    "use strict";
    var len = this.history[this.index].length;
    $('#chat input').val(this.history[this.index]);
    $('#chat input')[0].setSelectionRange(len, len);
};

InputHistory.prototype.resetVariables = function () {
    "use strict";
    this.index = 0;
};
window.plugins = window.plugins || {};
window.plugins.inputHistory = new InputHistory("1.0.6");
