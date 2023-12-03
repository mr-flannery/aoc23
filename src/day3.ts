import { readInputFile } from "./util"
import _ from 'lodash';

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
        // const partNumber = parseInt(number.map(([x,y]) => matrix[x][y]).join(''))
        // console.log(`Adding partNumber ${partNumber}, starting at ${number[0]}`)
        partNumbers.push(number)

        // const cords = []
        // for(const [x, y] of [...number, ...allNeighbors]) {
        //   const duplicates = cords.filter(([x1, y1]) => x === x1 && y === y1)
        //   if (!duplicates.length) {
        //     cords.push([x, y])
        //   }
        // }

        // const blerg = _.groupBy(cords.sort(), ([x, y]) => x)
        // const blarg = Object.values(blerg).map(row => row.map(([x,y]) => matrix[x][y]).join(''))
        // blarg.forEach(s => console.log(s))
        // console.log('')
        break;
      }
    }
  }

  // const discardedNumbers = numbers.filter(number => !partNumbers.includes(number))
  // discardedNumbers.forEach(number => {
  //   const partNumber = parseInt(number.map(([x,y]) => matrix[x][y]).join(''))
    
  //   const allNeighbors = []
  //   for (const [x, y] of number) {
  //     allNeighbors.push(...getNeighbors(x, y, matrix));
  //   }

  //   const cords = []
  //   for(const [x, y] of [...number, ...allNeighbors]) {
  //     const duplicates = cords.filter(([x1, y1]) => x === x1 && y === y1)
  //     if (!duplicates.length) {
  //       cords.push([x, y])
  //     }
  //   }
    // const blerg = _.groupBy(cords.sort(), ([x, y]) => x)
    // Object.values(blerg).map(row => row.map(([x,y]) => matrix[x][y]).join('')).forEach(s => console.log(s))
    // console.log('')
  // })

  const result = 
    partNumbers.map(number => parseInt(number.map(([x,y]) => matrix[x][y]).join('')))
    .reduce((a, b) => a + b)
  console.log(result)
}

async function part2() {
  const matrix = await parseMatrix();

  const result = 0
  console.log(result)
} 

part1();
// part2();