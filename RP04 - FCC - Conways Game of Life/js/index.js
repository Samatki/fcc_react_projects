'use strict';

var kk = 0;
var k = [];
var t = [];
var rows = 50;
var cols = 40;
var gStatus = true;
var displayCount = 0;
var cArray = [];
var playGrid = [];
var swapGrid = [];
var iterSpeed = 100;
var count;

for (var i = 0; i < rows; i++) {
  var playGridI = [];
  for (var j = 0; j < cols; j++) {
    playGridI.push('dead');
  }
  playGrid.push(playGridI);
}

var MainContainer = React.createClass({
  displayName: 'MainContainer',

  getInitialState: function getInitialState() {
    this.initiator();
    return {
      grid: playGrid,
      gMode: gStatus
    };
  },

  initiator: function initiator() {
    displayCount = 0;
    var randomFactor = 50;
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        if (100 * Math.random() > randomFactor) {
          playGrid[i].splice(j, 1, 'alive');
        }
      }
    }
  },

  clearer: function clearer() {
    playGrid = [];
    for (var i = 0; i < rows; i++) {
      var playGridI = [];
      for (var j = 0; j < cols; j++) {
        playGridI.push('dead');
      }
      playGrid.push(playGridI);
    }
    this.setState({
      grid: playGrid
    });
  },

  runCheck: function runCheck() {
    gStatus ? gStatus = false : gStatus = true;
    this.setState({
      gMode: gStatus
    });
  },

  runningGame: function runningGame() {
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        if (playGrid[i][j] == 'new') {
          playGrid[i].splice(j, 1, 'alive');
        }
      }
    }

    swapGrid = [];
    for (var i = 0; i < rows; i++) {
      var swapGridI = [];
      for (var j = 0; j < cols; j++) {

        var count = 0;
        for (var zrows = -1; zrows < 2; zrows++) {
          for (var zcols = -1; zcols < 2; zcols++) {
            if (zrows == 0 && zcols == 0) {} else {
              var rVal = (i + zrows) % rows;
              var cVal = (j + zcols) % cols;
              if (rVal < 0) {
                rVal = rows - 1;
              }
              if (cVal < 0) {
                cVal = cols - 1;
              }
              if (playGrid[rVal][cVal] == 'alive') {
                count++;
              }
            }
          }
        }

        if (count == 2) {
          swapGridI.push(playGrid[i][j]);
        } else if (playGrid[i][j] == 'dead' && switchStatement(count) == 'alive') {
          swapGridI.push('new');
        } else {
          swapGridI.push(switchStatement(count));
        }
      }
      swapGrid.push(swapGridI);
    }

    playGrid = swapGrid;
    this.setState({
      grid: playGrid
    });
  },

  gridMaker: function gridMaker() {
    t = [];
    var count = 0;
    var s = 0;
    while (s < rows) {
      var z = 0;
      k = [];
      while (z < cols) {
        k.push(React.createElement('td', { className: 'sqBlock ' + playGrid[s][z] }));
        z++;
        count++;
      };
      t.push(React.createElement(
        'tr',
        null,
        k
      ));
      s++;
    };
    return t;
  },

  changeSpeed: function changeSpeed() {
    iterSpeed = $('#iterSlider').val();
  },

  gridResize: function gridResize(height, width) {
    rows = height;
    cols = width;
    this.clearer();
    this.initiator();
    gStatus = true;
    this.setState({
      gMode: gStatus
    });
  },

  gridResizeB: function gridResizeB(height, width) {
    rows = height;
    cols = width;
    this.clearer();
    gStatus = false;
    displayCount = 0;
    this.setState({
      gMode: gStatus
    });
  },

  render: function render() {
    if (this.state.gMode) {
      displayCount++;
      setTimeout(this.runningGame, iterSpeed);
    }
    return React.createElement(
      'div',
      null,
      React.createElement(
        'table',
        { id: 'xx' },
        React.createElement(
          'tbody',
          null,
          this.gridMaker()
        )
      ),
      React.createElement(
        'div',
        { id: 'iterCount' },
        'Iteration: ',
        displayCount
      ),
      React.createElement(
        'button',
        { onClick: this.runCheck, id: 'pauseButton' },
        gStatus ? 'Pause' : 'Go'
      ),
      React.createElement(
        'label',
        { htmlFor: 'iterSlider' },
        'Iteration Speed'
      ),
      React.createElement('input', { type: 'range', min: '10', max: '300', value: iterSpeed, onChange: this.changeSpeed, id: 'iterSlider' }),
      React.createElement(
        'p',
        { id: 'label-left' },
        'Slower'
      ),
      React.createElement(
        'p',
        { id: 'label-right' },
        'Faster'
      ),
      React.createElement('br', null),
      gStatus ? null : React.createElement(NGControls, { namez: this.gridResize, namez2: this.gridResizeB })
    );
  }
});

var NGControls = React.createClass({
  displayName: 'NGControls',

  validate: function validate(myObj) {
    if (myObj.val() < 10 || myObj.val() > 100) {
      myObj.val(50);
      $('#vWarning').animate({ opacity: 1 }, 500);
    }
  },

  render: function render() {
    var _this = this;

    $('td').click(function () {
      var colz = $(this).index();
      var rowz = $(this).parent().index();
      if (gStatus == false) {
        $(this).addClass('new');
      }
      playGrid[rowz].splice(colz, 1, 'alive');
      console.log(colz + ' , ' + rowz);
    });

    return React.createElement(
      'div',
      null,
      React.createElement(
        'label',
        { htmlFor: 'wNum' },
        'Width:'
      ),
      React.createElement('input', { type: 'number', min: '10', max: '100', name: 'width', onBlur: function onBlur() {
          return _this.validate($('#wNum'));
        }, id: 'wNum', defaultValue: cols }),
      React.createElement(
        'label',
        { htmlFor: 'cNum' },
        'Height:'
      ),
      React.createElement('input', { type: 'number', min: '10', max: '100', name: 'height', onBlur: function onBlur() {
          return _this.validate($('#cNum'));
        }, id: 'cNum', defaultValue: rows }),
      React.createElement(
        'div',
        { id: 'vWarning', style: { 'opacity': 0 } },
        'Values must be between 10 and 100'
      ),
      React.createElement(
        'button',
        { onClick: function onClick() {
            return _this.props.namez(document.getElementsByName('height')[0].value, document.getElementsByName('width')[0].value);
          }, className: 'gButton' },
        'Generate (New Random Start)'
      ),
      React.createElement(
        'button',
        { onClick: function onClick() {
            return _this.props.namez2(document.getElementsByName('height')[0].value, document.getElementsByName('width')[0].value);
          }, className: 'gButton' },
        'Generate (New Blank Start)'
      )
    );
  }
});

ReactDOM.render(React.createElement(MainContainer, null), document.getElementById('app'));

function switchStatement(counters) {

  switch (counters) {
    case 0:
    case 1:
      // component dies //
      return 'dead';
      break;
    case 2:
      return null;
      break;
    case 3:
      return 'alive';
      break;
    // exactly 3 - becomes alive //
    //2 or 3 stays alive //
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      // More than 3 // Dies
      return 'dead';
      break;
  }
}