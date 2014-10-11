// ==UserScript==
// @name        InstaSynchP Input History
// @namespace   InstaSynchP
// @description Plugin to browse your chat history
// @version     1
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

function Plugin() {
    "use strict";
    this.version = 1;
    this.history = [''];
    this.index = 0;
}

function ref() {
    return window.plugins.inputHistory;
}

Plugin.prototype = {
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
    }
};

Plugin.prototype.executeOnce = function () {
    "use strict";
    var th = ref();
    events.on('SendChat', function (event, message) {
        if (th.index !== 0) {
            //remove the string from the array
            th.history.splice(th.index, 1);
        }
        //add the string to the array at position 1
        th.history.splice(1, 0, message);
        th.index = 0;
    });
    events.on('InputKeydown[38]', function (event, message) {
        th.index += 1;
        th.writeHistory();
    });
    events.on('InputKeydown[40]', function (event, message) {
        th.index = (th.index === 0) ? th.history.length - 1 : th.index - 1;
        th.writeHistory();
    });
};

Plugin.prototype.writeHistory = function () {
    "use strict";
    var len = this.history.length;
    $('#chat input').val(this.history[this.index]);
    $('#chat input')[0].setSelectionRange(len, len);
};

Plugin.prototype.resetVariables = function () {
    "use strict";
    this.index = 0;
};
window.plugins = window.plugins || {};
window.plugins.inputHistory = new Plugin();
