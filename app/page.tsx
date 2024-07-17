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

  return <></>;
}
