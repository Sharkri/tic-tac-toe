function Player(name, type, marker) {
  return { name, type, marker };
}

const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const resetBoard = () => (board = ["", "", "", "", "", "", "", "", ""]);

  const changeBoard = (num, marker) => (board[num] = marker);

  return { getBoard, resetBoard, changeBoard };
})();

const displayController = (() => {
  const p1 = document.querySelector(".p1");
  const p2 = document.querySelector(".p2");
  const getPlayers = () => players;
  const getPlayerInfo = (num, attr) => players[num][attr];
  let players = [];
  function changeOverlay() {
    const home = document.querySelector(".home");
    const openGame = document.querySelector(".game");
    if (home.style.display === "none") home.style.display = "flex";
    else home.style.display = "none";

    if (openGame.style.display === "flex") openGame.style.display = "none";
    else openGame.style.display = "flex";
  }

  function goBack() {
    changeOverlay();
    game.resetWins();
  }

  function startGame() {
    addPlayerToArray();
    p1.textContent = getPlayerInfo(0, "name");
    p2.textContent = getPlayerInfo(1, "name");
    game.restart();
    changeOverlay();
  }

  function addPlayerToArray() {
    const inputs = document.querySelectorAll("input[type='text']");
    players = [];
    let defaults = ["Player One", "Player Two"];
    for (let i = 0; i < inputs.length; i++) {
      let name = inputs[i].value ? inputs[i].value : defaults[i];
      players.push(Player(name, isPlayerOrAI(i), i === 0 ? "X" : "O"));
    }
  }

  function isPlayerOrAI(numType) {
    const P1Radio = document.querySelector("#player1Radio");
    if (numType === 0) return P1Radio.checked ? "Player" : "AI";

    const P2Radio = document.querySelector("#player2Radio");
    return P2Radio.checked ? "Player" : "AI";
  }
  document.querySelector(".start").addEventListener("click", startGame);
  document.querySelector(".back").addEventListener("click", goBack);

  return { getPlayers, getPlayerInfo };
})();

const game = (() => {
  const marker = document.querySelectorAll(".marker");
  const turn = document.querySelector(".turn");
  const p1Wins = document.querySelector(".p1-wins");
  const p2Wins = document.querySelector(".p2-wins");
  const p1Mode = document.querySelector("#P1-Modes");
  const p2Mode = document.querySelector("#P2-Modes");
  const board = Gameboard.getBoard;
  const changeBoard = Gameboard.changeBoard;
  const players = displayController.getPlayerInfo;
  marker.forEach((box) => {
    box.addEventListener("click", () => {
      const player = displayController.getPlayers();
      if (box.textContent || checkWinner(board())) return;
      // Gets AI Object Index
      const aiObject = player[player.findIndex((x) => x.type === "AI")];
      if (aiObject && aiObject.marker !== lastTurn) return;
      if (player[0].type === "AI" && player[1].type === "AI") return;
      let boxNum = Number(box.id) - 1;
      makeMove(boxNum);
      if (aiObject && aiObject.type)
        AIMove(aiObject.marker === "X" ? p1Mode.value : p2Mode.value);
    });
  });
  let lastTurn = "O";

  // Radio Button Event Listener
  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach((radio) => {
    radio.addEventListener("click", () => {
      const MODES = document.querySelectorAll(".modes");
      const PLAYER_MODE = { player1Radio: 0, player2Radio: 1 };
      if (radio.id === "ai1" || radio.id === "ai2") {
        const IDNumber = [+radio.id.slice(-1) - 1];
        MODES[IDNumber].style.display = "block";
      }
      if (radio.id === "player1Radio" || radio.id === "player2Radio") {
        MODES[PLAYER_MODE[radio.id]].style.display = "none";
      }
    });
  });

  function render() {
    for (let divNum = 0; divNum < board().length; divNum++) {
      marker[divNum].textContent = board()[divNum];
    }
    highlightTurn();
    if (checkWinner(board()) === "Draw") {
      turn.textContent = "Draw!";
      return;
    }
    const markers = { X: "X", O: "O" };
    if (checkWinner(board()) in markers) {
      if (lastTurn === "X") {
        turn.textContent = `${players(0, "name")} is the winner!`;
        p1Wins.textContent = `${(+p1Wins.textContent + 1).toString()}`;
        return;
      }

      turn.textContent = `${players(1, "name")} is the winner!`;
      p2Wins.textContent = `${(+p2Wins.textContent + 1).toString()}`;
    }
  }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function AIMove(mode) {
    let boxToPlaceMarker;
    if (checkWinner(board())) return;

    if (mode === "Easy") boxToPlaceMarker = easyMode();
    else if (mode === "Medium") boxToPlaceMarker = mediumMode(board());
    else boxToPlaceMarker = impossibleMode();

    await sleep(500);
    makeMove(boxToPlaceMarker);
    if (players(0, "type") === "AI" && players(1, "type") === "AI") {
      AIMove(lastTurn === "X" ? p2Mode.value : p1Mode.value);
    }
  }

  const impossibleMode = () => getBestMove(board());

  function mediumMode(board) {
    const currentTurn = lastTurn === "X" ? "O" : "X";
    let move = aboutToWin(board, currentTurn) || aboutToWin(board, lastTurn);
    return move !== undefined ? move : easyMode();
  }

  function easyMode() {
    randomMove = Math.floor(Math.random() * 9);
    while (board()[randomMove]) {
      randomMove = Math.floor(Math.random() * 9);
    }
    return randomMove;
  }

  function getBestMove(board) {
    const currentTurn = lastTurn === "X" ? "O" : "X";
    const turnsPlayed = board.filter((a) => a == lastTurn).length;
    const diag = (board[0] && board[8]) || (board[2] && board[6]);
    const corners = board[0] || board[8] || board[2] || board[6];
    const midCorner = board[1] || board[5] || board[7] || board[3];
    let bestMove;
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

  const checkGameOver = (board) => !board.includes("");

  function makeMove(boxNum) {
    changeTurn(boxNum);
    render();
  }

  function changeTurn(boxNum) {
    lastTurn = lastTurn === "X" ? "O" : "X";
    displayTurn();
    changeBoard(boxNum, lastTurn);
  }

  const displayTurn = () => {
    turn.textContent = `${
      lastTurn === "O" ? players(0, "name") : players(1, "name")
    }'s turn`;
    highlightTurn();
  };

  function highlightTurn() {
    const first = document.querySelector(".first");
    const second = document.querySelector(".second");

    first.style.backgroundColor = second.style.backgroundColor = "#f7f7f7";
    first.style.boxShadow = second.style.boxShadow = "none";

    if (checkWinner(board())) return;

    lastTurn === "O" ? turnStyle(first) : turnStyle(second);
  }

  function restart() {
    Gameboard.resetBoard();
    turn.textContent = `${players(0, "name")}'s turn`;
    lastTurn = "O";

    if (players(0, "type") === "AI") AIMove(p1Mode.value);
    render();
  }

  function turnStyle(num) {
    num.style.backgroundColor = "#fca5a5";
    num.style.boxShadow = "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px";
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
      const onlyContains = sorted[0] == sorted.slice(-1);
      if (onlyContains) return item[0];
    }
  }
  const resetWins = () => (p1Wins.textContent = p2Wins.textContent = "0");
  return { restart, checkWinner, resetWins };
})();
