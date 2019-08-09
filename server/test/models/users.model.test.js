const mongoose = require('mongoose');

describe('insert', () => {
  let connection;
  let userModel;

  beforeAll(async () => {
    // Setup mongodb in-memory db connection
    connection = await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
    });

    // Mock app.get, which is called is users.model.js to return in-memory db
    jest.mock('../../src/app', () => ({
      get: jest.fn(),
    }));
    const app = require('../../src/app');
    app.get.mockReturnValueOnce(mongoose);

    userModel = require('../../src/models/users.model')(app);
  });

  afterAll(async () => {
    // Close connection after end
    await connection.close();
  });

  afterEach(() => {
    // Before each test, drop collection to reset db to empty state
    userModel.collection.drop();
  });

  it('save with valid data', async () => {
    const mockUser = {
      name: 'User',
      password: '123',
      email: 'user@example.com',
    };
    await userModel.create(mockUser);

    const insertedUser = await userModel.findOne();

    expect(insertedUser.name).toEqual(mockUser.name);
    expect(insertedUser._id).not.toBe(null);
  });
});
