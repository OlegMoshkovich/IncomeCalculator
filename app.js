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
      newItem:function(type, desc, val){
         var newItem, ID;

         //create new id
         ID = data.allitems[type][ data.allitems[type].length - 1].id + 1;
         //create new item based on exp or inc type
         if(type === 'exp'){
           newItem = new Expense(id, desc,value);
         }else if(type === 'inc'){
           newItem = new Income(id, desc,value);
         }
         data.allitems[type].push(newItem);

         return newItem;
      }
    }
}
)()


var UIController  = (

function(){
var DOMStrings = {
  budgetType:'.budget__value',
  valueType:'.add__value',
  inputType:'.add__type',
  descriptionType:'.add__description',
  addButton:'.add__btn'
};

  return{
    getInput:function(){
      return{
        budgetValue: document.querySelector(DOMStrings.budgetType).textContent,
        addValue: document.querySelector(DOMStrings.valueType).value,
        addType: document.querySelector(DOMStrings.inputType).value,
        descriptionType: document.querySelector(DOMStrings.descriptionType).value
        }
    },
    getDOMStrings:function(){
      return DOMStrings
    }
  }
}
)()

var controller = (function(budgetCtl,UICtrl){
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
    return {
        init:function(){
        console.log('the application has started')
        setUp()}
    }
  }
)(budgetController,UIController)

controller.init()
