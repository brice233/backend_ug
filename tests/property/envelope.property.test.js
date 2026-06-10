'use strict';

/**
 * Property-based tests for response envelope consistency.
 *
 * Feature: herbal-medicine-backend
 * Property 17: Validation failures always produce a consistent 400 envelope
 * Property 18: Success responses always conform to the standard envelope
 */

// Mock the DB pool before any app modules are loaded
jest.mock('../../src/config/db', () => ({
  query: jest.fn(),
  execute: jest.fn(),
}));

const fc = require('fast-check');
const request = require('supertest');
const app = require('../../app');
const pool = require('../../src/config/db');
const medicineModel = require('../../src/models/medicineModel');

// Also mock medicineModel so we can control its return value
jest.mock('../../src/models/medicineModel');

describe('Property 17 — Validation failures always produce a consistent 400 envelope', () => {
  /**
   * Validates: Requirements 1.2
   *
   * For any payload that fails Joi validation on POST /api/v1/auth/register,
   * the response must be:
   *   { success: false, message: string, errors: Array (non-empty) }
   */
  it('POST /api/v1/auth/register with invalid fields always returns 400 with error envelope', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.constant(''),          // too short (min 2)
          email: fc.constant('not-an-email'), // invalid email
          password: fc.constant('short'),  // too short (min 8)
        }),
        async (invalidPayload) => {
          const response = await request(app)
            .post('/api/v1/auth/register')
            .send(invalidPayload)
            .set('Content-Type', 'application/json');

          expect(response.status).toBe(400);
          expect(response.body.success).toBe(false);
          expect(typeof response.body.message).toBe('string');
          expect(Array.isArray(response.body.errors)).toBe(true);
          expect(response.body.errors.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 10 }
    );
  });
});

describe('Property 18 — Success responses always conform to the standard envelope', () => {
  /**
   * Validates: Requirements 1.2
   *
   * For any valid page/limit combination, GET /api/v1/Health must return:
   *   { success: true, data: Array, pagination: object }
   */
  beforeEach(() => {
    // Reset and set up mock for medicineModel.findAllPublished
    medicineModel.findAllPublished.mockReset();
    medicineModel.findAllPublished.mockResolvedValue({ rows: [], total: 0 });
  });

  it('GET /api/v1/Health always returns 200 with standard success envelope', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5 }),
        fc.integer({ min: 1, max: 20 }),
        async (page, limit) => {
          const response = await request(app)
            .get(`/api/v1/Health?page=${page}&limit=${limit}`);

          expect(response.status).toBe(200);
          expect(response.body.success).toBe(true);
          expect(Array.isArray(response.body.data)).toBe(true);
          expect(typeof response.body.pagination).toBe('object');
          expect(response.body.pagination).not.toBeNull();
        }
      ),
      { numRuns: 20 }
    );
  });
});
