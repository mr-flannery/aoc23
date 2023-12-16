import { readInputFile, readSampleInputFile } from "./util"
import _, { has } from "lodash";
import { createHash } from "crypto";

function newBeamPosition(row, col, direction, max) {
  switch (direction) {
    case 'right': 
      if (col === max - 1) {
        return undefined;
      } else {
        return { row, col: col + 1, direction };
      }
    case 'left': 
      if (col === 0) {
        return undefined;
      } else {
        return { row, col: col - 1, direction };
      }
    case 'up': 
      if (row === 0) {
        return undefined;
      } else {
        return { row: row - 1, col, direction };
      }
    case 'down': 
      if (row === max - 1) {
        return undefined;
      } else {
        return { row: row + 1, col, direction };
      }
  }
}

function hashMatrix(matrix) {
  return createHash('md5').update(matrix.map(r => r.join("")).join("")).digest('hex');
}

async function part1() {
  // const input = await readSampleInputFile(16);
  const input = await readInputFile(16);
  const lines = input.split("\n");
  const matrix = lines.map(line => line.split(""));

  let beams = [{ row: 0, col: 0, direction: 'right' }]
  const energizationMatrix = _.range(0, matrix.length).map(x => '.'.repeat(matrix.length).split(''))
  let previousEnergizationMatrixStates = [hashMatrix(energizationMatrix)];
  let cont = true;
  
  while (cont) {
    const newBeams = []
    for (const {row, col, direction} of beams ) {
      energizationMatrix[row][col] = '#'; 
      if (matrix[row][col] === '.') {
        const newBeam = newBeamPosition(row, col, direction, matrix.length);
        if (newBeam) {
          newBeams.push(newBeam);
        }
      } else if (matrix[row][col] === '-') {
        if (direction === 'right' || direction === 'left') {
          const newBeam = newBeamPosition(row, col, direction, matrix.length);
          if (newBeam) {
            newBeams.push(newBeam);
          }
        } else {
          const newBeam = newBeamPosition(row, col, 'left', matrix.length);
          if (newBeam) {
            newBeams.push(newBeam);
          }
          const newBeam2 = newBeamPosition(row, col, 'right', matrix.length);
          if (newBeam2) {
            newBeams.push(newBeam2);
          }
        }
      } else if (matrix[row][col] === '|') {
        if (direction === 'up' || direction === 'down') {
          const newBeam = newBeamPosition(row, col, direction, matrix.length);
          if (newBeam) {
            newBeams.push(newBeam);
          }
        } else {
          const newBeam = newBeamPosition(row, col, 'up', matrix.length);
          if (newBeam) {
            newBeams.push(newBeam);
          }
          const newBeam2 = newBeamPosition(row, col, 'down', matrix.length);
          if (newBeam2) {
            newBeams.push(newBeam2);
          }
        }
      } else if (matrix[row][col] === '/') {
        switch (direction) {
          case 'right':
            const newBeam = newBeamPosition(row, col, 'up', matrix.length);
            if (newBeam) {
              newBeams.push(newBeam);
            }
            break;
          case 'left':
            const newBeam2 = newBeamPosition(row, col, 'down', matrix.length);
            if (newBeam2) {
              newBeams.push(newBeam2);
            }
            break;
          case 'up':
            const newBeam3 = newBeamPosition(row, col, 'right', matrix.length);
            if (newBeam3) {
              newBeams.push(newBeam3);
            }
            break;
          case 'down':
            const newBeam4 = newBeamPosition(row, col, 'left', matrix.length);
            if (newBeam4) {
              newBeams.push(newBeam4);
            }
            break;
        }
      } else if (matrix[row][col] === '\\') {
        switch (direction) {
          case 'right':
            const newBeam = newBeamPosition(row, col, 'down', matrix.length);
            if (newBeam) {
              newBeams.push(newBeam);
            }
            break;
          case 'left':
            const newBeam2 = newBeamPosition(row, col, 'up', matrix.length);
            if (newBeam2) {
              newBeams.push(newBeam2);
            }
            break;
          case 'up':
            const newBeam3 = newBeamPosition(row, col, 'left', matrix.length);
            if (newBeam3) {
              newBeams.push(newBeam3);
            }
            break;
          case 'down':
            const newBeam4 = newBeamPosition(row, col, 'right', matrix.length);
            if (newBeam4) {
              newBeams.push(newBeam4);
            }
            break;
        }
      }
    }
    let newEnergizationMatrixState = hashMatrix(energizationMatrix);
    
    if (previousEnergizationMatrixStates.every(state => state === newEnergizationMatrixState)) {
      cont = false;
    } else {
      // stabilization period
      if (previousEnergizationMatrixStates.length === 25) {
        previousEnergizationMatrixStates.shift();
      }
      previousEnergizationMatrixStates.push(newEnergizationMatrixState);
      beams = newBeams
    }
  }

  let energizedFields = 0;
  for (let r = 0; r < energizationMatrix.length; r++) {
    for (let c = 0; c < energizationMatrix.length; c++) {
      if (energizationMatrix[r][c] === '#') {
        energizedFields++;
      }
    }
  }

  console.log(energizedFields)
}

