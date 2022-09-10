var mongoose = require('mongoose'), Schema = mongoose.Schema;
//declare database type
var ChatSchema = new mongoose.Schema({
  room : { type: Schema.Types.ObjectId, ref: 'Room' },
  nickname: String,
  toUser: String, 
  message: String,
  isPrivate: Boolean,
  created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', ChatSchema);