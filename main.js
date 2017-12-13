var sequence = []; // stores beat sequence player must repeat

$(document).ready(function () {
  playSound('cymbal');
})

function start() {
  // lock in difficulty
  // $("input:checkbox").click(function () {
  //   return false;
  // });
  sequence.push(randNum());
  playSequence();
  
}

function playSequence(){
  for (let i = 0; i < sequence.length; i++) {
    setTimeout(function(){
      playSound(sequence[i]);
      $(`.btn${sequence[i]}`).addClass(`ai${sequence[i]}`);
      setTimeout(function(){
        $(`.btn${sequence[i]}`).removeClass(`ai${sequence[i]}`);
      }, 250);
    }, 1000 * i);
  }
}

function randNum() {
  return Math.floor(Math.random() * 6);
}

function squareClick(square) {
  playSound(square);
}

function playSound(id) {
  var data = {
    0: {
      sound: new Howl({
        src: ['sounds/kick.mp3']
      })
    },
    1: {
      sound: new Howl({
        src: ['sounds/oHat.mp3']
      })
    },
    2: {
      sound: new Howl({
        src: ['sounds/snare.mp3']
      })
    },
    3: {
      sound: new Howl({
        src: ['sounds/tamb.mp3']
      })
    },
    4: {
      sound: new Howl({
        src: ['sounds/tom.mp3']
      })
    },
    5: {
      sound: new Howl({
        src: ['sounds/triangle.mp3']
      })
    },
    cymbal: {
      sound: new Howl({
        src: ['sounds/cymbal.mp3']
      })
    },
    cowbell: {
      sound: new Howl({
        src: ['sounds/cowbell.mp3']
      })
    },
    clap: {
      sound: new Howl({
        src: ['sounds/clap.mp3']
      })
    }
  };
  data[id].sound.play();
}