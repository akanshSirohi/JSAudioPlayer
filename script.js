//Initialization
var audio;
var gTime;
var index = 0;
var playlist;
startPlayer();

function startPlayer() {
  $.post(
    "loadPlaylist.php",
    {
      data: "1",
    },
    function (e) {
      initializeAudio(e);
    }
  );
}

function initializeAudio(list) {
  audio = new Audio();
  playlist = list;
  playlist = playlist.split(",");
  audio.src = playlist[index];
  audio.addEventListener("timeupdate", updateDur);
  let data = "";
  for (let i = 0; i < playlist.length; i++) {
    let name2 = playlist[i];
    name2 = name2.split("/");
    name2 = name2[name2.length - 1];
    if (i == 0) {
      data =
        data +
        '<li class="active" id="' +
        i +
        'li" onclick="activateMe(this.id);"><a href="#">' +
        name2 +
        "</a></li>";
    } else {
      data =
        data +
        '<li id="' +
        i +
        'li" onclick="activateMe(this.id);"><a href="#">' +
        name2 +
        "</a></li>";
    }
  }
  $("#songList").html(data);
  updateSongName();
}

//Play Pause Handler
function playMusic() {
  if (audio.paused) {
    audio.play();
    $("#pp").attr("src", "img/pause.png");
    $("#well").css("animation", "asoftH 7s ease infinite");
    $("#well").css("background-size", "400% 400%");

    $("#well2").css("animation", "asoftH 7s ease infinite");
    $("#well2").css("background-size", "400% 400%");
  } else {
    audio.pause();
    $("#pp").attr("src", "img/play.png");
    $("#well").css("animation", "");
    $("#well2").css("animation", "");
  }
}

//Music Time Update Event
function updateDur() {
  var perc = (audio.currentTime * 100) / audio.duration;
  $("#as").css("width", perc + "%");
  let curMin = Math.floor(audio.currentTime / 60);
  let curSec = Math.floor(audio.currentTime - curMin * 60);
  let durMin = Math.floor(audio.duration / 60);
  let durSec = Math.floor(audio.duration - durMin * 60);
  if (curMin < 10) {
    curMin = "0" + curMin;
  }
  if (curSec < 10) {
    curSec = "0" + curSec;
  }
  if (durMin < 10) {
    durMin = "0" + durMin;
  }
  if (durSec < 10) {
    durSec = "0" + durSec;
  }
  gTime = curMin + ":" + curSec + "/" + durMin + ":" + durSec;
  $("#time").html(gTime);
  $("#timeL").html(gTime);
  let mappedSeek = map(audio.currentTime, 0, audio.duration, 0, 100);
  $("#seek").slider("setValue", mappedSeek);
  if (audio.currentTime == audio.duration) {
    $("#pp").attr("src", "img/play.png");
    $("#as").css("width", "0%");
    gTime = "00:00/00:00";
    $("#seek").slider("setValue", 0);
    $("#timeL").html("00:00/00:00");
    $("#well").css("animation", "");
    $("#well2").css("animation", "");
    nextSong();
  }
}

//Create Seek Bars
$(".seek").tooltip({
  title: '<span id="time">00:00/00:00</span>',
  html: true,
  placement: "bottom",
});
var volume = $("#volume")
  .slider({
    formatter: function (value) {
      return "Volume: " + value;
    },
  })
  .on("change", vol)
  .data("slider");
var seek = $("#seek").slider().on("change", seekMod).data("slider");

//Volume Control Function
function vol() {
  audio.volume = volume.getValue() / 100;
  let img;
  if (volume.getValue() == 0) {
    img = 0;
    $("#speaker").attr("src", "img/off.png");
  } else {
    img = map(volume.getValue(), 0, 100, 1, 5);
    $("#speaker").attr("src", "img/on.png");
  }
  img = Math.round(img);
  img = "volLevels/" + img + ".png";
  $("#volLevels").attr("src", img);
}

//Seek Music Time Handle
function seekMod() {
  let t = seek.getValue();
  let mappedVol = map(t, 0, 100, 0, audio.duration);
  audio.currentTime = mappedVol;
}

//Mute Function
function mute() {
  if (audio.muted) {
    volume.enable();
    audio.muted = false;
    $("#speaker").attr("src", "img/on.png");
    $("#volLevels").css("filter", "opacity(1)");
  } else {
    volume.disable();
    audio.muted = true;
    $("#speaker").attr("src", "img/off.png");
    $("#volLevels").css("filter", "opacity(0.5)");
  }
}

//Tooltip For Seekbar
function setLabel() {
  $("#time").html(gTime);
}

//Map Function
function map(n, start1, stop1, start2, stop2, withinBounds) {
  var newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return constrain(newval, start2, stop2);
  } else {
    return constrain(newval, stop2, start2);
  }
}
function constrain(n, low, high) {
  return Math.max(Math.min(n, high), low);
}

function updateSongName() {
  let name = playlist[index];
  name = name.split("/");
  name = name[name.length - 1];
  $("#songName").html(name);
}

function nextSong() {
  index++;
  audio.pause();
  audio.currentTime = 0;
  if (index <= playlist.length - 1) {
    audio.src = playlist[index];
    playMusic();
    updateSongName();
    activateMe(index + "li", index - 1 + "li");
  } else {
    activateMe("0li", index - 1 + "li");
    reset();
  }
}

function reset(val = 0) {
  gTime = "00:00/00:00";
  $("#timeL").html(gTime);
  $("#time").html(gTime);
  $("#seek").slider("setValue", 0);
  $("#pp").attr("src", "img/play.png");
  $("#well").css("animation", "");
  $("#well2").css("animation", "");
  index = val;
  updateSongName();
  audio.src = playlist[index];
}

function activateMe(newId, oldId = index + "li") {
  audio.pause();
  audio.currentTime = 0;
  audio.src = playlist[newId[0]];
  $("#" + oldId).attr("class", "");
  $("#" + newId).attr("class", "active");
  playMusic();
  index = newId[0];
  updateSongName();
}

function playPrev() {
  index--;
  audio.pause();
  audio.currentTime = 0;
  if (index >= 0) {
    audio.src = playlist[index];
    playMusic();
    updateSongName();
    activateMe(index + "li", index + 1 + "li");
  } else {
    activateMe(playlist.length - 1 + "li", index + 1 + "li");
    reset(playlist.length - 1);
  }
}

function playNext() {
  nextSong();
}

function seekS(mode) {
  if (mode == "f") {
    let t = audio.currentTime + 5;
    if (t <= audio.duration) {
      audio.currentTime = t;
    }
  } else if (mode == "b") {
    let t = audio.currentTime - 5;
    if (t >= 0) {
      audio.currentTime = t;
    }
  }
}
