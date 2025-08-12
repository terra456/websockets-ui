# Сетевая игра Морской бой с использованием websocket

Реализован бэкенд для предоставленного интерфейса игры Морской бой. На сервере есть возоможность зарегистрироваться, начать игру, просмотреть игры начатые другими пользователями и присоединиться к одной из них. Или сыграть с компьютером. Игровая механика полностью повторяет классическую игру.

<img width="1337" height="913" alt="battleship" src="https://github.com/user-attachments/assets/08b74dc5-bc2f-4504-90ab-2752cb2444bd" />


## Установка

1. Clone/download repo `git clone git@github.com:terra456/websockets-ui.git`
2. `npm install`

## Использование

**Разработка**

`npm run start:dev`

- App served @ `http://localhost:8181` with nodemon

**Production**

`npm run start`

- App served @ `http://localhost:8181` without nodemon

---

**All commands**

| Command             | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `npm run start:dev` | App served @ `http://localhost:8181` with nodemon    |
| `npm run start`     | App served @ `http://localhost:8181` without nodemon |

**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.
