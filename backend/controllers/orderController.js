const { Order, Product } = require('../models');
const { validateOrder } = require('../validation/orderValidation');
const { Op } = require('sequelize');

exports.createOrder = async (req, res) => {
  const buyerName = req.body.buyerName || (req.body.buyer && req.body.buyer.name);
  const buyerPhone = req.body.buyerPhone || (req.body.buyer && req.body.buyer.phone);

  const orderPayload = {
    buyerName,
    buyerPhone,
    items: req.body.items,
    totalAmount: req.body.totalAmount,
    paymentMethod: req.body.paymentMethod || 'cash',
    receiptImage: req.body.receiptImage,
    address: req.body.address,
    comment: req.body.comment,
    status: req.body.status || 'Yangi',
  };

  const { error } = validateOrder(orderPayload);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const order = await Order.create(orderPayload);
    res.status(201).send(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const { orderIds, phone } = req.body;
    const userPhone = phone || (req.user && req.user.phone);

    const conditions = [];
    if (orderIds && Array.isArray(orderIds) && orderIds.length > 0) {
      conditions.push({ id: orderIds });
    }
    if (userPhone) {
      conditions.push({ buyerPhone: userPhone });
    }

    if (conditions.length === 0) {
      return res.status(200).send([]);
    }

    const orders = await Order.findAll({
      where: conditions.length === 1 ? conditions[0] : { [Op.or]: conditions },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getMySales = async (req, res) => {
  try {
    const myPhone = req.user.phone;
    const myProducts = await Product.findAll({ where: { creatorPhone: myPhone } });
    const myProductIds = myProducts.map(p => p.id);
    
    if (myProductIds.length === 0) {
      return res.status(200).send([]);
    }

    const allOrders = await Order.findAll({ order: [['createdAt', 'DESC']] });
    
    const mySales = [];
    allOrders.forEach(order => {
      const myItems = order.items.filter(item => {
        const itemId = item.originalId || item.id;
        return myProductIds.includes(itemId);
      });
      
      if (myItems.length > 0) {
        const sellerOrder = {
          ...order.toJSON(),
          items: myItems,
          totalAmount: myItems.reduce((acc, item) => {
            const price = parseFloat(String(item.price).replace(/\D/g, '')) || 0;
            return acc + (price * item.quantity);
          }, 0)
        };
        mySales.push(sellerOrder);
      }
    });

    res.status(200).send(mySales);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).send('Order not found');

    if (order.status !== 'Bekor qilingan') {
      order.status = 'Bekor qilingan';
      await order.save();
    }
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).send('Order not found');
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) return res.status(404).send('Order not found');

    order.status = status;
    
    // If marked as 'Sotildi', deduct from stock
    if (status === 'Sotildi') {
      for (let item of order.items) {
        if (item.originalId) {
          const product = await Product.findByPk(item.originalId);
          if (product) {
            if (item.size && product.sizes && product.sizes.length > 0) {
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
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).send('Order not found');

    const data = order.toJSON();
    await order.destroy();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
