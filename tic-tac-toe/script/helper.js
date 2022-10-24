import { getStorageData, uploadStageData } from "./util.js";
import { playerRestart } from './app.js'

const dom = document;
const storage = window.localStorage;

export const createButtons = (id, buttonTxt = 'Button', classes) => {
  const btn = dom.createElement('button')
  btn.setAttribute('id', id)
  btn.setAttribute('class', classes)
  btn.textContent = buttonTxt

  return btn
}


export const createDivElements = () => {
  const divsArr = [];
  for (let i = 0; i < 9; i++) {
    const div = dom.createElement("div");
    const exactPos = i + 1;
    let boxNum;
    let boxPos;
    //cell ids anjd position
    if (exactPos % 3 === 0) {
      boxNum = 3;
    } else {
      boxNum = exactPos % 3;
    }
    if (exactPos - boxNum === 0) {
      boxPos = 1;
    }
    if (exactPos - boxNum === 3) {
      boxPos = 2;
    }
    if (exactPos - boxNum === 6) {
      boxPos = 3;
    }

    div.setAttribute("id", `cell${i + 1}`);
    div.setAttribute("box", `${boxNum}`);
    div.setAttribute("boxpos", `${boxPos}`);

    div.setAttribute("class", "tictacCell");
    divsArr.push(div);
  }

  storageInit()



  return divsArr;
};

export const createDivContainer = (classes, id) => {
  const div = dom.createElement("div");
  div.setAttribute("class", classes);
  div.setAttribute("id", id);
  return div;
};

export const createSpan = (classes, id) => {
  const div = dom.createElement("span");
  div.setAttribute("class", classes);
  div.setAttribute("id", id);
  return div;
};

export const playerMoves = (boxNum, player) => {
  let storagePlayerUpdate;
  if (player === 1) {
    storagePlayerUpdate = "playerOne";
  } else {
    storagePlayerUpdate = "playerTwo";
  }
  //upload playermoves
  uploadStageData(storagePlayerUpdate, boxNum);
 
};

export const calculateWin = (player) => {
  let checkPlayer;
  if (player === 1) {
    checkPlayer = "playerOne";
  } else {
    checkPlayer = "playerTwo";
  }
  const currentMoves = getStorageData(checkPlayer);

  const board = [[], [], []];

  currentMoves.forEach((e) => {
    const v = e[0] - 1;
    const h = e[1];
    board[v].push(h);
  });

  return checkBoard();

  function checkBoard() {
    const arr = [];

    // 123 / 321 combi
    board.forEach((e) => {
      const sorted = e.sort();
      const joined = +sorted.join("");
      if (joined === 123) {
        arr.push(checkPlayer + " won!");
      }
    });

    if (arr[0]) {
      return arr[0];
    }


    let winCombiOne = [];
    let winCombiTwo = [];

    //1 2 3
    if (board[0].includes('1')) {
      winCombiOne.push(1)
    }
    if (board[1].includes('2')) {
      winCombiOne.push(1)
    }
    if (board[2].includes('3')) {
      winCombiOne.push(1)
    }

    // 3 2 1 
    if (board[0].includes('3')) {
      winCombiTwo.push(1)
    }
    if (board[1].includes('2')) {
      winCombiTwo.push(1)
    }
    if (board[2].includes('1')) {
      winCombiTwo.push(1)
    }

    let firstLine = [];
    let secondLine = [];
    let thirdLine = [];
    board.forEach((e) => {
      if (e.includes("1")) {
        firstLine.push(1);
      }
    });

    board.forEach((e) => {
      if (e.includes("2")) {
        secondLine.push(1);
      }
    });

    board.forEach((e) => {
      if (e.includes("3")) {
        thirdLine.push(1);
      }
    });

    winCombiOne = checkCombination(winCombiOne)
    winCombiTwo = checkCombination(winCombiTwo)
    firstLine = checkCombination(firstLine);
    secondLine = checkCombination(secondLine);
    thirdLine = checkCombination(thirdLine);

    if (firstLine === 111 || secondLine === 111 || thirdLine === 111 || winCombiOne === 111 || winCombiTwo === 111) {
      return checkPlayer + " won!";
    }

    function checkCombination(boardCheck) {
      let winCombi = boardCheck.sort();
      winCombi = winCombi.join("")
      if (typeof winCombi !== "number") {
        winCombi = +winCombi;
      }
      return winCombi;
    }
  }
};


