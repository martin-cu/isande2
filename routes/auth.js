const router = require('express').Router();
const userController = require('../controllers/userController');
const homeController = require('../controllers/homeController');

const { isPrivate, isAdmin, isSales, isPurchasing } = require('../middlewares/checkAuth');
//Consistent Pages
router.get('/login', (req, res) => {
  res.render('login', {});
});
router.post('/login', userController.loginUser);
router.get('/logout', userController.logout);
router.get('/', isPrivate, (req, res) => {
  res.render('home', {session: true});
});
router.get('/home', isPrivate, homeController.queryOverview);

//Sales
router.get('/create_sales', isPrivate, (req, res) => {
  res.render('createOrder', {session: true});
});
router.get('/view_payments', isPrivate, (req, res) => {
  res.render('paymentsTable', {session: true, payments_tab: true});
});
router.get('/track_sale_orders', isPrivate, (req, res) => {
  res.render('trackSalesOrders', {session: true});
});
router.get('/view_sales_records', isPrivate, (req, res) => {
  res.render('salesRecordTable', {session: true});
});

module.exports = router;