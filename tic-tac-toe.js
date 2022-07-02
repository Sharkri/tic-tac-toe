function Player(name, type, marker) {
  return { name, type, marker };
}

const game = (() => {
  const marker = document.querySelectorAll(".marker");
  const turn = document.querySelector(".turn");
  const p1 = document.querySelector(".p1");
  const p2 = document.querySelector(".p2");
  const p1Wins = document.querySelector(".p1-wins");
  const p2Wins = document.querySelector(".p2-wins");
  const p1Mode = document.querySelector("#P1-Modes");
  const p2Mode = document.querySelector("#P2-Modes");

  const board = {
    gameBoard: ["", "", "", "", "", "", "", "", ""],
    eventMarkerPlaced: marker.forEach((box) => {
      box.addEventListener("click", () => {
        if (box.textContent || checkWinner(board.gameBoard)) return;
        const objectAI = players[players.findIndex((x) => x.type === "AI")];
        if (objectAI && objectAI.marker === (lastTurn === "X" ? "O" : "X"))
          return;
        if (players[0].type === "AI" && players[1].type === "AI") return;
        let boxNum = Number(box.id) - 1;
        makeMove(boxNum);
        if (objectAI && objectAI.type)
          AIMove(objectAI.marker === "X" ? p1Mode.value : p2Mode.value);
      });
    }),
  };
  let lastTurn = "O";
  let players = [];

  const overlay = {
    changeOverlay: function () {
      const home = document.querySelector(".home");
      const openGame = document.querySelector(".game");
      if (home.style.display === "none") home.style.display = "flex";
      else home.style.display = "none";

      if (openGame.style.display === "flex") openGame.style.display = "none";
      else openGame.style.display = "flex";
    },

    goBack: function () {
      overlay.changeOverlay();
      p2Wins.textContent = p1Wins.textContent = "0";
    },

    startGame: function () {
      overlay.addPlayerToArray();
      p1.textContent = players[0].name;
      p2.textContent = players[1].name;
      restart();
      overlay.changeOverlay();
    },
    addPlayerToArray: function () {
      const inputs = document.querySelectorAll("input[type='text']");
      players = [];
      let defaultNames = ["Player One", "Player Two"];
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value) {
          players.push(
            Player(
              inputs[i].value,
              overlay.isPlayerOrAI(i),
              i === 0 ? "X" : "O"
            )
          );
          continue;
        }
        players.push(
          Player(defaultNames[i], overlay.isPlayerOrAI(i), i === 0 ? "X" : "O")
        );
      }
    },

    isPlayerOrAI: function (numType) {
      const P1Radio = document.querySelector("#player1Radio");
      if (numType === 0) {
        return overlay.checkPlayer(P1Radio.checked);
      }
      const P2Radio = document.querySelector("#player2Radio");
      return overlay.checkPlayer(P2Radio.checked);
    },

    checkPlayer: function (value) {
      if (value) return "Player";
      return "AI";
    },
  };
  // Event Listeners
  document.querySelector(".start").addEventListener("click", overlay.startGame);
  document.querySelector(".back").addEventListener("click", overlay.goBack);
  document.querySelectorAll('input[type="radio"]').forEach((element) => {
    {
      element.addEventListener("click", () => {
        const MODES = document.querySelectorAll(".modes");
        const PLAYER_MODE = { player1Radio: 0, player2Radio: 1 };
        if (element.id === "ai1" || element.id === "ai2") {
          const IDNumber = [+element.id.slice(-1) - 1];
          MODES[IDNumber].style.display = "block";
        }
        if (element.id === "player1Radio" || element.id === "player2Radio") {
          MODES[PLAYER_MODE[element.id]].style.display = "none";
        }
      });
    }
  });

  function render() {
    for (let divNum = 0; divNum < board.gameBoard.length; divNum++) {
      marker[divNum].textContent = board.gameBoard[divNum];
    }
    highlightTurn();
    if (checkWinner(board.gameBoard) === "Draw") {
      turn.textContent = "Draw!";
      return;
    }
    const markers = { X: "X", O: "O" };
    if (checkWinner(board.gameBoard) in markers) {
      if (lastTurn === "X") {
        turn.textContent = `${players[0].name} is the winner!`;
        p1Wins.textContent = `${(+p1Wins.textContent + 1).toString()}`;
        return;
      }

      turn.textContent = `${players[1].name} is the winner!`;
      p2Wins.textContent = `${(+p2Wins.textContent + 1).toString()}`;
    }
  }

  async function AIMove(mode) {
    let boxToPlaceMarker;
    if (checkWinner(board.gameBoard)) return;

    if (mode === "Easy") boxToPlaceMarker = easyMode();
    if (mode === "Medium") boxToPlaceMarker = mediumMode(board.gameBoard);
    if (mode === "Impossible") boxToPlaceMarker = impossibleMode();

    await sleep(500);
    makeMove(boxToPlaceMarker);
    if (players[0].type === "AI" && players[1].type === "AI") {
      AIMove(lastTurn === "X" ? p2Mode.value : p1Mode.value);
    }
  }
  function mediumMode(board) {
    const currentTurn = lastTurn === "X" ? "O" : "X";
    let move = aboutToWin(board, currentTurn) || aboutToWin(board, lastTurn);
    return move !== undefined ? move : easyMode();
  }
  const impossibleMode = () => getBestMove(board.gameBoard);

  function getBestMove(board) {
    const currentTurn = lastTurn === "X" ? "O" : "X";
    const turnsPlayed = board.filter((a) => a == lastTurn).length;
    console.log(turnsPlayed);
    let bestMove;
    const diag = (board[0] && board[8]) || (board[2] && board[6]);
    const corners = board[0] || board[8] || board[2] || board[6];
    const midCorner = board[1] || board[5] || board[7] || board[3];
    bestMove = aboutToWin(board, currentTurn) || aboutToWin(board, lastTurn);
    if (turnsPlayed == 0) bestMove = 0;
    if (turnsPlayed == 1 && currentTurn === "X" && board[4]) bestMove = 8;
    if (turnsPlayed == 1 && currentTurn === "X") {
      bestMove = !board[2] ? 2 : board[6] ? 6 : 8;
    }
    if (turnsPlayed == 1 && currentTurn === "O" && corners) bestMove = 4;
    if (turnsPlayed == 2 && currentTurn === "O" && diag) bestMove = 3;
    if (turnsPlayed == 1 && currentTurn === "O" && board[4]) bestMove = 2;
    if (turnsPlayed == 1 && currentTurn === "O" && midCorner) {
      bestMove = board[5] ? 3 : board[3] ? 5 : board[1] ? 7 : 1;
    }
    if (turnsPlayed == 2 && !corners && currentTurn === "O") {
      bestMove = (board[3] || board[1]) === lastTurn ? 0 : board[5] ? 2 : 6;
    }
    return bestMove !== undefined ? bestMove : easyMode();
  }
  function aboutToWin(board, turn) {
    for (let i = 0; i < 9; i++) {
      if (board[i] != "") continue;
      board[i] = turn;
      let isWinner = checkWinner(board);
      board[i] = "";
      if (isWinner) return i;
    }
  }
  function easyMode() {
    randomMove = Math.floor(Math.random() * 9);
    while (board.gameBoard[randomMove]) {
      randomMove = Math.floor(Math.random() * 9);
    }
    return randomMove;
  }

  const checkGameOver = (board) => !board.includes("");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function makeMove(boxNum) {
    changeTurn(boxNum);
    render();
  }

  function changeTurn(boxNum) {
    lastTurn = lastTurn === "X" ? "O" : "X";
    displayTurn();
    board.gameBoard[boxNum] = lastTurn;
  }

  const displayTurn = () => {
    turn.textContent = `${
      lastTurn === "O" ? players[0].name : players[1].name
    }'s turn`;
    highlightTurn();
  };

  function highlightTurn() {
    const first = document.querySelector(".first");
    const second = document.querySelector(".second");

    first.style.backgroundColor = second.style.backgroundColor = "#f7f7f7";
    first.style.boxShadow = second.style.boxShadow = "none";

    if (checkWinner(board.gameBoard)) return;

    if (lastTurn === "O") {
      first.style.backgroundColor = "#fca5a5";
      first.style.boxShadow = "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px";
      return;
    }

    second.style.backgroundColor = "#fca5a5";
    second.style.boxShadow = "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px";
  }

  function restart() {
    board.gameBoard = ["", "", "", "", "", "", "", "", ""];
    turn.textContent = `${players[0].name}'s turn`;
    lastTurn = "O";

    if (players[0].type === "AI") AIMove(p1Mode.value);
    render();
  }

  function checkWinner(board) {
    let firstCol = board.slice(0, 3);
    let secondCol = board.slice(3, 6);
    let thirdCol = board.slice(6, 9);
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
    if (threeInARow(columns)) return threeInARow(columns);
    if (threeInARow(rows)) return threeInARow(rows);
    if (threeInARow(diagonals)) return threeInARow(diagonals);
    if (checkGameOver(board)) return "Draw";
    return false;
  }
  function threeInARow(array) {
    for (let item of array) {
      if (item.includes("")) continue;
      const sorted = item.sort();
      const onlyContains = sorted[0] == sorted[sorted.length - 1];
      if (onlyContains) return item[0];
    }
  }
  const getPlayersInfo = () => {
    for (let player of players) console.log(player);
  };
  const getBoard = () => board.gameBoard;
  return { restart, checkWinner, getPlayersInfo, getBoard };
})();
