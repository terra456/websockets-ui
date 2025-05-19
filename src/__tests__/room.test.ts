import Room from '../game/room.ts';
import { ships1, shipsGame1, gameBoard1, user1, user2, ships2 } from './game_mock.ts';

describe('create room and and start game', () => {
  const room = new Room(user1);
  const gameId = room.gameId;
  let user1Index: string;
  let user2Index: string;
  test('is user1 in room', () => {
    expect(room.games.length).toBe(1);
    expect(room.games[0].user).toMatchObject(user1);
    expect(room.games[0].indexPlayer).toBeDefined();
    user1Index = room.games[0].indexPlayer;
  });

  test('add 2 user into room', () => {
    room.addUserToRoom(user2);
    expect(room.games.length).toBe(2);
    expect(room.games[1].user).toMatchObject(user2);
    expect(room.isAvailable).toBeFalsy();
    expect(room.isGameStarted).toBeFalsy();
    expect(room.games[1].indexPlayer).toBeDefined();
    user2Index = room.games[1].indexPlayer;
  });
  test('add ships for user1', () => {
    const addShips = {
      gameId,
      ships: ships1,
      indexPlayer: user1Index,
    };
    room.addShips(JSON.stringify(addShips));
    room.games
      .find((game) => game.indexPlayer === user1Index)
      ?.ships.forEach((ship, i) => {
        const { borderCells, ...onlyShip } = ship;
        const matcher = {
          position: shipsGame1[i].position,
          direction: shipsGame1[i].direction,
          length: shipsGame1[i].length,
          type: shipsGame1[i].type,
          status: shipsGame1[i].status,
          cells: shipsGame1[i].cells,
        };
        expect(onlyShip).toMatchObject(matcher);
        expect(borderCells).toHaveLength(shipsGame1[i].borderCells.length);
      });
    room.games[0].gameBoard.forEach((row, i) => {
      expect(row).toMatchObject(gameBoard1[i]);
    });
  });

  test('add second player ships', () => {
    const addShips = {
      gameId,
      ships: ships2,
      indexPlayer: user2Index,
    };
    room.addShips(JSON.stringify(addShips));
    expect(room.isGameStarted).toBeTruthy();
    expect(room.games).toHaveLength(2);
    expect(room.games.find((el) => el.indexPlayer === user2Index)).toBeDefined();
    expect(room.games.find((el) => el.indexPlayer === user2Index)?.getShips()).toMatchObject(ships2);
    expect(room.games.find((el) => el.indexPlayer !== user2Index)?.getShips()).toMatchObject(ships1);
  });

  test('check turn', () => {
    expect(room.currentPlayerIndex).toBe(user2Index);
  });

  test('shoot user 2, kill', () => {
    const data = { indexPlayer: user2Index, x: 3, y: 1, gameId };
    room.attack(JSON.stringify(data));
    expect(room.games.find((el) => el.indexPlayer === user1Index)?.ships[7].status).toBe('killed');
    expect(room.currentPlayerIndex).toBe(user2Index);
  });

  test('shoot user 2, miss', () => {
    const data = { indexPlayer: user2Index, x: 5, y: 0, gameId };
    room.attack(JSON.stringify(data));
    expect(room.games.find((el) => el.indexPlayer === user1Index)?.gameBoard[0][5].isShoot).toBeTruthy();
    expect(room.currentPlayerIndex).toBe(user1Index);
  });

  test('shoot user 1, miss', () => {
    const data = { indexPlayer: user1Index, x: 0, y: 0, gameId };
    room.attack(JSON.stringify(data));
    expect(room.games.find((el) => el.indexPlayer === user2Index)?.gameBoard[0][0].isShoot).toBeTruthy();
    expect(room.currentPlayerIndex).toBe(user2Index);
  });

  test('shoot user 1, not his shoot', () => {
    const data = { indexPlayer: user1Index, x: 1, y: 0, gameId };
    room.attack(JSON.stringify(data));
    expect(room.games.find((el) => el.indexPlayer === user2Index)?.gameBoard[0][1].isShoot).toBeFalsy();
    expect(room.currentPlayerIndex).toBe(user2Index);
  });
});
