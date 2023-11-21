import { menuContent } from './gameContents.js';
import { addHoverForButtons } from './sketchBtn.js';

const hardLvl = new Audio('audio/dad-says-ok-3-113123.mp3');
const normalLvl = new Audio('audio/good-6081.mp3')
const easyLvl = new Audio('audio/good-6081.mp3')
export const createGameMenu = (app) => {
  const gameContent = document.querySelector('.game-content');
  gameContent.innerHTML = '';
  gameContent.innerHTML = menuContent;

  const easyBtn = document.querySelector('.easy');
  const normBtn = document.querySelector('.norm');
  const hardBtn = document.querySelector('.hard');

  easyBtn.addEventListener('click', () => {app(35);
    easyLvl.play();
    easyLvl.volume = 0.2;
  });
  normBtn.addEventListener('click', () => {app(15);
    normalLvl.play();
    normalLvl.volume = 0.2;
  });
  hardBtn.addEventListener('click', () => {app(5);
    hardLvl.play();
    hardLvl.volume = 0.2;
  });

  addHoverForButtons();
};
