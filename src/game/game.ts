/* eslint-disable prettier/prettier */
import randomIntFromInterval from '../utils/random.ts';
import { type RoomUser, type Cell, type GameShip, type Ship, type IUser, type Coordinates, Attack, type AttackFeedback } from '../types/types.ts';

class Game {
  gameId: string;
  gameBoard: Cell[][] = [];
  ships: GameShip[] = [];
  indexPlayer: string;
  user: IUser;

  constructor(gameId: string, { name, index, idPlayer }: RoomUser) {
    this.gameId = gameId;
    this.indexPlayer = idPlayer;
    this.user = { name, index };
  }

  getUser = (): RoomUser => {
    return {
      ...this.user,
      idPlayer: this.indexPlayer,
    }
  }

  addShips = (ships: Ship[], board: Cell[][] = this.generateGameBoard()): void => {
    const gameShips: GameShip[] = ships.map((ship, ind) => {
      const { x, y } = ship.position;
      const len = ship.length;
      const cells = [];
      let borderCells = [];
      if (len === 1) {
        board[y][x].ship = ind;
        cells.push({x, y});
        borderCells.push(
          {x: x - 1, y: y - 1}, {x, y: y - 1}, {x: x + 1, y: y - 1},
          {x: x - 1, y}, {x: x + 1, y},
          {x: x - 1, y: y + 1}, {x, y: y + 1}, {x: x + 1, y: y + 1},
        );
      } else if (!ship.direction) {
        for (let i = 0; i < len; i++) {
          board[y][x + i].ship = ind;
          cells.push({x: x + i, y});
          if (i === 0) {
            borderCells.push(
              {x: x - 1, y: y - 1}, {x, y: y - 1},
              {x: x - 1, y},
              {x: x - 1, y: y + 1}, {x, y: y + 1},
            );
          } else if (i === len - 1) {
            borderCells.push(
              {x: x + len - 1, y: y - 1}, {x: x + len, y: y - 1},
              {x: x + len, y},
              {x: x + len - 1, y: y + 1}, {x: x + len, y: y + 1},
            );
          } else {
            borderCells.push(
              {x: x + i, y: y - 1}, {x: x + i, y: y + 1}
            );
          }
        }
      } else {
        for (let j = 0; j < len; j++) {
          board[y + j][x].ship = ind;
          cells.push({x, y: y + j});
          if (j === 0) {
            borderCells.push(
              {x: x - 1, y: y - 1}, {x, y: y - 1}, {x: x + 1, y: y - 1},
              {x: x - 1, y}, {x: x + 1, y},
            )
          } else if (j === len - 1) {
            borderCells.push(
              {x: x - 1, y: y + len - 1}, {x: x + 1, y: y + len - 1},
              {x: x - 1, y: y + len}, {x, y: y + len}, {x: x + 1, y: y + len},
            )
          } else {
            borderCells.push(
              {x: x - 1, y: y + j}, {x: x + 1, y: y + j}
            )
          }
        }
      }
      borderCells = borderCells.filter(({x,y}) => x >= 0 && x <= 9 && y >= 0 && y <= 9);
      return {
        ...ship,
        status: 'alive',
        cells,
        borderCells,
      }
    });

    this.ships = gameShips;
    this.gameBoard = board;
  };

  generateGameBoard = (): Cell[][] => {
    const board = [];
    for (let i = 0; i < 10; i++) {
      const element = [];
      for (let j = 0; j < 10; j++) {
        const cell: Cell = { isShoot: false, ship: null };
        element.push(cell);
      }
      board.push(element);
    }
    return board;
  };

  getShips = (): Ship[] => {
    const ships = this.ships.map(({ position, direction, length, type }) => {
      return { position, direction, length, type };
    });
    return ships;
  }

  shoot = ({x, y}: Coordinates): AttackFeedback[] | undefined => {
    const cell = this.gameBoard[y][x];
    if (!cell.isShoot) {
      cell.isShoot = true;

      if (cell.ship === null) {
        return [{
          position: { x, y },
          currentPlayer: '',
          status: "miss",
        }]
      } else {
        const ship = this.ships[cell.ship];
        if (ship.status !== 'killed') {
          if (ship.length === 1) {
            // killed
            return this.killShip(ship, {x, y});
          } else {
            ship.length -= 1;
            ship.status = 'shot';
            return [{
              position: { x, y },
              currentPlayer: '',
              status: 'shot',
            }]
          }
        }
        return [{
          position: { x, y },
          currentPlayer: '',
          status: "miss",
        }]
      }
    }

  };

  killShip = (ship: GameShip, cell: Coordinates): AttackFeedback[] => {
    ship.status = 'killed';
    ship.length = 0;
    
    const responseShip = ship.cells.map(({ x, y }) => {
      return {
            position: { x, y },
            currentPlayer: '',
            status: 'killed',
        } satisfies AttackFeedback;
    });

    const response = ship.borderCells.map(({ x, y }) => {
      this.gameBoard[y][x].isShoot = true;
      return {
            position: { x, y },
            currentPlayer: '',
            status: 'miss',
        } satisfies AttackFeedback;
    });
    
    return [...responseShip, ...response];
  };
}

export default Game;