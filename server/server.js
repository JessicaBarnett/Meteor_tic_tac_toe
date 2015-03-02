// console.log('server works');

// if (Meteor.isServer) {

  // var GameData = new Mongo.Collection("GameData");

  Meteor.startup(function() {
    //clear db when server starts
    GameData.remove({});

  });

  Meteor.publish('boardData', function(game_id) {
    console.log('publishing boardData');
    if (game_id) {
      console.log('returning ', GameData.find({type: 'square', game: game_id}).count());
      return GameData.find({type: 'square', game: game_id});
    }
    else {
      return [];
    }
  });


// }
