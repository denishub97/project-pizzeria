import {templates, select, settings, classNames} from "../settings.js";
import AmountWidget from "./AmountWidget.js";
import DatePicker from "./DatePicker.js";
import HourPicker from "./HourPicker.js";
import utils from "../utils.js";
class Booking{
  constructor(element){
  const thisBooking = this;
  thisBooking.render(element);
  thisBooking.initWidgets();
  thisBooking.getData();
  thisBooking.selectedTable;
}

  selectTable(event){
    const thisBooking = this;
    if(event.target.classList.contains('table')){
      if(!event.target.classList.contains('booked')){
        thisBooking.selectedTable = event.target.getAttribute('data-table');
        
        thisBooking.resetTables();

        event.target.classList.add('selectedTable');
      } else {
        alert('Table is booked');
      } 
    } 
  }

  resetTables(){
    const thisBooking = this;

    const tables = thisBooking.dom.floorPlan.querySelectorAll('.table')
        tables.forEach(table => {      
            table.classList.remove('selectedTable');
        });
  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePickerWidget.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePickerWidget.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    }
    
    
    const urls = {
      booking:       settings.db.url + '/' + settings.db.bookings
      + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.events  
      + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.events  
      + '?' + params.eventsRepeat.join('&'),
    }

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
    }
    
    parseData(bookings, eventsCurrent, eventsRepeat){
      const thisBooking = this;
      
      thisBooking.booked = {};
      
      for(let item of bookings){
        thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
      }
      
      for(let item of eventsCurrent){
        thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
      }

      const minDate = thisBooking.datePickerWidget.minDate;
      const maxDate = thisBooking.datePickerWidget.maxDate;

      for(let item of eventsRepeat){
        if(item.repeat == 'daily'){
          for(let loopDate = minDate; loopDate <= maxDate;  loopDate = utils.addDays(loopDate, 1)){
            thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
          }
        }
      }
    
    thisBooking.updateDOM();
  }
 
  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);
    
    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
          thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
    
  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePickerWidget.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPickerWidget.value);

    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined' 
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }

    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
    thisBooking.resetTables();
    console.log(thisBooking.booked);
  }
  
  render(element){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    this.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePickerInput = document.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPickerInput = document.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector(select.booking.floorPlan);
    console.log(thisBooking.dom.floorPlan, 'floor');
  }

  initWidgets(){
    const thisBooking = this;
    
    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePickerWidget = new DatePicker(thisBooking.dom.datePickerInput);
    thisBooking.hourPickerWidget = new HourPicker(thisBooking.dom.hourPickerInput);

    thisBooking.dom.peopleAmount.addEventListener('updated', function(){

    });

    thisBooking.dom.hoursAmount.addEventListener('updated', function(){
    });
    
    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });

    thisBooking.dom.floorPlan.addEventListener('click', function(event){
      thisBooking.selectTable(event);
    })
  }
}

export default Booking;