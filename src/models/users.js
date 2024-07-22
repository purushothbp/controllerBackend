const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const userSchema = new mongoose.Schema({
  uuid: { type: String, default: uuid.v4, unique: true },
  firstname:{type:String},
  lastname:{type:String},
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'learner', 'guest'], default: 'guest' }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
