'use strict';

var recRows;
var ingredients;
var ingredientsCont;

var RecipesArray = [{
  title: 'Spaghetti Bolognese',
  src: 'https://secretsauce.co.uk/shared/images/cms/content/2/200/1626.jpg',
  recipe: 'mince,onions,mushrooms,tomatoes,garlic,spaghetti'
}, {
  title: 'Carbonara',
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Spaghetti_carbonara.jpg/1920px-Spaghetti_carbonara.jpg',
  recipe: 'cream,egg,pepper,bacon,spaghetti'
}, {
  title: 'Bread',
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Korb_mit_Br%C3%B6tchen.JPG/1024px-Korb_mit_Br%C3%B6tchen.JPG',
  recipe: 'Flour,yeast,salt,olive oil,water'
}];

if (typeof Storage !== "undefined" && localStorage.getItem('dataArray') != null) {
  RecipesArray = JSON.parse(localStorage.getItem('dataArray'));
  console.log('Loaded from local Storage');
  console.log(localStorage.getItem('dataArray'));
} else {
  console.log('NO LOCAL STORAGE DATA');
}

function saveState() {
  if (typeof Storage !== "undefined") {
    var data = JSON.stringify(RecipesArray);
    localStorage.setItem('dataArray', data);
    console.log('SAVED!');
    console.log(localStorage.getItem('dataArray'));
  } else {
    console.log('NO LOCAL STORAGE SUPPORT');
  }
}

function testImage(URL) {
  var result;
  var tester = new Image();
  tester.src = URL;
  tester.onload = function () {
    result = true;
  };
  tester.onerror = function () {
    result = false;
  };
  console.log(result);
  return result;
}

function newRecipe(x, y, z) {
  this.title = x;
  this.src = y;
  this.recipe = z;
}

////////////// REACT CLASS ////////////

var MainApp = React.createClass({
  displayName: 'MainApp',

  getInitialState: function getInitialState() {
    return {
      cRep: 0,
      MODE: 'SELECT'
    };
  },

  parseUp: function parseUp(num) {
    console.log('works ' + num);
    this.setState({
      cRep: num,
      MODE: 'SELECT'
    });
  },

  editItem: function editItem() {
    this.setState({
      MODE: 'EDIT'
    });
  },

  addItem: function addItem() {
    this.setState({
      MODE: 'ADD'
    });
  },

  deleteItem: function deleteItem() {
    RecipesArray.splice(this.state.cRep, 1);
    saveState();
    this.parseUp(0);
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'div',
        { className: 'col-sm-5 col-xs-12', id: 'leftSide' },
        React.createElement(
          'h1',
          { className: 'col-xs-10 col-xs-offset-1', style: { 'textAlign': 'center' } },
          'Recipes'
        ),
        React.createElement('br', null),
        React.createElement(Recipes, { parseUp: this.parseUp, adder: this.addItem })
      ),
      React.createElement(
        'div',
        { className: 'col-sm-5 col-sm-offset-2 col-xs-12', id: 'rightSide' },
        this.state.MODE == 'EDIT' ? React.createElement(Editor, { deleter: this.deleteItem, recItem: this.state.cRep, parseUp: this.parseUp }) : null,
        this.state.MODE == 'SELECT' ? React.createElement(Recipe, { recItem: this.state.cRep, editor: this.editItem }) : null,
        this.state.MODE == 'ADD' ? React.createElement(Add, { deleter: this.deleteItem, parseUp: this.parseUp }) : null
      )
    );
  }
});

////////////// REACT CLASS ////////////

