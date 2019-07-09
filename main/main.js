'use strict';

function printReceipt(inputs) {
  const allItems = loadAllItems();
  const targetItems = inputs
    .map(barcode => findItemByBarcode(barcode, allItems))
    .filter(item => item !== undefined);

  const parsedItems = mergeAndParseItems(targetItems);
  const totalPrice = calculateTotalPrice(parsedItems);

  const receiptString = formatToReceipt(parsedItems, totalPrice);
  printOut(receiptString);
}

function printOut(message) {
  console.log(message);
}

function formatToReceipt(items, totalPrice) {
  const formatSingleItem = ({ name, count, unit, price, total }) =>
    `名称：${name}，数量：${count}${unit}，单价：${price.toFixed(2)}(元)，` +
    `小计：${total.toFixed(2)}(元)\n`;

  const itemListView = items.map(item => formatSingleItem(item)).join('');

  return '***<没钱赚商店>收据***\n' +
    `${itemListView}` +
    '----------------------\n' +
    `总计：${totalPrice.toFixed(2)}(元)\n` +
    '**********************';
}

function calculateTotalPrice(items) {
  return items.reduce((totalPrice, { total }) => totalPrice + total, 0.00);
}

function mergeAndParseItems(originalItems) {
  let hash = {};

  originalItems.forEach(({ barcode, price, ...otherProps }) => {
    const nextCount = hash[barcode] ? hash[barcode].count + 1 : 1;
    hash[barcode] = {
      barcode,
      price: price,
      count: nextCount,
      total: price * nextCount,
      ...otherProps,
    }
  });

  return Object.values(hash);
}

function findItemByBarcode(barcode, storage) {
  return storage.find(item => barcode === item.barcode);
}