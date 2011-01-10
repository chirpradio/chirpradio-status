
const data = require("self").data;
const notifications = require("notifications");
const panels = require("panel");
const prefs = require("preferences-service");
const request = require('request');
const tabs = require("tabs");
const timer = require('timer');
const widgets = require('widget');

var api = 'https://chirpradio.appspot.com/api';
var widget;
var currentPlaylist;
var last_dj;
var last_song_id;
var update_interval;


exports.startup = function() {
    widget = widgets.Widget({
        label: "CHIRP Status",
        width: 16,
        contentURL: data.url('chirpradio.ico'),
        panel: panels.Panel({
            width: 280,
            height: 400,
            contentURL: data.url('status-panel.html'),
            contentScriptFile: [data.url('status-panel.js')],
        }),
        contentScript: 'postMessage("loaded")',
        contentScriptWhen: 'ready',
        onMessage: function(msg) {
        }
    });

    // TODO(Kumar) bind to pref change event
    if (!prefs.has('chirpradio-status.updateIntervalInMin')) {
        prefs.set('chirpradio-status.updateIntervalInMin', 1);
    }
    var min = parseInt(prefs.get('chirpradio-status.updateIntervalInMin'));
    update_interval = min * 60 * 1000;

    updateStatus();
    update_interval = timer.setInterval(function() {
        updateStatus();
    }, update_interval);
};

function updateStatus() {
    var req = request.Request({
        url: api + '/current_playlist?src=chirpradio-status',
        onComplete: function (response) {
            current_playlist = response.json;
            var d = current_playlist;
            console.log(d.now_playing.dj, ':',
                        d.now_playing.artist, '/', d.now_playing.track)

            widget.panel.postMessage(response.json);
            if (d.now_playing.dj != last_dj) {
                // TODO(Kumar) trigger/bind new_dj event
                notify(d.now_playing.dj);
            }
            last_dj = d.now_playing.dj;

            if (d.now_playing.id != last_song_id) {
                // TODO(Kumar) trigger/bind new_song event
                notify(d.now_playing.artist + ': ' +
                       d.now_playing.track + ' from ' +
                       d.now_playing.release);
            }
            last_song_id = d.now_playing.id;
        }
    });
    req.get();
}

function debugObject(obj) {
    console.log(obj);
    for (var k in obj) {
        console.log('  ', k, '=', obj[k]);
    }
}

function notify(msg) {
    notifications.notify({
        text: msg,
        iconURL: data.url('chirpradio.ico'),
        onClick: function(data) {
            tabs.open('http://chirpradio.org/');
        }
    });
}
