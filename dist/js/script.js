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

  class Product {
    constructor(id, data) {
      this.id = id;
      this.data = data;
      this.renderInMenu();
      this.initAccordion();
      this.getElements();
      this.initOrderForm();
      this.getElements();
    }

    renderInMenu() {
      const generatedHTML = templates.menuProduct(this.data);
      this.element = utils.createDOMFromHTML(generatedHTML);
      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(this.element);
    }

    getElements() {
      this.accordionTrigger = this.element.querySelector(select.menuProduct.clickable);
      this.form = this.element.querySelector(select.menuProduct.form);
      this.formInputs = this.form.querySelectorAll(select.all.formInputs);
      this.cartButton = this.element.querySelector(select.menuProduct.cartButton);
      this.priceElem = this.element.querySelector(select.menuProduct.priceElem);
      this.ProductimageWrapper = this.element.querySelector(select.menuProduct.imageWrapper);
    }

    initOrderForm() {
      this.form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.processOrder();
      });

      this.formInputs.forEach(input => {
        input.addEventListener('change', () => {
          this.processOrder();
        });
      });

      this.cartButton.addEventListener('click', (event) => {
        event.preventDefault();
        this.processOrder();
      });
    }

    processOrder() {
      const formData = utils.serializeFormToObject(this.form);
      let price = this.data.price;

      for (let paramId in this.data.params) {
        const param = this.data.params[paramId];

        for (let optionId in param.options) {
          const option = param.options[optionId];
          const optionImage = this.ProductimageWrapper.querySelector(`.${paramId}-${optionId}`);
          if (optionImage != null) {
          optionImage.classList.remove(classNames.menuProduct.imageVisible);
          }
          const pizzaClass = '.' + paramId + '-' + optionId;
          const variable = formData[paramId] && formData[paramId].includes(optionId);
          console.log(optionId, option);

          if (variable) {
            if (!option.default) {
              price += option.price;
              console.log(option.price, price);
            }
            if(optionImage){
              optionImage.classList.add(classNames.menuProduct.imageVisible);
            }
          } else{
            if (option.default) {
              price -= option.price;
              console.log(option.price, price)
              if(optionImage){
              optionImage.classList.remove(classNames.menuProduct.imageVisible);
            }
            }
          } else {
            if (option.default) {
              price -= option.price;
            }
          }
        }
      }

      this.priceSingle = price;
      this.priceElem.innerHTML = price;
    }

    initAccordion() {
      this.element.querySelector('.product__header').addEventListener("click", (event) => {
        event.preventDefault();
        const activeProduct = document.querySelector('.product.active');
        if (activeProduct && activeProduct !== this.element) {
          activeProduct.classList.remove('active');
        }
        this.element.classList.toggle('active');
      });
    }
  }

  const app = {
    initData: function () {
      this.data = dataSource;
    },
    initMenu() {
      for (let productData in this.data.products) {
        new Product(productData, this.data.products[productData]);
      }
    },

    init: function () {
      console.log('*** App starting ***');
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      this.initData();
      this.initMenu();
    },
  };

  app.init();
}