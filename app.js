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
      allItems:{
        inc:[],
        exp:[]
      },
      totals:{
        inc:0,
        exp:0
      },
      budget:0,
      percentage:-1

    }

    var calculateTotal = function(type){
      var sum = 0;
        data.allItems[type].forEach(function(cur){
          sum = sum + cur.value
        })
        data.totals[type] = sum;
    }




    return {
      //add Item method -- accept type description and value from the UI controller through the gloabal controller
      addItem:function(type, desc, val){
         var newItem, ID;
         //create new id
         if(data.allItems[type].length>0){
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
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
         data.allItems[type].push(newItem);
         //return the elememt
         return newItem; //other module will have dfirect access to the newItem that has been created
      },
      calculateBudget:function(){
        //calculate all of the income
        calculateTotal('inc');
        //calculate all of the expenses
        calculateTotal('exp');
        //calculate the total
        data.budget = data.totals.inc - data.totals.exp;
        //calculate percent
        if(data.totals.inc>0){
          data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100)
        }else{
          data.percentage = -1;
        }

      },
      getBudget:function(){
        return {
          budget:data.budget,
          totalInc:data.totals.inc,
          totalExp:data.totals.exp,
          percentage:data.percentage
        }
      },
      print:function(){
        console.log(data)
      }
    }
}
)()
var UIController  = (function(){ //it is treated as the function expression and immediately executes

  var DOMStrings = {
    budgetLabel:'.budget__value',
    value:'.add__value',
    inputType:'.add__type',
    description :'.add__description',
    addButton:'.add__btn',
    incomeContainer:'.income__list',
    expensesContainer:'.expenses__list',
    incomeLabel:'.budget__income--value',
    expensesLabel:'.budget__expenses--value',
    percentageLabel:'.budget__expenses--percentage'
  };

  return{ // the return object contains all of the methods publicly available
    getInput:function(){
      return{
        budget: document.querySelector(DOMStrings.budgetLabel).textContent,
        value: parseFloat(document.querySelector(DOMStrings.value).value),
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

    displayBudget:function(obj){
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;


      if(obj.percentge>0){
          document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      }else{
          document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
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


    var updateBudget = function(){
      //1.calculate budget
      budgetCtrl.calculateBudget()
      //2.return the budget
      var budgetTotals = budgetCtrl.getBudget()

      //6.Display the budget on the UI
      UICtrl.displayBudget(budgetTotals)

    }


    var ctrlAddItem = function(){
      var input,newItem
      //1. get input fields
      var input = UICtrl.getInput()
      if(input.description !== "" && !isNaN(input.value) && input.value>0 ){
        //2. add the item to the budget controller
        var newItem =budgetCtrl.addItem(input.type, input.description, input.value )
        //3.add the item to the UI
        UICtrl.addListItem(newItem,input.type )
        //4. clear the fields
        UICtrl.clearFields();
        //5. calculate and update the budget
        updateBudget();
      }



    }

    return {
        init:function(){
        setUp()
        UICtrl.displayBudget({  budget:0,
                                totalInc:0,
                                totalExp:0,
                                percentage:0})},
        addItem:function(){
          ctrlAddItem()
        }
    }
  }
)(budgetController,UIController)


controller.init()
