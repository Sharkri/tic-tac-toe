const game = (() => {
  const marker = document.querySelectorAll(".marker");
  const turn = document.querySelector(".turn");
  const p1 = document.querySelector(".p1");
  const p2 = document.querySelector(".p2");
  let p1Wins = document.querySelector(".p1-wins");
  let p2Wins = document.querySelector(".p2-wins");
  const board = {
    gameBoard: ["", "", "", "", "", "", "", "", ""],
    eventMarkerPlaced: marker.forEach((box) => {
      box.addEventListener("click", () => {
        if (box.textContent) return;
        if (checkWinner()) return;
        changeTurn(box);
        render();
      });
    }),
  };
  let lastTurn = "O";

  let playerNames = [];
  const overlay = {
    inputs: document.querySelectorAll("input"),

    changeOverlay: function () {
      const home = document.querySelector(".home");
      const openGame = document.querySelector(".game");
      if (home.style.display === "none") home.style.display = "block";
      else home.style.display = "none";

      if (openGame.style.display === "flex") openGame.style.display = "none";
      else openGame.style.display = "flex";
    },

    submitName: function () {
      playerNames = [];
      let defaultNames = ["Player 1", "Player 2"];
      for (let i = 0; i < overlay.inputs.length; i++) {
        if (overlay.inputs[i].value) {
          playerNames.push(overlay.inputs[i].value);
          continue;
        }
        playerNames.push(defaultNames[i]);
      }
      // Default value for turn
      restart();
      overlay.changeOverlay();
    },

    goBack: function () {
      for (let input of overlay.inputs) input.value = "";
      overlay.changeOverlay();
      p2Wins.textContent = p1Wins.textContent = "0";
    },
  };
  // Event Listener
  document
    .querySelector(".start")
    .addEventListener("click", overlay.submitName);

  document.querySelector(".back").addEventListener("click", overlay.goBack);

  function render() {
    for (let divNum = 0; divNum < board.gameBoard.length; divNum++) {
      marker[divNum].textContent = board.gameBoard[divNum];
    }
    if (!board.gameBoard.includes("") && !checkWinner()) {
      turn.textContent = "Draw!";
      p1.style.backgroundColor = p2.style.backgroundColor = "white";
      return;
    }
    if (checkWinner()) {
      p1.style.backgroundColor = p2.style.backgroundColor = "white";
      if (lastTurn === "X") {
        turn.textContent = `${playerNames[0]} is the winner!`;
        p1Wins.textContent = (+p1Wins.textContent + 1).toString();
        return;
      }
      turn.textContent = `${playerNames[1]} is the winner!`;
      p2Wins.textContent = (+p2Wins.textContent + 1).toString();
    }
  }

  function changeTurn(box) {
    lastTurn = lastTurn === "X" ? "O" : "X";
    displayTurn();
    // Puts marker in box
    board.gameBoard[+box.id - 1] = lastTurn;
  }
  const displayTurn = () => {
    p2.style.backgroundColor = p1.style.backgroundColor = "white";
    // Swap O with X to get current turn
    const XO = { O: playerNames[0], X: playerNames[1] };
    turn.textContent = `${XO[lastTurn]}'s turn`;
    styleTurn();
  };
  function styleTurn() {
    if (lastTurn === "O") {
      p1.style.backgroundColor = "#fca5a5";
      p1.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px;";
      return;
    }
    p2.style.backgroundColor = "#fca5a5";
    p2.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px;";
  }
  function restart() {
    board.gameBoard = ["", "", "", "", "", "", "", "", ""];
    turn.textContent = `${playerNames[0]}'s turn`;
    p1.textContent = playerNames[0];
    p2.textContent = playerNames[1];
    lastTurn = "O";
    styleTurn();
    render();
  }
  function checkWinner() {
    // Only work for cols...
    let firstCol = board.gameBoard.slice(0, 3);
    let secondCol = board.gameBoard.slice(3, 6);
    let thirdCol = board.gameBoard.slice(6, 9);
    const columns = [firstCol, secondCol, thirdCol];
    const rows = [
      [firstCol[0], secondCol[0], thirdCol[0]],
      [firstCol[1], secondCol[1], thirdCol[1]],
      [firstCol[2], secondCol[2], thirdCol[2]],
    ];
    const diagonals = [
      [firstCol[0], secondCol[1], thirdCol[2]],
      [firstCol[2], secondCol[1], thirdCol[0]],
    ];
    if (threeInARow(columns) || threeInARow(rows) || threeInARow(diagonals)) {
      return true;
    }
  }

  function threeInARow(array) {
    for (let item of array) {
      if (onlyContains(item)) {
        return true;
      }
    }
  }
  function onlyContains(array) {
    if (array.includes("")) return;
    array.sort();
    return array[0] == array[array.length - 1];
  }

  const getBoard = () => board.gameBoard;
  const getNames = () => playerNames;

  return { getBoard, restart, getNames, checkWinner };
})();
