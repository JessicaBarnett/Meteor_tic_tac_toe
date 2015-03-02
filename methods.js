// console.log('methods works');
var debug = true;
var GameData = new Mongo.Collection("GameData");


Meteor.methods({

  //no access to session server-side...
  toggleXO: function(){
    if (Session.get('xo') === 'X')
      Session.set('xo', 'O');
    else
      Session.set('xo', 'X');
  },

  //removes all squares for the passed game_id
  clearBoard: function (game_id){
    GameData.remove({type: 'square', game: game_id});
  },

  createBoard: function(game_id) {
    //creates 9 squares
    for (var i = 0; i < 9; i++) {
      GameData.insert({
        type: 'square',
        game: game_id,
        position: i,
        value: ''
      });
    }
  },

  /* finished data structure for player
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
  */
  addPlayer: function(username){
    console.log('adding player!!!');
    var newPlayer_id = GameData.insert({
      type: 'player',
      username: username
    });

    Session.set('player_id', newPlayer_id);

    if (debug) console.log('player \"', Session.get('player_id'), "\" added");
  },

  /* finished data structure for game
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
  createGame: function(player1_id){
    var newGame_id = GameData.insert({
      type: 'game',
      status: 'pending',
      player1: player1_id
    });

    //create new squares to represent the game board
    Meteor.call('createBoard', newGame_id);

    Session.set('game_id', newGame_id);

    if (debug) console.log('game \"', Session.get('game_id'), '\" added.  player1 id = ', player1_id);
  },


  joinGame: function(player2_id){
    //check if a 1-player game exists in the database
    var pendingGame_cursor = GameData.find({type: 'game', status: 'pending'});

    //if so, then add the passed player to that game
    if (pendingGame_cursor.count() > 0) {
      GameData.update(pendingGame_cursor, {status: 'in-progress', player2: player2_id });
      if (debug) console.log('game \"', newGame_id, '\" joined.  player2 id = ', player2_id);
    }
    else {
      if (debug) console.log('no pending games.');
    }

    return pendingGame_cursor; //return the game's id
  }

});
