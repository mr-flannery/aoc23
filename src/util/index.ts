import { readFile } from "fs/promises";
import { join } from "path";


export async function readInputFile(day: number): Promise<string> {
  const inputPath = join(__dirname, `../../input/${day}.txt`);
  const input = await readFile(inputPath, 'utf8');
  return input;
}