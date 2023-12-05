import { readInputFile } from "./util"
import _ from "lodash";

function parseMapping(lines: string) {
  return lines.split("\n").splice(1).map(s => s.trim()).map(line => {
    const [destination, source, offset] = line.split(" ").map(num => parseInt(num))
    return { source, destination, offset }
  }).sort((a,b) => a.source - b.source)
}

async function part1() {
  const input = await readInputFile(5);
  const lines = input.split("\n\n");

  // const lines = [
  //   "seeds: 79 14 55 13",    
  //   `seed-to-soil map:
  //   50 98 2
  //   52 50 48`,
  //   `soil-to-fertilizer map:
  //   0 15 37
  //   37 52 2
  //   39 0 15`,
  //   `fertilizer-to-water map:
  //   49 53 8
  //   0 11 42
  //   42 0 7
  //   57 7 4`,
  //   `water-to-light map:
  //   88 18 7
  //   18 25 70`,
  //   `light-to-temperature map:
  //   45 77 23
  //   81 45 19
  //   68 64 13`,
  //   `temperature-to-humidity map:
  //   0 69 1
  //   1 0 69`,
  //   `humidity-to-location map:
  //   60 56 37
  //   56 93 4`
  // ]
  
  const seeds = lines[0].split(':')[1].trim().split(" ").map(num => parseInt(num));

  const mappers = lines.splice(1).map(parseMapping)

  const locations = seeds.map(seed => {
    let value = seed;
    for (const mapper of mappers) {
      const m = mapper.find(ma => value >= ma.source && value < ma.source + ma.offset);
      if (m) {
        value = value + (m.destination - m.source);
      }
    }
    return value;
  })

  console.log(Math.min(...locations))
}

async function part2() {
  const input = await readInputFile(5);
  const lines = input.split("\n\n");

  // const lines = [
  //   "seeds: 79 14 55 13",    
  //   `seed-to-soil map:
  //   50 98 2
  //   52 50 48`,
  //   `soil-to-fertilizer map:
  //   0 15 37
  //   37 52 2
  //   39 0 15`,
  //   `fertilizer-to-water map:
  //   49 53 8
  //   0 11 42
  //   42 0 7
  //   57 7 4`,
  //   `water-to-light map:
  //   88 18 7
  //   18 25 70`,
  //   `light-to-temperature map:
  //   45 77 23
  //   81 45 19
  //   68 64 13`,
  //   `temperature-to-humidity map:
  //   0 69 1
  //   1 0 69`,
  //   `humidity-to-location map:
  //   60 56 37
  //   56 93 4`
  // ]
  
  const seeds = 
    _.chunk(lines[0].split(':')[1].trim().split(" ").map(num => parseInt(num)), 2)
    //  .flatMap(([start, length]) => _.range(start, start + length));

  // console.log(seeds.length)

  const mappers = lines.splice(1).map(parseMapping)

  let minLocation = Number.MAX_SAFE_INTEGER;

  for (const [start, length] of seeds) {
    for (let seed = start; seed < start + length; seed++) {
      let value = seed;
      for (const mapper of mappers) {
        const m = mapper.find(ma => value >= ma.source && value < ma.source + ma.offset);
        if (m) {
          value = value + (m.destination - m.source);
        }
      }
      if (value < minLocation) {
        minLocation = value;
      }
    }
  }

  console.log(minLocation)
}

// part1()
part2()