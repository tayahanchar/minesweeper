
let level = localStorage.getItem('level') || 'beginner';
let boardSize;
let qualityOfMines;
let board = [];
let isGameStarted = false;
let time = localStorage.getItem('timeSec') || 0;
let steps = localStorage.getItem('steps') || 0;
let timerId;
let checked = 0;
let minesLeft;
let theme = localStorage.getItem('theme') || 'light';

if(level === 'beginner') {
  boardSize = 10;
  qualityOfMines = localStorage.getItem('sizeOfMines') || 10;
}

if(level === 'intermediate') {
  boardSize = 15;
  qualityOfMines = localStorage.getItem('sizeOfMines') || 40;
}

if(level === 'expert') {
  boardSize = 25;
  qualityOfMines = localStorage.getItem('sizeOfMines') || 80;
}

minesLeft = qualityOfMines;

function checkBoardLocalSt() {
  if(localStorage.getItem('board')) {
    isGameStarted = true;
    
    const newBoard = JSON.parse(localStorage.getItem('board'));
    board = newBoard

    newBoard.forEach(line => {
      line.forEach(item => {
        const itemDom = document.querySelector(`[data-number="${item.number}"]`);
        itemDom.setAttribute('data-status', item.status);

        if(item.open) {
          itemDom.classList.add('board__item-open');

          if(item.status !== 0) {
            itemDom.textContent = itemDom.dataset.status;
            addContentStyle(itemDom);
          }
        }

        if(item.checked) {
          itemDom.classList.add('board__item-checked');
         
          checked++;
          document.querySelector('.checked').textContent = checked;
          minesLeft--;
          document.querySelector('.mines-left').textContent = minesLeft;
        }
      })
    })

  }

}

createBoard(boardSize, qualityOfMines);
checkBoardLocalSt();

function changeBoardSize(qq) {
  if(level === 'beginner') {
    boardSize = 10;
    qualityOfMines = qq || 10;
  }

  if(level === 'intermediate') {
    boardSize = 15;
    qualityOfMines = qq || 40;
  }

  if(level === 'expert') {
    boardSize = 25;
    qualityOfMines = qq || 80;
  }

  minesLeft = qualityOfMines;

  localStorage.removeItem('board');
  localStorage.setItem('level', level);
  localStorage.removeItem('steps');

  localStorage.setItem('sizeOfMines', qualityOfMines);

  startNewGame();
}

const audioLose = new Audio();
audioLose.src = './assets/sounds/lose.wav';

const audioWin = new Audio();
audioWin.src = './assets/sounds/win.wav';

const audioCheck = new Audio();
audioCheck.src = './assets/sounds/check.wav';

function createBoard(boardSize, qualityOfMines) {

  document.body.innerHTML = `
  <div class="modal">
  <div class="modal-window">
    <img class="fireworks-img" src="./assets/fireworks.svg" alt="fireworks">
    <p class="modal-winow__descr big-font-size">Hooray!</p>
    <p class="modal-winow__descr">You found all mines in <span class="game-time"></span> seconds and <span class="game-clicks"></span> moves!</p>
  </div>
  <div class="modal-window-lose">
    <p class="modal-winow__descr big-font-size">Game over. Try again</p>
  </div>
  </div>`;

  addTheme();
  addBoard();
  addTitle();
  addButtons();
  addLevels();
  addDescription(qualityOfMines);

  let number = 1;
  for (let i = 0; i < boardSize; i++) {
    const line = [];
    for (let k = 0; k < boardSize; k++) {
      addBoardItem(number);
      line.push({
        line: i,
        position: k,
        number: number,
      })
      number++;
    }
    board.push(line);
  }

  document.querySelector('.dark').addEventListener('click', changeDarkTheme);
  document.querySelector('.light').addEventListener('click', changeLightTheme);

  if(theme === 'light') {
    document.querySelectorAll('.board__item').forEach(item => {
      item.classList.remove('dark-color');
    });

    document.body.style.background = 'radial-gradient(circle, rgba(148,187,233,1) 0%, rgba(238,174,202,1) 100%)';

    document.querySelectorAll('.level-btn').forEach(item => {
      item.classList.remove('dark-bg');
    });
  } else {
    document.querySelectorAll('.board__item').forEach(item => {
      item.classList.add('dark-color');
    });

    document.body.style.background = 'radial-gradient(circle, rgba(249,250,251,1) 0%, rgba(8,7,8,1) 100%)';

    document.querySelectorAll('.description__item ').forEach(item => {
      item.style.color = 'black';
    });

    document.querySelectorAll('.level-btn').forEach(item => {
      item.classList.add('dark-bg');
    });

    document.querySelector('.new-game-button').style.color = 'black';
    document.querySelector('.statistics-button').style.color = 'black';
    document.querySelector('.title').style.color = 'black';

    if(document.querySelector('.bomb-img')) {
      document.querySelector('.bomb-img').src = './assets/bombLargeDark.svg';
    }

    document.querySelectorAll('.level-btn').forEach(item => {
      item.classList.add('dark-bg');
    });
  }

  if(time !== 0) {
    startTimer();
  }
}

