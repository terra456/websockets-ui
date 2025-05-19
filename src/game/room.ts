import { randomUUID } from 'node:crypto';
import { type UpdateRoom, type AddShips, type IUser, type GameInfo, type Attack, type Coordinates } from '../types/types.ts';
import Game from './game.ts';
import { EventEmitter } from 'node:events';
import randomIntFromInterval from '../utils/random.ts';
class GameEmitter extends EventEmitter {}

class Room {
  roomId: string;
  isGameStarted: boolean;
  isAvailable: boolean;
  games: Game[] = [];
  gameEmitter: GameEmitter;
  gameId: string;
  currentPlayerIndex: string = '';
  destroy: () => void = () => {};

  constructor(user: IUser) {
    this.gameEmitter = new GameEmitter();
    this.roomId = randomUUID();
    this.isGameStarted = false;
    this.isAvailable = true;
    this.gameId = randomUUID();
    this.addUserToRoom(user);
  }

  addUserToRoom = (user: IUser): GameInfo | undefined => {
    const gameUser = {
      ...user,
      idPlayer: randomUUID(),
    };
    const game = new Game(this.gameId, gameUser);
    this.games.push(game);
    this.currentPlayerIndex = gameUser.idPlayer;
    if (this.games.length === 2) {
      this.isAvailable = false;
      return this.createGameInfo();
    }
  };

  createGameInfo = (): GameInfo => {
    return {
      idGame: this.gameId,
      users: this.games.map((el) => el.getUser()),
    };
  };

  updateRoomInfo = (): UpdateRoom => {
    return {
      roomId: this.roomId,
      roomUsers: this.games.map((el) => el.user),
    };
  };

  addShips = (data: string): void => {
    const shipsData = JSON.parse(data) as AddShips;
    this.games.find((el) => el.indexPlayer === shipsData.indexPlayer)?.addShips(shipsData.ships);

    if (this.games.every((el) => el.ships.length > 0)) {
      this.startGame();
    }
  };

  startGame = (): void => {
    this.isGameStarted = true;
    // TODO Random
    // this.currentPlayerIndex = gameUser.idPlayer;
    this.gameEmitter.emit('start_game');
  };

  attack(data: string): void {
    const { indexPlayer, x, y } = JSON.parse(data) as Attack;
    if (indexPlayer && indexPlayer === this.currentPlayerIndex) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const anoutherGame = this.games.find((el) => el.indexPlayer !== indexPlayer)!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
      const feedback = anoutherGame.shoot({ x, y })!;

      if (feedback) {
        feedback.forEach((el) => {
          el.currentPlayer = indexPlayer;
        });
        if (feedback.length === 1 && feedback[0].status === 'miss') {
          this.currentPlayerIndex = anoutherGame.indexPlayer;
        }
        this.gameEmitter.emit('attack_feedback', feedback);
        if (feedback.length > 1) {
          if (anoutherGame.ships.filter((ship) => ship.status === 'killed').length === 10) {
            this.gameEmitter.emit('finish', { winPlayer: this.currentPlayerIndex });
          }
        }
      }
    }
  }

  randomAttack = (data: string): void => {
    const { indexPlayer, gameId } = JSON.parse(data);
    if (indexPlayer && indexPlayer === this.currentPlayerIndex) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const anoutherGame = this.games.find((el) => el.indexPlayer !== indexPlayer)!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
      const getMissCell = (): Coordinates => {
        const x = randomIntFromInterval(0, 9);
        const y = randomIntFromInterval(0, 9);
        if (anoutherGame.gameBoard[y][x].isShoot) {
          return getMissCell();
        }
        return { x, y };
      };
      const coordinates = getMissCell();
      this.attack(JSON.stringify({ indexPlayer, gameId, ...coordinates }));
    }
  };

  endGame = (gamePlayer: string): void => {
    const anoutherUser = this.games.find((el) => el.indexPlayer !== gamePlayer)?.getUser();
    this.gameEmitter.emit('finish', { winPlayer: anoutherUser?.idPlayer });
  };
}

export default Room;
