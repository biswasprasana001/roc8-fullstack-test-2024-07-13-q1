"use client";
import { useEffect, useState } from "react";
import useInterval from "./components/useInterval";

export default function Home() {
  const GRID_SIZE = 30;

  const directions = [
    [0, 1], // right
    [0, -1], // left
    [1, 0], // bottom right
    [-1, 0], // bottom left
    [1, 1], // top
    [1, -1], // top left
    [-1, 1], // top right
    [-1, -1], // bottom
  ];

  const genEmpGrid = (): number[][] => {
    const grid = new Array(GRID_SIZE)
      .fill(0)
      .map(() => new Array(GRID_SIZE).fill(0));
    return grid;
  };

  const genRandomGrid = (): number[][] => {
    const grid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      grid.push(
        Array.from(Array(GRID_SIZE), () => (Math.random() > 0.2 ? 0 : 1))
      );
    }
    return grid;
  };

  const [grid, setGrid] = useState(genEmpGrid());
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setGrid(genRandomGrid());
  }, []);

  const run = (grid: number[][]) => {
    if (running) {
      return;
    }
    let gridTemp = JSON.parse(JSON.stringify(grid));
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        let neighbors = 0;
        for (let k = 0; k < 8; k++) {
          let x = i + directions[k][0];
          let y = j + directions[k][1];
          if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
            neighbors += grid[x][y];
          }
        }

        if (neighbors < 2 || neighbors > 3) {
          gridTemp[i][j] = 0;
        } else if (grid[i][j] === 0 && neighbors === 3) {
          gridTemp[i][j] = 1;
        }
      }
    }
    setGrid(gridTemp);
  };

  useInterval(() => {
    run(grid);
  }, 100);

  const checkOne = (grid: number[][]) => {
    return grid.some((row) => row.includes(1));
  };

  return (
    <div className="text-center flex flex-col justify-center items-center h-screen w-screen">
      <h1 className="mb-5 text-white font-size-1rem font-bold">
        Conway's Game of Life
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: "fit-content",
          margin: "0 auto",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                // Deep clone grid
                let newGrid = JSON.parse(JSON.stringify(grid));
                newGrid[i][k] = grid[i][k] ? 0 : 1;
                setGrid(newGrid);
              }}
              style={{
                width: 25,
                height: 25,
                backgroundColor: grid[i][k] ? "white" : "",
                border: "1px solid #555555",
              }}
            ></div>
          ))
        )}
      </div>
      <div className="buttons m-5 flex justify-center">
        <button onClick={() => setRunning(!running)} disabled={!checkOne(grid)}>
          {running ? "Start" : "Stop"}
        </button>
        <button onClick={() => setGrid(genEmpGrid())}>Clear</button>
        <button onClick={() => setGrid(genRandomGrid())}>Random</button>
      </div>
    </div>
  );
}
