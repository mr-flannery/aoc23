import { readInputFile } from "./util"

async function parseGames() {
  const input = await readInputFile(2);
  const lines = input.split("\n");

  const games = lines.map(line => {
    const [game, cubes] = line.split(":");
    const id = /(\d+)/.exec(game)![0];

    const draws = cubes.split(";").map(draw => {
      const red = /(\d+) red/.exec(draw)
      const green = /(\d+) green/.exec(draw)
      const blue = /(\d+) blue/.exec(draw)

      const result = { red: 0, green: 0, blue: 0 }
      red ? result.red = parseInt(red[1]) : null;
      green ? result.green = parseInt(green[1]) : null;
      blue ? result.blue = parseInt(blue[1]) : null;
      return result;
    })

    return { id, draws };
  })

  return games;
}

async function part1() {
  const games = await parseGames();

  const maxRed = 12;
  const maxGreen = 13;
  const maxBlue = 14;

  const possibleGames = games.filter(game => {
    const impossibleDraws = 
      game.draws.filter(game => !(game.red <= maxRed && game.green <= maxGreen && game.blue <= maxBlue))
    
    return impossibleDraws.length === 0
  })

  const result = possibleGames.reduce((a, b) => a + parseInt(b.id), 0)

  console.log(result)
}

async function part2() {
  const games = await parseGames();

  const powers = games.map(game => {
    const maxRed = Math.max(...game.draws.map(draw => draw.red))
    const maxBlue = Math.max(...game.draws.map(draw => draw.blue))
    const maxGreen = Math.max(...game.draws.map(draw => draw.green))

    const red = maxRed !== 0 ? maxRed : 1;
    const green = maxGreen !== 0 ? maxGreen : 1;
    const blue = maxBlue !== 0 ? maxBlue : 1;

    return red * green * blue;
  })

  const result = powers.reduce((a, b) => a + b, 0);
  console.log(result)
} 

part2()