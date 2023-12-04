import { readInputFile } from "./util"
import _ from "lodash";

async function part1() {
  const input = await readInputFile(4);
  const lines = input.split("\n");

  const cards = lines.map(l => {
    const [_, nums] = l.split(":");
    const [winning, card] = nums.split("|");
    const winningNums = 
      winning.trim().split(" ")
        .filter(n => n)
        .map(n => parseInt(n)); 
    const cardNums = 
      card.trim().split(" ")
        .filter(n => n)
        .map(n => parseInt(n)); 

    return {
      winningNums,
      cardNums
    }
  })

  const result = cards.map(c => {
    const numWinningNums = _.intersection(c.winningNums, c.cardNums).length
    if (numWinningNums === 0) {
      return 0;
    } else {
      return Math.pow(2, numWinningNums - 1);
    }
  })
    .reduce((a, b) => a + b, 0)
  
  console.log(result)
}

async function part2() {
  const input = await readInputFile(4);
  const lines = input.split("\n");

  // const lines = [
  //   "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
  //   "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19",
  //   "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1",
  //   "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83",
  //   "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36",
  //   "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
  // ]

  const cards = lines.map((line, index) => {
    const [_, nums] = line.split(":");
    const [winning, card] = nums.split("|");
    const winningNums = 
      winning.trim().split(" ")
        .filter(n => n)
        .map(n => parseInt(n)); 
    const cardNums = 
      card.trim().split(" ")
        .filter(n => n)
        .map(n => parseInt(n)); 

    return {
      id: index + 1,
      winningNums,
      cardNums,
      count: 1
    }
  })

  const maxIndex = cards.length - 1;

  for (let i = 0; i < cards.length - 1; i++) {
    console.log(i)
    
    const card = cards[i];
    const numWinningNums = _.intersection(card.winningNums, card.cardNums).length

    const addXToCardIndexes = _.range(i + 1, Math.min(i + 1 + numWinningNums, maxIndex + 1))

    for (const index of addXToCardIndexes) {
      cards[index].count += card.count;
    }
  }

  const result = _.sum(cards.map(c => c.count))
  console.log(result)
}

// part1()
part2()