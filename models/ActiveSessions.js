const mongoose = require('mongoose');

const ActiveSessiosSchema = new mongoose.Schema({
    sessionId:{type:String,required:true},
    isActive:{type:Boolean,default:true},   
});

module.exports = mongoose.model('ActiveSessions', ActiveSessiosSchema);