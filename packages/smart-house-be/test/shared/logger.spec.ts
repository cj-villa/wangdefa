import { EventEmitter } from 'node:events';
import { LokiLogger } from '@/shared/logger';

jest.mock('winston', () => {
  const createLogger = jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  }));
  const format = {
    combine: jest.fn(() => ({})),
    errors: jest.fn(() => ({})),
    json: jest.fn(() => ({})),
    timestamp: jest.fn(() => ({})),
    printf: jest.fn(() => ({})),
  };

  return {
    __esModule: true,
    default: {
      createLogger,
      format,
      transports: {
        Console: jest.fn(),
      },
    },
  };
});

jest.mock('winston-loki', () => {
  class MockLokiTransport extends EventEmitter {
    static instances: MockLokiTransport[] = [];
    constructor(public readonly options: unknown) {
      super();
      MockLokiTransport.instances.push(this);
    }
  }

  return {
    __esModule: true,
    default: MockLokiTransport,
  };
});

describe('LokiLogger loki feedback', () => {
  beforeEach(() => {
    const winston = jest.requireMock('winston').default;
    winston.createLogger.mockClear();
    const loki = jest.requireMock('winston-loki').default;
    loki.instances = [];
  });

  it('should emit structured feedback when loki transport fails', () => {
    const stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const logger = new LokiLogger(
      {
        level: 'info',
        console: false,
        loki: { host: 'http://loki:3100' },
      },
      'LoggerSpec'
    );

    logger.logger;
    const transport = jest.requireMock('winston-loki').default.instances[0];
    transport.emit('error', new Error('loki post failed'));

    expect(stderrSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(String(stderrSpy.mock.calls[0][0]).trim());
    expect(payload.event).toBe('loki_transport_error');
    expect(payload.lokiHost).toBe('http://loki:3100');
    expect(payload.error).toContain('loki post failed');
    expect(payload.context).toBe('LoggerSpec');
    expect(payload.timestamp).toBeDefined();
    stderrSpy.mockRestore();
  });

  it('should emit feedback for each transport error', () => {
    const stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const logger = new LokiLogger({
      level: 'info',
      console: false,
      loki: { host: 'http://loki:3100' },
    });

    logger.logger;
    const transport = jest.requireMock('winston-loki').default.instances[0];
    transport.emit('error', new Error('same error'));
    transport.emit('error', new Error('same error'));

    expect(stderrSpy).toHaveBeenCalledTimes(2);
    stderrSpy.mockRestore();
  });
});
