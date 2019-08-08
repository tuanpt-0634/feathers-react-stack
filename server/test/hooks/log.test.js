const logger = require('../../src/logger');
logger.debug = jest.fn();
logger.error = jest.fn();

const feathers = require('@feathersjs/feathers');
const log = require('../../src/hooks/log');

describe('Test "log" hook', () => {
  let app;

  beforeEach(() => {
    // Create a new plain Feathers application
    app = feathers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debug log', async () => {
    app.use('/dummy-service', {
      async find() {
        return [];
      },
    });

    // Register the `log` hook on that service
    app.service('dummy-service').hooks({
      before: {
        find: [log()],
      },
    });

    await app.service('dummy-service').find();
    expect(logger.debug.mock.calls.length).toBe(1);
  });

  it('debug log when context has function toJson', async () => {
    logger.level = 'debug';

    app.use('/dummy-service', {
      async find() {
        return [];
      },
    });

    app.service('dummy-service').hooks({
      before: {
        find: [
          context => {
            context.toJson = function() {
              //
            };
          },
          log(),
        ],
      },
    });

    await app.service('dummy-service').find();
    expect(logger.debug.mock.calls.length).toBe(2);
  });

  it('error log when context has error', async () => {
    app.use('/dummy-service', {
      async find() {
        return [];
      },
    });

    app.service('dummy-service').hooks({
      before: {
        find: [
          context => {
            context.error = true;
            context.result = false;
          },
          log(),
        ],
      },
    });

    await app.service('dummy-service').find();
    expect(logger.error.mock.calls.length).toBe(1);
  });
});
