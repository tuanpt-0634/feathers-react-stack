module.exports = {
  host: 'localhost',
  port: 3030,
  public: '../public/',
  debug: false,
  paginate: {
    default: 10,
    max: 50,
  },
  mongodb: global.__MONGO_URI__,
};
