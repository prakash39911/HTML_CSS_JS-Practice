'use strict';


let secretNumber = Math.trunc(Math.random()*20) + 1;
let score = 20;
let highScore = 0;

// Game Functionality--

document.querySelector('.check').addEventListener
('click', function (){
    const guessNumber = Number(document.querySelector('.guess').value);

    if (!guessNumber) {
        document.querySelector('.message').textContent = 'not a number...';

    } else if (guessNumber===secretNumber){
        document.querySelector('.message').textContent = 'You Won the Match';
        document.querySelector('.number').textContent = secretNumber;
        document.querySelector('.number').style.width = '30rem';
        document.querySelector('body').style.backgroundColor = '#60b347';

        if (score > highScore){
            highScore = score ;
            document.querySelector('.highscore').textContent = highScore;
        }

    } else if(guessNumber !== secretNumber){
        if (score >1){
            document.querySelector('.message').textContent = guessNumber > secretNumber ? 'Too High' : 'Too Low';
            score--;
            document.querySelector('.score').textContent = score;
        }else {
            document.querySelector('.message').textContent = 'You Lost The Game...';
            document.querySelector('.score').textContent = 0;
        }
    } 
});


// Working on Again Button


document.querySelector('.again').addEventListener
('click', function(){
    secretNumber = Math.trunc(Math.random()*20) + 1;
    score = 20;

    document.querySelector('.number').style.width = '15rem';
    document.querySelector('.number').textContent = '?';
    document.querySelector('body').style.backgroundColor = '#222';

    document.querySelector('.message').textContent = 'Start Guessing...';
    document.querySelector('.score').textContent = score ;

    document.querySelector('.guess').value = '';

});