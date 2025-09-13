import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import './styles.css';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={`square ${highlight ? "highlight" : ""}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const win = winner ? winner.winner : null;
  const winningLine = winner ? winner.line : [];

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  if (!winner && squares.every(square => square !== null)) {
    status = "It's a draw!"
  } 

  function renderSquare(i) {
    return (<Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} highlight={winningLine.includes(i)}/>)
  }

  const rows = [];
  for (let row = 0; row < 3; row++) {
    const squareInRow = [];
    for (let col = 0; col < 3; col++) {
        const index = row * 3 + col;
        squareInRow.push(renderSquare(index));
    }
    rows.push(<div key={row} className="board-row">{squareInRow}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      <>{rows}</>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares,  ) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {move === history.length - 1 ? (<p onClick={() => jumpTo(move)}>{description}</p>
  ) : (<button onClick={() => jumpTo(move)}>{description}</button>)}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], line: [a,b,c]};
    }
  }
  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Game/>);
