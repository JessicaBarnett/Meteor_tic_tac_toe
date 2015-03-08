var AllGamesData = new Mongo.Collection("AllGamesData");

Meteor.startup(function() {
  // debugger;
  console.log("start server");
});


//gameData will contain all board squares, the game's information, and one or the other's player information
Meteor.publish('gameData', function(player_id, game_id) {
  var data = AllGamesData.find({type: 'square', game: game_id}, {id: game_id}, {id: player_id});
  console.log('publishing gameData: ', data.count());
  return data;
});



/*
  finished data structure for player
  player: {
    type: player
    id: playerID
    username: username
    games: {type: game, players contains playerID}
    won: {type: game, won: playerID}
    lost: {type: game, lost: playerID}
    drawn: {type: game, outcome: draw, players contains playerID}
    abandoned:
  }
  finished data structure for game
  game: {
    id: gameID
    type: game
    status: pending, in-progress, complete, drawn, abandoned
    player1: playerID
    player2: playerID
    winner: playerID (no property if drawn)
    turns: {type: turn, game: gameID}
  }


*/


Meteor.methods({
  createBoard: function(game_id) {
    //creates 9 squares
    for (var i = 0; i < 9; i++) {
      AllGamesData.insert({
        type: 'square',
        game: game_id,
        position: i,
        value: ''
      });
    }
  },

  addPlayer: function(username){
    var player_id = AllGamesData.insert({
      type: 'player',
      username: username
    });

    console.log('added player:  ', player_id);
    debugger;
    return player_id;
  },

  createGame: function(player1_id){
    var game_id = AllGamesData.insert({
      type: 'game',
      status: 'pending',
      player1: player1_id
    });

    //create new squares to represent the game board
    Meteor.call('createBoard', newGame_id);

    //returns game Id
    return game_id;
  },


  joinGame: function(player2_id){
    // debugger;
    //check if a 1-player game exists in the database
    var pendingGame_cursor = AllGamesData.find({type: 'game', status: 'pending'});

    //if so, then add the passed player to that game
    if (pendingGame_cursor.count() > 0) {
      AllGamesData.update(pendingGame_cursor, {status: 'in-progress', player2: player2_id });
      console.log('game joined');
    }
    else {
      console.log('no pending games.');
    }

    return pendingGame_cursor; //return the game's id
  }

});
