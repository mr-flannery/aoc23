import { readInputFile } from "./util"
import _ from "lodash";

async function part1() {
  const races = [
    { time: 60, distance: 475 },
    { time: 94, distance: 2138 },
    { time: 78, distance: 1015 },
    { time: 82, distance: 1650 },
  ]

  const result = 
    races.map(race => _.range(0, race.time)
         .filter(t => (race.time - t) * t > race.distance))
         .map(r => r.length)
         .reduce((a, b) => a * b)

  console.log(result)
}

async function part2() {
  const race = { time: 60947882, distance: 475213810151650 },´

  const result = 
   _.range(0, race.time)
    .filter(t => (race.time - t) * t > race.distance)
    .length

  console.log(result)
}

// part1()
part2()