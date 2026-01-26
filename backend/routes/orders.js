const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.post('/', authenticateToken, orderController.createOrder);
router.get('/', authenticateToken, orderController.getUserOrders);
router.get('/:id', authenticateToken, orderController.getOrderById);
router.put('/:id/cancel', authenticateToken, orderController.cancelOrder);

// Admin routes
router.get('/admin/all', authenticateToken, isAdmin, orderController.getAllOrders);
router.put('/admin/:id/status', authenticateToken, isAdmin, orderController.updateOrderStatus);

module.exports = router;
