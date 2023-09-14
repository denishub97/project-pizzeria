/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

const select = {
  templateOf: {
    menuProduct: "#template-menu-product",
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',

      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 0,
      defaultMax: 10,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };
class AmountWidget{
  constructor(element){
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value);


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

    const event = new Event('updated');
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
      const generatedHTML = templates.menuProduct(thisProduct.data);
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element);
    }
    initAccordion(){
      const thisProduct = this;

      thisProduct.accordionTrigger.addEventListener('click', function(event) {
        event.preventDefault();
        const activeProduct = document.querySelector(select.all.menuProductsActive);
         if (activeProduct !== null && activeProduct != thisProduct.element ) {
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }
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
      });
    }
    initAmountWidget() {
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      this.amountWidgetElem.addEventListener('updated', event => {
        event.preventDefault();
       // console.log(thisProduct.amountWidget.value);
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
      price *= thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = price;
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
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    }
  };


  app.init();
}