when a new user joins, a new playerid is added to Session

when a game is started, the game id is added to Session

server publishes game + game._id
client subscribes to game + game._id

client pings subscribed data for the addition of player2?


*/




store a db full of these:

how to determine when to start a new game?
how to determine if a game was won and by whom?

Store turns:

player1 creates username
  player1 added to db

player1 creates Game
  game added to db
  player1 assigned X
  waiting...

player2 creates username
  player2 added to db

player2 joins game
  player2 assigned Y
  game start...

player 1 chooses Square
  turn is added to db
  check for game end.

player 2 chooses Square
  turn is added to db
  check for game end.

player 1 chooses Square
  turn is added to db
  check for game end.

player 2 chooses Square
  turn is added to db
  check for game end.

player 1 chooses Square
  turn is added to db
  check for game end.

player1 has won
  game is updated with an outcome and winner

player1 and player 2 are given the option to play again


square: {
  id: #,
  value: '',
  game: gameID
}

turn: {
  type: turn
  player: PlayerID,
  square: 3,
  game: gameID
}

game: {
  id: gameID
  type: game
  outcome: finished, draw, abandoned
  players: playerID, playerID
  winner: playerID or null
  turns: {type: turn, game: gameID}
}

player: {
  type: playerID
  id: playerID
  username: username
  games: {type: game, players contains playerID}
  won: {type: game, won: playerID}
  lost: {type: game, lost: playerID}
  drawn: {type: game, outcome: draw, players contains playerID}
  abandoned:
}



I think I need to store current squares because the board template is dependant on them...





past game data -
    result(win/lose/draw/incomplete)
    turns or final state (?)

current game data -
    current player (XO)
    turns or state

player data -
    username
    record (ids of games won, lost, drawn, incomplete)
      would be a query for games won by this player's id



how to run multiple games at once?

each player has the gameID stored, and uses that to look up
opponent moves and post their own

waits to start game until game has a player2 property

player joins - enters username.
  if there is a game waiting, add player as player2 and start game
  else, create a new game and wait until it has a player2
