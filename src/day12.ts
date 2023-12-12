import { writeFile } from "fs/promises";
import { readInputFile } from "./util"
import _ from "lodash";


function magicCalc(str, nums) {
  if (str.join('').length < _.sum(nums)) {
    return 0
  } 
  return 1
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
    const possibilityFactors = [];

    let r0 = 0;
    let r1 = 1;
    let rmax = rowGroups.length;
    let g0 = 0;
    let g1 = 1;
    let gmax = groups.length;

    while (r0 < rowGroups.length && g0 < groups.length) {
      let rw = rowGroups.slice(r0, r1);
      let gw = groups.slice(g0, g1);
      if (_.last(rw).includes('#')) {
        if (_.last(rw).length > _.sum(gw) + gw.length - 1) { // this makes no sense for e.g. ###? and 3 being the last elements
          if (g1 === gmax) {
            possibilityFactors.push(magicCalc(rw, groups.slice(g0, g1)));
            g0 = g1;
          
          }
          g1++
        } else if (rmax - r1 < gmax - g1) {
          g1++
        } else {
          let factor = magicCalc(rw, groups.slice(g0, g1))
          if (factor === 0) {
            factor = magicCalc(rw, groups.slice(g0, g1-1))
            if (factor === 0) {
              console.log('error')
            } else {
              possibilityFactors.push(factor);
              g0 = g1;
              g1++
              r0 = r1;
              r1++
            }
          }
          possibilityFactors.push(factor);
          // TODO: this might be wrong, maybe I just need to move r0 and g0 by 1
          g0 = g1;
          g1++
          r0 = r1;
          r1++
        }
      } else {
        if (rmax - r1 < gmax - g1) {
          g1++
        } else if (gmax - g1 < rmax - r1) {
          r1++
        } else {
          possibilityFactors.push(magicCalc(rw, groups.slice(g0, g1)));
          g0 = g1;
          g1++
          r0 = r1;
          r1++
        }
      }
    }

    console.log()
  }  

  console.log()
}

async function part2() {

}

part1()
// part2()