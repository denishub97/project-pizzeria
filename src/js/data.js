params: {
  sauce: {
    label: 'Sauce',
    type: 'radios',
    options: {
      tomato: {label: 'Tomato', price: 0, default: true},
      cream: {label: 'Sour cream', price: 2},
    },
  },
  toppings: {
    label: 'Toppings',
    type: 'checkboxes',
    options: {
      olives: {label: 'Olives', price: 2, default: true},
      redPeppers: {label: 'Red peppers', price: 2, default: true},
      greenPeppers: {label: 'Green peppers', price: 2, default: true},
      mushrooms: {label: 'Mushrooms', price: 2, default: true},
      basil: {label: 'Fresh basil', price: 2, default: true},
      salami: {label: 'Salami', price: 3},
    },
  },
  crust: {
    label: 'pizza crust',
    type: 'select',
    options: {
      standard: {label: 'standard', price: 0, default: true},
      thin: {label: 'thin', price: 2},
      thick: {label: 'thick', price: 2},
      cheese: {label: 'cheese in edges', price: 5},
      wholewheat: {label: 'wholewheat', price: 3},
      gluten: {label: 'with extra gluten', price: 0},
    },
  },
},
