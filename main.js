var sequence = []; // stores beat sequence player must repeat
var clickedSquare;
var won = false;
var sequenceCurInd;
var idleTimer;
var hardcore = false;
var gameOver = true;

$(document).ready(function () {
  playSound('cymbal');
})

function start() {
  // reset settings to default
  if($(".start-btn").text() === 'RESET'){
    gameOver = true;
    $(".start-btn").text('START');
    $("#status").text('');
    $('.buttons-wrapper > div').css("pointer-events", "auto");
    sequence = [];
    clickedSquare = null;
    won = null;
    sequenceCurInd = null;
    idleTimer = null;
  } else {
      // get ready to start
  gameOver = false;
  $(".start-btn").text('START');
  $("#status").text('Match the beat.');
  $('.buttons-wrapper > div').css("pointer-events", "none");
  sequence = [];
  clickedSquare = null;
  won = null;
  sequenceCurInd = null;
  idleTimer = null;
  // lock in difficulty
  if ($('input:checkbox').prop("checked")) {
    hardcore = true;
  } else {
    hardcore = false;
  }
  $("input:checkbox").click(function () {
    return false;
  });
  // turn start button into restart button
  $(".start-btn").text('RESET');
  // start game
  sequence.push(randNum());
  playSequence();
  }
}

function lose() {
  // make buttons unclickable
  $('.buttons-wrapper > div').css("pointer-events", "none");
  gameOver = true;
  won = false;
  if (hardcore) {
    $("#status").text('Game Over.');
    $(".start-btn").text('START');
    sequence = [];
    clickedSquare = null;
    sequenceCurInd = null;
    $('.buttons-wrapper > div').css("pointer-events", "auto");
    gameOver = true;
  } else {
    $("#status").text('Not quite. Try again.');
    setTimeout(function () {
      $("#status").text('Match the beat.');
      playSequence();
    }, 3000);
    playSound('cowbell');
  }
  // reactivate difficulty slider
  $("input:checkbox").click(function () {
    return true;
  });
}

function win() {
  $("#status").text('You win');
  won = true;
}

function playSequence() {
  // stop idle timer
  clearTimeout(idleTimer);
  // make buttons unclickable while sequence is being shown
  $('.buttons-wrapper > div').css("pointer-events", "none");
  for (let i = 0; i < sequence.length; i++) {
    setTimeout(function () {
      playSound(sequence[i]);
      $(`.btn${sequence[i]}`).addClass(`ai${sequence[i]}`);
      setTimeout(function () {
        $(`.btn${sequence[i]}`).removeClass(`ai${sequence[i]}`);
      }, 250);
    }, 1000 * i + 1);
  }
  // make buttons clickable again
  setTimeout(function () {
    $('.buttons-wrapper > div').css("pointer-events", "auto");
  }, 1000 * sequence.length);
  // give user 5 secs after sequence to respond
  $(function () {
    function resetTimer() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(lose, sequence.length * 1000 + 5000);
    }
    $('.buttons-wrapper > div').bind('click', resetTimer);
    resetTimer();
  });
  sequenceCurInd = 0;
}

function randNum() {
  return Math.floor(Math.random() * 6);
}

function squareClick(square) {
  if(gameOver){
    playSound(square);
  } else {
    playSound(square);
    clickedSquare = Number(square);
    if (clickedSquare !== sequence[sequenceCurInd]) {
      lose();
      return;
    }
    sequenceCurInd++;
    if (sequenceCurInd === sequence.length) {
      sequence.push(randNum());
      setTimeout(function(){
        playSequence();
      }, 1000);
    }
  }
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