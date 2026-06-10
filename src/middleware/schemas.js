'use strict';

const Joi = require('joi');

/**
 * Schema for user registration
 */
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

/**
 * Schema for user login
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 * Schema for creating a medicine record
 */
const createHealthchema = Joi.object({
  name: Joi.string().max(255).required(),
  description: Joi.string().required(),
  uses: Joi.string().required(),
  category: Joi.string().max(100).required(),
  scientific_name: Joi.string().max(255).allow('', null).optional(),
  preparation_method: Joi.string().allow('', null).optional(),
  precautions: Joi.string().allow('', null).optional(),
  image_url: Joi.string().uri().allow('', null).optional(),
  video_url: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('published', 'pending', 'draft').optional(),
});

/**
 * Schema for updating a medicine record (all fields optional)
 */
const updateHealthchema = Joi.object({
  name: Joi.string().max(255).optional(),
  description: Joi.string().optional(),
  uses: Joi.string().optional(),
  category: Joi.string().max(100).optional(),
  scientific_name: Joi.string().max(255).allow('', null).optional(),
  preparation_method: Joi.string().allow('', null).optional(),
  precautions: Joi.string().allow('', null).optional(),
  image_url: Joi.string().uri().allow('', null).optional(),
  video_url: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('published', 'pending', 'draft').optional(),
});

/**
 * Schema for creating a news post
 */
const createNewsSchema = Joi.object({
  title: Joi.string().max(255).required(),
  content: Joi.string().required(),
  category: Joi.string().max(100).required(),
  cover_image_url: Joi.string().uri().allow('').optional(),
  video_url: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('published', 'pending', 'draft').optional(),
});

/**
 * Schema for updating a news post (all fields optional)
 */
const updateNewsSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  content: Joi.string().optional(),
  category: Joi.string().max(100).optional(),
  cover_image_url: Joi.string().uri().allow('', null).optional(),
  video_url: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('published', 'pending', 'draft').optional(),
});

/**
 * Schema for updating a user's role
 */
const updateRoleSchema = Joi.object({
  role: Joi.string().valid('admin', 'user').required(),
});

/**
 * Schema for pagination query parameters
 */
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

/**
 * Schema for submitting a question (public)
 */
const submitQuestionSchema = Joi.object({
  visitor_name:  Joi.string().min(1).max(255).required(),
  visitor_email: Joi.string().email().required(),
  question_text: Joi.string().min(1).required(),
});

/**
 * Schema for updating a question's status (admin)
 */
const updateQuestionStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'answered').required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  createMedicineSchema: createHealthchema,
  updateMedicineSchema: updateHealthchema,
  createHealthchema,
  updateHealthchema,
  createNewsSchema,
  updateNewsSchema,
  updateRoleSchema,
  paginationSchema,
  submitQuestionSchema,
  updateQuestionStatusSchema,
};
