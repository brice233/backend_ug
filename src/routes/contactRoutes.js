'use strict';

const express    = require('express');
const router     = express.Router();
const authenticate  = require('../middleware/authenticate');
const requireRole   = require('../middleware/requireRole');
const contactCtrl   = require('../controllers/contactController');

// Public — submit a contact message
router.post('/', contactCtrl.submitMessage);

// Admin only
router.get('/unread-count', authenticate, requireRole('admin'), contactCtrl.unreadCount);
router.get('/',             authenticate, requireRole('admin'), contactCtrl.listMessages);
router.get('/:id',          authenticate, requireRole('admin'), contactCtrl.getMessage);
router.post('/:id/reply',   authenticate, requireRole('admin'), contactCtrl.replyToMessage);
router.delete('/:id',       authenticate, requireRole('admin'), contactCtrl.deleteMessage);

module.exports = router;
