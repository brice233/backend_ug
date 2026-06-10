'use strict';

/**
 * Test DB helpers — no real DB connection needed.
 * All DB calls are mocked via jest.mock in individual test files.
 */

/**
 * No-op: in a real integration setup this would create a test schema.
 */
async function setupTestDb() {
  // no-op — DB is mocked
}

/**
 * No-op: in a real integration setup this would drop the test schema.
 */
async function teardownTestDb() {
  // no-op — DB is mocked
}

/**
 * No-op: in a real integration setup this would DELETE FROM <tableName>.
 * @param {string} _tableName
 */
async function clearTable(_tableName) {
  // no-op — DB is mocked
}

/**
 * Returns a jest mock object that mimics a mysql2 pool.
 * @returns {{ query: jest.Mock, execute: jest.Mock }}
 */
function createMockPool() {
  return {
    query: jest.fn(),
    execute: jest.fn(),
  };
}

module.exports = {
  setupTestDb,
  teardownTestDb,
  clearTable,
  createMockPool,
};
