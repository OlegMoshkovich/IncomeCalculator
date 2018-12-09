var budgetController = (
  function(){
    var Expense = function(id, description,value){
      this.id = id,
      this.description = description,
      this.value = value
    }
    var Income = function(id, description,value){
      this.id = id,
      this.description = description,
      this.value = value
    }
    var totalExpenses = 0;

    //data strructure containing all of the data from the budget controller
    var data = {
      allitems:{
        inc:[],
        exp:[]
      },
      totals:{
        inc:0,
        exp:0
      }
    }

    return {
      //add Item method -- accept type description and value from the UI controller through the gloabal controller
      addItem:function(type, desc, val){
         var newItem, ID;
         //create new id
         if(data.allitems[type].length>0){
            ID = data.allitems[type][data.allitems[type].length - 1].id + 1;
         }else{
           ID = 0;
         }
         // the first portion of the expression above return the id of the last item -- in order to generate the new id
         // we need to add one to the last item

         //create new item based on 'exp' or 'inc' type
         if(type === 'exp'){
           newItem = new Expense(ID, desc,val);
         }else if(type === 'inc'){
           newItem = new Income(ID, desc,val);
         }
         //push it to the data structure
         data.allitems[type].push(newItem);
         //return the elememt
         return newItem; //other module will have dfirect access to the newItem that has been created
      }
    }
}
)()

//immeditately invoked function of the UI controller
var UIController  = (function(){ //it is treated as the function expression and immediately executes

  var DOMStrings = {
    budgetType:'.budget__value',
    valueType:'.add__value',
    inputType:'.add__type',
    descriptionType:'.add__description',
    addButton:'.add__btn'
  };

  return{ // the return object contains all of the methods publicly available

    getInput:function(){
      return{
        budget: document.querySelector(DOMStrings.budgetType).textContent,
        value: document.querySelector(DOMStrings.valueType).value,
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.descriptionType).value
        }
    },
    getDOMStrings:function(){
      return DOMStrings
    }
  }
}
)()

//immeditately invoked function of the global controller
var controller = (function(budgetCtrl,UICtrl){
    var setUp = function(){
      var DOMStrings = UICtrl.getDOMStrings()
      document.addEventListener('keydown',function(e){
        if(e.keyCode == 32 || e.keyCode == 13){
          console.log(UICtrl.getInput());
        }
      })
      document.querySelector(DOMStrings.addButton).addEventListener('click',function(){
          console.log(UICtrl.getInput());
      })
    }

    var ctrlAddItem = function(){
      var input, newItem

      //1. get input fields
      var input = UICtrl.getInput()
      //2. add the item to the budget controller
      var newItem = budgetCtrl.addItem(input.addType, input.descriptionType, input.addValue);

      //3.add the item to the UI

      //4. calculate thte budget

      //5.Display the budget on the UI

    }
    return {
        init:function(){
        console.log('the application has started')
        setUp()},
        log:ctrlAddItem()
    }
  }
)(budgetController,UIController)


controller.init()
