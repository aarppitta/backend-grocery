import express from "express";
import addressRoute from "./address-route.js";
import userRoute from "./user-route.js";
import productRoute from "./product-route.js";
import orderRoute from "./order-route.js";
import contactRoute from "./contact-route.js";
import cartRouter from "./cart-route.js";
import categoryRoute from "./category-route.js";
import paymentRoute from "./payment-route.js";
import wishlistRoute from "./wishlist-route.js";

const route = express();

route.use("/user/address", addressRoute );
route.use("/user", userRoute );
route.use("/product", productRoute );
route.use("/order", orderRoute );
route.use("/contact", contactRoute );
route.use("/cart", cartRouter );
route.use("/category", categoryRoute);
route.use("/payment", paymentRoute);
route.use("/wishlist", wishlistRoute);

export default route;
