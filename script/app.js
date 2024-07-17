'use strict';

import data from './data.js';
import { insetDessertHTML, insertCartHTML, insertModalHTML } from './markup.js';

export let dessertData = JSON.parse(JSON.stringify(data));

const cartVisibility = {
  open() {
    document.querySelector('.cart-empty').classList.add('hidden');
    document.querySelector('.cart-content').classList.remove('hidden');
  },
  close() {
    document.querySelector('.cart-empty').classList.remove('hidden');
    document.querySelector('.cart-content').classList.add('hidden');
  },
};

export function currencyFormatter(price) {
  return new Intl.NumberFormat('en-us', {
    currency: 'USD',
    style: 'currency',
  }).format(price);
}

function init() {
  const dessertItems = document.querySelectorAll('.dessert-item');
  const quantityContainer = document.querySelectorAll('.dessert-quantity');
  const addToCartBtns = document.querySelectorAll('.dessert-btn--cart');
  const quantityBtnWrappers = document.querySelectorAll('.dessert-btn--quantity-wrap');

  dessertData.map(data => (data.quantity = 0));
  console.log(dessertData);
  quantityContainer.forEach(container => (container.textContent = 0));
  dessertItems.forEach(item => item.classList.remove('selected'));
  addToCartBtns.forEach(btn => btn.classList.remove('hidden'));
  quantityBtnWrappers.forEach(btn => btn.classList.add('hidden'));

  document.querySelector('.cart-list').innerHTML = '';
  document.querySelector('.modal-list').innerHTML = '';
  document.querySelector('.cart-title > span').textContent = 0;
  cartVisibility.close();
}

function setCartQuantity() {
  const items = dessertData.filter(data => data.quantity > 0);
  const totalPrice = items.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);
  const totalQty = items.reduce((acc, cur) => acc + cur.quantity, 0);
  const listContainer = document.querySelector('.cart-list');

  if (!items.length) {
    listContainer.innerHTML = '';
    document.querySelector('.cart-title > span').textContent = 0;
    cartVisibility.close();
  }

  if (items.length) {
    listContainer.innerHTML = '';
    document.querySelector('.cart-title > span').textContent = totalQty;
    document.querySelector('.order-total').textContent = currencyFormatter(totalPrice);
    insertCartHTML(items);
    cartVisibility.open();
  }
}

function handleAddToCartButton(event) {
  const itemContainer = event.target.closest('.dessert-item');
  const id = itemContainer.dataset.id;
  const addToCartBtn = event.target.closest('.dessert-btn--cart');
  const thumbnailContainer = addToCartBtn.closest('.dessert-thumbnail');
  const quantityBtnWrapper = thumbnailContainer.querySelector('.dessert-btn--quantity-wrap');

  if (!addToCartBtn.classList.contains('hidden')) {
    const unselectedItems = dessertData.filter(data => data.id !== id);
    const selectedItem = dessertData.filter(data => data.id === id);
    addToCartBtn.classList.add('hidden');
    quantityBtnWrapper.classList.remove('hidden');
    itemContainer.classList.add('selected');
    quantityBtnWrapper.querySelector('.dessert-quantity').textContent = 1;
    selectedItem.at(0).quantity = 1;
    dessertData = [...unselectedItems, ...selectedItem];
    setCartQuantity();
  }
}

function handleQuantityBtn(event) {
  const btn = event.target.closest('.dessert-btn--quntity');

  if (!btn) return;

  const btnType = btn.dataset.action;
  const itemContainer = event.target.closest('.dessert-item');
  const id = itemContainer.dataset.id;
  const addToCartBtn = itemContainer.querySelector('.dessert-btn--cart');
  const quantityBtnWrapper = itemContainer.querySelector('.dessert-btn--quantity-wrap');
  const quantityContainer = itemContainer.querySelector('.dessert-quantity');
  const unselectedItems = dessertData.filter(data => data.id !== id);
  const selectedItem = dessertData.filter(data => data.id === id);

  if (btnType === 'increment') {
    quantityContainer.textContent = +quantityContainer.textContent + 1;
    selectedItem.at(0).quantity += 1;
  }

  if (btnType === 'decrement') {
    if (+quantityContainer.textContent === 1) {
      selectedItem.at(0).quantity = 0;
      addToCartBtn.classList.remove('hidden');
      quantityBtnWrapper.classList.add('hidden');
      itemContainer.classList.remove('selected');
    }

    if (+quantityContainer.textContent > 1) {
      quantityContainer.textContent -= 1;
      selectedItem.at(0).quantity -= 1;
    }
  }

  dessertData = [...unselectedItems, ...selectedItem];
  setCartQuantity();
}

function handleDeleteBtn(event) {
  const btn = event.target.closest('.delete-btn');

  if (!btn) return;

  const itemContainer = btn.closest('.cart-item');
  const id = itemContainer.dataset.id;
  const unselectedItems = dessertData.filter(data => data.id !== id);
  const selectedItem = dessertData.filter(data => data.id === id);
  const dessertItem = document.querySelector(`.dessert-item[data-id="${id}"]`);

  dessertItem.querySelector('.dessert-quantity').textContent = 0;
  dessertItem.querySelector('.dessert-btn--cart').classList.remove('hidden');
  dessertItem.querySelector('.dessert-btn--quantity-wrap').classList.add('hidden');
  dessertItem.classList.remove('selected');
  selectedItem.at(0).quantity = 0;
  dessertData = [...unselectedItems, ...selectedItem];
  setCartQuantity();
}

function handleConfirmBtn() {
  document.querySelector('.modal').showModal();
  setModalList();
}

function setModalList() {
  const selectedItems = dessertData.filter(data => data.quantity > 0);
  const totalPrice = selectedItems.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);
  document.querySelector('.modal-list').innerHTML = '';
  insertModalHTML(selectedItems, totalPrice);
}

function handleFormSubmitBtn(event) {
  event.preventDefault();
  init();
  document.querySelector('.modal form').submit();
}

function attachEventListeners(className, event, fn) {
  const containers = document.querySelectorAll(`.${className}`);
  containers.forEach(container => container.addEventListener(event, fn));
}

insetDessertHTML();

attachEventListeners('dessert-btn--cart', 'click', handleAddToCartButton);
attachEventListeners('dessert-btn--quantity-wrap', 'click', handleQuantityBtn);
attachEventListeners('cart-container', 'click', handleDeleteBtn);
attachEventListeners('confirm-btn', 'click', handleConfirmBtn);
attachEventListeners('modal form', 'submit', handleFormSubmitBtn);