function addLevels() {
  const levels = document.createElement('div');
  levels.classList.add('level');

  levels.innerHTML = `
  <div class="level__buttons">
      <button class="beginner level-btn">Beginner</button>
      <button class="intermediate level-btn">Intermediate</button>
      <button class="expert level-btn">Expert</button>
    </div>
    <form>
      <input type="number" maxlength="2" placeholder="${qualityOfMines}">
    </form>
    ${level === 'expert' ? '<p class="level__descr">You can change the number of mines from 70 to 99</p>' : '<p class="level__descr">You can change the number of mines from 10 to 99</p>'}`;

  document.querySelector('.title').after(levels);

  document.querySelector(`.${level}`).classList.add('button-active');

  document.querySelectorAll('.level-btn').forEach (item => item.addEventListener('click', changeLevel));

  document.querySelector('form').addEventListener('submit', changeMinesNumber);
}

function changeLevel(event) {
  level = event.target.textContent.toLowerCase();
  changeBoardSize();

  document.querySelectorAll('.level-btn').forEach(item => {
    item.classList.remove('button-active');
    if(item.classList.contains(`${level}`)) {
      item.classList.add('button-active');
    }
  })
}

function changeDarkTheme() {
  if(theme === 'dark') return;

  document.body.style.background = 'radial-gradient(circle, rgba(249,250,251,1) 0%, rgba(8,7,8,1) 100%)';
  theme = 'dark';

  document.querySelectorAll('.board__item').forEach(item => {
    item.classList.add('dark-color');
  })

  document.querySelectorAll('.description__item ').forEach(item => {
    item.style.color = 'black';
  })

  document.querySelector('.new-game-button').style.color = 'black';
  document.querySelector('.statistics-button').style.color = 'black';

  document.querySelector('.title').style.color = 'black';

  if(document.querySelector('.bomb-img')) {
    document.querySelector('.bomb-img').src = './assets/bombLargeDark.svg';
  }

  document.querySelectorAll('.level-btn').forEach(item => {
    item.classList.add('dark-bg');
  });

  localStorage.setItem('theme', 'dark');
}

function changeLightTheme() {
  if(theme === 'light') return;

  document.body.style.background = 'radial-gradient(circle, rgba(148,187,233,1) 0%, rgba(238,174,202,1) 100%)';
  theme = 'light';
  document.querySelectorAll('.board__item').forEach(item => {
    item.classList.remove('dark-color');
  })

  document.querySelectorAll('.description__item ').forEach(item => {
    item.style.color = '#97024d';
  })

  document.querySelector('.new-game-button').style.color = 'white';
  document.querySelector('.statistics-button').style.color = 'white';

  document.querySelector('.title').style.color = 'white';

  if(document.querySelector('.bomb-img')) {
    document.querySelector('.bomb-img').src = './assets/bombLarge.svg';
  }

  document.querySelectorAll('.level-btn').forEach(item => {
    item.classList.remove('dark-bg');
  });

  localStorage.setItem('theme', 'light');
}

