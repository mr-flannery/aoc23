import { readInputFile } from "./util"
import _, { sum } from 'lodash';

async function parseMatrix() {
  const input = await readInputFile(3);
  const lines = input.split("\n");
  const matrix = lines.map(line => line.split(""));
  return matrix;
}

function getNeighbors(x: number, y: number, matrix: string[][]) {
  return [
    [x - 1, y - 1], 
    [x - 1, y], 
    [x - 1, y + 1],
    [x, y - 1], 
    [x , y + 1],
    [x + 1, y - 1], 
    [x + 1, y], 
    [x + 1, y + 1]
  ].filter(([x,y]) => x >= 0 && x < matrix.length && y >= 0 && y < matrix[0].length)
}

async function part1() {
  const matrix = await parseMatrix();
  // const matrix = [
  //   '467..114..',
  //   '...*......',
  //   '..35..633.',
  //   '......#...',
  //   '617*......',
  //   '.....+.58.',
  //   '..592.....',
  //   '......755.',
  //   '...$.*....',
  //   '.664.598..',
  // ].map(line => line.split(''))

  const numbers = []

  for (let x = 0; x < matrix.length; x++) {

    let state: '.' | 'number' = '.'
    let number = []
    
    for (let y = 0; y < matrix[x].length; y++) {
      const n =  matrix[x][y]
      if (state === '.' && isNaN(parseInt(matrix[x][y], 10))) {
        continue;
      } else if (state === 'number' && isNaN(parseInt(matrix[x][y], 10))) {
        state = '.'
        numbers.push(number)
        number = []
      } else if (!isNaN(parseInt(matrix[x][y], 10))) {
        if (state === '.') {
          state = 'number'
        }
        number.push([x, y])
      }
    }
    if (number.length) {
      numbers.push(number)
    }

  }

  const partNumbers: number[][][] = []

  for (const number of numbers) {
    const allNeighbors = []
    
    for (const [x, y] of number) {
      allNeighbors.push(...getNeighbors(x, y, matrix));
    }

    for(const [x, y] of allNeighbors) {
      const n = matrix[x][y]
      if (matrix[x][y] !== '.' && isNaN(parseInt(matrix[x][y], 10))) {
        partNumbers.push(number)
        break;
      }
    }
  }

  const result = 
    partNumbers.map(number => parseInt(number.map(([x,y]) => matrix[x][y]).join('')))
    .reduce((a, b) => a + b)
  console.log(result)
}

class Point {
  constructor(public x: number, public y: number) {}

  equals(point: Point) {
    return this.x === point.x && this.y === point.y;
  }
}

async function part2() {
  const matrix = await parseMatrix();

  const numbers = []

  for (let x = 0; x < matrix.length; x++) {

    let state: '.' | 'number' = '.'
    let number = []
    
    for (let y = 0; y < matrix[x].length; y++) {
      const n =  matrix[x][y]
      if (state === '.' && isNaN(parseInt(matrix[x][y], 10))) {
        continue;
      } else if (state === 'number' && isNaN(parseInt(matrix[x][y], 10))) {
        state = '.'
        numbers.push(number)
        number = []
      } else if (!isNaN(parseInt(matrix[x][y], 10))) {
        if (state === '.') {
          state = 'number'
        }
        number.push(new Point(x,y))
      }
    }
    if (number.length) {
      numbers.push(number)
    }

  }

  const gears = []
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      if (matrix[x][y] === '*') {
        gears.push([x, y])
      }
    }
  }

  let sumOfGearRatios = 0
  for (const [x,y] of gears) {
    const neighbors = getNeighbors(x, y, matrix).map(([x,y]) => new Point(x, y))
    
    const intersectingNumbers = []

    for (const number of numbers) {
      for (const point of number) {
        for (const neighbor of neighbors) {
          if (point.equals(neighbor)) {
            intersectingNumbers.push(number)
          }
        }
      }
    }

    const deduplicatedIntersectingNumbers = []
    const jsons: string[] = []

    for (const n of intersectingNumbers) {
      const json = JSON.stringify(n)
      if (!jsons.includes(json)) {
        jsons.push(json)
        deduplicatedIntersectingNumbers.push(n)
      }
    }

    if (deduplicatedIntersectingNumbers.length === 2) {
      const [f1,f2] = deduplicatedIntersectingNumbers.map(number => parseInt(number.map(({x,y}) => matrix[x][y]).join('')))
      sumOfGearRatios += f1 * f2
    }
  }

  console.log(sumOfGearRatios)
} 

// part1();
part2();