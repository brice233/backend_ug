'use strict';

/**
 * Unit tests for terminal message formats in db.js and server.js.
 */

const fs = require('fs');
const path = require('path');

// ─── DB module tests ──────────────────────────────────────────────────────────

describe('DB module (db.js)', () => {
  // Mock mysql2/promise before requiring db.js so no real connection is made
  jest.mock('mysql2/promise', () => ({
    createPool: jest.fn(() => ({
      getConnection: jest.fn().mockResolvedValue({
        release: jest.fn(),
      }),
      on: jest.fn(),
      query: jest.fn(),
      execute: jest.fn(),
    })),
  }));

  let mysql;
  let pool;

  beforeAll(() => {
    // Clear the module registry so db.js is freshly required with the mock
    jest.resetModules();

    // Re-apply the mock after resetModules
    jest.mock('mysql2/promise', () => ({
      createPool: jest.fn(() => ({
        getConnection: jest.fn().mockResolvedValue({
          release: jest.fn(),
        }),
        on: jest.fn(),
        query: jest.fn(),
        execute: jest.fn(),
      })),
    }));

    mysql = require('mysql2/promise');

    // Set env vars so createPool receives them
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '3306';
    process.env.DB_USER = 'testuser';
    process.env.DB_PASSWORD = 'testpass';
    process.env.DB_NAME = 'testdb';

    pool = require('../../src/config/db');
  });

  it('calls mysql.createPool when the module is loaded', () => {
    expect(mysql.createPool).toHaveBeenCalledTimes(1);
  });

  it('creates the pool with config values from environment variables', () => {
    const callArgs = mysql.createPool.mock.calls[0][0];
    expect(callArgs.host).toBe('localhost');
    expect(callArgs.user).toBe('testuser');
    expect(callArgs.password).toBe('testpass');
    expect(callArgs.database).toBe('testdb');
  });

  it('exports the pool as the module default', () => {
    // The exported value should be the object returned by createPool
    expect(pool).toBeDefined();
    expect(typeof pool.query).toBe('function');
    expect(typeof pool.execute).toBe('function');
  });
});

// ─── Server startup message format tests ─────────────────────────────────────

describe('server.js startup message format strings', () => {
  let serverSource;

  beforeAll(() => {
    serverSource = fs.readFileSync(
      path.resolve(__dirname, '../../server.js'),
      'utf8'
    );
  });

  it('contains [Server] Running on format string', () => {
    expect(serverSource).toContain('[Server] Running on');
  });

  it('contains [Swagger] Docs available at format string', () => {
    expect(serverSource).toContain('[Swagger] Docs available at');
  });

  it('contains [Admin] Email: format string', () => {
    expect(serverSource).toContain('[Admin] Email:');
  });

  it('contains [Admin] Password: format string', () => {
    expect(serverSource).toContain('[Admin] Password:');
  });
});
