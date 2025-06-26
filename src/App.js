import React, { useState, useEffect, useCallback } from 'react';

const ROWS = 20;
const COLS = 10;
const EMPTY_CELL = 0;

const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [2, 2],
    [2, 2]
  ],
  T: [
    [0, 3, 0],
    [3, 3, 3]
  ],
  S: [
    [0, 4, 4],
    [4, 4, 0]
  ],
  Z: [
    [5, 5, 0],
    [0, 5, 5]
  ],
  J: [
    [6, 0, 0],
    [6, 6, 6]
  ],
  L: [
    [0, 0, 7],
    [7, 7, 7]
  ]
};

const randomShape = () => {
  const keys = Object.keys(SHAPES);
  const rand = keys[Math.floor(Math.random() * keys.length)];
  return { shape: SHAPES[rand], color: rand };
};

const createBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY_CELL));

function App() {
  const [board, setBoard] = useState(createBoard());
  const [piece, setPiece] = useState(randomShape());
  const [position, setPosition] = useState({ x: 4, y: 0 });

  const mergePiece = useCallback((newBoard, shape, pos) => {
    shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          const boardY = y + pos.y;
          const boardX = x + pos.x;
          if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
            newBoard[boardY][boardX] = cell;
          }
        }
      });
    });
  }, []);

  const movePieceDown = useCallback(() => {
    setPosition(pos => ({ ...pos, y: pos.y + 1 }));
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        setPosition(pos => ({ ...pos, x: pos.x - 1 }));
      } else if (e.key === 'ArrowRight') {
        setPosition(pos => ({ ...pos, x: pos.x + 1 }));
      } else if (e.key === 'ArrowDown') {
        movePieceDown();
      }
    },
    [movePieceDown]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const interval = setInterval(() => {
      movePieceDown();
    }, 500);
    return () => clearInterval(interval);
  }, [movePieceDown]);

  useEffect(() => {
    const newBoard = createBoard();
    mergePiece(newBoard, piece.shape, position);
    setBoard(newBoard);
  }, [piece, position, mergePiece]);

  return (
    <div style={{ display: 'inline-block', background: '#111', padding: 10 }}>
      {board.map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {row.map((cell, x) => (
            <div
              key={x}
              style={{
                width: 20,
                height: 20,
                background: cell ? 'cyan' : '#222',
                border: '1px solid #333'
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
