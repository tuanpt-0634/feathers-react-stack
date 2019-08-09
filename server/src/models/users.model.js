// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const usersSchema = new mongooseClient.Schema(
    {
      name: { type: String, default: '' },
      email: { type: String, unique: true, lowercase: true },
      password: { type: String, default: '', required: true },
      status: { type: Number, default: 0 },
    },
    {
      timestamps: true,
    },
  );

  return mongooseClient.model('User', usersSchema);
};
