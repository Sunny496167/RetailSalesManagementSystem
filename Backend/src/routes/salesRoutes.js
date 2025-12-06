// backend/src/routes/salesRoutes.js
import express from 'express';
import salesController from '../controllers/salesController.js';
import { validateQueryParams } from '../utils/validation.js';

const router = express.Router();

// Get all sales with filters, search, sort, and pagination
router.get('/', validateQueryParams, salesController.getSales);

// Get filter options for dropdown menus
router.get('/filter-options', salesController.getFilterOptions);

// Get sales statistics
router.get('/stats', salesController.getStatistics);

export default router;