var Recipes = React.createClass({
  displayName: 'Recipes',

  parseUp: function parseUp(num) {
    this.props.parseUp(num);
  },

  makeRecipeList: function makeRecipeList() {
    var recIndex = -1;
    recRows = RecipesArray.map(function (rowItem) {
      recIndex++;
      return React.createElement(RecipeItem, { key: recIndex, recIndex: recIndex, parseUp: this.parseUp, title: rowItem.title, image: rowItem.src, recipe: rowItem.recipe });
    }, this);
  },

  render: function render() {
    this.makeRecipeList();
    return React.createElement(
      'div',
      null,
      recRows,
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'button',
          { className: 'funcButton col-xs-10 col-xs-offset-1', onClick: this.props.adder },
          React.createElement('i', { className: 'fa fa-plus-circle', 'aria-hidden': 'true' })
        )
      )
    );
  }
});

////////////// REACT CLASS ////////////

var RecipeItem = React.createClass({
  displayName: 'RecipeItem',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'div',
        { className: 'box RecListItem col-xs-10 col-xs-offset-1', onClick: this.props.parseUp.bind(null, this.props.recIndex) },
        React.createElement(
          'p',
          { className: 'col-xs-10 col-xs-offset-1' },
          this.props.title
        )
      )
    );
  }
});

////////////// REACT CLASS ////////////

var Recipe = React.createClass({
  displayName: 'Recipe',

  ingMaker: function ingMaker() {
    ingredients = RecipesArray[this.props.recItem].recipe.split(',');
    ingredientsCont = ingredients.map(function (ingredient) {
      return React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-xs-10 col-xs-offset-1' },
          React.createElement(
            'h3',
            { key: 'ing' + ingredient },
            ingredient.toLowerCase()
          )
        )
      );
    }, this);
  },

  render: function render() {
    console.log(RecipesArray.length);
    if (RecipesArray.length != 0) {
      this.ingMaker();
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-10 col-xs-offset-1' },
            React.createElement(
              'h1',
              null,
              RecipesArray[this.props.recItem].title
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-6 col-xs-offset-3' },
            React.createElement('img', { src: RecipesArray[this.props.recItem].src })
          )
        ),
        React.createElement(
          'div',
          null,
          ingredientsCont
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'button',
            { className: 'funcButton col-xs-10 col-xs-offset-1', onClick: this.props.editor.bind(null) },
            React.createElement('i', { className: 'fa fa-info-circle', 'aria-hidden': 'true' }),
            React.createElement(
              'span',
              null,
              ' Edit'
            )
          )
        )
      );
    } else {
      return null;
    };
  }
});

////////////// REACT CLASS ////////////

var Editor = React.createClass({
  displayName: 'Editor',

  updateEntry: function updateEntry() {
    if (a != '' && c != '') {
      var a = document.getElementsByClassName('TitleInput')[0].value;
      var b = document.getElementsByClassName('ImageInput')[0].value;
      var c = document.getElementsByClassName('IngredientsInput')[0].value;
      var d = new newRecipe(a, b, c);

      RecipesArray.splice([this.props.recItem], 1, d);
      saveState();
      console.log(RecipesArray);

      this.props.parseUp([this.props.recItem]);
    }
  },

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        { className: 'col-xs-10 col-xs-offset-1', style: { 'textAlign': 'center' } },
        'Edit Entry'
      ),
      React.createElement('br', null),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'span',
          { className: 'col-xs-offset-1' },
          'Title:'
        ),
        React.createElement('br', null),
        React.createElement('input', { type: 'text', defaultValue: RecipesArray[this.props.recItem].title, className: 'TitleInput col-xs-offset-2 col-xs-8' })
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement('br', null),
        React.createElement(
          'span',
          { className: 'col-xs-offset-1' },
          'Image Source:'
        ),
        React.createElement('br', null),
        React.createElement('input', { type: 'text', defaultValue: RecipesArray[this.props.recItem].src, className: 'ImageInput col-xs-offset-2 col-xs-8' })
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement('br', null),
        React.createElement(
          'span',
          { className: 'col-xs-offset-1' },
          'Ingredients (seperated by commas):'
        ),
        React.createElement('br', null),
        React.createElement('textArea', { className: 'IngredientsInput col-xs-offset-2 col-xs-8', defaultValue: RecipesArray[this.props.recItem].recipe })
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'button',
          { className: 'funcButton col-xs-10 col-xs-offset-1', onClick: this.updateEntry },
          React.createElement('i', { className: 'fa fa-check-circle', 'aria-hidden': 'true' }),
          React.createElement(
            'span',
            null,
            ' Save'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'button',
          { className: 'funcButton col-xs-10 col-xs-offset-1', id: 'deleteButton', onClick: this.props.deleter.bind(null) },
          React.createElement('i', { className: 'fa fa-times-circle', 'aria-hidden': 'true' }),
          React.createElement(
            'span',
            null,
            ' Delete'
          )
        )
      )
    );
  }
});

