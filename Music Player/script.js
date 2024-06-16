let currentSong = new Audio();
let songsArr;
let currentFolder;

// Play a song
const playSong = function (track, pause = false) {
  currentSong.src = `/songs/${currentFolder}/` + track;
  if (!pause) {
    currentSong.play();
    currentSong.volume = document.querySelector("#volrange").value / 100;
    play.src = "./assets/pause.svg";
  }
  currentSong.volume = document.querySelector("#volrange").value / 100;
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};  

// Converting seconds to minute

const secondsToMinutes = function (seconds) {
  if (seconds < 0 || isNaN(seconds)) {
    return `00:00`;
  }
  const minute = Math.floor(seconds / 60);
  const second = Math.floor(seconds % 60);

  const formattedMinute = String(minute).padStart(2, 0);
  const formattedSeconds = String(second).padStart(2, 0);

  return `${formattedMinute}:${formattedSeconds}`;
};

// Get songs from a folder and returning songs array {get Songs Asynchronously + display them on left panel + add event listeners to each song}

const getSongs = async function (albumFolder) {
  currentFolder = albumFolder;
  const data = await fetch(`http://127.0.0.1:5500/songs/${albumFolder}/`);
  const newData = await data.text();
  let div = document.createElement("div");
  div.innerHTML = newData;
  const elements = div.getElementsByTagName("a");
  songsArr = [];
  for (let index = 0; index < elements.length; index++) {
    let element = elements[index];
    if (element.href.endsWith(".mp3")) {
      songsArr.push(element.href.split(`/${albumFolder}/`)[1]);
    }
  }

  // display them on left panel

  document.querySelector(".songPlaylist").children[0].innerHTML = "";
  for (const songs of songsArr) {
    let songlist = `
  <li class="musicCard animate">
      <div class = "detail">
          <img class="invert" src="./assets/music.svg" alt="" />
          <div>${songs.replaceAll("%20", " ")}</div>
      </div>
      <div>
          <img class = "playbuttonleft" src="./assets/play.svg" alt="" />
          </div>
  </li>
  `;
    document
      .querySelector(".songPlaylist")
      .children[0].insertAdjacentHTML("beforeend", songlist);
  }

  // attaching event listeners to each song

  Array.from(document.querySelectorAll(".musicCard")).forEach((e) => {
    e.addEventListener("click", (element) => {
      playSong(e.firstElementChild.lastElementChild.innerHTML);
    });
  });

  return songsArr;
};

// { display albums in the playlist section + when any playlist is clicked, load corresponding songs on the left panel}

async function displayAlbums() {
  let data = await fetch(`http://127.0.0.1:5500/songs/`);
  let html = await data.text();
  let div = document.createElement("div");
  div.innerHTML = html;
  let arr = div.getElementsByTagName("a");
  for (let index = 0; index < arr.length; index++) {
    let element = arr[index];
    if (element.href.includes("/songs/")) {
      let albumFolder = element.href.split("/songs/")[1];
      // Get the metadata of the folder
      let jsondata = await fetch(
        `http://127.0.0.1:5500/songs/${albumFolder}/info.json`
      );
      let response = await jsondata.json();

      const cardhtml = `
        <div data-album=${albumFolder} class="card">
              <img src=./songs/${albumFolder}/cover.jpeg alt="" />
              <div class="playButton">
                <img src="./assets/blackPlay.svg" alt="" />
              </div>
              <h4>${response.title}</h4>
              <p>${response.description}</p>
            </div>
      `;
      document
        .querySelector(".cardContainer")
        .insertAdjacentHTML("beforeend", cardhtml);
    }
  }

  // When playlist is clicked, load songs on the left panel

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (ele) => {
      await getSongs(e.dataset.album);
      playSong(songsArr[0], true);
      document.querySelector(".seek").style.left = 0;
      document.querySelector("#play").src = "./assets/play.svg";
    });
  });
}

// Receiving songs array and implementing different functionalities---

const mainFunctionality = async function () {
  await getSongs("allTimeFavourite");
  playSong(songsArr[0], true);

  await displayAlbums();

  document.querySelector("#play").addEventListener("click", function () {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "./assets/pause.svg";
    } else {
      currentSong.pause();
      play.src = "./assets/play.svg";
    }
  });

  // Listen for timeupdate event and update the time accordingly--

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutes(
      currentSong.currentTime
    )}/${secondsToMinutes(currentSong.duration)}`;
    document.querySelector(".seek").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add event listener to seekbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".seek").style.left = percentage + "%";
    currentSong.currentTime = (currentSong.duration * percentage) / 100;
  });

  // Display left side when hamburger Button is clicked

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".left").style.width = "50vw";
    document.querySelector(".hamburger").style.display = "none";
    document.querySelector(".playerbar").style.width = "90%";
    document.querySelector(".seekbar").style.width = "90%";
  });

  // Close left panel when cross button is clicked

  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
    document.querySelector(".left").style.width = "0";
    document.querySelector(".hamburger").style.display = "flex";
    document.querySelector(".playerbar").style.width = "90vw";
    document.querySelector(".seekbar").style.width = "90vw";
  });

  // Add event listener to previous button

  document.querySelector("#previous").addEventListener("click", () => {
    let currSongIndex = songsArr.indexOf(
      currentSong.src.split("/").slice(-1)[0]
    );
    if (currSongIndex - 1 >= 0) {
      playSong(songsArr[currSongIndex - 1]);
    }
  });

  // Add event listener to next button

  document.querySelector("#next").addEventListener("click", () => {
    let currSongIndex = songsArr.indexOf(
      currentSong.src.split("/").slice(-1)[0]
    );
    if (currSongIndex + 1 < songsArr.length) {
      playSong(songsArr[currSongIndex + 1]);
    }
  });

  // Add event listener to volume seekbar
  document.querySelector("#volrange").addEventListener("change", (e) => {
    if (
      document.querySelector("#volicon").src.split("/assets/")[1] == "mute.svg"
    ) {
      currentSong.volume = e.target.value / 100;
      document.querySelector("#volicon").src = "./assets/volume.svg";
    }
    currentSong.volume = e.target.value / 100;
  });

  // add event listener to mute the volume
  document.querySelector("#volicon").addEventListener("click", (e) => {
    if (e.target.src.split("/assets/")[1] == "volume.svg") {
      document.querySelector("#volrange").dataset.previousVol =
        document.querySelector("#volrange").value;
      currentSong.volume = 0;
      document.querySelector("#volicon").src = "./assets/mute.svg";
      document.querySelector("#volrange").value = 0;
    } else {
      document.querySelector("#volicon").src = "./assets/volume.svg";
      document.querySelector("#volrange").value =
        document.querySelector("#volrange").dataset.previousVol;
      currentSong.volume = document.querySelector("#volrange").value / 100;
    }
  });
};

mainFunctionality();
