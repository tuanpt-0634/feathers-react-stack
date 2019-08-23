// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const usersSchema = new mongooseClient.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, unique: true, lowercase: true, required: true },
      password: { type: String, required: true },
      status: { type: Number, default: 0 },
    },
    {
      timestamps: true,
    },
  );

  return mongooseClient.model('User', usersSchema);
};
