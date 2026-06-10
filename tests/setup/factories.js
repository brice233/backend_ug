'use strict';

/**
 * Factory helpers for generating test payloads.
 * Pass an overrides object to customise individual fields.
 */

/**
 * @param {object} overrides
 * @returns {{ name: string, email: string, password: string }}
 */
function makeUserPayload(overrides = {}) {
  return {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    ...overrides,
  };
}

/**
 * @param {object} overrides
 * @returns {{ name: string, description: string, uses: string, category: string }}
 */
function makeMedicinePayload(overrides = {}) {
  return {
    name: 'Test Herb',
    description: 'A test herb',
    uses: 'Testing',
    category: 'Test',
    ...overrides,
  };
}

/**
 * @param {object} overrides
 * @returns {{ title: string, content: string, category: string }}
 */
function makeNewsPayload(overrides = {}) {
  return {
    title: 'Test News',
    content: 'Test content',
    category: 'Test',
    ...overrides,
  };
}

/**
 * @returns {{ id: number, name: string, email: string, role: string }}
 */
function makeAdminUser() {
  return { id: 1, name: 'Admin', email: 'admin@test.com', role: 'admin' };
}

/**
 * @returns {{ id: number, name: string, email: string, role: string }}
 */
function makeRegularUser() {
  return { id: 2, name: 'User', email: 'user@test.com', role: 'user' };
}

module.exports = {
  makeUserPayload,
  makeMedicinePayload,
  makeNewsPayload,
  makeAdminUser,
  makeRegularUser,
};