function startNewGame() {
  localStorage.removeItem('board');
  localStorage.removeItem('steps');
  board = [];
  isGameStarted = false;
  localStorage.removeItem('timeSec');
  time = 0;
  steps = 0;
  clearTimeout(timerId);
  checked = 0;
  minesLeft = qualityOfMines;

  document.body.innerHTML = `<script src="index.js" type="module"></script>`;

  createBoard(boardSize, qualityOfMines);
}

function addTheme() {
  const themeWrapper = document.createElement('div');
  themeWrapper.classList.add('theme');
  themeWrapper.innerHTML = `
    <p class="dark">dark</p>
    /
    <p class="light">light</p>`

  document.body.append(themeWrapper);
}

function addDescription() {
  const description = document.createElement('div');
  description.classList.add('description');
  description.innerHTML = `
  <div class="description__item">Mines left: <span class="mines-left">${minesLeft}</span></div>
  <div class="description__item">Checked: <span class="checked">${checked}</span></div>
  <div class="description__item">Moves: <span class="steps">${steps}</span></div>
  <div class="description__item">Time: <span class="time">${time}</span></div>`;
  
  document.querySelector('.wrapper').after(description);
}

function addButtons() {
  const container = document.createElement('div');
  container.classList.add('buttons');

  const newGameButton = document.createElement('button');
  newGameButton.classList.add('new-game-button');
  newGameButton.textContent = 'New Game';

  const statisticsButton = document.createElement('button');
  statisticsButton.classList.add('statistics-button');
  statisticsButton.textContent = 'Statistics';

  container.append(newGameButton);
  container.append(statisticsButton);
  document.querySelector('.title').after(container);

  newGameButton.addEventListener('click', startNewGame);

  statisticsButton.addEventListener('click', openStatistics);
}

function addBoardItem(number) {
  const boardItem = document.createElement('div');

  if(level === 'beginner') {
    boardItem.classList.add('board__item');
    boardItem.classList.add('board__item-s');
  }
  if(level === 'intermediate') {
    boardItem.classList.add('board__item');
    boardItem.classList.add('board__item-int');
  }
  if(level === 'expert') {
    boardItem.classList.add('board__item');
    boardItem.classList.add('board__item-ex');
  }
  boardItem.setAttribute('data-number', number);

  document.querySelector('.board').append(boardItem);
}

function addBoard() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');
  
  const board = document.createElement('div');
  board.classList.add('board');

  if(level === 'beginner') {
    board.classList.add('board-beg');
    wrapper.classList.add('wrapper-b');

    const bombImg = document.createElement('img');
    bombImg.src = 'assets/bombLarge.svg';
    bombImg.alt = 'bomb';
    bombImg.classList.add('bomb-img');

    wrapper.prepend(board);
    wrapper.append(bombImg);
  }
  if(level === 'intermediate') {
    board.classList.add('board-int');
    wrapper.classList.add('wrapper-int');

    wrapper.prepend(board);
  }
  if(level === 'expert') {
    board.classList.add('board-exp');
    wrapper.classList.add('wrapper-exp');

    wrapper.prepend(board);
  }

  document.body.prepend(wrapper);

  document.querySelector('.board').addEventListener('click', openBoardItem);

  document.querySelector('.board').addEventListener('contextmenu', checkBoardItem);

}

function checkBoardItem(event) {
  event.preventDefault();
  if(event.target.classList.contains('board__item-open')) return;
  if(event.target.classList.contains('board')) return;
  if(!event.target.classList.contains('board__item-checked')) {
    event.target.classList.add('board__item-checked');
    board.map((line, index) => {
      line.map((elem, ind) => {
        if(+event.target.dataset.number === elem.number) { 
          board[index][ind] = {
            ...elem,
            checked: true,
          } 
        }
      })
    })

    checked++;
    document.querySelector('.checked').textContent = checked;
    minesLeft--;
    document.querySelector('.mines-left').textContent = minesLeft;

    audioCheck.play();
  } else {
    event.target.classList.remove('board__item-checked');

    board.map((line, index) => {
      line.map((elem, ind) => {
        if(+event.target.dataset.number === elem.number) { 
          board[index][ind] = {
            ...elem,
            checked: false,
          } 
        }
      })
    })
    checked--;
    document.querySelector('.checked').textContent = checked;
    minesLeft++;
    document.querySelector('.mines-left').textContent = minesLeft;

    audioCheck.play();
  }
  const jsonBoard = JSON.stringify(board);
  localStorage.setItem('board', jsonBoard);
}

