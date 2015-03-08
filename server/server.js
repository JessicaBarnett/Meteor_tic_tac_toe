var AllGamesData = new Mongo.Collection("AllGamesData");

Meteor.startup(function() {
  AllGamesData.remove({}); //clears db every time server restarts
  console.log("start server");
});


//gameData will contain all board squares, the game's information, and one or the other's player information
Meteor.publish('gameData', function(player_id, game_id) {
  var data = AllGamesData.find({type: 'square', game: game_id}, {id: game_id}, {id: player_id});
  console.log('publishing gameData: ', data.count());
  return data;
});



/*finished data structure for player
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
    // debugger;
    var player_id = AllGamesData.insert({
      type: 'player',
      username: username
    });

    console.log('added player:  ', player_id);
    return player_id;
  },

  createGame: function(player1_id){
    var game_id = AllGamesData.insert({
      type: 'game',
      status: 'pending',
      player1: player1_id
    });

    //create new squares to represent the game board
    Meteor.call('createBoard', game_id);

    //returns game Id
    debugger;
    return game_id;
  },


  joinGame: function(player2_id){
    // debugger;
    //check if a 1-player game exists in the database
    var pendingGame = AllGamesData.findOne({type: 'game', status: 'pending'});

    //if so, then add the passed player to that game
    if (pendingGame.count() > 0) {
      AllGamesData.update(pendingGame, {status: 'in-progress', player2: player2_id });
      console.log('game joined');
      return pendingGame; //return the game's id (?)
    }
    else {
      console.log('no pending games.');
      return null;
    }
  }

});
