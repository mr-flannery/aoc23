import { readInputFile } from "./util"
import _ from "lodash";
import lcm from "compute-lcm";

async function part1() {
  const input = await readInputFile(8);
  const lines = input.split("\n");

  const instructions = lines[0].split("")
  const graph = lines.splice(2).reduce((graph: Record<string, Record<string, string>>, line) => {
    const groups = Array.from(line.matchAll(/[A-Z]{3}/g)).map(m => m[0])
    graph[groups[0]] = {L: groups[1], R: groups[2]}
    return graph;
  }, {})

  let currentNode = 'AAA';
  let i = 0;
  while (currentNode !== 'ZZZ') {
    const instruction = instructions[i % instructions.length];
    currentNode = graph[currentNode][instruction];
    i++;
  }

  console.log(i)
}

async function part2() {
  const input = await readInputFile(8);
  const lines = input.split("\n");

  const instructions = lines[0].split("")
  const graph = lines.splice(2).reduce((graph: Record<string, Record<string, string>>, line) => {
    const groups = Array.from(line.matchAll(/[A-Z]{3}/g)).map(m => m[0])
    graph[groups[0]] = {L: groups[1], R: groups[2]}
    return graph;
  }, {})


  const currentNodes = Object.keys(graph).filter(node => node.endsWith('A'))
  const cycleLengths = currentNodes.map(node => {
    let currentNode = node;
    let i = 0;
    while (!currentNode.endsWith('Z')) {
      const instruction = instructions[i % instructions.length];
      currentNode = graph[currentNode][instruction];
      i++;
    }
    return i;
  })
  // let i = 0;
  // while (currentNodes.filter(n => !n.endsWith('Z')).length) {
  //   const instruction = instructions[i % instructions.length];
  //   for (let j = 0; j < currentNodes.length; j++) {
  //     currentNodes[j] = graph[currentNodes[j]][instruction];
  //   }
  //   i++;
  // }

  console.log(lcm(cycleLengths))
}

// part1()
part2()