function addTitle() {
  const title = document.createElement('h1');
  title.classList.add('title');
  title.textContent = 'MineSweeper Game';

  document.body.prepend(title);
}

function startTimer() {
  time++;
  document.querySelector('.time').textContent = time;

  localStorage.setItem('timeSec', time);

  timerId = setTimeout(startTimer, 1000);
}

function openBoardItem(event) {
  if(event.target.classList.contains('board')) return;

  if(event.target.classList.contains('board__item-checked')) return;

  if(!isGameStarted) {
    isGameStarted = true;

    startTimer();

    addStatus(+event.target.dataset.number);
    event.target.classList.add('board__item-open');
    const audioOpen = new Audio();
    audioOpen.src = './assets/sounds/open.wav';
    audioOpen.play();

    steps++;
    localStorage.setItem('steps', steps);

    document.querySelector('.steps').textContent = steps;

    if(event.target.dataset.status !== '0') {
      event.target.textContent = event.target.dataset.status;
      addContentStyle(event.target);
    }

    if(event.target.dataset.status === '0') {
      board.map((line) => {
        line.map((elem) => {
          if(+event.target.dataset.number === elem.number) {
            openEmptyItems(elem);
          }
        })
      })
    }

    board.map((line, index) => {
      line.map((elem, ind) => {
        if(+event.target.dataset.number === elem.number) { 
          board[index][ind] = {
            ...elem,
            open: true,
          } 
        }
      })
    })

    checkOpenItems();
  } else {
    if(event.target.dataset.status === 'mine') {
      event.target.classList.add('board__item-bombed');
      steps++;
      localStorage.setItem('steps', steps);
      document.querySelector('.steps').textContent = steps;
      loseGame();
    } else {

      if(!event.target.classList.contains('board__item-open')) {
        const audioOpen = new Audio();
        audioOpen.src = './assets/sounds/open.wav';
        audioOpen.play();
        event.target.classList.add('board__item-open');
        steps++;
        localStorage.setItem('steps', steps);
        document.querySelector('.steps').textContent = steps;
      }
    
      board.map((line, index) => {
        line.map((elem, ind) => {
          if(+event.target.dataset.number === elem.number) {  
            board[index][ind] = {
              ...elem,
              open: true,
            }
          }
        })
      })


      if(event.target.dataset.status !== '0') {
        event.target.textContent = event.target.dataset.status;
        addContentStyle(event.target);
      }

      if(event.target.dataset.status === '0') {
        board.map((line) => {
          line.map((elem) => {
            if(+event.target.dataset.number === elem.number) {
              openEmptyItems(elem);
            }
          })
        })
      }
    }
    checkOpenItems();
  }
  const jsonBoard = JSON.stringify(board);
  localStorage.setItem('board', jsonBoard);
}

function addContentStyle(domItem) {
  if(domItem.dataset.status === '8') {
    domItem.style.color = '#4c0f77';
  }
  if(domItem.dataset.status === '7') {
    domItem.style.color = '#77400f';
  }
  if(domItem.dataset.status === '6') {
    domItem.style.color = '#0f6677';
  }
  if(domItem.dataset.status === '5') {
    domItem.style.color = '#72770f';
  }
  if(domItem.dataset.status === '4') {
    domItem.style.color = '#c00524';
  }
  if(domItem.dataset.status === '3') {
    domItem.style.color = '#9405c0';
  }
  if(domItem.dataset.status === '2') {
    domItem.style.color = '#050ec0';
  }
  if(domItem.dataset.status === '1') {
    domItem.style.color = '#0f7743';
  }
}

