import Order from "../models/Order.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: "Cart is empty" });
    }
    if (!address) {
      return res.status(400).json({ success: false, error: "Address is required" });
    }

    const order = await Order.create({
      user_id: req.user.id, // ✅ user id from auth middleware
      items,
      address,
    });

    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Order create error:", err);
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
};

// Get all orders of the logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.getByUser(req.user.id);
    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Fetch orders error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch orders" });
  }
};

// Update order status (for admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    const updated = await Order.updateStatus(id, status);
    res.json({ success: true, updated });
  } catch (err) {
    console.error("❌ Update order status error:", err);
    res.status(500).json({ success: false, error: "Failed to update order" });
  }
};


// Get all orders (for admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Fetch all orders error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch all orders" });
  }
};
