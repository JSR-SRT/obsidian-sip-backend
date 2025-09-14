import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
} from "./controllers/ordersController.js";
import { authUser } from "../middleware/auth.js";

const router = express.Router();

// POST → create order
// เรียกใช้ตอนที่ User ยืนยันการสั่งซื้อ (กดปุ่ม "Place Order" ที่หน้า Checkout)
// รับข้อมูล ต่างๆ จาก frontend และ บันทึกเป็น order ใหม่ ลงใน MongoDB
// Response Status 201 Created และข้อมูล order ที่เพิ่งสร้าง
router.post("/", authUser, createOrder);


// GET → all orders ของ user
// ใช้ตอนที่ frontend หน้า My Orders ต้องการ ดึงรายการ order ทั้งหมดของ user ที่กำลัง login อยู่
// ทำการหา order ทั้งหมดใน DB ที่ userId = user ที่ login อยู่
router.get("/", authUser, getUserOrders);

// GET → single order
// ใช้ตอนที่ frontend ต้องการ ดูรายละเอียด order เดียว
// หลังจากที่ User กดปุ่ม "Place Order" ที่หน้า Checkout → จะเรียก api เส้นนี้เพื่อดึงข้อมูล order ที่เพิ่งสร้างมาแสดงผล ที่หน้า Order Confirmation
router.get("/:orderId", authUser, getOrderById);

export default router;
