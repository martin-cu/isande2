const router = require('express').Router();
const userController = require('../controllers/userController');
const homeController = require('../controllers/homeController');
const salesController = require('../controllers/salesController');
const reportController = require('../controllers/reportController');

const { isPrivate, isAdmin, isSales, isPurchasing } = require('../middlewares/checkAuth');
//Consistent Pages
router.get('/login', (req, res) => {
  res.render('login', {});
});
router.post('/login', userController.loginUser);
router.get('/logout', userController.logout);

router.get('/', isPrivate, isPrivate, homeController.viewDashboard);
router.get('/home', isPrivate, homeController.viewDashboard);

router.get('/reports', isPrivate, reportController.viewReports);
router.get('/reports/:type', isPrivate, reportController.viewSalesDetailedReport);
router.get('/reports/:type/:product', isPrivate, reportController.viewSalesDetailedReport);

//Sales
router.get('/create_sales', isPrivate, salesController.getSaleOrderForm);
router.post('/create_sales', isPrivate, salesController.createSaleRecord);
router.get('/view_payments', isPrivate, salesController.getPaymentsPage);
router.get('/track_sale_orders', isPrivate, salesController.getTrackOrdersPage);
router.get('/view_sales_records', isPrivate, salesController.getSalesRecords);

module.exports = router;