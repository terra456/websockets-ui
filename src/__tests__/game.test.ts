import Game from '../game/game.ts';
import { ships1, shipsGame1, gameBoardNull, gameBoard1, uuidGame, user1 } from './game_mock.ts';

describe('only function tests', () => {
  const game = new Game(uuidGame, { ...user1, idPlayer: uuidGame });
  test('add 1 ship', () => {
    game.addShips([ships1[0]]);
    expect(game.ships[0]).toMatchObject(shipsGame1[0]);
  });

  test('generate game board', () => {
    const board = game.generateGameBoard();
    expect(board).toMatchObject(gameBoardNull);
  });
});

describe('game start', () => {
  const game = new Game(uuidGame, { ...user1, idPlayer: uuidGame });
  test('add 1 player ships', () => {
    game.addShips(ships1);
    const recivedShips = game.getShips();
    recivedShips.forEach((el, i) => {
      expect(el).toMatchObject(ships1[i]);
    });
  });

  test('ships status be filled', () => {
    game.ships.forEach((el, i) => {
      expect(el.status).toBe('alive');
    });
  });

  test('game board must be filled', () => {
    const gameBoard = game.gameBoard;
    gameBoard.forEach((el, i) => {
      expect(el).toMatchObject(gameBoard1[i]);
    });
  });
});
