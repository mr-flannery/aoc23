import { readInputFile } from "./util"
import _ from "lodash";

function pairwiseDiffs(nums: number[]) {
  const diffs = []
  for (let i = 0; i < nums.length - 1; i++) {
    diffs.push(nums[i + 1] - nums[i])
  }
  return diffs
}


async function part1() {
  const input = await readInputFile(9);
  const lines = input.split("\n");
  const seqs = lines.map(line => line.split(" ").map(num => parseInt(num, 10)));

  const topLevelExtrapolatedValues = []

  for (const seq of seqs) {
    let currentSeq = seq;
    const diffs = []
    while (new Set(currentSeq).size > 1) {
      const nextSeq = pairwiseDiffs(currentSeq)
      diffs.push(nextSeq)
      currentSeq = nextSeq;
    }
    for (let i = diffs.length - 2; i >= 0; i--) {
      const extrapolatedValue = diffs[i][diffs[i].length - 1] + diffs[i + 1][diffs[i+1].length - 1]
      diffs[i].push(extrapolatedValue)
    }
    topLevelExtrapolatedValues.push(seq[seq.length - 1] + diffs[0][diffs[0].length - 1])
    console.log()
  }

  console.log(topLevelExtrapolatedValues.reduce((a, b) => a + b, 0))
}

async function part2() {
  const input = await readInputFile(9);
  const lines = input.split("\n");
  const seqs = lines.map(line => line.split(" ").map(num => parseInt(num, 10)));

  const topLevelExtrapolatedValues = []

  for (const seq of seqs) {
    let currentSeq = seq;
    const diffs = []
    while (new Set(currentSeq).size > 1) {
      const nextSeq = pairwiseDiffs(currentSeq)
      diffs.push(nextSeq)
      currentSeq = nextSeq;
    }
    for (let i = diffs.length - 2; i >= 0; i--) {
      const extrapolatedValue = diffs[i][0] - diffs[i + 1][0]
      diffs[i].unshift(extrapolatedValue)
    }
    topLevelExtrapolatedValues.unshift(seq[0] - diffs[0][0])
    console.log()
  }

  console.log(topLevelExtrapolatedValues.reduce((a, b) => a + b, 0))
}

// part1()
part2()