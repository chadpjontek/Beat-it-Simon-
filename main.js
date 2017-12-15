// globals
var hardcore = false;
var isGameOver = true;
var sequence = [];
var clickedSquare;
var sequenceCurInd;
var idleTimer;
var playSequenceTimeOut;
var reactivateButtonsTimeOut;
var sequenceTimeLength;
var loseTimeout;
const wordsOfEncouragement = ['Good job!', ':D', 'You got this.', 'You can do it!', 'Great!', 'Keep going!', 'Wow!', 'Such skill!', 'Amazing!', 'Look at you!', 'Awesome!'];
const sounds = {
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

$(document).ready(function () {
  playSound('cymbal');
});

function playSound(id) {
  sounds[id].sound.play();
}

function start() {
  // lock in difficulty
  if ($('input:checkbox').prop("checked")) {
    hardcore = true;
  } else {
    hardcore = false;
  }
  // start game
  isGameOver = false;
  sequence = [];
  clearTimers();
  $("input:checkbox").prop('disabled', true);
  $(".start-btn").text('RESTART');
  $('#round').text('ROUND: 1');
  $("#status").text('Match the beat.');
  $('.buttons-wrapper > div').css("pointer-events", "none");
  sequence.push(randNum());
  playSequence();
}

function clearTimers() {
  clearTimeout(playSequenceTimeOut);
  clearTimeout(reactivateButtonsTimeOut);
  clearTimeout(sequenceTimeLength);
  clearTimeout(loseTimeout);
  clearTimeout(idleTimer);
  $('.buttons-wrapper > div').off('click', resetTimer);
}

function randNum() {
  return Math.floor(Math.random() * 6);
}

function playSequence() {
  // set speed of sequence play back
  var speed;
  var round = sequence.length;
  if (round < 5) {
    speed = 1000;
  } else if (round > 4 && round < 9) {
    speed = 750;
  } else if (round > 8 && round < 13) {
    speed = 500;
  } else {
    speed = 250;
  }
  $('#round').text(`ROUND: ${round}`);
  clearTimeout(idleTimer);
  $('.buttons-wrapper > div').off('click', resetTimer);
  // make board non-interactive until sequence is over
  $('.buttons-wrapper > div').css("pointer-events", "none");
  for (let i = 0; i < sequence.length; i++) {
    playSequenceTimeOut = setTimeout(function () {
      playSound(sequence[i]);
      $(`.btn${sequence[i]}`).addClass(`ai${sequence[i]}`);
      setTimeout(function () {
        $(`.btn${sequence[i]}`).removeClass(`ai${sequence[i]}`);
      }, 250);
    }, speed * i + 1);
  }
  reactivateButtonsTimeOut = setTimeout(function () {
    $('.buttons-wrapper > div').css("pointer-events", "auto");
  }, speed * sequence.length);
  // give user 5 secs after sequence to respond
  sequenceTimeLength = setTimeout(function () {
    $('.buttons-wrapper > div').on('click', resetTimer);
    resetTimer();
  }, sequence.length * speed);
  sequenceCurInd = 0;
}

function resetTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(lose, 5000);
}

function reset() {
  clearTimers();
  gameOver();
  playSound('cymbal');
  $('#round').text('ROUND: 0');
  $("#status").text('');
  if ($('.btn0').hasClass('ai0')) {
    $('.btn0').removeClass('ai0');
  }
  if ($('.btn1').hasClass('ai1')) {
    $('.btn1').removeClass('ai1');
  }
  if ($('.btn2').hasClass('ai2')) {
    $('.btn2').removeClass('ai2');
  }
  if ($('.btn3').hasClass('ai3')) {
    $('.btn3').removeClass('ai3');
  }
  if ($('.btn4').hasClass('ai4')) {
    $('.btn4').removeClass('ai4');
  }
  if ($('.btn5').hasClass('ai5')) {
    $('.btn5').removeClass('ai5');
  }
}

function gameOver() {
  isGameOver = true;
  $('.buttons-wrapper > div').css("pointer-events", "auto");
  $(".start-btn").text('START');
  $("input:checkbox").prop('disabled', false);
}

function squareClick(square) {
  // allow player to bang the drums when not in a game
  playSound(square);
  // check sequence
  if (!isGameOver) {
    clickedSquare = Number(square);
    if (clickedSquare !== sequence[sequenceCurInd]) {
      lose();
    } else {
      sequenceCurInd++;
      if (sequenceCurInd === sequence.length) {
        if (sequence.length === 20) {
          // clap for victory!
          for (var i = 0; i < 3; i++) {
            setTimeout(function () {
              playSound('clap');
            }, i * 150);
          }
          $('#status').text('YOU DID IT! YOU ARE INCREDIBLE!');
          gameOver();
          clearTimers();
        } else {
          // encourage and go to next sequence
          $('#status').text(randCheer());
          sequence.push(randNum());
          setTimeout(function () {
            playSequence();
          }, 1000);
        }
      }
    }
  }
}

function randCheer() {
  return wordsOfEncouragement[Math.floor(Math.random() * 11)];
}

function lose() {
  clearTimers();
  if (hardcore) {
    gameOver();
    playSound('cowbell');
    $("#status").text('Game Over.');
  } else {
    playSound('cowbell');
    $('.buttons-wrapper > div').css("pointer-events", "none");
    $("#status").text('Not quite. Try again.');
    loseTimeout = setTimeout(function () {
      $("#status").text('Match the beat.');
      playSequence();
    }, 2500);
  }
}