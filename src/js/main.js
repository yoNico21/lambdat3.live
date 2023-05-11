import { inject } from '@vercel/analytics';
 
inject();

const body = document.body;
const hero = document.querySelector(".hero");
const main = document.querySelector("main");
const heroButton = document.querySelector(".logo-hero");
const homeButton = document.querySelector(".logo");

const audioTrack = new Audio("Trackmania/firstFinal.mp3");
const audioTracer = new Audio("traceroute/traceroute.wav");
const audioMurder = new Audio("Murder/unheard_danger.wav");

let activeHero;

heroButton.addEventListener("click", () => {
  activeHero = !activeHero;
  if (!activeHero) {
    hero.style.top = "0";
  } else {
    hero.style.top = "-100dvh";
  }
});

homeButton.addEventListener("click", () => {
  activeHero = !activeHero;
  if (!activeHero) {
    hero.style.top = "0";
  } else {
    hero.style.top = "-100dvh";
  }
});

// ------------------------------------------------------------------------------

import data from "/src/content.json" assert { type: "json" };

const content = data;

let sections = [];

content.forEach((object) => {
  let section = create("section", "content");
  if (object.title !== "") {
    section.classList.add(object.title);
    section.setAttribute("id", object.title);
  }
  if (object.backgroundImage.includes("#")) {
    section.style.background = object.backgroundImage;
  } else {
    section.style.background = "url(" + object.backgroundImage + ")";
    section.style.backgroundRepeat = "norepeat";
    section.style.backgroundPosition = "center";
    section.style.backgroundSize = "cover";
  }

  let title;

  let container = create("div", "container");

  let audioPlayer = create("button", "audio-player");
  let icon = create("i", "fa-solid");
  icon.classList.add("fa-play-circle");

  add(icon, audioPlayer);

  let repeat = create("button", "repeat");
  icon = create("i", "fa-solid");
  icon.classList.add("fa-rotate-left");

  add(icon, repeat);

  let workDescription = create("div", "work-description");

  let p = create("p");
  p.innerHTML = object.description;

  add(p, workDescription);

  if (object.titleImage === "" && object.title !== "") {
    title = create("h1", "title");
    let titleText = object.title.replaceAll("-", " ");
    title.innerText = titleText;
  } else if (object.titleImage !== "") {
    title = create("img", "title");
    title.src = object.titleImage;
  }

  add(title, section);

  add(audioPlayer, container);
  add(repeat, container);
  add(workDescription, container);

  add(container, section);

  add(section, main);

  sections.push({ id: object.title });
});

const playButtons = document.querySelectorAll(".audio-player");
const repeatButtons = document.querySelectorAll(".repeat");

for (let j = 0; j < playButtons.length; j++) {
  playButtons[j].id = j;
}

for (let j = 0; j < repeatButtons.length; j++) {
  repeatButtons[j].id = j;
}
let state = [false, false, false];
repeatButtons.forEach((button) => {
  button.addEventListener("click", () => {
    pause();
    state[button.id] = !state[button.id];
    switch (button.id) {
      case "0":
        audioTrack.currentTime = 0;
        break;
      case "1":
        audioTracer.currentTime = 0;
        break;
      case "2":
        audioMurder.currentTime = 0;
        break;
    }
  });
});

playButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state[button.id] = !state[button.id];

    if (state[button.id]) {
      button.firstChild.classList.replace("fa-play-circle", "fa-pause-circle");
      switch (button.id) {
        case "0":
          audioTrack.play();
          break;
        case "1":
          audioTracer.play();
          break;
        case "2":
          audioMurder.play();
          break;
        default:
          console.log("No id for audio");
      }
    } else {
      button.firstChild.classList.replace("fa-pause-circle", "fa-play-circle");
      pause();
    }
  });
});

const leftNav = document.querySelector(".left-nav");
const rightNav = document.querySelector(".right-nav");

let i = 1;

let transform = -100;
main.style.right = `${transform}dvw`;

const logo = document.querySelector(".logo");

document.addEventListener("click", () => {
  if (transform === 0 || transform === -200) {
    logo.style.filter = "invert()";
    leftNav.style.filter = "invert()";
    rightNav.style.filter = "invert()";
  } else {
    logo.style.filter = "none";
    leftNav.style.filter = "none";
    rightNav.style.filter = "none";
  }
});

leftNav.addEventListener("click", () => {
  if (i !== 0) {
    i -= 1;
    transform -= 100;
    pause();
  }
  main.style.right = `${transform}dvw`;
});

rightNav.addEventListener("click", () => {
  if (i !== 2) {
    i += 1;
    transform += 100;
    pause();
  }
  main.style.right = `${transform}dvw`;
});

function pause() {
  playButtons.forEach((button) => {
    let player = button.firstChild;
    if (player.classList.contains("fa-pause-circle")) {
      player.classList.replace("fa-pause-circle", "fa-play-circle");
    }
  });

  audioTrack.pause();
  audioTracer.pause();
  audioMurder.pause();
}

// ------------------------------------------------------------------------------

import introduction from "/src/introductory.json" assert { type: "json" };

const intro = document.querySelector(".introductory-text");
intro.innerHTML = introduction.text;

// ------------------------------------------------------------------------------

function create(el, cl) {
  let element = document.createElement(el);
  if (cl) element.classList.add(cl);
  return element;
}

function add(child, parent) {
  if (parent === body) {
    parent.insertBefore(child, document.querySelector(".left-nav"));
  } else {
    parent.appendChild(child);
  }
}

document.addEventListener("click", () => {
  if (transform === 0) {
    rightNav.classList.add("animate");
    setTimeout(() => {
      rightNav.classList.add("hidden")
    }, 400);
  } else {
    rightNav.classList.remove("hidden");
    setTimeout(() => {
      rightNav.classList.remove("animate")
    }, 400);
  }
  if (transform === -200) {
    leftNav.classList.add("animate");
    setTimeout(() => {
      leftNav.classList.add("hidden")
    }, 400);
  } else {
    leftNav.classList.remove("hidden");
    setTimeout(() => {
      leftNav.classList.remove("animate")
    }, 400);
  }
});
