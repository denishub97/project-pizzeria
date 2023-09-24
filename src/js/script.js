{const select = {
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

class AmountWidget{
  constructor(element){
    const thisWidget = this;
    thisWidget.getElements(element);

    if (thisWidget.input.value === '' || thisWidget.input.value === undefined ) {
      thisWidget.setValue(settings.amountWidget.defaultValue)
  } else {
      thisWidget.setValue(thisWidget.input.value);
  }

    thisWidget.initActions();

  }
  getElements(element){
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    thisWidget.defaultMin = (settings.amountWidget.defaultMin);
    thisWidget.defaultMax = (settings.amountWidget.defaultMax);
  }

  setValue(value){
    const thisWidget = this;
     let newValue = parseInt(value);

    if( thisWidget.value !== newValue && !isNaN(newValue)) {
      if (newValue <= thisWidget.defaultMin){
        newValue =  thisWidget.defaultMin;

      } if(newValue >= thisWidget.defaultMax){
        newValue = thisWidget.defaultMax;
      }
      thisWidget.value = newValue;
    }
      thisWidget.announce();
      thisWidget.input.value = thisWidget.value;

  }
  initActions(){
    const thisWidget = this;
    thisWidget.input.addEventListener('change', function(event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.input.value);
    });
      thisWidget.linkDecrease.addEventListener('click', function(value){
        value.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);

        });
        thisWidget.linkIncrease.addEventListener('click', function(value){
          value.preventDefault();
          thisWidget.setValue(thisWidget.value + 1);

          });
  }
  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated',
    thisWidget.element.dispatchEvent(event);
    }
  }


  class Product{
    constructor(id, data){
      const thisProduct = this;

      this.id = id;
      this.data = data;


      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
    }
    getElements(){
      const thisProduct = this;
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }
    renderInMenu(){
      const thisProduct = this;
      //
      /* [DONE]generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);
      /*[DONE] create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /*[DONE] find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      /*[DONE] add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }
    initAccordion(){
      const thisProduct = this;

      /* [DONE]find the clickable trigger (the element that should react to clicking) -!NO NEEDED ANYMORE */
      /*[DONE]START: add event listener to clickable trigger on event click */
      thisProduct.accordionTrigger.addEventListener('click', function(event) {
        /* prevent default action for event */
        event.preventDefault();
        /*[DONE] find active product (product that has active class) */
        const activeProduct = document.querySelector(select.all.menuProductsActive);
        /* if there is active product and it's not thisProduct.element, remove class active from it */
         /* if there is active product and it's not thisProduct.element, remove class active from it */
         if (activeProduct !== null && activeProduct != thisProduct.element ) {
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }
        /* toggle active class on thisProduct.element */
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
      });
    }

    initOrderForm(){
      const thisProduct = this;
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });

      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }
    initAmountWidget() {
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      this.amountWidgetElem.addEventListener('updated', event => {
        event.preventDefault();
        
        this.processOrder();
      
      });
    }
    processOrder() {
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      let price = thisProduct.data.price;
      for(let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];

        for(let optionId in param.options) {
          const option = param.options[optionId]
          const optionImage = thisProduct.imageWrapper.querySelector(`.${paramId}-${optionId}`);
          if (optionImage != null) {
            optionImage.classList.remove(classNames.menuProduct.imageVisible);
          }
      let optionSelected = formData[paramId] && formData[paramId].includes(optionId);

    if(optionSelected) {
      if(!option.default){
      price += option.price;
      }
    if(optionImage){
      optionImage.classList.add(classNames.menuProduct.imageVisible);
    }
  } else if (option.default) {
      price -= option.price;
      if (optionImage) {
        optionImage.classList.remove(classNames.menuProduct.imageVisible);
      }
    }
  }
}
      this.priceSingle = price;
      this.amount = thisProduct.amountWidget.value;
      this.name = thisProduct.name;

      price *= thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = price;
    }

  
    prepareCartProductParams() {
      const thisProduct = this;

      const formData = utils.serializeFormToObject(thisProduct.form);
      const params = {};

      for(let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];

        params[paramId] = {
          label: param.label,
          options: {}
        }

        for(let optionId in param.options) {
          const option = param.options[optionId];
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

          if(optionSelected) {
            params[paramId].options[optionId] = option.label;
          }
        }
      }

      return params;
    }

     preparateCartProduct(){
      const productSummary = {
        id: this.id,
        name: this.data.name,
        amount: this.amount,
        priceSingle: this.priceSingle,
        price: this.priceSingle * this.amountWidget.value,
        params: this.prepareCartProductParams(),

      };
      console.log(productSummary.params);
      console.log(productSummary);
      return productSummary;
    }


    addToCart(){
      const thisProduct = this;
      app.cart.add(thisProduct.preparateCartProduct());
    }
  }

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
        deliveryFree: element.querySelector(select.cart.deliveryFee),
        subtotalPrice: element.querySelector(select.cart.subtotalPrice),
        totalPrice: element.querySelectorAll(select.cart.totalPrice),
        totalNumber: element.querySelector(select.cart.totalNumber)

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
  }

  class CartProduct {
    constructor(menuProduct, element) {
      this.id = menuProduct.id;
      this.name = menuProduct.name;
      this.amount = menuProduct.amount;
      this.priceSingle = menuProduct.priceSingle;
      this.price = menuProduct.price;
      this.paramsOnlyIds = menuProduct.paramsOnlyIds;
      this.id = menuProduct.id;

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
    }

  }
  

  const app = {
      initData: function(){
        const thisApp = this;
        thisApp.data = dataSource;
      },
      initMenu(){
        const thisApp = this;
        for (let productData in thisApp.data.products) {
          new Product(productData, thisApp.data.products[productData]);
        }
      },

      initCart: function(){
        const thisApp = this;

        const cartElem = document.querySelector(select.containerOf.cart);
        thisApp.cart = new Cart(cartElem);
      },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    }
  };


  app.init();
}