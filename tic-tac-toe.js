const game = (() => {
  const board = {
    gameBoard: ["", "", "", "", "", "", "", "", ""],
  };

  const marker = document.querySelectorAll(".marker");
  const turn = document.querySelector(".turn");

  function render() {
    for (let divNum = 0; divNum < board.gameBoard.length; divNum++) {
      marker[divNum].textContent = board.gameBoard[divNum];
    }
  }

  // Event Listener
  marker.forEach((box) => {
    box.addEventListener("click", () => {
      if (box.textContent) return;

      currentTurn = turn.textContent.includes("X") ? "X" : "O";
      turn.textContent = `${currentTurn === "X" ? "O" : "X"}'s Turn`;
      board.gameBoard[+box.id - 1] = currentTurn;

      render();
    });
  });

  function restart() {
    board.gameBoard = ["", "", "", "", "", "", "", "", ""];
    turn.textContent = "X's turn";
    render();
  }

  function getBoard() {
    return board.gameBoard;
  }

  return { getBoard, restart };
})();
