'use strict';

const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1'); // Faster way to select ID.
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');
const diceEl = document.querySelector('.dice');
const btnRoll = document.querySelector('.btn--roll');
const btnNew = document.querySelector('.btn--new');
const btnHold = document.querySelector('.btn--hold');
const player1 = document.querySelector('.player--0');
const player2 = document.querySelector('.player--1');

let score, currentScore, activePlayer, playing; // Declare all the variables outside the function, so that we can access them in other fn.

const init = function () {
  score = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  current0El.textContent = 0;
  current1El.textContent = 0;
  score0El.textContent = 0;
  score1El.textContent = 0;
  diceEl.classList.add('hidden');
  player1.classList.remove('player--winner');
  player2.classList.remove('player--winner');
  player2.classList.remove('player--active');
  player1.classList.add('player--active');
};

init(); // initializing all the Values by calling init Function.

const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  currentScore = 0;
  player1.classList.toggle('player--active'); // if active--player class is present it removes it, if not present then add it to Player 1.
  player2.classList.toggle('player--active');
};

// Rolling a Dice Functionality---

btnRoll.addEventListener('click', function () {
  if (playing) {
    // 1. Generating a dice number
    const dice = Math.trunc(Math.random() * 6) + 1;

    // 2. Display dice image
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;

    // 3. Dice !== 1
    if (dice !== 1) {
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      // if dice === 1 , Switch Player
      switchPlayer();
    }
  }
});

// Hold Button Functionality-----

btnHold.addEventListener('click', function () {
  if (playing) {
    // 1. Add Current Score to Total Score.
    score[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      score[activePlayer];

    if (score[activePlayer] >= 20) {
      playing = false;
      console.log(`Player ${activePlayer + 1} Won the Match`);
      currentScore = 0;
      document.getElementById(`current--${activePlayer}`).textContent = 0;
      diceEl.classList.add('hidden');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector('.player--${activePlayer}')
        .classList.remove('player--active');
    } else {
      switchPlayer();
    }
  }
});

// New Game button Functionality ---

btnNew.addEventListener('click', init);
