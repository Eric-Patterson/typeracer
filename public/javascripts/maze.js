typingTest = [
  {
    number: 1,
    passage:
      "Except for the occasional episode of teenage acne, he rarely saw anyone under forty.He specialized in cosmetic dermatology-Botox injections, chemical peels, nail fungus treatments. Hopeless cases of upper-middle-aged women trying to look the way they did at twenty. Imploring him like Rumplestiltskin to spin straw into gold. Stiltskin, yes, that's exactly how they saw him. As if he might boost up faces with the lift of a magic wand. These people kept him in business, but he knew what they refused to admit: youth is only eternal in fairy tales. Blend in the age spots, smooth out the wrinkles, thicken the lips-still, old is old.",
  },
  {
    number: 2,
    passage:
      "No one can escape it. The doctor reveled in it. He wore his age like a weapon, like an accusation, refusing even the mildest of his own remedies.Once he had wanted to change people's lives, save them from the crippling effects of facial disfigurement. Now he only wanted to make it through each day. The doctor had a very comfortable routine. He rose every morning at six o' clock, sipped coffee and watched the weather report. In the office by 7:30 to review files and get ready for the first patient at nine. He would prescribe creams and ointments, perform minor surgical procedures under local anesthetic, do follow-up checks.",
  },
  {
    number: 3,
    passage:
      "Two hours off for lunch, then out the door by five on the dot. Stop by the florist for a fresh bouquet-something to match up with the multi-floral pattern of Clara's curtains, all the better if on sale. Home by six to catch the evening news while he ate whatever the housekeeper had prepared him for dinner. Though he used to enjoy cooking occasionally, he'd rarely touched the stove since Clara died, some twenty-odd years ago. Didn't seem worth the energy to cook for one. The housekeeper made large meals that could be frozen in individual portions, placed a different selection in the oven to warm for him each night.",
  },
];
// random number based on number of arrays
const randomNumber = Math.floor(Math.random() * typingTest.length);

// console.log(randomNumber);
// console.log(typingTest[randomNumber].passage);

// fills out textarea with random passage
randomPassage = typingTest[randomNumber].passage;

let textLength = randomPassage.length;
console.log(randomPassage.length);

let wpmid = document.getElementById("wpm");
let errorsid = document.getElementById("errors");

const log = document.getElementById("log");
document.addEventListener("keydown", logKey);

window.addEventListener("load", logKey);

let keyCounter = 0;
let counter = 0;
let errors = -1;
let wordCount = 0;
let removeTextCounter = -1;
let wpm = 0;
let timer = 0;
let newArray = [];

// splits array, send it to array
for (let i = 0; i < randomPassage.length; i++) {
  // console.log(randomPassage.charAt(keyCounter));
  newArray.push(randomPassage.charAt(i));
  //   console.log(newArray);
  //   console.log(randomPassage.charAt(i));
}
console.log(newArray);

function logKey(e) {
  //   let keysInput = e.key;
  // logs the data in the <p id="log">

  // tracks key input
  let keysInput = e.key;
  //   console.log("Key Pressed", keysInput);

  //   tracks current key in passage
  let currentKey = randomPassage.charAt(keyCounter);
  //   if key pressed and key at passage = true counter++ and keycounter ++
  if (keysInput === randomPassage[counter]) {
    startTimerOnce();
    log.innerHTML += `${e.key}`;
    // console.log(randomPassage[counter]);
    newArray.splice(0, 1);
    console.log(newArray);
    counter++;
    console.log(`passage  ${randomPassage[counter]}`);
    console.log(counter);
    // console.log(`Success ${keysInput}`);
    keyCounter++;
    // console.log(testing);
    document.getElementById("color").className = "color";
    // document.getElementById("color").classList.toggle("color");
    document.getElementById("passage").classList.remove("shake");
  } else {
    errors++;
    errorsid.innerHTML = errors;
    document.getElementById("error").value = errors;
    document.getElementById("color").className = "colors";
    document.getElementById("passage").className = "shake";
    // document.getElementById("color").classList.add("colors");
    // document.getElementById("passage").classList.add("shake");
    setTimeout(function () {
      document.getElementById("passage").classList.remove("shake");
    }, 300);
    // console.log(`erors ${errors}`);
  }

  // if (errors <= errors) {
  //   console.log("works");
  //   document.getElementById("color").classList.toggle("colors");
  //   document.getElementById("passage").classList.toggle("shake");
  //   // document.getElementById("color").className = "colors";
  //   // document.getElementById("passage").className = "shake";
  // }

  // Tracks word count
  if (keysInput === " " && keysInput === currentKey) {
    wordCount++;
    console.log(`word count ${wordCount}`);
    wpm = Math.round(wordCount / (timer / 60));
    if (wpm === Infinity) {
      //   console.log("nothing");
    } else {
      wpmid.innerHTML = wpm;
      document.getElementById("wordspm").value = wpm;
    }
  }

  // starts timer loop on 1 second intervals. wont be called more than once

  //stop the clock from running
  if (counter === textLength) {
    console.log("end");
    stop();
  }

  //   loops through text and gets character

  //   let newArray = [typingTest[randomNumber].passage];
  //   let remove = newArray.splice(counter, 1);
  //   console.log(remove);
  //   console.log(newArray);

  //sends spliced array to id="passage"
  randomPassageInserted = document.getElementById("passage").innerHTML =
    newArray.join("");
}
function match() {
  if (logKey(e) === randomPassage[0]) {
    console.log("sucess");
  }
}

function stop() {
  clearInterval(clock);
  console.log("stops");
}

// If timer not started, call once, wont call repeatidly on keypress
function startTimerOnce() {
  if (!timerStarted) startClock();
}
// start timer off false
let timerStarted = false;

function startClock() {
  clock = setInterval(setTime, 1000);
  timerStarted = true;
}

// timer
let minutes = document.getElementById("minutes");
let seconds = document.getElementById("seconds");

function setTime() {
  ++timer;
  seconds.innerHTML = pad(timer % 60);
  minutes.innerHTML = pad(parseInt(timer / 60));
  document.getElementById("timer").value = timer;
}

function pad(val) {
  let valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}
