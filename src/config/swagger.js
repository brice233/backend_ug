'use strict';

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Herbal Medicine API',
      version: '1.0.0',
    },
    servers: [{ url: '/api/v1' }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            role: { type: 'string', enum: ['admin', 'user'], example: 'user' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Medicine: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Ginger' },
            description: { type: 'string' },
            uses: { type: 'string' },
            category: { type: 'string', example: 'Digestive' },
            scientific_name: { type: 'string', nullable: true },
            preparation_method: { type: 'string', nullable: true },
            precautions: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['pending', 'published', 'rejected'] },
            submitted_by: { type: 'integer', nullable: true },
            moderated_by: { type: 'integer', nullable: true },
            moderated_at: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        CreateMedicineInput: {
          type: 'object',
          required: ['name', 'description', 'uses', 'category'],
          properties: {
            name: { type: 'string', maxLength: 255 },
            description: { type: 'string' },
            uses: { type: 'string' },
            category: { type: 'string', maxLength: 100 },
            scientific_name: { type: 'string', maxLength: 255 },
            preparation_method: { type: 'string' },
            precautions: { type: 'string' },
          },
        },
        UpdateMedicineInput: {
          type: 'object',
          properties: {
            name: { type: 'string', maxLength: 255 },
            description: { type: 'string' },
            uses: { type: 'string' },
            category: { type: 'string', maxLength: 100 },
            scientific_name: { type: 'string', maxLength: 255 },
            preparation_method: { type: 'string' },
            precautions: { type: 'string' },
          },
        },
        NewsPost: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Benefits of Turmeric' },
            content: { type: 'string' },
            category: { type: 'string', example: 'Health' },
            cover_image_url: { type: 'string', format: 'uri', nullable: true },
            status: { type: 'string', enum: ['pending', 'published', 'rejected'] },
            author_id: { type: 'integer', nullable: true },
            moderated_by: { type: 'integer', nullable: true },
            moderated_at: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        CreateNewsInput: {
          type: 'object',
          required: ['title', 'content', 'category'],
          properties: {
            title: { type: 'string', maxLength: 255 },
            content: { type: 'string' },
            category: { type: 'string', maxLength: 100 },
            cover_image_url: { type: 'string', format: 'uri' },
          },
        },
        UpdateNewsInput: {
          type: 'object',
          properties: {
            title: { type: 'string', maxLength: 255 },
            content: { type: 'string' },
            category: { type: 'string', maxLength: 100 },
            cover_image_url: { type: 'string', format: 'uri' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 42 },
            totalPages: { type: 'integer', example: 5 },
          },
        },
        Question: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            visitor_name: { type: 'string', example: 'Alice' },
            visitor_email: { type: 'string', format: 'email', example: 'alice@example.com' },
            question_text: { type: 'string', example: 'Is ginger safe during pregnancy?' },
            status: { type: 'string', enum: ['pending', 'answered'], example: 'pending' },
            submitted_at: { type: 'string', format: 'date-time' },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Missing or invalid JWT',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Unauthorized' },
                  errors: { type: 'array', items: {}, example: [] },
                },
              },
            },
          },
        },
        Forbidden: {
          description: 'Insufficient role',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Forbidden' },
                  errors: { type: 'array', items: {}, example: [] },
                },
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Resource not found' },
                  errors: { type: 'array', items: {}, example: [] },
                },
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Validation failed' },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        field: { type: 'string' },
                        message: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Internal server error' },
                  errors: { type: 'array', items: {}, example: [] },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Auth' },
      { name: 'Users' },
      { name: 'Health' },
      { name: 'News' },
      { name: 'Moderation' },
      { name: 'Questions' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
