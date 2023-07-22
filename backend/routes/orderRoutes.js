import express from "express";
import {
  addOrderItems,
  getOrderById,
  updateOrderTOPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders
} from "../controllers/orderController.js";
const router = express.Router();
import { admin, protect } from "../middleware/authMiddleware.js"

router.route("/").get(protect, admin, getOrders).post(protect, addOrderItems);
router.route("/mine").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderTOPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;