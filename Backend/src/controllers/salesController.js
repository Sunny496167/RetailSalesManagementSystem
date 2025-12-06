// backend/src/controllers/salesController.js
import salesService from '../services/salesService.js';

class SalesController {
  async getSales(req, res, next) {
    try {
      const {
        page = 1,
        pageSize = 10,
        search = '',
        sortBy = 'date',
        sortOrder = 'desc',
        customerRegion,
        gender,
        ageMin,
        ageMax,
        productCategory,
        tags,
        paymentMethod,
        dateFrom,
        dateTo
      } = req.query;

      // Build filter object with validation
      const filters = {
        customerRegion: customerRegion ? customerRegion.split(',').map(r => r.trim()).filter(Boolean) : [],
        gender: gender ? gender.split(',').map(g => g.trim()).filter(Boolean) : [],
        ageMin: ageMin ? parseInt(ageMin) : null,
        ageMax: ageMax ? parseInt(ageMax) : null,
        productCategory: productCategory ? productCategory.split(',').map(c => c.trim()).filter(Boolean) : [],
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        paymentMethod: paymentMethod ? paymentMethod.split(',').map(p => p.trim()).filter(Boolean) : [],
        dateFrom: dateFrom || null,
        dateTo: dateTo || null
      };

      const result = await salesService.getSalesData({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        search: search.trim(),
        sortBy,
        sortOrder,
        filters
      });

      res.json(result);
    } catch (error) {
      console.error('Error in getSales controller:', error);
      next(error);
    }
  }

  async getFilterOptions(req, res, next) {
    try {
      const options = await salesService.getFilterOptions();
      res.json(options);
    } catch (error) {
      console.error('Error in getFilterOptions controller:', error);
      next(error);
    }
  }

  async getStatistics(req, res, next) {
    try {
      const stats = await salesService.getStatistics();
      res.json(stats);
    } catch (error) {
      console.error('Error in getStatistics controller:', error);
      next(error);
    }
  }
}

export default new SalesController();