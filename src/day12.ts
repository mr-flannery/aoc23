import { writeFile } from "fs/promises";
import { readInputFile } from "./util"
import _ from "lodash";


function magicCalc(rw, gw) {
  if (rw.length === 1 && gw.length === 1) {
    if (rw[0].split('').filter(c => c === '#').length === gw[0]) {
      return 1
    }
  }
}

async function part1() {
  const input = await readInputFile(12);
  const lines = input.split("\n");

  const records = lines.map(line => {
    const [row, nums] = line.split(" ");
    const groups = nums.split(',').map(num => parseInt(num))
    return { row, groups }
  })

  // maybe I need to adaptive sliding windows
  for (let { row, groups } of records) {
    const rowGroups = row.split('.').filter(x=>x);
    console.log(rowGroups.map(g => g.length), groups)
    const possibilityFactors = [];

    let r0 = 0;
    let r1 = 1;
    let rmax = rowGroups.length;
    let g0 = 0;
    let g1 = 1;
    let gmax = groups.length;


    // TODO: Can I remove groups without # until it doesn't work?
    // while (r0 < rowGroups.length && g0 < groups.length) {
    //   let rw = rowGroups.slice(r0, r1);
    //   let gw = groups.slice(g0, g1);
    //   if (_.last(rw).includes('#')) {
    //     if (gw.length === 1 && rw.length === 1 && _.last(rw).length === gw[0]) {
    //       // perfect match, do nothing
    //       r0++; r1++; g0++; g1++;
    //     } else {
    //       const result = magicCalc(rw, gw);
    //       r0++; r1++; g0++; g1++;
    //     }
    //   } else {
    //     if (gw.length === 1 && rw.length === 1 && _.last(rw).length === gw[0]) {
    //       // would fit. +1
    //       // we only increase r, since the next r could still fit the same g, in theory
    //       r0++; r1++; 
    //     }
    //   }
    // }

    console.log()
  }  

  console.log()
}

async function part2() {

}

part1()
// part2()