function openEmptyItems({line, position}) {



  if(board[line - 1]?.[position]) {
    const topItem = board[line - 1][position];

    if(!topItem?.open) {
    setTimeout(() => openTopItems(topItem), 0);
    }
  }

  if(board[line]?.[position - 1]) {
    const prevItem = board[line][position - 1];

    if(!prevItem?.open) {
      setTimeout(() => openPrevItems(prevItem), 0);
    }
  }

  if(board[line + 1]?.[position]) {
  
    const bottomItem = board[line + 1][position];

    if(!bottomItem?.open) {
    setTimeout(() => openBottomItems(bottomItem), 0);
    }
  }

  if(board[line]?.[position + 1]) {
    const nextItem = board[line][position + 1];

    if(!nextItem?.open) {
    setTimeout(() => openNextItems(nextItem), 0);
    }
  }

}

function openTopItems(topItem) {

  const topItemDom = document.querySelector(`[data-number="${topItem.number}"]`);
    topItemDom.classList.add('board__item-open');
    checkOpenItems();
    addContentStyle(topItemDom);

    if(topItemDom.classList.contains('board__item-checked')) {
      topItemDom.classList.remove('board__item-checked');

      checked--;
      document.querySelector('.checked').textContent = checked;
      minesLeft++;
      document.querySelector('.mines-left').textContent = minesLeft;
    }
   
    if(topItemDom.dataset.status !== '0') {
      topItemDom.textContent = topItemDom.dataset.status;
    }

    if(topItemDom.dataset.status === '0') {
      openEmptyItems(topItem);
    }

    board.map((line, index) => {
      line.map((elem, ind) => {
        if(topItem.number === elem.number) {
          board[index][ind] = {
            ...elem,
            open: true,
            checked: false,
          }
        }
      })
    })
  
  const jsonBoard = JSON.stringify(board);
  localStorage.setItem('board', jsonBoard);
}

function openPrevItems(prevItem) {
    const prevItemDom = document.querySelector(`[data-number="${prevItem.number}"]`);
    prevItemDom.classList.add('board__item-open');
    checkOpenItems();
    addContentStyle(prevItemDom);

    if(prevItemDom.classList.contains('board__item-checked')) {
      prevItemDom.classList.remove('board__item-checked');

      checked--;
      document.querySelector('.checked').textContent = checked;
      minesLeft++;
      document.querySelector('.mines-left').textContent = minesLeft;
    }

    if(prevItemDom.dataset.status !== '0') {
      prevItemDom.textContent = prevItemDom.dataset.status;
    }

    if(prevItemDom.dataset.status === '0') {
      openEmptyItems(prevItem);
    }

    board.map((line, index) => {
      line.map((elem, ind) => {
        if(prevItem.number === elem.number) {
          board[index][ind] = {
            ...elem,
            open: true,
            checked: false,
          }
        }
      })
    })

  const jsonBoard = JSON.stringify(board);
  localStorage.setItem('board', jsonBoard);
}

function openNextItems(nextItem) {
  const nextItemDom = document.querySelector(`[data-number="${nextItem.number}"]`);
    nextItemDom.classList.add('board__item-open');
    checkOpenItems();
    addContentStyle(nextItemDom);

    if(nextItemDom.classList.contains('board__item-checked')) {
      nextItemDom.classList.remove('board__item-checked');

      checked--;
      document.querySelector('.checked').textContent = checked;
      minesLeft++;
      document.querySelector('.mines-left').textContent = minesLeft;
    }

    if(nextItemDom.dataset.status !== '0') {
      nextItemDom.textContent = nextItemDom.dataset.status;
    }

    if(nextItemDom.dataset.status === '0') {
      openEmptyItems(nextItem);
    }

    board.map((line, index) => {
      line.map((elem, ind) => {
        if(nextItem.number === elem.number) {
          board[index][ind] = {
            ...elem,
            open: true,
            checked: false,
          }
        }
      })
    })
  
  const jsonBoard = JSON.stringify(board);
  localStorage.setItem('board', jsonBoard);
}