/*

 <div>
               <div className='row'>
    Title:
    <input type='text'  defaultValue={RecipesArray[this.props.recItem].title} className='TitleInput' />
        </div>
               <div className='row'>
                 Image Source:
    <input type='text'  defaultValue={RecipesArray[this.props.recItem].src} className='ImageInput'/>
        </div>
               <div className='row'>
                 Ingredients (seperated by commas):
    <textarea  defaultValue={RecipesArray[this.props.recItem].recipe} className='IngredientsInput'></textarea>
        </div>
            <div className='row'>
        <button className='funcButton col-xs-10 col-xs-offset-1' onClick={this.updateEntry}>
     	<i className="fa fa-check-circle" aria-hidden="true"></i>
      <span> Save</span>
    </button> 
        </div>
                <div className='row'>
    <button className='funcButton col-xs-10 col-xs-offset-1' id='deleteButton' onClick={this.props.deleter.bind(null)}>
      <i className="fa fa-times-circle" aria-hidden="true"></i>
      <span> Delete </span>
    </button>
        </div>
  </div>

*/

////////////// REACT CLASS ////////////

var Add = React.createClass({
  displayName: 'Add',

  updateEntry: function updateEntry() {

    var a = document.getElementsByClassName('TitleInput')[0].value;
    var b = document.getElementsByClassName('ImageInput')[0].value;
    var c = document.getElementsByClassName('IngredientsInput')[0].value;
    if (a != '' && c != '') {
      var d = new newRecipe(a, b, c);

      RecipesArray.push(d);
      saveState();
      console.log(RecipesArray);

      this.props.parseUp(RecipesArray.length - 1);
    }
  },

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        { className: 'col-xs-10 col-xs-offset-1', style: { 'textAlign': 'center' } },
        'Add Entry'
      ),
      React.createElement('br', null),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'span',
          { className: 'col-xs-offset-1' },
          'Title:'
        ),
        React.createElement('br', null),
        React.createElement('input', { type: 'text', className: 'TitleInput col-xs-offset-2 col-xs-8' })
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement('br', null),
        React.createElement(
          'span',
          { className: 'col-xs-offset-1' },
          'Image Source:'
        ),
        React.createElement('br', null),
        React.createElement('input', { type: 'text', className: 'ImageInput col-xs-offset-2 col-xs-8' })
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement('br', null),
        React.createElement(
          'span',
          { className: 'col-xs-offset-1' },
          'Ingredients (seperated by commas):'
        ),
        React.createElement('br', null),
        React.createElement('textArea', { className: 'IngredientsInput col-xs-offset-2 col-xs-8' })
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'button',
          { className: 'funcButton col-xs-10 col-xs-offset-1', onClick: this.updateEntry },
          React.createElement('i', { className: 'fa fa-check-circle', 'aria-hidden': 'true' }),
          React.createElement(
            'span',
            null,
            ' Save'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'button',
          { className: 'funcButton col-xs-10 col-xs-offset-1', id: 'deleteButton', onClick: this.props.parseUp.bind(null, 0) },
          React.createElement('i', { className: 'fa fa-times-circle', 'aria-hidden': 'true' }),
          React.createElement(
            'span',
            null,
            ' Delete'
          )
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(MainApp, null), document.getElementById('app'));