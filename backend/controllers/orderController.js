const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { buyer, items, totalAmount, address, comment } = req.body;

    const order = await Order.create({
      buyerName: buyer.name,
      buyerPhone: buyer.phone,
      items,
      totalAmount,
      address,
      comment
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const { orderIds } = req.body;
    if (!orderIds || !Array.isArray(orderIds)) {
      return res.status(400).json({ message: "No orderIds provided" });
    }
    const orders = await Order.findAll({
      where: {
        id: orderIds
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      if (order.status !== 'Bekor qilingan') {
        order.status = 'Bekor qilingan';
        await order.save();
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (order) {
      order.status = status;
      
      // If marked as 'Sotildi', deduct from stock
      if (status === 'Sotildi') {
        for (let item of order.items) {
          if (item.originalId) {
            const product = await Product.findByPk(item.originalId);
            if (product) {
              if (item.size && product.sizes && product.sizes.length > 0) {
                // Since sizes is JSON, we must copy it, update it, and set it back
                const sizes = [...product.sizes];
                const sizeObjIndex = sizes.findIndex(s => s.size === item.size);
                if (sizeObjIndex !== -1) {
                  sizes[sizeObjIndex].stock = Math.max(0, parseInt(sizes[sizeObjIndex].stock || 0) - item.quantity).toString();
                  product.sizes = sizes;
                }
              } else {
                product.stock = Math.max(0, parseInt(product.stock || 0) - item.quantity).toString();
              }
              await product.save();
            }
          }
        }
      }

      await order.save();
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      await order.destroy();
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
