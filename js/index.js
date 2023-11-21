import { tetrisContent } from './gameContents.js';
import { createGameMenu } from './gameMenu.js';
import { addHoverForButtons } from './sketchBtn.js';
import { colors, tetrominoItems } from './tetrominoItems.js';
import {
  isValidPos,
  moveOnClickLeft,
  moveOnClickRight,
  rapidFallOnDown,
  rotateOnClickUp,
  showGameMessage,
  showNextTetromino,
  shuffle,
  tetrisResize,
} from './utils.js';

const app = (difficulty) => {
  const gameContent = document.querySelector('.game-content');
  gameContent.innerHTML = '';
  gameContent.innerHTML = tetrisContent;

  const canvas = document.getElementById('game');
  const context = canvas.getContext('2d');
  const startBtn = document.querySelector('.start');
  const pauseBtn = document.querySelector('.pause');
  const restartBtn = document.querySelector('.restart');
  const scoreBlock = document.querySelector('.score__total');
  const topArrow = document.querySelector('.top');
  const bottomArrow = document.querySelector('.bottom');
  const leftArrow = document.querySelector('.left');
  const rightArrow = document.querySelector('.right');
  const squareSize = 32;
  let tetrominoOrder = [];
  let playArea = [];

  for (let row = -2; row < 20; row++) {
    playArea[row] = [];

    for (let col = 0; col < 10; col++) {
      playArea[row][col] = 0;
    }
  }

  let count = 0;
  let tetromino = createTetromino();
  let score = 0;
  let isGameOver = false;
  let requestAnimationId = null;

  const GameOver = new Audio('audio/GameOver.mp3');
  const showGameOver = () => {
    cancelAnimationFrame(requestAnimationId);
    GameOver.play();
    GameOver.volume = 0.2;
    isGameOver = true;
    showGameMessage(context, canvas, 'GAME OVER!');
  };

  function createTetromino() {
    if (tetrominoOrder.length === 0) {
      tetrominoOrder = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
      shuffle(tetrominoOrder);
    }

    const name = tetrominoOrder.pop();
    const matrix = tetrominoItems[name];
    const col = playArea[0].length / 2 - Math.ceil(matrix[0].length / 2);
    const row = name === 'I' ? -1 : -2;

    return {
      name,
      matrix,
      row,
      col,
    };
  }

  const lineBurnSound = new Audio('audio/decidemp3-14575.mp3');
  const thudSound = new Audio('audio/Brick.mp3');

  const placeTetromino = () => {
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
          if (tetromino.row + row < 0) {
            return showGameOver();
          }

          playArea[tetromino.row + row][tetromino.col + col] = tetromino.name;
        }
      }
    }

    for (let row = playArea.length - 1; row > 0; ) {
      if (playArea[row].every((cell) => !!cell)) {
        for (let r = row; r >= 0; r--) {
          for (let col = 0; col < playArea[r].length; col++) {
            playArea[r][col] = playArea[r - 1][col];
          }
        }

        scoreBlock.innerHTML = score += 5;
        lineBurnSound.play();
        lineBurnSound.volume = 0.2;
      } else {
        row--;
      }
    }
    thudSound.play(); // Воспроизвести звук при приземлении фигурки
    thudSound.volume = 0.2;
    tetromino = createTetromino();
  };

  const game = () => {
    showNextTetromino(tetrominoOrder[tetrominoOrder.length - 1]);
    requestAnimationId = requestAnimationFrame(game);
    context.clearRect(0, 0, canvas.clientWidth, canvas.height);

    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 10; col++) {
        if (playArea[row][col]) {
          const name = playArea[row][col];
          context.fillStyle = colors[name];
          context.fillRect(
            col * squareSize,
            row * squareSize,
            squareSize - 1,
            squareSize - 1
          );
        }
      }
    }

    if (tetromino) {
      if (++count > difficulty) {
        tetromino.row++;
        count = 0;
      }

      if (
        !isValidPos(tetromino.matrix, tetromino.row, tetromino.col, playArea)
      ) {
        tetromino.row--;
        placeTetromino();
      }

      context.fillStyle = colors[tetromino.name];

      for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
          if (tetromino.matrix[row][col]) {
            context.fillRect(
              (tetromino.col + col) * squareSize,
              (tetromino.row + row) * squareSize,
              squareSize - 1,
              squareSize - 1
            );
          }
        }
      }
    }
  };

  document.addEventListener('keydown', (e) => {
    if (isGameOver) return;

    if (e.which === 40) {
      rapidFallOnDown(tetromino, playArea, placeTetromino);
    }

    if (e.which === 38) {
      rotateOnClickUp(tetromino, playArea);
    }

    if (e.which === 39) {
      moveOnClickRight(tetromino, playArea);
    }

    if (e.which === 37) {
      moveOnClickLeft(tetromino, playArea);
    }
  });
  const StartTheGame = new Audio('audio/gamemusic-6082.mp3');
  StartTheGame.addEventListener('ended', () => {
    StartTheGame.play();
    lineBurnSound.volume = 0.3;
  });

  startBtn.addEventListener('click', () => {
    requestAnimationId = requestAnimationFrame(game);
    StartTheGame.play();
    StartTheGame.volume = 0.6
    startBtn.disabled = true;
    pauseBtn.disabled = false;
  });

  const PausedGame = new Audio('audio/game-start-6104.mp3');
  pauseBtn.addEventListener('click', () => {
    cancelAnimationFrame(requestAnimationId);
    showGameMessage(context, canvas, 'PAUSED');
    PausedGame.play();
    PausedGame.volume = 0.4;
    pauseBtn.disabled = true;
    startBtn.disabled = false;
  });

  restartBtn.addEventListener('click', () => {
    window.location.reload();
  });

  topArrow.addEventListener('click', () =>
    rotateOnClickUp(tetromino, playArea)
  );
  bottomArrow.addEventListener('click', () =>
    rapidFallOnDown(tetromino, playArea, placeTetromino)
  );
  leftArrow.addEventListener('click', () =>
    moveOnClickLeft(tetromino, playArea)
  );
  rightArrow.addEventListener('click', () =>
    moveOnClickRight(tetromino, playArea)
  );

  addHoverForButtons();
};

createGameMenu(app);

tetrisResize();
window.addEventListener('resize', tetrisResize);
