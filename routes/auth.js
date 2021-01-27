const router = require('express').Router();
const userController = require('../controllers/userController');
const homeController = require('../controllers/homeController');
const notificationController = require('../controllers/notificationController');
const salesController = require('../controllers/salesController');
const purchaseController = require('../controllers/purchaseController');
const deliveryController = require('../controllers/deliveryController');
const reportController = require('../controllers/reportController');
const inventoryController = require('../controllers/inventoryController');

const { isPrivate, isAdmin, isSales, isPurchasing } = require('../middlewares/checkAuth');
//Consistent Pages
router.get('/login', (req, res) => {
  res.render('login', {});
});
router.post('/login', userController.loginUser);
router.get('/logout', userController.logout);

router.get('/getNotifs', isPrivate, notificationController.getNotifs);
router.post('/seenNotifs', isPrivate, notificationController.seenNotifs);

router.get('/', isPrivate, (req, res) => {
	res.redirect('home');
});
router.get('/home', isPrivate, homeController.viewDashboard);
//Reports
router.get('/reports', isPrivate, reportController.viewReports);
router.get('/reports/:type', isPrivate, reportController.viewSalesDetailedReport);
router.get('/reports/:type/:product', isPrivate, reportController.viewSalesDetailedReport);
//Inventory
router.get('/inventory', isPrivate, inventoryController.getProductInventory);
router.get('/product_catalogue', isPrivate, inventoryController.getProductCatalogue);
router.get('/change_price', isAdmin, inventoryController.getProductName);
router.post('/change_price', isPrivate, inventoryController.changeProductPrice);
router.get('/manual_count', isAdmin, inventoryController.getProductNameForManualCount);


//Sales
router.get('/create_sales', isPrivate, salesController.getSaleOrderForm);
router.post('/create_sales', isPrivate, salesController.createSaleRecord);
router.get('/view_payments', isPrivate, salesController.getPaymentsPage);
router.post('/submit_payment', isPrivate, salesController.postPaymentForm);
router.get('/track_sale_orders', isPrivate, salesController.getTrackOrdersPage);
router.get('/changeSaleCalendar', isPrivate, salesController.changeCalendar);
router.get('/view_sales_records', isPrivate, salesController.getSalesRecords);
router.get('/view_sales_details/:dr', isPrivate, salesController.viewSalesDetails);

//Purchasing
router.get('/track_purchase_orders', isPrivate, purchaseController.getTrackOrdersPage);
router.get('/changePurchaseCalendar', isPrivate, purchaseController.changeCalendar);
router.get('/view_purchase_records', isPrivate, purchaseController.getPurchaseRecords);
router.get('/view_purchase_details/:lo', isPrivate, purchaseController.viewPurchaseDetails);

//router.get('/view_purchase_records', isPrivate, purchaseController.getAllPurchases);
router.get('/create_purchase', isPrivate, purchaseController.getCreatePurchase);
router.post('/create_purchase', isPrivate, purchaseController.postCreatePurchase);
router.get('/get_price', isPrivate, purchaseController.getPrice);
//Logistics
router.get('/schedule_delivery', isPrivate, deliveryController.scheduleDelivery);
router.post('/schedule_delivery', isPrivate, deliveryController.updateDelivery);
router.get('/ajaxChangeDeliveryInfo', isPrivate, deliveryController.getSingleDeliveryInfo);
router.get('/ajaxChangeDriver', isPrivate, deliveryController.ajaxChangeDriver);
router.get('/confirm_delivery', isPrivate, deliveryController.getConfirmDelivery);
router.post('/confirm_delivery', isPrivate, deliveryController.updateDelivery);
router.get('/track_deliveries', isPrivate, deliveryController.getTrackDelivery);
router.get('/changeLogisticCalendar', isPrivate, deliveryController.changeCalendar);
router.get('/view_delivery_records', isPrivate, deliveryController.getDeliveryRecords);
router.get('/view_delivery_details/:id', isPrivate, deliveryController.viewDeliveryDetails);

module.exports = router;