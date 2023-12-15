 import { writeFile } from "fs/promises";
import { readInputFile } from "./util"
import _ from "lodash";


async function part1() {
  const input = await readInputFile(12);
  const lines = input.split("\n");

  // const lines = [
  //   "??????##?.? 2,5,1"
  // ]

  const records = lines.map(line => {
    const [str, nums] = line.split(" ");
    const groups = nums.split(',').map(num => parseInt(num))
    return { str, groups }
  })

  let result = 0;

  for (const {str, groups} of records) {
    const workingStates = []
    const nextState = [{group: 0, index: 0, amount: 0, path: "" }]
    while (nextState.length) {
      let { group, index, amount, path } = nextState.pop();

      // we used all groups before exhausting the string
      if (group === groups.length) {
        if (!str.substring(index).includes('#')) {
          workingStates.push(path)
        } 
        continue;
      }

      // we exhausted the string
      if (index === str.length) {
        if (path.split('').filter(char => char === '#').length === _.sum(groups)) {
          workingStates.push(path)
        }
        continue;
      }


      if (str.charAt(index) === '.' && amount > 0 && amount < groups[group]) {
        continue;
      }

      if (amount === groups[group]) {
        if (str.charAt(index) === '#') {
          continue;
        } else if (str.charAt(index) === '?') {
          nextState.push({ group: group+1, index: index + 1, amount: 0, path: path + '.' })
          continue;
        } else {
          group++;
          amount = 0;
        }
      }

      if (str.charAt(index) === '.') {
        nextState.push({ group, index: index + 1, amount, path: path + '.' })
      } else if (str.charAt(index) === '#') {
        nextState.push({ group, index: index + 1, amount: amount + 1, path: path + '#' })
      } else {
        // don't use a dot if it can only cause a failstate
        if (!(amount !== 0 && amount < groups[group])) {
          nextState.push({ group, index: index + 1, amount, path: path + '.' })
        }
        nextState.push({ group, index: index + 1, amount: amount + 1, path: path + '#' })
      }
    }
    // console.log(workingStates.length)
    result += workingStates.length;
  }

  console.log(result)
}

async function part2() {
  const input = await readInputFile(12);
  const lines = input.split("\n");

  // const lines = [
  //   "??????##?.? 2,5,1"
  // ]

  const records = lines.map(line => {
    let [str, nums] = line.split(" ");
    // str = [str, str, str, str, str].join('?')
    // nums = [nums, nums, nums, nums, nums].join(',')
    const groups = nums.split(',').map(num => parseInt(num))
    return { str, groups }
  })

  let result = 0;

  
  for (const {str, groups} of records) {
    const cache = new Map()
    const workingStates = []
    const nextState = [{group: 0, index: 0, amount: 0, path: "" }]
    while (nextState.length) {
      let { group, index, amount, path } = nextState.shift();

      // we used all groups before exhausting the string
      // if (group === groups.length) {
      //   if (!str.substring(index).includes('#')) {
      //     workingStates.push(path)
      //   } 
      //   continue;
      // }

      // we exhausted the string
      if (index === str.length) {
        if (path.split('').filter(char => char === '#').length === _.sum(groups)) {
          workingStates.push(path)
        }
        continue;
      }


      if (str.charAt(index) === '.' && amount > 0 && amount < groups[group]) {
        continue;
      }

      if (amount === groups[group]) {
        if (str.charAt(index) === '#') {
          continue;
        } else if (str.charAt(index) === '?') {
          group++;
          index++;
          amount = 0;
          if (cache.has(`${group}-${index}`)) {
            cache.set(`${group}-${index}`, cache.get(`${group}-${index}`) + 1)
          } else {
            cache.set(`${group}-${index}`, 1)
            nextState.push({ group, index, amount, path: path + '.' })
          }
          continue;
        } else {
          group++;
          amount = 0;

          if (cache.has(`${group}-${index}`)) {
            cache.set(`${group}-${index}`, cache.get(`${group}-${index}`) + 1)
            continue
          } else {
            cache.set(`${group}-${index}`, 1)
          }
        }
      }

      if (str.charAt(index) === '.') {
        nextState.push({ group, index: index + 1, amount, path: path + '.' })
      } else if (str.charAt(index) === '#') {
        nextState.push({ group, index: index + 1, amount: amount + 1, path: path + '#' })
      } else {
        // don't use a dot if it can only cause a failstate
        if (!(amount !== 0 && amount < groups[group])) {
          nextState.push({ group, index: index + 1, amount, path: path + '.' })
        }
        if (group !== groups.length) {
          nextState.push({ group, index: index + 1, amount: amount + 1, path: path + '#' })
        }
      }
    }
    console.log(workingStates.length)
    result += workingStates.length;
  }

  console.log(result)
}

// part1()
part2()