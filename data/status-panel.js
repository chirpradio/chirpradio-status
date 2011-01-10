
onMessage = function onMessage(data) {
    var pl = document.querySelector('.mini-playlist');
    pl.innerHTML = '';
    pl.appendChild(renderTrack(data.now_playing, true));
    for (var i in data.recently_played) {
        pl.appendChild(renderTrack(data.recently_played[i], false));
    }
};

function renderTrack(trk, is_first) {
    var li = document.createElement('li');
    if (is_first) {
        li.setAttribute('class', 'first');
    }
    li.innerHTML = '<strong>' + trk.artist + '</strong> '
                              + trk.track + ' from <em>'
                              + trk.release + '</em>';
    return li;
}
