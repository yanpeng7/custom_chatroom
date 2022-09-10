var mongoose = require('mongoose'), Schema = mongoose.Schema;
//declare database type
var RoomSchema = new mongoose.Schema({
  room_name: String,
  created_date: { type: Date, default: Date.now },
  userIds: Array,
  banUserIds: Array,
  creatorId: String,
  password:String
});

module.exports = mongoose.model('Room', RoomSchema);