async function part2() {
  //  const input = await readSampleInputFile(16);
   const input = await readInputFile(16);
   const lines = input.split("\n");
   const matrix = lines.map(line => line.split(""));
 
   const initialBeams = [
    ..._.range(0, matrix.length).map(c => ({ row: 0, col: c, direction: 'down' })),
    ..._.range(0, matrix.length).map(c => ({ row: matrix.length - 1, col: c, direction: 'up' })),
    ..._.range(0, matrix.length).map(r => ({ row: r, col: 0, direction: 'right' })),
    ..._.range(0, matrix.length).map(r => ({ row: r, col: matrix.length - 1, direction: 'left' })),
   ]

   let maxEnergizedFields = 0;

   for (const initialBeam of initialBeams) {
    console.log(initialBeam)
    let beams = [{ row: initialBeam.row, col: initialBeam.col, direction: initialBeam.direction }]
    const energizationMatrix = _.range(0, matrix.length).map(x => '.'.repeat(matrix.length).split(''))
    let previousEnergizationMatrixStates = [hashMatrix(energizationMatrix)];
    let cont = true;
    
    while (cont) {
      const newBeams = []
      for (const {row, col, direction} of beams ) {
        energizationMatrix[row][col] = '#'; 
        if (matrix[row][col] === '.') {
          const newBeam = newBeamPosition(row, col, direction, matrix.length);
          if (newBeam) {
            newBeams.push(newBeam);
          }
        } else if (matrix[row][col] === '-') {
          if (direction === 'right' || direction === 'left') {
            const newBeam = newBeamPosition(row, col, direction, matrix.length);
            if (newBeam) {
              newBeams.push(newBeam);
            }
          } else {
            const newBeam = newBeamPosition(row, col, 'left', matrix.length);
            if (newBeam) {
              newBeams.push(newBeam);
            }
            const newBeam2 = newBeamPosition(row, col, 'right', matrix.length);
            if (newBeam2) {
              newBeams.push(newBeam2);
            }
          }
        } else if (matrix[row][col] === '|') {
          if (direction === 'up' || direction === 'down') {
            const newBeam = newBeamPosition(row, col, direction, matrix.length);
            if (newBeam) {
              newBeams.push(newBeam);
            }
          } else {
            const newBeam = newBeamPosition(row, col, 'up', matrix.length);
            if (newBeam) {
              newBeams.push(newBeam);
            }
            const newBeam2 = newBeamPosition(row, col, 'down', matrix.length);
            if (newBeam2) {
              newBeams.push(newBeam2);
            }
          }
        } else if (matrix[row][col] === '/') {
          switch (direction) {
            case 'right':
              const newBeam = newBeamPosition(row, col, 'up', matrix.length);
              if (newBeam) {
                newBeams.push(newBeam);
              }
              break;
            case 'left':
              const newBeam2 = newBeamPosition(row, col, 'down', matrix.length);
              if (newBeam2) {
                newBeams.push(newBeam2);
              }
              break;
            case 'up':
              const newBeam3 = newBeamPosition(row, col, 'right', matrix.length);
              if (newBeam3) {
                newBeams.push(newBeam3);
              }
              break;
            case 'down':
              const newBeam4 = newBeamPosition(row, col, 'left', matrix.length);
              if (newBeam4) {
                newBeams.push(newBeam4);
              }
              break;
          }
        } else if (matrix[row][col] === '\\') {
          switch (direction) {
            case 'right':
              const newBeam = newBeamPosition(row, col, 'down', matrix.length);
              if (newBeam) {
                newBeams.push(newBeam);
              }
              break;
            case 'left':
              const newBeam2 = newBeamPosition(row, col, 'up', matrix.length);
              if (newBeam2) {
                newBeams.push(newBeam2);
              }
              break;
            case 'up':
              const newBeam3 = newBeamPosition(row, col, 'left', matrix.length);
              if (newBeam3) {
                newBeams.push(newBeam3);
              }
              break;
            case 'down':
              const newBeam4 = newBeamPosition(row, col, 'right', matrix.length);
              if (newBeam4) {
                newBeams.push(newBeam4);
              }
              break;
          }
        }
      }
      let newEnergizationMatrixState = hashMatrix(energizationMatrix);
      
      if (previousEnergizationMatrixStates.every(state => state === newEnergizationMatrixState)) {
        cont = false;
      } else {
        // stabilization period
        if (previousEnergizationMatrixStates.length === 25) {
          previousEnergizationMatrixStates.shift();
        }
        previousEnergizationMatrixStates.push(newEnergizationMatrixState);
        beams = newBeams
      }
    }
  
    let energizedFields = 0;
    for (let r = 0; r < energizationMatrix.length; r++) {
      for (let c = 0; c < energizationMatrix.length; c++) {
        if (energizationMatrix[r][c] === '#') {
          energizedFields++;
        }
      }
    }
  
    if (energizedFields > maxEnergizedFields) {
      maxEnergizedFields = energizedFields;
    }
   }

   console.log(maxEnergizedFields)
}

// part1()
part2()