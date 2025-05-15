export interface WsRequest<T> {
  type:
    | 'reg'
    | 'update_winners'
    | 'create_room'
    | 'add_user_to_room'
    | 'create_game'
    | 'update_room'
    | 'add_ships'
    | 'start_game'
    | 'attack'
    | 'randomAttack'
    | 'turn'
    | 'finish';
  data: T;
  id: number;
}

export interface LoginRequest {
  name: string;
  password: string;
}

export interface LoginResponse {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
}

export interface IUser {
  name: string;
  index: string;
}

export interface UpdateWinner {
  name: string;
  wins: number;
}

export interface AddUserToRoom {
  indexRoom: number | string;
}

export interface CreateGame {
  idGame: number | string;
  idPlayer: number | string;
}

export interface UpdateRoom {
  roomId: number | string;
  roomUsers: RoomUsers[];
}

export interface RoomUsers {
  name: string;
  index: number | string;
}

export interface AddShips {
  gameId: number | string;
  ships: Ship[];
  indexPlayer: number | string;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Ship {
  position: Coordinates;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export interface StartGame {
  ships: Ship[];
  currentPlayerIndex: number | string;
}

export interface Attack {
  gameId: number | string;
  x: number;
  y: number;
  indexPlayer: number | string;
}

export interface RandomAttack {
  gameId: number | string;
  indexPlayer: number | string;
}

export interface AttackFeedback {
  position: Coordinates;
  currentPlayer: number | string;
  status: 'miss' | 'killed' | 'shot';
}

export interface Turn {
  currentPlayer: number | string;
}

export interface FinishGame {
  winPlayer: number | string;
}
