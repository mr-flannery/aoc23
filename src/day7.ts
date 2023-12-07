import { readInputFile } from "./util"
import _ from "lodash";

async function part1() {
  const cardStrengths = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse();
  
  function handType(hand: string[]) {
    const grouped = Object.entries(_.groupBy(hand)).sort((a, b) => b[1].length - a[1].length);
  
    if (grouped.length === 1) {
      return 7;
    } else if (grouped.length === 2 && grouped[0][1].length === 4) {
      return 6;
    } else if (grouped.length === 2 && grouped[0][1].length === 3 && grouped[1][1].length === 2) {
      return 5;
    } else if (grouped.length === 3 && grouped[0][1].length === 3) {
      return 4;
    } else if (grouped.length === 3 && grouped[0][1].length === 2 && grouped[1][1].length === 2) {
      return 3;
    } else if (grouped.length === 4 && grouped[0][1].length === 2) {
      return 2;
    } else {
      return 1;
    }
  } 
  const input = await readInputFile(7);
  const lines = input.split("\n");

  const hands = lines.map(line => {
    const [hand, bid] = line.split(" ");
    const cards = hand.split("");
    return { hand: cards, bid: parseInt(bid), type: handType(cards)};
  })

  hands.sort((a, b) => {
    const byType = a.type - b.type;
    if (byType !== 0) {
      return byType;
    }
    for (const [cardA, cardB] of _.zip(a.hand, b.hand)) {
      const byCard = cardStrengths.indexOf(cardA!) - cardStrengths.indexOf(cardB!);
      if (byCard !== 0) {
        return byCard;
      }
    }
    return 0;
  })

  let totalWinnings = 0;
  for (let i = 1; i <= hands.length; i++) {
    totalWinnings += hands[i - 1].bid * i;
  }

  console.log(totalWinnings)
}

async function part2() {
  const cardStrengths = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse();
  
  function handType(hand: string[]) {
    let grouped = Object.entries(_.groupBy(hand)).sort((a, b) => b[1].length - a[1].length);
    const jokers = grouped.filter(([card, _]) => card === 'J');
    if (jokers.length) {
      const handWithoutJokers = grouped.filter(([card, _]) => card !== 'J');
      if (handWithoutJokers.length) {
        handWithoutJokers[0] = [handWithoutJokers[0][0], [...handWithoutJokers[0][1], ...jokers[0][1]]]
        grouped = handWithoutJokers;
      }
    }

    if (grouped.length === 1) {
      return 7;
    } else if (grouped.length === 2 && grouped[0][1].length === 4) {
      return 6;
    } else if (grouped.length === 2 && grouped[0][1].length === 3 && grouped[1][1].length === 2) {
      return 5;
    } else if (grouped.length === 3 && grouped[0][1].length === 3) {
      return 4;
    } else if (grouped.length === 3 && grouped[0][1].length === 2 && grouped[1][1].length === 2) {
      return 3;
    } else if (grouped.length === 4 && grouped[0][1].length === 2) {
      return 2;
    } else {
      return 1;
    }
  } 
  const input = await readInputFile(7);
  const lines = input.split("\n");
  // const lines = [
  //   "32T3K 765",
  //   "T55J5 684",
  //   "KK677 28",
  //   "KTJJT 220",
  //   "QQQJA 483",
  // ]

  const hands = lines.map(line => {
    const [hand, bid] = line.split(" ");
    const cards = hand.split("");
    return { hand: cards, bid: parseInt(bid), type: handType(cards)};
  })

  hands.sort((a, b) => {
    const byType = a.type - b.type;
    if (byType !== 0) {
      return byType;
    }
    for (const [cardA, cardB] of _.zip(a.hand, b.hand)) {
      const byCard = cardStrengths.indexOf(cardA!) - cardStrengths.indexOf(cardB!);
      if (byCard !== 0) {
        return byCard;
      }
    }
    return 0;
  })

  let totalWinnings = 0;
  for (let i = 1; i <= hands.length; i++) {
    totalWinnings += hands[i - 1].bid * i;
  }

  console.log(totalWinnings)
}

// part1()
part2()