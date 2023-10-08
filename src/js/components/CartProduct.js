import { select } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class CartProduct {
    constructor(menuProduct, element) {
      this.id = menuProduct.id;
      this.name = menuProduct.name;
      this.amount = menuProduct.amount;
      this.priceSingle = menuProduct.priceSingle;
      this.price = menuProduct.price;
      this.params = menuProduct.params;
      this.getElements(element);
      this.initAmountWidget(this.amount);
      this.initActions();
    }

    getElements(element) {
      this.dom = {
        wrapper: element,
        amountWidget: element.querySelector(select.cartProduct.amountWidget),
        price: element.querySelector(select.cartProduct.price),
        edit: element.querySelector(select.cartProduct.edit),
        remove: element.querySelector(select.cartProduct.remove),
      };
    }

    initAmountWidget(amount) {
      this.amountWidget = new AmountWidget(this.dom.amountWidget);
      this.amountWidget.setValue(amount);

      this.dom.amountWidget.addEventListener('updated', event => {
        event.preventDefault();
        const amount = this.amountWidget.value;
        const price = this.priceSingle;
        this.amount = amount;
        this.price = amount * price;
        this.dom.price.innerHTML = price * amount;
      });
    }

    initActions() {
      this.dom.edit.addEventListener('click', event => {
        event.preventDefault();
      });

      this.dom.remove.addEventListener('click', event => {
        event.preventDefault();

        console.log('removed');
        this.remove();
      });
    }

    remove() {
      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: this,
        },
      });
      this.dom.wrapper.dispatchEvent(event);
    }

    getData() {
      return {
        name: this.id,
        amount: this.amount,
        price: this.price,
        priceSingle: this.priceSingle,
        params: this.params,
      }
    }

  }
  export default CartProduct;