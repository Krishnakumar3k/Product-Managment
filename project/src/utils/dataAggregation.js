function aggregateQuantities(data) {
  return Object.values(data.reduce((acc, item) => {
    const key = `${item.price}-${item.option}`;
    
    if (!acc[key]) {
      acc[key] = {
        price: item.price,
        quantity: 0,
        option: item.option
      };
    }
    
    acc[key].quantity += item.quantity;
    return acc;
  }, {}));
}

// Test the function
const testData = [
  { price: 20, quantity: 25, option: "yes" },
  { price: 12, quantity: 25, option: "yes" },
  { price: 20, quantity: 25, option: "yes" },
  { price: 15, quantity: 25, option: "yes" },
  { price: 15, quantity: 5, option: "yes" }
];

const result = aggregateQuantities(testData);
console.log(result);

module.exports = { aggregateQuantities };