const mongoose = require("mongoose");

//User schema
const schema = mongoose.Schema;
const userSchema = new schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cart: { type: Array, default: [] },
  },
  { timestamps: true }
);

//product schema
const productSchema = new schema(
  {
    username: String,
    productName: String,
    productType: String,
    email: { type: "String" },
    price: String,
    comment: String,
    mobile: String,
    images: { type: Array },
  },
  { timestamps: true }
);

const conversationSchema = new schema(
  {
    members: { type: Array },
  },
  { timestamps: true }
);

const messageSchema = new schema(
  {
    conversationId: String,
    senderEmail: String,
    text: String,
  },
  { timestamps: true }
);

const modal = mongoose.model;
const userModal = modal("User", userSchema);
const productModal = modal("Product", productSchema);
const conversationModal = modal("conversations", conversationSchema);
const messageModal = modal("messages", messageSchema);
module.exports = {
  userModal,
  productModal,
  conversationModal,
  messageModal,
};
