const GAME_BOARD = {
  gameBoard: ["x", "o", "x", "x", "o", "x", "x", "o", "x"],
  render_gameBoard: function () {
    const gameBoardHTML = document.querySelectorAll(".marker");
    for (let divNum = 0; divNum < this.gameBoard.length; divNum++) {
      gameBoardHTML[divNum].textContent = this.gameBoard[divNum];
    }
  },
};
GAME_BOARD.render_gameBoard();