function openBottomItems(bottomItem) {
  const bottomItemDom = document.querySelector(`[data-number="${bottomItem.number}"]`);
    bottomItemDom.classList.add('board__item-open');
    checkOpenItems();
    addContentStyle(bottomItemDom);

    if(bottomItemDom.classList.contains('board__item-checked')) {
      bottomItemDom.classList.remove('board__item-checked');

      checked--;
      document.querySelector('.checked').textContent = checked;
      minesLeft++;
      document.querySelector('.mines-left').textContent = minesLeft;
    }

    if(bottomItemDom.dataset.status !== '0') {
      bottomItemDom.textContent = bottomItemDom.dataset.status;
    }

    if(bottomItemDom.dataset.status === '0') {
      openEmptyItems(bottomItem);
    }

    board.map((line, index) => {
      line.map((elem, ind) => {
        if(bottomItem.number === elem.number) {
          board[index][ind] = {
            ...elem,
            open: true,
            checked: false,
          }
        }
      })
    })

  const jsonBoard = JSON.stringify(board);
  localStorage.setItem('board', jsonBoard);
}

function addStatus(itemNumber) {
  const mines = createMineItems(itemNumber);
  mines.forEach(mine => {
    board.map((line, index) => {
      line.map((elem, ind) => {
        if(mine === elem.number) {
          document.querySelector(`[data-number="${mine}"]`).setAttribute('data-status', 'mine');
          board[index][ind] = {
            ...elem,
            status: 'mine',
          }
        }
      })
    })
  })

  board.map((line, index) => {
    line.map((elem, ind) => {
      if(elem?.status !== 'mine') {
        const neighbours = countNeighbourMines(elem);
        document.querySelector(`[data-number="${elem.number}"]`).setAttribute('data-status', neighbours);
        board[index][ind] = {
          ...elem,
          status: neighbours,
        }
      }
    })
  })

}

function createMineItems(num) {
  const minesArray = [];
  while(minesArray.length < qualityOfMines) {
    let number = createRandomNumber();
    if(!(number === num || minesArray.includes(number))) {
      minesArray.push(number);
    }
  }
  return minesArray;
}

function createRandomNumber() {
  return Math.floor(Math.random() * (boardSize * boardSize - 1 + 1)) + 1;
}

function loseGame() {
  const imgBoom = document.createElement('img');
  imgBoom.src = './assets/boom.png';
  imgBoom.alt = 'boom';
  imgBoom.classList.add('boom');
  document.querySelector('.board').prepend(imgBoom);

  clearTimeout(timerId);

  document.querySelectorAll('.board__item-checked').forEach(item => {
    item.classList.remove('board__item-checked');
  });

  document.querySelectorAll([`[data-status="mine"]`]).forEach(item => {
    item.classList.add('board__item-bombed');
  });

  document.querySelector('.board').removeEventListener('click', openBoardItem);

  audioLose.play();
  
  localStorage.removeItem('board');

  time = 0;
  localStorage.removeItem('timeSec');
  clearTimeout(timerId);
  localStorage.removeItem('steps');

  setTimeout(() => {
    document.querySelector('.modal-window-lose').style.display = 'flex';
    document.querySelector('.modal').style.display = 'block';

    document.querySelector('.modal').addEventListener('click', closeModalWindow);
  }, 1000)

}

function countNeighbourMines({line, position}) {
  let count = 0;
  if(board[line][position - 1]) {
    board[line][position - 1]?.status === 'mine' ? count++ : count;
  }

  if(board[line][position + 1]) {
    board[line][position + 1]?.status === 'mine' ? count++ : count;
  }

  if(board[line + 1]) {
    board[line + 1][position]?.status === 'mine' ? count++ : count;

    board[line + 1][position + 1]?.status === 'mine' ? count++ : count;
    board[line + 1][position - 1]?.status === 'mine' ? count++ : count;
  }

  if(board[line - 1]) {
    board[line - 1][position]?.status === 'mine' ? count++ : count;

    board[line - 1][position + 1]?.status === 'mine' ? count++ : count;
    board[line - 1][position - 1]?.status === 'mine' ? count++ : count;
  }

  return count;
}

