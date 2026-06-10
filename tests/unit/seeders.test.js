'use strict';

/**
 * Unit tests for seeder files.
 * Verifies that each seeder exports a run() function and calls pool.execute
 * with INSERT statements. Also verifies bcrypt cost factor usage.
 */

// Mock bcryptjs before requiring seeders
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2a$10$hashedpassword'),
}));

const bcrypt = require('bcryptjs');
const seeder001 = require('../../src/seeders/001_seed_users');
const seeder002 = require('../../src/seeders/002_seed_Health');
const seeder003 = require('../../src/seeders/003_seed_news_posts');

describe('Seeder exports', () => {
  it('001_seed_users exports a run() function', () => {
    expect(typeof seeder001.run).toBe('function');
  });

  it('002_seed_Health exports a run() function', () => {
    expect(typeof seeder002.run).toBe('function');
  });

  it('003_seed_news_posts exports a run() function', () => {
    expect(typeof seeder003.run).toBe('function');
  });
});

describe('Seeder 001 — seed users', () => {
  let mockPool;

  beforeEach(() => {
    mockPool = { execute: jest.fn().mockResolvedValue([{ affectedRows: 1 }]) };
    bcrypt.hash.mockClear();
  });

  it('calls pool.execute with INSERT statements', async () => {
    await seeder001.run(mockPool);

    expect(mockPool.execute).toHaveBeenCalled();
    const calls = mockPool.execute.mock.calls;
    const allSql = calls.map((c) => c[0]).join(' ');
    expect(allSql).toMatch(/INSERT/i);
    expect(allSql).toMatch(/users/i);
  });

  it('calls bcrypt.hash with cost factor 10', async () => {
    await seeder001.run(mockPool);

    expect(bcrypt.hash).toHaveBeenCalled();
    // Every call to bcrypt.hash should use cost factor 10
    bcrypt.hash.mock.calls.forEach(([_password, costFactor]) => {
      expect(costFactor).toBe(10);
    });
  });

  it('inserts at least one admin user and regular users', async () => {
    await seeder001.run(mockPool);

    // 1 admin + 3 regular users = 4 execute calls
    expect(mockPool.execute.mock.calls.length).toBeGreaterThanOrEqual(4);
  });
});

describe('Seeder 002 — seed Health', () => {
  it('calls pool.execute with INSERT statements for Health', async () => {
    const mockPool = { execute: jest.fn().mockResolvedValue([{ affectedRows: 1 }]) };
    await seeder002.run(mockPool);

    expect(mockPool.execute).toHaveBeenCalled();
    const calls = mockPool.execute.mock.calls;
    const allSql = calls.map((c) => c[0]).join(' ');
    expect(allSql).toMatch(/INSERT/i);
    expect(allSql).toMatch(/Health/i);
  });

  it('inserts multiple medicine records', async () => {
    const mockPool = { execute: jest.fn().mockResolvedValue([{ affectedRows: 1 }]) };
    await seeder002.run(mockPool);

    expect(mockPool.execute.mock.calls.length).toBeGreaterThan(1);
  });
});

describe('Seeder 003 — seed news posts', () => {
  it('calls pool.execute with INSERT statements for news_posts', async () => {
    const mockPool = { execute: jest.fn().mockResolvedValue([{ affectedRows: 1 }]) };
    await seeder003.run(mockPool);

    expect(mockPool.execute).toHaveBeenCalled();
    const calls = mockPool.execute.mock.calls;
    const allSql = calls.map((c) => c[0]).join(' ');
    expect(allSql).toMatch(/INSERT/i);
    expect(allSql).toMatch(/news_posts/i);
  });

  it('inserts multiple news post records', async () => {
    const mockPool = { execute: jest.fn().mockResolvedValue([{ affectedRows: 1 }]) };
    await seeder003.run(mockPool);

    expect(mockPool.execute.mock.calls.length).toBeGreaterThan(1);
  });
});
