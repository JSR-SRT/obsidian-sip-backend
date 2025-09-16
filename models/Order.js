// import 'Schema' และ 'model' จาก Mongoose เพื่อสร้าง Schema และ Model
// และ import 'mongoose' สำหรับใช้กำหนด Reference
import { Schema, model, mongoose } from "mongoose";

// สร้าง Schema หรือโครงสร้างข้อมูลสำหรับ Order (คำสั่งซื้อ)
const OrderSchema = new Schema(
  {
    //Field Order Number เป็นข้อมูลแบบข้อความ (String) ต้องมีข้อมูลนี้ (Required) และ ห้ามมีข้อมูลซ้ำกันใน collection
    orderNumber: { type: String, required: true, unique: true },

    // 'type: String' หมายถึงเป็นข้อมูลแบบข้อความ
    // 'required: true' หมายถึงต้องมีข้อมูลนี้
    // 'unique: true' หมายถึงห้ามมีข้อมูลซ้ำกันใน collection
    customerInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      email: { type: String, required: true },
    },

    basketItems: [
      {
        // 'productId' คือ ID ของสินค้าในตะกร้า
        // 'mongoose.Schema.Types.ObjectId' หมายถึงเป็นค่าที่เป็น ObjectId ของ MongoDB
        // 'ref: "products"' หมายถึงอ้างอิงไปที่ collection 'products'
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "products"}, 
        // เก็บ snapshot ของชื่อสินค้า ณ เวลาที่สั่งซื้อ เพื่อไม่ให้ข้อมูลเปลี่ยนไปถ้าภายหลังชื่อสินค้าใน collection 'products' ถูกแก้ไข
        name: { type: String, required: true },
        // 'price' คือราคาต่อหน่วย (ต้องมี) เก็บ snapshot ของราคา เพื่อไม่ให้ข้อมูลเปลี่ยนไปถ้าหากว่าภายหลังราคาสินค้าถูกแก้ไข
        price: { type: Number, required: true },
        // 'quantity' คือจำนวนสินค้า (ต้องมี) และต้องมีค่าอย่างน้อย 1
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    orderType: {
      type: String,
      // 'enum' คือการกำหนดว่าค่าที่รับได้ต้องเป็นหนึ่งในตัวเลือกที่กำหนดเท่านั้น
      enum: ["dinein", "pickup", "delivery"],
      required: true,
    },

    //"N/A" คือค่าเริ่มต้น ถ้าไม่ได้ระบุ address
    address: { type: String, default: "N/A" },
    // 'subtotal' คือราคารวมของสินค้าทั้งหมดก่อนค่าจัดส่ง
    subtotal: { type: Number, required: true },
    // ค่าจัดส่ง 'default: 0' คือค่าเริ่มต้นเป็น 0
    deliveryFee: { type: Number, default: 0 },
    // 'total' คือราคารวมทั้งหมด (subtotal + deliveryFee)
    total: { type: Number, required: true },
    // 'note' คือข้อความเพิ่มเติมจากลูกค้า set default: "" คือมีค่าเริ่มต้นเป็นข้อความว่าง
    note: { type: String, default: "" },
    

    // 'user' คือ ID ของผู้ใช้ที่ทำการสั่งซื้อ
    // 'Schema.Types.ObjectId' หมายถึงเป็นค่าที่เป็น ObjectId ของ MongoDB
    // 'ref: "User"' หมายถึงอ้างอิงไปที่ collection 'users'
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
  },
  // { timestamps: true } คือการบอก Mongoose ให้สร้างฟิลด์ 'createdAt' และ 'updatedAt' ให้ auto
  // 'createdAt' คือเวลาที่สร้างข้อมูล และ 'updatedAt' คือเวลาที่อัปเดตข้อมูลล่าสุด
  { timestamps: true }
);

// สร้าง Model ชื่อ 'Order' จาก OrderSchema
// ซึ่งเป็น Object ที่ใช้สำหรับจัดการข้อมูลใน collection 'orders' ของ MongoDB
export const Order = model("Order", OrderSchema);



