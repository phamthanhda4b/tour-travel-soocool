const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');
const userController = require('../controllers/userController');
const tourController = require('../controllers/tourController');
const paymentController = require('../controllers/paymentController');
const provinceController = require('../controllers/provinceController');
const authController = require('../controllers/authController');
const customerController = require('../controllers/customerController');
const slideController = require('../controllers/slideController');
const uploadSlide = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');

const initAPIs = (app) => {
  router.get('/transports', transportController.handleGetValues);
  router.post('/transports', transportController.handleCreate);
  router.get(
    '/users-top',
    authMiddleware.validateAPI,
    authMiddleware.authorizationAPIAdmin,
    userController.handleGetTopUser
  );
  router.get(
    '/tours',
    authMiddleware.validateAPI,
    authMiddleware.authorizationAPIAdmin,
    tourController.handleGetTourType
  );
  router.get('/tours/:id', tourController.handleGetTourDetail);
  router.get(
    '/users/:id',
    authMiddleware.validateAPI,
    authMiddleware.authorizationAPI,
    userController.handleGetInfo
  );
  router.get('/provinces', provinceController.handleGetAll);
  // Post tour
  router.post(
    '/tour-order',
    authMiddleware.validateAPI,
    authMiddleware.authorizationAPI,
    tourController.handleOrderTour
  );
  router.post(
    '/payment',
    authMiddleware.validateAPI,
    authMiddleware.authorizationAPI,
    paymentController.handleCreateOrder
  );
  router.post('/auth/login', authController.handleLogin);
  router.post('/auth/logout', (req, res) => {
    res.clearCookie('SessionID', { path: '/' });
    res.status(200).json({
      message: 'OK',
    });
  });
  router.put(
    '/users/:id',
    authMiddleware.validateAPI,
    authMiddleware.authorizationAPI,
    validateMiddleware.validateDataUser,
    userController.handleUpdateInfo
  );
  router.put(
    '/customer/orders/:orderId/cancel',
    authMiddleware.validateAPI,
    authMiddleware.authorizationAPI,
    customerController.handleCancelOrder
  );

  // APIs Quản lý Banner / Slide
  router.get('/slides', slideController.handleGetActiveSlides);
  router.get(
    '/admin/slides',
    authMiddleware.validateAPI,
    authMiddleware.authorizationAPIAdmin,
    slideController.handleGetAllSlides
  );
  router.get(
    '/admin/slides/:id',
    authMiddleware.validateAPI,
    authMiddleware.authorizationAPIAdmin,
    slideController.handleGetSlideById
  );
  router.post(
    '/admin/slides',
    authMiddleware.validateAPI,
    authMiddleware.authorizationAPIAdmin,
    uploadSlide.single('image_file'),
    slideController.handleCreateSlide
  );
  router.put(
    '/admin/slides/:id',
    authMiddleware.validateAPI,
    authMiddleware.authorizationAPIAdmin,
    uploadSlide.single('image_file'),
    slideController.handleUpdateSlide
  );
  router.delete(
    '/admin/slides/:id',
    authMiddleware.validateAPI,
    authMiddleware.authorizationAPIAdmin,
    slideController.handleDeleteSlide
  );
  router.patch(
    '/admin/slides/:id/toggle',
    authMiddleware.validateAPI,
    authMiddleware.authorizationAPIAdmin,
    slideController.handleToggleStatus
  );

  return app.use('/api/v1/', router);
};

module.exports = initAPIs;
