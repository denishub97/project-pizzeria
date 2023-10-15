import { settings, select, classNames, templates } from '../settings.js';
import CartProduct from './CartProduct.js';
import utils from '../utils.js';

 class Cart{
    constructor(element){
      const thisCart = this;

      thisCart.products = [];
      thisCart.getElements(element);
      this.initActions();

    }

    getElements(element){
      const thisCart = this;


      thisCart.dom = {
        wrapper: element,
        toogleTrigger: element.querySelector(select.cart.toggleTrigger),
        productList: element.querySelector(select.cart.productList),
        deliveryFee: element.querySelector(select.cart.deliveryFee),
        subtotalPrice: element.querySelector(select.cart.subtotalPrice),
        totalPrice: element.querySelectorAll(select.cart.totalPrice),
        totalNumber: element.querySelector(select.cart.totalNumber),
        form: element.querySelector(select.cart.form),
        address: element.querySelector(select.cart.address),
        phone: element.querySelector(select.cart.phone),


      };
    }

    initActions(){
      const thisCart = this;
      thisCart.dom.toogleTrigger.addEventListener('click', event =>{
        event.preventDefault();
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
      thisCart.dom.productList.addEventListener('updated', () =>{
        thisCart.update();
      });
        thisCart.dom.productList.addEventListener('remove', event =>{
        thisCart.remove(event.detail.cartProduct);
      });
      this.dom.form.addEventListener('submit', event => {
        event.preventDefault();
        thisCart.sentOrder();
      });
     }

    add(menuProduct){
      const thisCart = this;
      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      thisCart.dom.productList.appendChild(generatedDOM);
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      this.update();
    }

    update(){
      this.deliveryFee = settings.cart.defaultDeliveryFee;
      this.totalNumber = 0;
       this.subtotalPrice = 0;

      for (let signleProduct of this.products){
        this.totalNumber += signleProduct.amount;
        this.subtotalPrice += signleProduct.price;
      }

      if (!this.products.length) {
        this.deliveryFee = 0;
      }

      this.totalPrice = this.subtotalPrice + this.deliveryFee;
      this.dom.deliveryFee.innerHTML = this.deliveryFee;
      this.dom.totalNumber.innerHTML = this.totalNumber;
      this.dom.subtotalPrice.innerHTML = this.subtotalPrice;

      for (let singleTotalPrice of this.dom.totalPrice) {
        singleTotalPrice.innerHTML = this.totalPrice;
      }
    }

    remove(productToRemove) {
      productToRemove.dom.wrapper.remove();
      const indexToRemove = this.products.indexOf(productToRemove);
      this.products.splice(indexToRemove, 1);
      this.update();
    }

    sentOrder() {
    const thisCart = this;
    const url = `${settings.db.url}/${settings.db.orders}`;

     const payload = {
        address: this.dom.address.value,
        phone: this.dom.phone.value,
        totalPrice: this.totalPrice,
        subtotalPrice: this.subtotalPrice,
        totalNumber: this.totalNumber,
        deliveryFee: this.deliveryFee,
        products: [],
      };
      for(let prod of thisCart.products) {
        payload.products.push(prod.getData());
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      fetch(url, options)
        .then(function(response){
          return response.json();
        }).then(function(parsedResponse){
          console.log('paresedResponse', parsedResponse);
        })

    }

  }
  export default Cart;