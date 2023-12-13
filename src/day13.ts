import { writeFile } from "fs/promises";
import { readInputFile, readSampleInputFile } from "./util"
import _ from "lodash";
import levenshtein from "js-levenshtein";

function transpose(matrix): string[][] {
  return _.zip(...matrix) as string[][];
}


async function part1() {
  const input = await readInputFile(13);
  // const input = await readSampleInputFile(13);
  const patterns = input.split("\n\n");
  const matrixes = patterns.map(pattern => pattern.split("\n").map(line => line.split("")));
  
  const results = []
  
  for (const matrix of matrixes) {
    for (let i = 1; i < matrix.length; i++) {
      const zipped = _.zip(matrix.slice(0,i).reverse(), matrix.slice(i)).filter(([a,b]) => a && b)
      let reflection = true;
      for (const [a,b] of zipped) {
        if (a.join('') !== b.join('')) {
          reflection = false;
          break;
        }
      }
      if (reflection) {
        results.push(i*100)
        break;
      }
    }

    const t_matrix = transpose(matrix);
  
    for (let i = 1; i < t_matrix.length; i++) {
      const zipped = _.zip(t_matrix.slice(0,i).reverse(), t_matrix.slice(i)).filter(([a,b]) => a && b)
      let reflection = true;
      for (const [a,b] of zipped) {
        if (a.join('') !== b.join('')) {
          reflection = false;
          break;
        }
      }
      if (reflection) {
        results.push(i)
        break;
      }
    }
  }

  console.log(_.sum(results))
  return results
}

async function part2() {
  const input = await readInputFile(13);
  // const input = await readSampleInputFile(13);
  const patterns = input.split("\n\n");
  const matrixes = patterns.map(pattern => pattern.split("\n").map(line => line.split("")));
  
  // const part1result = await part1();
  const results = []
  
  for (const matrix of matrixes) {
    for (let i = 1; i < matrix.length; i++) {
      const zipped = _.zip(matrix.slice(0,i).reverse(), matrix.slice(i)).filter(([a,b]) => a && b)
      let reflection = true;
      let smudgeAccountedFor = false;
      for (const [a,b] of zipped) {
        const astr = a.join('');
        const bstr = b.join('');
        if (astr !== bstr) {
          if (!smudgeAccountedFor && levenshtein(astr, bstr) === 1) {
            smudgeAccountedFor = true;
          } else {
            reflection = false;
            break;
          }
        }
      }
      if (reflection && smudgeAccountedFor) {
        results.push(i*100)
        break;
      }
    }

    const t_matrix = transpose(matrix);
  
    for (let i = 1; i < t_matrix.length; i++) {
      const zipped = _.zip(t_matrix.slice(0,i).reverse(), t_matrix.slice(i)).filter(([a,b]) => a && b)
      let reflection = true;
      let smudgeAccountedFor = false;
      for (const [a,b] of zipped) {
        const astr = a.join('');
        const bstr = b.join('');
        if (astr !== bstr) {
          if (!smudgeAccountedFor && levenshtein(astr, bstr) === 1) {
            smudgeAccountedFor = true;
          } else {
            reflection = false;
            break;
          }
        }
      }
      if (reflection && smudgeAccountedFor) {
        results.push(i)
        break;
      }
    }
  }

  console.log(_.sum(results))
}

// part1()
part2()