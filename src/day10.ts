import { writeFile } from "fs/promises";
import { readInputFile } from "./util"
import _, { forEach, runInContext, xor } from "lodash";
import { on } from "events";

function getConnectingNeighbors(point: [number, number], matrix: string[][]): [number, number][] {
  const [row, col] = point;
  const neighbors = [];
  const max = matrix.length;

  if (row - 1 >= 0 && ['|', 'F', '7'].includes(matrix[row - 1][col])) {
    neighbors.push([row - 1, col])
  }
  if (row + 1 < max && ['|', 'J', 'L'].includes(matrix[row + 1][col])) {
    neighbors.push([row + 1, col])
  }
  if (col - 1 >= 0 && ['-', 'F', 'L'].includes(matrix[row][col - 1])) {
    neighbors.push([row, col - 1])
  }
  if (col + 1 < max && ['-', 'J', '7'].includes(matrix[row][col + 1])) {
    neighbors.push([row, col + 1])
  }

  return neighbors as [number, number][];
}

function getNextNode(point: [number, number], prev: [number, number], matrix: string[][]): [number, number] {
  const [row, col] = point;
  let neighbors;
  const max = matrix.length;

  switch (matrix[row][col]) {
    case '-':
      neighbors = [[row, col + 1], [row, col - 1]]
      break;
    case '|':
      neighbors = [[row + 1, col], [row - 1, col]]
      break;
    case 'F':
      neighbors = [[row, col + 1], [row + 1, col]]
      break;
    case 'J':
      neighbors = [[row, col - 1], [row - 1, col]]
      break;
    case '7':
      neighbors = [[row, col - 1], [row + 1, col]]
      break;
    case 'L':
      neighbors = [[row, col + 1], [row - 1, col]]
      break;
  }

  return neighbors!.filter(n => (n[0] !== prev[0] || n[1] !== prev[1]) && n[0] >= 0 && n[1] >= 0 && n[0] < max && n[1] < max)[0] as [number, number];
}

function includes(array: [number, number][], point: [number, number]) {
  return array.some(([x, y]) => x === point[0] && y === point[1])
}

async function part1() {
  const input = await readInputFile(10);
  const lines = input.split("\n");
  const matrix = lines.map(line => line.split(""));
  let start: [number, number];
  matrix.forEach((row, x) => {
    if (row.includes('S')) {
      start = [x, row.indexOf('S')]
    }
  })  

  let loop;
  const stateStack = [{current: start!, visited: [start!], prev: undefined as [number, number] | undefined}]
  while (stateStack.length) {
    const { current, visited, prev } = stateStack.pop()!;
    if (prev) {
      const next = getNextNode(current, prev, matrix);
      if (next[0] === start![0] && next[1] === start![1]) {
        loop = visited
        stateStack.length = 0;
      } else if (next) {
        stateStack.unshift({current: next, visited: [...visited, next], prev: current})
      }
    } else {
      // this thing could just be a smarter init of the state stack
      const newNeighbors = getConnectingNeighbors(current, matrix).filter(n => !includes(visited, n));
      if (newNeighbors.length > 1) {
        console.log(newNeighbors)
      }
      forEach(newNeighbors, n => {
        stateStack.unshift({current: n, visited: [...visited, n], prev: current})
      })
    }
    
  }

  console.log(loop!.length/2)
}

function getNeighbors(point: [number, number], matrix: string[][]): [number, number][] {
  const [x,y] = point;
  
  return [
    [x - 1, y - 1], 
    [x - 1, y], 
    [x - 1, y + 1],
    [x, y - 1], 
    [x , y + 1],
    [x + 1, y - 1], 
    [x + 1, y], 
    [x + 1, y + 1]
  ].filter(([x,y]) => x >= 0 && x < matrix.length && y >= 0 && y < matrix[0].length) as [number, number][]
}

function floodFill(start: [number, number], matrix: string[][], loop: [number, number][]) {
  const visited: [number, number][] = []
  const queue: [number, number][] = [start]
  while (queue.length) {
    const current = queue.pop()!;
    visited.push(current);
    const neighbors = getNeighbors(current, matrix).filter(n => !includes(visited, n) && !includes(loop, n) && !includes(queue, n))
    neighbors.forEach(n => {
      queue.push(n)
    })
  }
  return visited;
}

function distinct(array: [number, number][]) {
  const result = []
  for (const p of array) {
    if (!includes(result, p)) {
      result.push(p)
    }
  }
  return result
}

async function part2() {
  const input = await readInputFile(10);
  const lines = input.split("\n");
  const matrix = lines.map(line => line.split(""));
  let start: [number, number];
  matrix.forEach((row, x) => {
    if (row.includes('S')) {
      start = [x, row.indexOf('S')]
    }
  })  

  let loop: [number, number][];
  const stateStack = [{current: start!, visited: [start!], prev: undefined as [number, number] | undefined}]
  while (stateStack.length) {
    const { current, visited, prev } = stateStack.pop()!;
    if (prev) {
      const next = getNextNode(current, prev, matrix);
      if (next[0] === start![0] && next[1] === start![1]) {
        loop = visited
        stateStack.length = 0;
      } else if (next) {
        stateStack.unshift({current: next, visited: [...visited, next], prev: current})
      }
    } else {
      // this thing could just be a smarter init of the state stack
      const newNeighbors = getConnectingNeighbors(current, matrix).filter(n => !includes(visited, n));
      if (newNeighbors.length > 1) {
        console.log(newNeighbors)
      }
      forEach(newNeighbors, n => {
        stateStack.unshift({current: n, visited: [...visited, n], prev: current})
      })
    }
  }

  matrix[120][110] = '|'
  // const allCoords: [number, number][] = _.range(0, 140).flatMap(x => _.range(0, 140).map(y => [x, y])) as [number, number][]

  matrix.forEach((row, x) => {
    row.forEach((col, y) => {
      if (!includes(loop!, [x, y])) {
        matrix[x][y] = '.'
      }
    })
  })

  let insideFields = 0;
  for (let row = 0; row < matrix.length; row++) {
    let inside = false;
    let onPipe = false;
    
    for (let col = 0; col < matrix.length; col++) {
      const field = matrix[row][col];
      process.stdout.write(field)
      if (field === '.') {
        if (inside) {
          insideFields++;
        }
      } else if (field === '|') {
        inside = !inside;
      } else if (!onPipe) {
         if (field === 'F') {
          // inside = !inside;
          onPipe = true;
         } else if (field === 'J') {
          inside = !inside;
         } else if (field === '7') {
          inside = true;
          onPipe = false;
         } else if (field === 'L') {
          inside = !inside
          onPipe = true;
         }
      } else if (onPipe) {
        if (field === 'F') {
          process.stdout.write('')
        } else if (field === 'J') {
          onPipe = false;
          inside = !inside;
        } else if (field === '7') {
          onPipe = false;
        } else if (field === 'L') {
          process.stdout.write('')
        }
      }
    }
    console.log()
  }

  console.log(insideFields)
}

// part1()
part2()