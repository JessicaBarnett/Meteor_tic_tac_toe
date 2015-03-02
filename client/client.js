  Meteor.subscribe('boardData'/*, Session.get('game_id')*/);
  Session.set('xo', 'X');
  // Session.set('board');

  //Game Stuff

  Template.game.events({
    'click .js-new-player': function(){
      //hide the overlay
      $('.overlay').hide();

      //add new players
      Meteor.call('addPlayer', $('#username').val());

      //if there is a pending game, join it
      Meteor.call('joinGame', Session.get('player_id'));

      //if not, create a new game, and start asking the server
      if (!Session.get('game_id')){
        Meteor.call('createGame', Session.get('player_id'));
      }
    },
  });


  //Board Stuff
      // if (Session.get('game_id')){
      //   var game_id = Session.get('game_id');
      //   Meteor.call('getBoard', game_id); //refreshes board with current data
      //   return Session.get('board_'+game_id);
      // }
      // else {
      //   return [];
      // }

  Template.board.helpers({
    squares : function(){
      console.log('boardData length:  ', boardData.count());
      return boardData.find({});
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
      var square = GameData.findOne(Session.get('selectedSquare'));
      if (square.value === ''){
        GameData.update(Session.get('selectedSquare'), {value: Session.get('xo')});
        Meteor.call('toggleXO');
      }

      return square; //return square to the template to render new data
    }
  });
