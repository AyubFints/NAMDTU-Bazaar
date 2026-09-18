const axios = require('axios');

async function testOrder() {
  try {
    const res = await axios.post('https://namdtu-bazaar.onrender.com/api/orders', {
      buyer: { name: 'Test', phone: '+998901234567' },
      items: [
        { originalId: 1, name: 'Test item', quantity: 1, price: '100', size: null, image: '' }
      ],
      totalAmount: 100,
      address: 'Kiritilmagan',
      comment: ''
    });
    console.log("SUCCESS:", res.data);
  } catch (error) {
    console.log("ERROR:", error.response ? error.response.data : error.message);
  }
}

testOrder();
