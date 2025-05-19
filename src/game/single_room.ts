import { type IUser } from '../types/types.ts';
import GameBot from './game_bot.ts';
import Room from './room.ts';

class SingleRoom extends Room {
  player: string;
  botId: string = '';
  constructor(user: IUser) {
    super(user);
    this.isAvailable = false;
    this.player = this.games[0].indexPlayer;
    this.addBot();
  }

  addBot = (): void => {
    const bot = new GameBot(this.gameId);
    this.botId = bot.indexPlayer;
    this.games.push(bot);
    this.currentPlayerIndex = this.player;
    this.startGame();
  };

  attack(data: string): void {
    super.attack(data);
    if (this.currentPlayerIndex !== this.player) {
      setTimeout(() => {
        this.randomAttack(JSON.stringify({ indexPlayer: this.botId, gameId: this.gameId }));
      }, 1000);
    }
  }
}

export default SingleRoom;
