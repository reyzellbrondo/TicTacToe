import { createDivElements, createDivContainer, playerMoves, calculateWin, createSpan, clickHistory, createButtons, backBtnOnly,forwardBtnOnly } from "./helper.js";
import { uploadStageData, getStorageData } from './util.js'

const dom = document;
const storage = window.localStorage
const root = dom.getElementById("root");
let winner;
let playWithComputer = false;




//start on load
window.addEventListener("load", () => {
  const div = createDivElements();

  //title
  const titleDiv = createDivContainer('title', 'title')
  const tic = createSpan('tic', 'tic')
  const tac = createSpan('tac', 'tac')
  const toe = createSpan('toe', 'toe')
  tic.innerText = 'Tic '
  tac.innerText = 'Tac '
  toe.innerText = 'Toe '
  titleDiv.appendChild(tic)
  titleDiv.appendChild(tac)
  titleDiv.appendChild(toe)
  titleDiv.innerHTML += 'By Reyzell'


  root.appendChild(titleDiv);

  // btns
  const backBtn = createButtons('backBtn', 'Previous', 'btn back')
  const forwardBtn = createButtons('forwardBtn', 'Next', 'btn forward')
  const btnContainer = createDivContainer('btnContainer', 'btnContainer')
  btnContainer.appendChild(backBtn);
  btnContainer.appendChild(forwardBtn);

  root.appendChild(btnContainer);

  //init board
  const container = createDivContainer("gridContainer", "board");
  root.appendChild(container);
  div.forEach((e) => {
    dom.getElementById("board").appendChild(e);
  });

  const tictacCell = dom.querySelectorAll(".tictacCell");
  const btn = dom.querySelectorAll(".btn");

  btn.forEach(e => {
    e.addEventListener('click', e => {
      const id = e.target.id
      if (id === 'backBtn') {
        backBtnOnly(id, player)
      } else {
        forwardBtnOnly()
      }

    })
  })


  let player = getStorageData('move')

  tictacCell.forEach((e) => {
    e.addEventListener("click", (el) => {

      let text;
      const boxNum = el.target.getAttribute("box");
      const boxPos = el.target.getAttribute("boxpos");
      let color;

     if (dom.getElementById(el.target.id).textContent.length > 0) {
        return
      } else {
        clickHistory(e)
        player = getStorageData('move')
        if (dom.getElementById('forwardBtn').style.visibility == 'visible') {
        } else {
          player += 1;
        }

       dom.getElementById('forwardBtn').style.visibility = 'hidden'
        storage.setItem("historyForward", JSON.stringify([]));
        storage.setItem("boardForward", JSON.stringify([]));

        if (player % 2 === 0) {
          player = 2;
          text = 'O'
          color = 'yellow'
          storage.setItem('move', player)

        } else {
          player = 1
          text = 'X'
          color = 'red'
          storage.setItem('move', player)

        }

        uploadStageData('history', player)

        //stop if winner detected
        if (winner) {
          return
        }

        dom.getElementById(el.target.id).textContent = text
        dom.getElementById(el.target.id).style.color = color

        const history = getStorageData('history')
        if (history.length > 0) {
          dom.getElementById('backBtn').style.visibility = 'visible'
        }

        playerMoves([boxPos, boxNum], player)
        const result = calculateWin(player)
        
        //check result
        if (result) {
          let announce;
          if (result.includes('playerOne')) {
            announce = 'Player X Won!'
            dom.getElementById('backBtn').style.visibility = 'hidden'
            dom.getElementById('forwardBtn').style.visibility = 'hidden'

          }
          if (result.includes('playerTwo')) {
            announce = 'Player O Won!'
            dom.getElementById('backBtn').style.visibility = 'hidden'
            dom.getElementById('forwardBtn').style.visibility = 'hidden'
          }
          titleDiv.innerText = announce
          winner = result
        
        }

        if(draw() == 'tie' && !winner) {
          titleDiv.innerText = 'Draw!'
        }
      }

    });

  });

  // end on load
});

function draw() {
  const cells = dom.querySelectorAll('.tictacCell')
    const arr = []
  cells.forEach(e => {
    
    if(e.textContent.length > 0) {
      arr.push(e.textContent)
    }
    
  })
  if(arr.length == 9) {
    return 'tie'
  } else {
    return undefined
  }
}



export const playerRestart = () => {

  let lastPlayer = getStorageData('history')
  let board = getStorageData('board')

  const backed = lastPlayer[lastPlayer.length - 1]
  uploadStageData('historyForward', backed)

  let boardFwd = board[board.length -1]

  uploadStageData('boardForward', boardFwd)
  
  lastPlayer.pop()
  board.pop()
  lastPlayer = JSON.stringify(lastPlayer)
  board = JSON.stringify(board)
  storage.setItem('history', lastPlayer)
  storage.setItem('board', board)


}