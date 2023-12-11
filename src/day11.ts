import { writeFile } from "fs/promises";
import { readInputFile } from "./util"
import _ from "lodash";

function transpose(matrix): string[][] {
  return _.zip(...matrix) as string[][];
}

function expand(matrix): string[][] {
  for (let i = 0; i < matrix.length; i++) {
    if(!matrix[i].includes('#')) {
      matrix.splice(i+1, 0, '.'.repeat(matrix[0].length).split(''))
      i++;
    } 
  }
  return matrix;
}

function printGalaxy(matrix) {
  console.log(matrix.map(line => line.join("")).join("\n"))
}

async function part1() {
  const input = await readInputFile(11);
  const lines = input.split("\n");
  // const lines = [
  //   '...#......',
  //   '.......#..',
  //   '#.........',
  //   '..........',
  //   '......#...',
  //   '.#........',
  //   '.........#',
  //   '..........',
  //   '.......#..',
  //   '#...#.....',
  // ]
  let matrix = lines.map(line => line.split(""));
  matrix = expand(matrix);
  matrix = transpose(matrix);
  matrix = expand(matrix);
  matrix = transpose(matrix);

  const galaxies = [];
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === '#') {
        galaxies.push([r, c])
      }
    }
  }

  const galaxyPairs = []
  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      galaxyPairs.push([galaxies[i], galaxies[j]])
    }
  }

  let sumOfDistances = 0;
  for (const [[r1, c1], [r2, c2]] of galaxyPairs) {
    const distance = Math.abs(r1 - r2) + Math.abs(c1 - c2);
    sumOfDistances += distance;
  }

  console.log(sumOfDistances)
  // printGalaxy(matrix)
}

async function part2() {
  const input = await readInputFile(11);
  const lines = input.split("\n");
  // const lines = [
  //   '...#......',
  //   '.......#..',
  //   '#.........',
  //   '..........',
  //   '......#...',
  //   '.#........',
  //   '.........#',
  //   '..........',
  //   '.......#..',
  //   '#...#.....',
  // ]
  let matrix = lines.map(line => line.split(""));
  const emptyRows = matrix.reduce((lines: number[], line: string[], index: number) => line.every(c => c === '.') ? [...lines, index] : lines, [])
  matrix = transpose(matrix);
  await writeFile('matrix.txt', matrix.map(line => line.join("")).join("\n"))
  const emptyCols =  matrix.reduce((lines, line, index) => line.every(c => c === '.') ? [...lines, index] : lines, [])
  matrix = transpose(matrix);

  const galaxies = [];
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === '#') {
        galaxies.push([r, c])
      }
    }
  }

  const galaxyPairs = []
  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      galaxyPairs.push([galaxies[i], galaxies[j]])
    }
  }

  let sumOfDistances = 0;
  for (const [[r1, c1], [r2, c2]] of galaxyPairs) {
    const [rmin, rmax] = [...[r1, r2]].sort()
    const [cmin, cmax] = [...[c1, c2]].sort()
    let distance = Math.abs(rmax - rmin) + Math.abs(cmax - cmin);
    const traversedEmptyRows = _.intersection(emptyRows, _.range(rmin, rmax));
    const traversedEmptyCols = _.intersection(emptyCols, _.range(cmin, cmax));

    sumOfDistances += distance + (traversedEmptyCols.length + traversedEmptyRows.length) * (1000000 - 1);
  }

  console.log(sumOfDistances)
}

// part1()
part2()