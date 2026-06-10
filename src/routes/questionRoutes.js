'use strict';

const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');
const { submitQuestionSchema, updateQuestionStatusSchema } = require('../middleware/schemas');
const questionController = require('../controllers/questionController');

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Ask a Doctor — question submission and management
 */

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Submit a question (public — no authentication required)
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - visitor_name
 *               - visitor_email
 *               - question_text
 *             properties:
 *               visitor_name:
 *                 type: string
 *                 example: Alice
 *               visitor_email:
 *                 type: string
 *                 format: email
 *                 example: alice@example.com
 *               question_text:
 *                 type: string
 *                 example: Is ginger safe during pregnancy?
 *     responses:
 *       201:
 *         description: Question submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', validate(submitQuestionSchema), questionController.submitQuestion);

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: List all submitted questions (admin only, paginated, newest first)
 *     tags: [Questions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', authenticate, requireRole('admin'), questionController.listQuestions);

/**
 * @swagger
 * /questions/{id}/status:
 *   patch:
 *     summary: Update a question's status — pending or answered (admin only)
 *     tags: [Questions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, answered]
 *                 example: answered
 *     responses:
 *       200:
 *         description: Question status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch('/:id/status', authenticate, requireRole('admin'), validate(updateQuestionStatusSchema), questionController.updateStatus);

/**
 * POST /questions/:id/reply — admin only
 * Save a reply text and mark the question as answered.
 */
router.post('/:id/reply', authenticate, requireRole('admin'), questionController.replyToQuestion);

module.exports = router;
