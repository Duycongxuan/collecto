import { AddressController } from '../controllers/address.controller';
import { Router } from 'express';
import { AuthMiddleWare } from '../middlewares/auth.middleware';

const router = Router();
const controller = new AddressController();
const authMiddleware = new AuthMiddleWare();

// All address routes require user authentication.
router.use(authMiddleware.authenticate);

// GET / - Get all addresses.
router.get('/', controller.getAllAddresses);

// GET /:id - Get a single address.
router.get('/:id', controller.getAddressById);

// POST / - Create a new address.
router.post('/', controller.createAddress);

// PUT /:id - Update an address.
router.put('/:id', controller.updateAddress);

// PATCH /:id/default - Set an address as default.
router.patch('/:id/default', controller.setDefaultAddress);

// DELETE /:id - Delete an address.
router.delete('/:id', controller.deleteAddress);

export { router as addressRoute };