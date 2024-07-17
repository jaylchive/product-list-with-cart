'use strict';

import { currencyFormatter, dessertData } from './app.js';

function generateDessertMarkup(data) {
  return `
    <li class="dessert-item" data-id="${data.id}">
      <div class="dessert-thumbnail">
        <img src="${data.image.desktop}" alt="${data.name}" />
        <button class="dessert-btn--cart">
          <img src="./assets/images/icon-add-to-cart.svg" alt="Add to cart icon" />
          <span>Add to Cart</span>
        </button>
        <div class="dessert-btn--quantity-wrap hidden">
          <button class="dessert-btn--quntity" data-action="decrement">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="2"
              fill="none"
              viewBox="0 0 10 2"
            >
              <path fill="currentColor" d="M0 .375h10v1.25H0V.375Z" />
            </svg>
          </button>
          <span class="dessert-quantity">0</span>
          <button class="dessert-btn--quntity" data-action="increment">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              fill="none"
              viewBox="0 0 10 10"
            >
              <path
                fill="currentColor"
                d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="dessert-info">
        <span class="dessert-category">${data.category}</span>
        <h4 class="dessert-name">${data.name}</h4>
        <span class="dessert-price">${currencyFormatter(data.price)}</span>
      </div>
    </li>`;
}

function generateCartListMarkup(data) {
  return `
    <li class="cart-item" data-id="${data.id}">
      <h5 class="cart-name">${data.name}</h5>
      <div class="cart-price-info">
        <span class="cart-quantity">x${data.quantity}</span>
        <span class="cart-price">@ ${currencyFormatter(data.price)} <span>${currencyFormatter(
    data.price * data.quantity
  )}</span></span>
      </div>
      <button class="delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
          <path
            fill="currentColor"
            d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
          />
        </svg>
      </button>
    </li>
    `;
}

function generateModalListMarkup(data) {
  return `
    <li class="modal-item">
      <img src="${data.image.thumbnail}" alt="${data.name}" />
      <h5 class="modal-name">${data.name}</h5>
      <div class="modal-info">
        <span class="modal-quantity">x${data.quantity}</span>
        <span class="modal-price">@ ${currencyFormatter(data.price)}</span>
      </div>
      <span class="modal-total">${currencyFormatter(data.price * data.quantity)}</span>
    </li>
  `;
}

function generateModalTotalMarkup(totalPrice) {
  return `
    <div class="modal-final">
      <span>Order Total</span>
      <span class="final-total">${currencyFormatter(totalPrice)}</span>
    </div>
  `;
}

function insertListHTML(listName, mainData, fn) {
  const listContainer = document.querySelector(`.${listName}-list`);
  mainData.forEach(data => listContainer.insertAdjacentHTML('beforeend', fn(data)));
}

export function insertModalHTML(cartData, totalPrice) {
  const modalListContainer = document.querySelector('.modal-list');
  insertListHTML('modal', cartData, generateModalListMarkup);
  modalListContainer.insertAdjacentHTML('beforeend', generateModalTotalMarkup(totalPrice));
}

export function insertCartHTML(cartData) {
  insertListHTML('cart', cartData, generateCartListMarkup);
}

export function insetDessertHTML() {
  insertListHTML('dessert', dessertData, generateDessertMarkup);
}
