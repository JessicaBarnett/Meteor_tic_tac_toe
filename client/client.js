console.log("start client");

  Session.set('xo', 'X');
  Session.set('game_id', null);
  var gameData;

  Meteor.subscribe('gameData', Session.get('player_id'), Session.get('game_id'));

  var helpers = {
      toggleXO: function(){
        if (Session.get('xo') === 'X')
          Session.set('xo', 'O');
        else
          Session.set('xo', 'X');
      }
  };

  //Game Stuff

  Template.game.helpers({
    gameData: function() {
      console.log("elements in gamedata: ", gameData.find({}).count());
      return gameData.find({});
    }
  });

  Template.game.events({
    'click .js-new-player': function(){
      //hide the overlay
      $('.overlay').hide();

      //add new players
      Meteor.call('addPlayer', $('#username').val(), Session.get('player_id'), function(err, data){

        Session.set('player_id', data);

        Meteor.call('joinGame', Session.get('player_id'), function(err, data){
          //if there is a pending game, join it.
          if (data) {
            Session.set('game_id', data);
          }
          // Else, create a new game.
          else {
            Meteor.call('createGame', Session.get('player_id'), function(err, data){
              Session.set('game_id', data);
            });

          }
        });

      });
    }

  });


  //Board Stuff

  Template.board.helpers({
    squares : function(){
      if (gameData) {
        return gameData.find({type: "square"}) || [];
      }
      else {
        return [];
      }
    }
  });

  Template.board.events({
    'click .js-reset' : function(){
      Meteor.call('resetBoard');
    }
  });

  //Square Stuff

  Template.square.events({
    'click .js-square': function () {

      Session.set('selectedSquare', this._id);

      //fetches selected square from database and updates the value
      var square = boardData.findOne(Session.get('selectedSquare'));
      if (square.value === ''){
        boardData.update(Session.get('selectedSquare'), {value: Session.get('xo')});
        helpers.toggleXO();
      }

      return square; //return square to the template to render new data
    }
  });
