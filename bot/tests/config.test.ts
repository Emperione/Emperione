import config from '../src/config/config';

describe('config loader', () => {
  const OLD = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD };
  });
  afterAll(() => {
    process.env = OLD;
  });

  it('throws on missing DISCORD_TOKEN', () => {
    delete process.env.DISCORD_TOKEN;
    expect(() => require('../src/config/config')).toThrow();
  });

  it('returns config when env present', () => {
    process.env.DISCORD_TOKEN = 'fake-token';
    const cfg = require('../src/config/config').default;
    expect(cfg.discordToken).toBe('fake-token');
  });
});
