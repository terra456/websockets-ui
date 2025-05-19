import { randomUUID } from 'node:crypto';
import Game from './game.ts';
import { type Cell, type Ship } from '../types/types.ts';
import randomIntFromInterval from '../utils/random.ts';
class GameBot extends Game {
  constructor(gameId: string) {
    const bot = {
      name: 'Game Bot',
      index: randomUUID(),
      idPlayer: randomUUID(),
    };
    super(gameId, bot);
    this.randomShips();
  }

  randomShips = (): void => {
    const types = ['small', 'medium', 'large', 'huge'];
    const board = this.generateGameBoard();
    const ships: Ship[] = [];

    const checkAvaliable = ({ position, direction, length }: Ship, board: Cell[][]): boolean => {
      const { x, y } = position;
      for (let i = -1; i <= length; ) {
        const threeCells = direction
          ? [
              { x: x - 1, y: y + i },
              { x, y: y + i },
              { x: x + 1, y: y + i },
            ]
          : [
              { x: x + i, y: y - 1 },
              { x: x + i, y },
              { x: x + i, y: y + 1 },
            ];
        if (threeCells.filter(({ x, y }) => x >= 0 && x <= 9 && y >= 0 && y <= 9 && board[y][x].ship !== null).length === 0) {
          i++;
        } else {
          return false;
        }
      }
      return true;
    };

    const generateShip = (len: number): Ship => {
      const randomDirection = randomIntFromInterval(0, 1);
      const x = randomIntFromInterval(0, !randomDirection ? 10 - len : 9);
      const y = randomIntFromInterval(0, randomDirection ? 10 - len : 9);
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const ship = {
        position: { x, y },
        direction: Boolean(randomDirection),
        length: len,
        type: types[len - 1],
      } as Ship;
      const avaliable = checkAvaliable(ship, board);
      if (!avaliable) {
        return generateShip(len);
      }
      for (let i = 0; i < ship.length; i++) {
        ship.direction ? (board[y + i][x].ship = 4) : (board[y][x + i].ship = 4);
      }
      return ship;
    };

    for (let len = 4; len > 0; len--) {
      const count = 5 - len;
      for (let i = 0; i < count; i++) {
        const ship = generateShip(len);

        ships.push(ship);
      }
    }

    this.addShips(ships);
  };
}

export default GameBot;
