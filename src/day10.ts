import { writeFile } from "fs/promises";
import { readInputFile } from "./util"
import _, { forEach, runInContext, xor } from "lodash";

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

  const allCoords: [number, number][] = _.range(0, 140).flatMap(x => _.range(0, 140).map(y => [x, y])) as [number, number][]
  
  // print matrix with loop
  // const matrixWithLoop = _.cloneDeep(matrix)
  // allCoords.forEach(([x,y]) => {
  //   if (includes(loop!, [x,y])) {
  //     matrixWithLoop[x][y] = 'X'
  //   }
  // })
  // await writeFile('day10-with-loop.txt', matrixWithLoop.map(row => row.join('')).join('\n'))

  // let's h
  const outerArea = floodFill([0, 0], matrix, loop!)

  const innerArea = allCoords.filter(n => !includes(outerArea, n) && !includes(loop, n))

  let innerAreaCopy = _.cloneDeep(innerArea)
  // assumption: non-loop-enclosed inner areas are innerAreas where both outer neighbor rings are part of the loop
  const distinctInnerAreas = []
  while (!(distinctInnerAreas.map(a => a.length).reduce((a, b) => a + b, 0) === innerArea.length)) {
    const area = floodFill(innerAreaCopy[0], matrix, loop!)
    distinctInnerAreas.push(area)
    innerAreaCopy = innerAreaCopy.filter(n => !includes(area, n))
  }

  // fuck me
  matrix[120][110] = '|'
  const blerg = distinctInnerAreas.filter(area => {
    // const [r,c] = area[0];
  
    // const upperLoopPipes = _.range(0, r).map(x => [x, c]).filter(n => includes(loop, n as [number, number])).map(([r,c]) => matrix[r][c]).filter(p => p !== '|')
    // const lowerLoopPipes = _.range(r + 1, matrix.length).map(x => [x, c]).filter(n => includes(loop, n as [number, number])).map(([r,c]) => matrix[r][c]).filter(p => p !== '|')
    // const leftLoopPipes = _.range(0, c).map(y => [r, y]).filter(n => includes(loop, n as [number, number])).map(([r,c]) => matrix[r][c]).filter(p => p !== '-')
    // const rightLoopPipes = _.range(c + 1, matrix.length).map(y => [r, y]).filter(n => includes(loop, n as [number, number])).map(([r,c]) => matrix[r][c]).filter(p => p !== '-');

    // return upperLoopPipes.length % 2 === lowerLoopPipes.length % 2 && rightLoopPipes.length % 2 === leftLoopPipes.length % 2

    // return (
    //      upperLoopPipes.length % 2 === 1
    //   || lowerLoopPipes.length % 2 === 1
    //   || leftLoopPipes.length % 2 === 1
    //   || rightLoopPipes.length % 2 === 1
    // )
    
    // const groupedByRow = _.groupBy(area, ([x, y]) => x) 
    // const groupedByCol = _.groupBy(area, ([x, y]) => y)

    // const [minrr, minrc] = Object.values(groupedByRow)[0][0]
    // const [maxrr, maxrc] = _.last(Object.values(groupedByRow))![0]
    // const [mincr, mincc] = Object.values(groupedByCol)[0][0]
    // const [maxcr, maxcc] = _.last(Object.values(groupedByCol))![0]

    // return (
    //      _.range(0, minrr).map(x => [x, minrc]).filter(n => includes(loop, n as [number, number]) && matrix[n[0]][n[1]] !== '|').length % 2 === 1
    //   || _.range(maxrr + 1, matrix.length).map(x => [x, maxrc]).filter(n => includes(loop, n as [number, number]) && matrix[n[0]][n[1]] !== '|').length % 2 === 1
    //   || _.range(0, mincc).map(y => [mincr, y]).filter(n => includes(loop, n as [number, number]) && matrix[n[0]][n[1]] !== '-').length % 2 === 1
    //   || _.range(maxcc + 1, matrix.length).map(y => [maxcr, y]).filter(n => includes(loop, n as [number, number]) && matrix[n[0]][n[1]] !== '-').length % 2 === 1
    // )

    // return !(
    //   includes(loop!, [minrr - 1, minrc]) && includes(loop!, [minrr - 2, minrc]) &&
    //   includes(loop!, [maxrr + 1, maxrc]) && includes(loop!, [maxrr + 2, maxrc]) &&
    //   includes(loop!, [mincr, mincc - 1]) && includes(loop!, [mincr, mincc - 2]) &&
    //   includes(loop!, [maxcr, maxcc + 1]) && includes(loop!, [maxcr, maxcc + 2])
    // )

    const outerNeighbors = distinct(area.flatMap(n => getNeighbors(n, matrix))).filter(n => !includes(area, n))
    const newInner = [...area, ...outerNeighbors]
    const outerNeighbors2 = distinct(newInner.flatMap(n => getNeighbors(n, matrix))).filter(n => !includes(newInner, n))
    return !(outerNeighbors2.every(n => includes(loop, n)) && outerNeighbors.every(n => includes(loop, n)))
  })
  console.log(blerg.flatMap(a=>a).length)
}

// part1()
part2()