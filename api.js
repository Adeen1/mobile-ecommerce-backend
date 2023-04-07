const express = require("express");
const app = express();
const router = express.Router();
const {
  userModal,
  productModal,
  conversationModal,
  messageModal,
  allUserModal,
} = require("./schema");
const fileupload = require("express-fileupload");
const multer = require("multer");
const path = require("path");
router.get("/home", (req, res) => {
  res.send("home");
});

//adding product
router.post("/api/sale", async (req, res) => {
  res.header("Access-Control-Allow-Origin");
  const data = req.body;

  const newProduct = new productModal(data);
  await newProduct
    .save()
    .then(() => {
      res.status(200).send("Success");
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//show products
router.post("/api/getAllProduct", async (req, res) => {
  let filter = req.body;
  const sort = filter.sort || 0;
  const input = filter.input || "";
  const type = filter.type || "";
  var data;
  if (input && type) {
    data = await productModal.find({
      productName: { $regex: input },
      productType: type,
    });
  } else if (input) {
    data = await productModal.find({
      productName: { $regex: input },
    });
  } else if (type) {
    data = await productModal.find({
      productType: type,
    });
  } else {
    data = await productModal.find();
  }
  if (sort) {
    if (sort == "asc") {
      data.sort((a, b) => {
        return Number(a.min) - Number(b.min);
      });
    } else if (sort == "desc") {
      data.sort((a, b) => {
        return Number(b.min) - Number(a.min);
      });
    }
  }

  res.status(200).json(data);
});

//filter product

//                                            cart

//    add cart
router.post("/api/addUser", async (req, res) => {
  let { email, username } = req.body;
  let cart = [];
  let user = await userModal.findOne({ email });
  console.log(user);

  if (!user) {
    let newUser = new userModal({ email, username, cart });
    try {
      await newUser.save();
      res.status(200).send("Success");
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(200).send("User already exists");
  }
});
router.post("/api/cartadd", async (req, res) => {
  const data = req.body;
  const newUser = new userModal(data);
  let prev_data = await userModal.find({ email: data.email });

  if (prev_data.length == 0) {
    await newUser.save();
    res.status(200).send("Success : cartadd");
  } else {
    let temparr = prev_data[0].cart.filter((item) => {
      return item._id == data.cart._id;
    });
    if (temparr.length == 0) {
      let newArr = [...prev_data[0].cart, data.cart];

      await userModal.findOneAndUpdate({ email: data.email }, { cart: newArr });
      res.status(200).send("success");
    } else {
      res.status(200).send("success");
    }
  }
});
router.post("/api/getcart", async (req, res) => {
  const email = req.body.email;
  const data = await userModal.findOne({ email: email });
  console.log(data);
  res.status(200).json(data);
});

router.post("/api/getAccount", async (req, res) => {
  const email = req.body.email;
  const data = await productModal.find({ email: email });

  res.status(200).json(data);
});
router.post("/api/delProduct", async (req, res) => {
  const { email, id } = req.body;
  await productModal.deleteOne({ _id: id });
  res.status(200).send("Success");
});

//deleting an item

router.post("/api/delItem", async (req, res) => {
  const { email, id } = req.body;
  const data = await userModal.findOne({ email });
  const cart_arr = data.cart;
  const temp_Arr = cart_arr.filter((item) => {
    return item._id != id;
  });
  await userModal.updateOne({ email }, { cart: temp_Arr });
  res.status(200).send("Success");
});

// messaging  //
// 1.Conversation
// a.create Conversation
router.post("/api/chat/creatConvo", async (req, res) => {
  const newConversation = new conversationModal({
    members: [req.body.senderEmail, req.body.receiverEmail],
  });
  try {
    await newConversation.save();
    res.status(200).send("new conversation created successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});
// b. get all conversations of a user
router.get("/api/chat/getConvo/:email", async (req, res) => {
  try {
    const conversations = await conversationModal.find({
      members: { $in: [req.params.email] },
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).send(error);
  }
});
// c. check if conversation already exists
router.post("/api/chat/checkConvo", async (req, res) => {
  const { sender, receiver } = req.body;
  try {
    let conversations = await conversationModal.findOne({
      members: [sender, receiver],
    });
    conversations = await conversationModal.findOne({
      memebers: [receiver, sender],
    });
    if (conversations) {
      res.status(200).send("1");
    } else {
      res.status(200).send("0");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// 2.message
// a.add message
router.post("/api/chat/addMsg", async (req, res) => {
  const newMessage = new messageModal(req.body);
  try {
    let message = await newMessage.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).send(error);
  }
});
// b.getMessage
router.post("/api/chat/getMessage/:id", async (req, res) => {
  try {
    const messages = await messageModal.find({ conversationId: req.params.id });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
