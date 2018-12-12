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
      },
      print:function(){
        console.log(data)
      }
    }
}
)()
//immeditately invoked function of the UI controller
var UIController  = (function(){ //it is treated as the function expression and immediately executes

  var DOMStrings = {
    budget:'.budget__value',
    value:'.add__value',
    inputType:'.add__type',
    description :'.add__description',
    addButton:'.add__btn',
    incomeContainer:'.income__list',
    expensesContainer:'.expenses__list'
  };

  return{ // the return object contains all of the methods publicly available
    getInput:function(){
      return{
        budget: document.querySelector(DOMStrings.budget).textContent,
        value: document.querySelector(DOMStrings.value).value,
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.description).value
        }
    },

    addListItem:function(obj,type){
      console.log("in the addList --- type -- ",type);
      //Create HTML string as the HTML placeholder
      var html,newHTML,element;
      if(type === 'inc'){
        element = DOMStrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }else if(type === 'exp'){
        element = DOMStrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //replace placeholder with the actual data
      newHTML = html.replace('%id%',obj.id);
      newHTML = newHTML.replace('%description%',obj.description);
      newHTML = newHTML.replace('%value%',obj.value);


      //insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('afterend', newHTML)
    },
    clearFields:function(){
      var fields,fieldsArr;
      fields = document.querySelectorAll(DOMStrings.description + ',' + DOMStrings.value);
      fieldsArr = Array.from(fields);
      console.log(fieldsArr)
      fieldsArr.forEach(function(current,index,array){
        current.value = "";
      })
      fieldsArr[0].focus();

    },

    getDOMStrings:function(){
      return DOMStrings
    },

  }
}
)()
//immeditately invoked function of the global controller
var controller = (function(budgetCtrl,UICtrl){
    var setUp = function(){
      var DOMStrings = UICtrl.getDOMStrings()
      document.addEventListener('keydown',function(e){
        if(e.keyCode == 32 || e.keyCode == 13){
        }
      })
      document.querySelector(DOMStrings.addButton).addEventListener('click',function(){
        ctrlAddItem()
      })
    }
    var ctrlAddItem = function(){

      var input,newItem
      //1. get input fields
      var input = UICtrl.getInput()
      console.log('main controller input',input.type)
      //2. add the item to the budget controller
      var newItem =budgetCtrl.addItem(input.type, input.description, input.value )

      //3.add the item to the UI
      UICtrl.addListItem(newItem,input.type )

      //4. clear the fields
      UICtrl.clearFields();

      //5.Display the budget on the UI

    }

    return {
        init:function(){
        setUp()},
        addItem:function(){
          ctrlAddItem()
        }
    }
  }
)(budgetController,UIController)


controller.init()
