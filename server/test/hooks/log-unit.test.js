const logger = require('../../src/logger');
logger.debug = jest.fn();
logger.error = jest.fn();

const log = require('../../src/hooks/log');

describe('Test "log" hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debug log', async () => {
    log()({});

    expect(logger.debug).toHaveBeenCalledTimes(1);
  });

  it('debug log when context has function toJson', async () => {
    logger.level = 'debug';

    log()({
      toJSON: function() {
        //
      },
    });
    expect(logger.debug).toHaveBeenCalledTimes(2);
  });

  it('error log when context has error', async () => {
    log()({
      error: true,
      result: false,
    });
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
