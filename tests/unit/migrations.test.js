'use strict';

/**
 * Unit tests for migration files.
 * Verifies that each migration exports the correct function and calls pool.query
 * with the expected SQL statement type.
 */

const migration001 = require('../../src/migrations/001_create_users');
const migration002 = require('../../src/migrations/002_create_Health');
const migration003 = require('../../src/migrations/003_create_news_posts');
const rollback = require('../../src/migrations/rollback');

describe('Migration exports', () => {
  it('001_create_users exports an up() function', () => {
    expect(typeof migration001.up).toBe('function');
  });

  it('002_create_Health exports an up() function', () => {
    expect(typeof migration002.up).toBe('function');
  });

  it('003_create_news_posts exports an up() function', () => {
    expect(typeof migration003.up).toBe('function');
  });

  it('rollback exports a down() function', () => {
    expect(typeof rollback.down).toBe('function');
  });
});

describe('Migration 001 — create users', () => {
  it('calls pool.query with a CREATE TABLE statement', async () => {
    const mockPool = { query: jest.fn().mockResolvedValue([]) };
    await migration001.up(mockPool);

    expect(mockPool.query).toHaveBeenCalledTimes(1);
    const sql = mockPool.query.mock.calls[0][0];
    expect(sql).toMatch(/CREATE TABLE/i);
    expect(sql).toMatch(/users/i);
  });
});

describe('Migration 002 — create Health', () => {
  it('calls pool.query with a CREATE TABLE statement', async () => {
    const mockPool = { query: jest.fn().mockResolvedValue([]) };
    await migration002.up(mockPool);

    expect(mockPool.query).toHaveBeenCalledTimes(1);
    const sql = mockPool.query.mock.calls[0][0];
    expect(sql).toMatch(/CREATE TABLE/i);
    expect(sql).toMatch(/Health/i);
  });
});

describe('Migration 003 — create news_posts', () => {
  it('calls pool.query with a CREATE TABLE statement', async () => {
    const mockPool = { query: jest.fn().mockResolvedValue([]) };
    await migration003.up(mockPool);

    expect(mockPool.query).toHaveBeenCalledTimes(1);
    const sql = mockPool.query.mock.calls[0][0];
    expect(sql).toMatch(/CREATE TABLE/i);
    expect(sql).toMatch(/news_posts/i);
  });
});

describe('Rollback — down()', () => {
  it('calls pool.query with DROP TABLE statements', async () => {
    const mockPool = { query: jest.fn().mockResolvedValue([]) };
    await rollback.down(mockPool);

    expect(mockPool.query).toHaveBeenCalled();
    const calls = mockPool.query.mock.calls;
    const allSql = calls.map((c) => c[0]).join(' ');
    expect(allSql).toMatch(/DROP TABLE/i);
  });

  it('drops news_posts, Health, and users tables', async () => {
    const mockPool = { query: jest.fn().mockResolvedValue([]) };
    await rollback.down(mockPool);

    const droppedTables = mockPool.query.mock.calls.map((c) => c[0]);
    expect(droppedTables.some((sql) => /news_posts/i.test(sql))).toBe(true);
    expect(droppedTables.some((sql) => /Health/i.test(sql))).toBe(true);
    expect(droppedTables.some((sql) => /users/i.test(sql))).toBe(true);
  });
});
