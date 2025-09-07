import Cart from "../models/Cart.js";

export const mergeCart = async (req, res) => {
  try {
    const { items, user } = req.body;

    if (!user || !user.id) {
      return res.status(401).json({ success: false, message: "User not logged in" });
    }

    const cart = await Cart.merge(user.id, items);

    res.json({ success: true, cart });
  } catch (err) {
    console.error("❌ Cart merge failed:", err);
    res.status(500).json({ success: false, error: "Cart merge failed" });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.getByUser(req.user.id);
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch cart" });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.clear(req.user.id);
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to clear cart" });
  }
};
