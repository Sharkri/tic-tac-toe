const game = (() => {
  const marker = document.querySelectorAll(".marker");
  const turn = document.querySelector(".turn");
  let currentTurn = "O";
  const board = {
    gameBoard: ["", "", "", "", "", "", "", "", ""],

    eventMarkerPlaced: marker.forEach((box) => {
      box.addEventListener("click", () => {
        if (box.textContent) return;
        changeTurn(box);
        render();
      });
    }),
  };

  submitName = function () {
    const inputs = document.querySelectorAll("input");

    if (!(inputs[0].value && inputs[1].value)) return;
    for (let input of inputs) playerNames.push(input.value);
    // Default value for turn
    turn.textContent = `${playerNames[0]}'s turn`;

    const home = document.querySelector(".home");
    home.style.display = "none";
    const openGame = document.querySelector(".game");
    openGame.style.display = "flex";
  };

  const playerNames = [];

  function render() {
    for (let divNum = 0; divNum < board.gameBoard.length; divNum++) {
      marker[divNum].textContent = board.gameBoard[divNum];
    }
    if (!board.gameBoard.includes("")) console.log("game finish");
  }

  function changeTurn(box) {
    if (currentTurn === "X") {
      currentTurn = "O";
    } else {
      currentTurn = "X";
    }

    turn.textContent = `${
      currentTurn === "X" ? playerNames[1] : playerNames[0]
    }'s turn`;

    board.gameBoard[+box.id - 1] = currentTurn;
  }
  function restart() {
    board.gameBoard = ["", "", "", "", "", "", "", "", ""];
    turn.textContent = `${playerNames[0]}'s turn`; // aple
    render();
  }

  function getBoard() {
    return board.gameBoard;
  }
  function getNames() {
    return playerNames;
  }
  return { getBoard, restart, submitName, getNames };
})();
