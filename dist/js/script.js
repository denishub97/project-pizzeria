const select = {
  templateOf: {
    menuProduct: '#template-menu-product',
    cartProduct: '#template-cart-product', // CODE ADDED
  },
  containerOf: {
    menu: '#product-list',
    cart: '#cart',
  },
  all: {
    menuProducts: '#product-list > .product',
    menuProductsActive: '#product-list > .product.active',
    formInputs: 'input, select',
  },
  menuProduct: {
    clickable: '.product__header',
    form: '.product__order',
    priceElem: '.product__total-price .price',
    imageWrapper: '.product__images',
    amountWidget: '.widget-amount',
    cartButton: '[href="#add-to-cart"]',
  },
  widgets: {
    amount: {
      input: 'input.amount', // CODE CHANGED
      linkDecrease: 'a[href="#less"]',
      linkIncrease: 'a[href="#more"]',
    },
  },
  // CODE ADDED START
  cart: {
    productList: '.cart__order-summary',
    toggleTrigger: '.cart__summary',
    totalNumber: `.cart__total-number`,
    totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
    subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
    deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
    form: '.cart__order',
    formSubmit: '.cart__order [type="submit"]',
    phone: '[name="phone"]',
    address: '[name="address"]',
  },
  cartProduct: {
    amountWidget: '.widget-amount',
    price: '.cart__product-price',
    edit: '[href="#edit"]',
    remove: '[href="#remove"]',
  },
  // CODE ADDED END
};

const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },
  cart: {
    wrapperActive: 'active',
  },
};

const settings = {
  amountWidget: {
    defaultValue: 1,
    defaultMin: 1,
    defaultMax: 10,
  },
  cart: {
    defaultDeliveryFee: 20,
  },
};

const templates = {
  menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
};
  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.initAccordion();
    }
processOrder() {
  const thisProduct = this;

  const formData = utils.serializeFormToObject(thisProduct.form);
  console.log('formData', formData);

  let price = thisProduct.data.price;

  for(let paramId in thisProduct.data.params) {
    const param = thisProduct.data.params[paramId];
    console.log(paramId, param);

    for(let optionId in param.options) {
      const option = param.options[optionId];
      console.log(optionId, option);
    }
  }
  thisProduct.priceElem.innerHTML = price;
}
    renderInMenu() {
      const thisProduct = this;

      const view = templates.menuProduct(thisProduct.data);
      thisProduct.element = utils.createDOMFromHTML(view);

      thisProduct.productsList = document.querySelector('.product-list');
      thisProduct.productsList.appendChild(thisProduct.element);
    }
getElements(){
  const thisProduct = this;

  thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
  thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
  thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
  thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
  thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
}
    initAccordion() {
      const thisProduct = this;

      thisProduct.element.querySelector('.product__header').addEventListener("click", function(event) {
        event.preventDefault();

        const activeProduct = document.querySelector('.product.active');
        if (activeProduct && activeProduct !== thisProduct.element) {
          activeProduct.classList.remove('active');
        }

        thisProduct.element.classList.toggle('active');
      });
    }
  }
  class Cart{
    constructor(element){
      const thisCart = this;

      thisCart.products = [];

      thisCart.getElements(element);

      console.log('new Cart', thisCart);
    }
  getElements(element){
    const thisCart = this;

    this.dom = {};

    thisCart.dom.wrapper = element;
  }}
  const app = {
    initData: function () {
      const thisApp = this;
      thisApp.data = dataSource;
    },
    initMenu() {
      const thisApp = this;
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    init: function () {
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp,cart = new Cart(cartElem);
    }
  };

  app.init();
}