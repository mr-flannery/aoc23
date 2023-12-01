import { readInputFile } from "./util"

async function part1() {
  const input = await readInputFile(1);
  const lines = input.split("\n");

  console.log(
    lines
      .map((line) => line.match(/\d/g))
      .filter((nums) => nums)
      .map(nums => parseInt(nums![0] + nums![nums!.length - 1]))
      .reduce((a, b) => a + b)
  )
}

const wordsToDigits: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9"
}

function mapWordsToDigits(nums: string[]) {
  return nums.map(num => {
    if (num in wordsToDigits) {
      return wordsToDigits[num]
    } else {
      return num
    }
  })
}

async function part2() {
  const input = await readInputFile(1);
  const lines = input.split("\n");

  // const lines = [
  //   "two1nine",
  //   "eightwothree",
  //   "abcone2threexyz",
  //   "xtwone3four",
  //   "4nineeightseven2",
  //   "zoneight234",
  //   "7pqrstsixteen",
  // ]

  // overlappins
  // const matches = lines.map((line) => line.match(/\d|one|two|three|four|five|six|seven|eight|nine/g))
  const matches = 
    lines.map(line => Array.from(line.matchAll(/(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g)))
         .map(match => match.map(m => m[1]))
  const mapped = matches.map(nums => mapWordsToDigits(nums as string[]))
  const parsed = mapped.map(nums => parseInt(nums![0] + nums![nums!.length - 1]))
  const result = parsed.reduce((a, b) => a + b)

  console.log(result)
} 

part2()