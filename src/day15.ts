import { readInputFile, readSampleInputFile } from "./util"
import _ from "lodash";
import { createHash } from "crypto";

function hash(str) {
  let currentValue = 0;
  for (let i = 0; i < str.length; i++) {
    currentValue += str.charCodeAt(i) 
    currentValue = currentValue * 17
    currentValue = currentValue % 256
  }
  return currentValue
}


async function part1() {
  const input = await readInputFile(15);
  
  const codes = input.split(",")

  console.log(codes.map(hash).reduce((a,b) => a+b, 0))
}

async function part2() {
  const input = await readInputFile(15);
  const codes = input.split(",")
  // const codes = "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7".split(",")

  const instructions = codes.map(code => {
    const removeCommandMatch = /([a-z]+)-/.exec(code);
    const insertCommandMatch = /([a-z]+)=(\d)/.exec(code);
    if (removeCommandMatch) {
      const [_, label] = removeCommandMatch;
      return { label, command: '-', box: hash(label)}
    } else if (insertCommandMatch) {
      const [_, label, focalLength] = insertCommandMatch;
      return { label, command: '=', box: hash(label), focalLength }
    } 
  })

  const boxes = [];
  for (let i = 0; i < 256; i++) {
    boxes.push([])
  }

  for (const instruction of instructions) {
    if (instruction.command === '-') {
      const index = boxes[instruction.box].findIndex(lens => lens.label === instruction.label)
      if (index !== -1) {
        boxes[instruction.box].splice(index, 1)
      }
    } else if (instruction.command === '=') {
      const index = boxes[instruction.box].findIndex(lens => lens.label === instruction.label)
      if (index !== -1) {
        boxes[instruction.box].splice(index, 1)
        boxes[instruction.box].splice(index, 0, { label: instruction.label, focalLength: instruction.focalLength })
      } else {
        boxes[instruction.box].push({ label: instruction.label, focalLength: instruction.focalLength })
      }
    }
  }

  let focussingPower = 0;
  for (let i = 0; i < 256; i++) {
    for (let j = 0; j < boxes[i].length; j++) {
      focussingPower += (i+1) * (j+1) * boxes[i][j].focalLength
    }
  }

  console.log(focussingPower)
}

// part1()
part2()