import { writeFile } from "fs/promises";
import { readInputFile, readSampleInputFile } from "./util"
import _ from "lodash";
import levenshtein from "js-levenshtein";
import { createHash } from "crypto";

function transpose(matrix): string[][] {
  return _.zip(...matrix) as string[][];
}


async function part1() {
  const input = await readInputFile(14);
  const lines = input.split("\n");
  const matrix = transpose(lines.map(line => line.split("")));

  let sum = 0;

  for (const line of matrix) {
    const col = line.join('').split('#').map(sub => {
      const rocks = [...sub.matchAll(/O/g)].length
      return "O".repeat(rocks) + ".".repeat(sub.length - rocks)
    }).join("#").split('')

    for (let i = 0; i < col.length; i++) {
      if (col[i] === 'O') {
        sum += col.length - i;
      }
    }
  }

  console.log(sum)
}

async function part2() {
  const input = await readInputFile(14);
  const lines = input.split("\n");
  // const lines = [
  //   "O....#....",
  //   "O.OO#....#",
  //   ".....##...",
  //   "OO.#O....O",
  //   ".O.....O#.",
  //   "O.#..O.#.#",
  //   "..O..#O..O",
  //   ".......O..",
  //   "#....###..",
  //   "#OO..#....",
  // ]
  let matrix = lines.map(line => line.split(""));

  let cycleFound = false;
  const previousMatrixes = []
  const cycles = 1000000000;
  // const cycles = 10;
  for (let i = 1; i <= cycles; i++) {
    // console.log(i)
    // north
    matrix = transpose(matrix);
    matrix = matrix.map(line => {
      return line.join('').split('#').map(sub => {
        const rocks = [...sub.matchAll(/O/g)].length
        return "O".repeat(rocks) + ".".repeat(sub.length - rocks)
      }).join("#").split("")
    });

    // west
    matrix = transpose(matrix);
    matrix = matrix.map(line => {
      return line.join('').split('#').map(sub => {
        const rocks = [...sub.matchAll(/O/g)].length
        return "O".repeat(rocks) + ".".repeat(sub.length - rocks)
      }).join("#").split("")
    });

    // south
    matrix = transpose(matrix);
    matrix = matrix.map(line => {
      return line.join('').split('#').map(sub => {
        const rocks = [...sub.matchAll(/O/g)].length
        return ".".repeat(sub.length - rocks) + "O".repeat(rocks)
      }).join("#").split("")
    });

    // west
    matrix = transpose(matrix);
    matrix = matrix.map(line => {
      return line.join('').split('#').map(sub => {
        const rocks = [...sub.matchAll(/O/g)].length
        return ".".repeat(sub.length - rocks) + "O".repeat(rocks)
      }).join("#").split("")
    });

    if (!cycleFound) {
      const hash = createHash('sha1').update(matrix.map(line => line.join('')).join('')).digest("hex")
      if (previousMatrixes.includes(hash)) {
        const cyleLength = previousMatrixes.length - previousMatrixes.indexOf(hash);
        // console.log(cyleLength)
        i = cycles - ((cycles - i) % cyleLength)
        cycleFound = true;
      } else {
        previousMatrixes.push(hash);
      }
    }
  }

  matrix.forEach(line => console.log(line.join('')))

  let sum = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === 'O') {
        sum += matrix.length - i;
      }
    }
  }

  console.log(sum)
}

// part1()
part2()