export const clickHistory = (e) => {
  const len = e.id.length - 1
  uploadStageData('board', e.id[len])

}


function storageInit() {
  storage.setItem("playerOne", JSON.stringify([]));
  storage.setItem("playerTwo", JSON.stringify([]));
  storage.setItem("board", JSON.stringify([]));
  storage.setItem("history", JSON.stringify([]));
  storage.setItem("historyForward", JSON.stringify([]));
  storage.setItem("boardForward", JSON.stringify([]));
  storage.setItem("move", 0);
  storage.setItem('historyForward', JSON.stringify([]))
  storage.setItem('boardForward', JSON.stringify([]))
}





export const backBtnOnly = (btnClicked) => {

  const title = dom.getElementById('title')
  if(title.textContent.includes('Won')) {
 
    return
  }
  let history = getStorageData('history')
  let player = history[history.length -1]

  let checkThis;
  let holder;
  if (player == 1) {
    checkThis = getStorageData('playerOne')
    holder = 'playerOne'
  } else {
    checkThis = getStorageData('playerTwo')
    holder = 'playerTwo'
  }
  checkThis.pop()
  checkThis = JSON.stringify(checkThis)
  storage.setItem(holder,checkThis)


  const cells = dom.querySelectorAll('.tictacCell')

  const pos = history.length - 1

  const board = getStorageData('board')
  const cellNumtoClear = board[pos] -1
  cells[cellNumtoClear].textContent = ''
 
  playerRestart()


  //full back clear
  if(history.length == 1) {

    dom.getElementById(btnClicked).style.visibility = 'hidden'
    dom.getElementById('forwardBtn').style.visibility = 'hidden'
    storageInit()
    return;
  }

  const fwd = dom.getElementById('forwardBtn')
  const historyFwd = getStorageData('historyForward')
  if(historyFwd.length > 0) {
    fwd.style.visibility = 'visible'
  }

  let updateMove = historyFwd[historyFwd.length -1];

  

  storage.setItem('move',updateMove)
   
}






export const forwardBtnOnly = () => {

  const boardForward = getStorageData('boardForward')
  const playerForward = getStorageData('historyForward')
  const history = getStorageData('history')
  let move = getStorageData('move')


  let lastPlayer = playerForward[playerForward.length -1]
  let lastBox = boardForward[boardForward.length -1]
  let boxPos, boxNum,char,color;
   
  

  if(lastBox / 3 < 1) {
    boxPos = 1;
  } else if (lastBox / 3 < 2) {
    boxPos = 2;
  } else {
    boxPos = 3;
  }
  if(lastBox  < 4) {
    boxNum = 1;
  } else if (lastBox < 7) {
    boxNum = 2;
  } else {
    boxNum = 3;
  }

   playerMoves([boxPos,boxNum],lastPlayer)

  const cell = dom.querySelectorAll('.tictacCell')

  // console.log(move)

  if(move == 1) {
    char = 'X'

    color = 'red'
  } else {
    char = 'O'

    color = 'yellow'
  }

  cell[lastBox-1].style.color = color
  cell[lastBox-1].textContent = char

  uploadStageData('board',lastBox)

  playerForward.pop()
  boardForward.pop()


  storage.setItem('boardForward',JSON.stringify(boardForward))
  storage.setItem('historyForward',JSON.stringify(playerForward))
  
  history.push(move)

  storage.setItem('history',JSON.stringify(history))

  storage.setItem('move',move)

  if(playerForward.length < 1) {
    dom.getElementById('forwardBtn').style.visibility = 'hidden'
    
    return
  }



 

  


  

  // storage.setItem("history",JSON.stringify(history))


}