function checkOpenItems() {  
  if(document.querySelectorAll('.board__item-open').length === ((boardSize * boardSize) - qualityOfMines)) {
    winGame();
    clearTimeout(timerId);
  }
}

function winGame() {
  audioWin.play();
  document.querySelector('.modal').style.display = 'block';
  document.querySelector('.modal-window').style.display = 'flex';
  document.querySelector('.game-time').textContent = time;
  document.querySelector('.game-clicks').textContent = steps;

  document.querySelector('.modal').addEventListener('click', closeModalWindow);

  if(localStorage.getItem('statistic')) {
    const lastStat = JSON.parse(localStorage.getItem('statistic'));
    if(lastStat.length >= 10) {
      lastStat.shift();
      lastStat.push({'time': time, 'click': steps});
    } else {
      lastStat.push({'time': time, 'click': steps});
    }
    localStorage.setItem('statistic',   JSON.stringify(lastStat));
  } else {
    localStorage.setItem('statistic',   JSON.stringify([{'time': time, 'click': steps}]));
  }

  localStorage.removeItem('board');
  time = 0;
  localStorage.removeItem('timeSec');
  clearTimeout(timerId);
  localStorage.removeItem('steps');
}

function closeModalWindow() {
  document.querySelector('.modal').style.display = 'none';
  document.querySelector('.modal-window').style.display = 'none';
  document.querySelector('.modal-window-lose').style.display = 'none';
  document.querySelector('.game-time').textContent = '';
  document.querySelector('.game-clicks').textContent = '';

  localStorage.removeItem('board');

  startNewGame();
}

function changeMinesNumber(event) {
  event.preventDefault();
  
  const inputValue = document.querySelector('input');

  if(level === 'expert') {
    if(+inputValue.value >= 70 && +inputValue.value <= 99) {
      changeBoardSize(+inputValue.value);
  
      board = [];
      isGameStarted = false;
      time = 0;
      steps = 0;
      clearTimeout(timerId);
      checked = 0;
    
      document.body.innerHTML = `<script src="index.js" type="module"></script>`;
    
      createBoard(boardSize, qualityOfMines);
    } else {
      inputValue.value = '';
    }
  } else {
    if(+inputValue.value >= 10 && +inputValue.value <= 99) {
      changeBoardSize(+inputValue.value);
  
      board = [];
      isGameStarted = false;
      time = 0;
      steps = 0;
      clearTimeout(timerId);
      checked = 0;
    
      document.body.innerHTML = `<script src="index.js" type="module"></script>`;
    
      createBoard(boardSize, qualityOfMines);
    } else {
      inputValue.value = '';
    }
  }
}

function openStatistics() {
  
  document.querySelector('.modal').style.display = 'block';

  document.querySelector('.modal').addEventListener('click', closeStatWindow);
  openStatisticsWindow();
}

function openStatisticsWindow() {
  let stat = document.createElement('div');
  stat.classList.add('statistics');
  const statArray = localStorage.getItem('statistic');

  if(statArray) {
    stat.innerHTML = `<h2 class="statistics__title">10 last games</h2>`;
    
    const statParse = JSON.parse(statArray);
    statParse.forEach((item, index)=> {
      const gameDescription = `${index + 1}. Game time: ${item.time} seconds, clicks: ${item.click}`;
      const oneGame = document.createElement('div');
      oneGame.classList.add('statistics__game');
      oneGame.textContent = gameDescription;
      stat.append(oneGame);
    })
  } else {
    stat.innerHTML = `<h2 class="statistics__title">There is no games</h2>`;
  }

  document.body.append(stat);
}

function closeStatWindow() {
  document.querySelector('.modal').style.display = 'none';
  if(document.querySelector('.statistics')) {
    document.querySelector('.statistics').remove();
  }
}