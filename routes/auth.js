const router = require('express').Router();
const userController = require('../controllers/userController');
const homeController = require('../controllers/homeController');
const notificationController = require('../controllers/notificationController');
const salesController = require('../controllers/salesController');
const purchaseController = require('../controllers/purchaseController');
const deliveryController = require('../controllers/deliveryController');
const reportController = require('../controllers/reportController');
const inventoryController = require('../controllers/inventoryController');

const { isPrivate, isAdmin, isSales, isPurchasing, isLogistics } = require('../middlewares/checkAuth');
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
router.get('/MonthlyPurchaseperProduct', (req,res) => {
	res.render('MonthlyPurchaseperProduct', {
		reports:true,
		purchaseReports: true,
	});
})
router.get('/AverageDailyPurchase', (req,res) => {
	res.render('AverageDailyPurchase', {
		reports:true,
		purchaseReports: true,
	});
})
router.get("/LogiReport1", (req,res) => {
	res.render("logistics_purchase_report",{
		reports : true
	});
});
router.get("/LogiReport2", (req,res) => {
	res.render("logistics_sales_report",{
		reports : true
	});
});
//Inventory
router.get('/inventory', isPrivate, inventoryController.getProductInventory);
router.get('/product_catalogue', isPrivate, inventoryController.getProductCatalogue);
router.get('/change_price', isPrivate, inventoryController.getProductName);
router.post('/change_price', isPrivate, inventoryController.changeProductPrice);
router.get('/manual_count', isPrivate, inventoryController.getProductNameForManualCount);


//Sales
router.get('/create_sales', isSales, salesController.getSaleOrderForm);
router.post('/create_sales', isSales, salesController.createSaleRecord);
router.post('/void_sales/:dr', isSales, salesController.voidSales);
router.get('/view_payments', isSales, salesController.getPaymentsPage);
router.post('/submit_payment', isSales, salesController.postPaymentForm);
router.get('/track_sale_orders', isSales, salesController.getTrackOrdersPage);
router.get('/changeSaleCalendar', isSales, salesController.changeCalendar);
router.get('/view_sales_records', isSales, salesController.getSalesRecords);
router.get('/view_sales_details/:dr', isSales, salesController.viewSalesDetails);

//Purchasing
router.get('/track_purchase_orders', isPurchasing, purchaseController.getTrackOrdersPage);
router.post('/void_purchases/:lo', isPurchasing, purchaseController.voidPurchase);
router.get('/changePurchaseCalendar', isPurchasing, purchaseController.changeCalendar);
router.get('/view_purchase_records', isPurchasing, purchaseController.getPurchaseRecords);
router.get('/view_purchase_details/:lo', isPurchasing, purchaseController.viewPurchaseDetails);

//router.get('/view_purchase_records', isPurchasing, purchaseController.getAllPurchases);
router.get('/create_purchase', isPurchasing, purchaseController.getCreatePurchase);
router.post('/create_purchase', isPurchasing, purchaseController.postCreatePurchase);
router.get('/get_price', isPurchasing, purchaseController.getPrice);
//Logistics
router.get('/schedule_delivery', isLogistics, deliveryController.scheduleDelivery);
router.post('/schedule_delivery', isLogistics, deliveryController.updateDelivery);
router.get('/ajaxChangeDeliveryInfo', isLogistics, deliveryController.getSingleDeliveryInfo);
router.get('/ajaxChangeDriver', isLogistics, deliveryController.ajaxChangeDriver);
router.get('/confirm_delivery', isLogistics, deliveryController.getConfirmDelivery);
router.post('/confirm_delivery', isLogistics, deliveryController.updateDelivery);
router.get('/track_deliveries', isLogistics, deliveryController.getTrackDelivery);
router.get('/changeLogisticCalendar', isLogistics, deliveryController.changeCalendar);
router.get('/view_delivery_records', isLogistics, deliveryController.getDeliveryRecords);
router.get('/view_delivery_details/:id', isLogistics, deliveryController.viewDeliveryDetails);

module.exports = router;