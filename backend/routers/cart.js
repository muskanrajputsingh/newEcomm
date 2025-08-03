const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

// POST: Add to cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    const existingCartItem = await Cart.findOne({ productId });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      return res.status(200).json({ message: 'Cart updated', item: existingCartItem });
    }

    const newCartItem = new Cart({ productId, quantity });
    await newCartItem.save();

    res.status(201).json({ message: 'Item added to cart', item: newCartItem });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT: Change quantity for a product in the cart
router.put('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cartItem = await Cart.findOne({ productId });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: 'Quantity updated', item: cartItem });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE: Remove from cart by productId
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const deletedItem = await Cart.findOneAndDelete({ productId });

    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    res.status(200).json({ message: 'Item removed from cart', item: deletedItem });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Fetch all cart items with product details
router.get('/', async (req, res) => {
  try {
    const cartItems = await Cart.find().populate('productId');
    res.status(200).json({ cart: cartItems });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

module.exports = router;
