describe('insert', () => {
  let userModel;

  beforeAll(async () => {
    const app = require('../../src/app');

    userModel = app.get('mongooseClient').model('User');
  });

  afterEach(async () => {
    // Before each test, drop collection to reset db to empty state
    await userModel.collection.drop();

    // Tricky solution for issue of mongodb-memory-server
    // https://github.com/nodkz/mongodb-memory-server/issues/102
    await userModel.ensureIndexes();
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

  it('cannot create user with duplicate email', async () => {
    expect.assertions(1);

    const mockUser = {
      name: 'test',
      password: '123',
      email: 'test@example.com',
    };

    await userModel.create(mockUser);

    const user = {
      name: 'thu',
      password: '123',
      email: 'test@example.com',
    };

    try {
      await userModel.create(user);
    } catch (err) {
      expect(err.errmsg).toEqual(
        'E11000 duplicate key error dup key: { : "test@example.com" }',
      );
    }
  });
});
