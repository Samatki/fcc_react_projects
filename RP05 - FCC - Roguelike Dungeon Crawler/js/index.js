'use strict';

// MAP SETUP VARIABLES //
var minNoRooms = 20;
var maxNoRooms = 25;
var minRoomHeight = 5;
var maxRoomHeight = 15;
var minRoomWidth = 5;
var maxRoomWidth = 17;
var room = [];
var gSize = 75;
var grid = [];
var tableInner = [];
var roomArray = [];
var gromitpercenter = 0.92;
var pathpercenter = 0.985;
var noAcceptaplePositionIterations = 5000;
var gromitIterations = 3;
var noSkippedRooms = 0;
var borderSize = gromitIterations + 1;

// LIGHTING VARIABLES //
var lightRadius = 5;
var lightsMode = 1;

// ENTITIES //
var bossObj = {};
var noItems = 3;
var noHealth = 5;
var mobArray = [];
var healthObjectValue = 25;
var lvlEnder;

// ENTITY POSITIONING SPACING //
var itemRadius = 6;
var mobRadius = 5;
var playerRadius = 10;
var healthRadius = 4;
var dirArray = [[1, 0], [0, -1], [-1, 0], [0, 1]];

// PLAYER SETUP //
var playerMinDamage = 10;
var playerMaxDamage = 15;
var playerObj = {
  health: 100,
  dmgModifier: 0,
  playerWeapon: 'fists',
  playerXP: 0,
  get playerLevel() {
    //return Math.floor(this.playerXP/100)}
    return Math.floor(2.5 * Math.log(this.playerXP / 100 + 1));
  }
};
// MOB SETUP //
var noMobs = 15;
var minMobHealth = 30;
var maxMobHealth = 50;
var minMobDamage = 10;
var maxMobDamage = 15;

// SETUP PARAMETERS //
var mapLevel = 1;
var counter = 0;

// ITEMS SETUP //
var itemArray = [];
var itemsArray = [{
  name: 'Sword',
  dmg: 0.25,
  message: 'Slicey Dicey'
}, {
  name: 'Banana',
  dmg: -0.25,
  message: '...'
}, {
  name: 'Chainsaw',
  dmg: 0.5,
  message: 'Wish it was a BFG'
}, {
  name: 'Brick',
  dmg: 0.15,
  message: 'I LOVE MY BRICK'
}, {
  name: 'Cheesgrater',
  dmg: 0.05,
  message: 'Now to find some cheese'
}, {
  name: 'Pen',
  dmg: 0.25,
  message: 'Would have preferred a sword'
}, {
  name: 'Crowbar',
  dmg: 0.35,
  message: 'Not the third version'
}, {
  name: 'Boxing Gloves',
  dmg: 0.1,
  message: 'Time for a knockout'
}, {
  name: 'Spiders',
  dmg: 0.75,
  message: 'Spiders, thousands of them!'
}];

// REACT OBJECT (MAP CREATION AND ENTITY POSITIONING) //
var MainContainer = React.createClass({
  displayName: 'MainContainer',

  componentDidMount: function componentDidMount() {

    cycleLightMode(this.props.lightX);
  },

  gridGen: function gridGen() {
    grid = [];
    var gridI = [];

    for (var i = 0; i < gSize; i++) {
      gridI = [];
      for (var j = 0; j < gSize; j++) {
        gridI.push('wall dark');
      }
      grid.push(gridI);
    }
    this.roomGen();
  },

  roomGen: function roomGen() {

    var noRooms = minNoRooms + Math.round((maxNoRooms - minNoRooms) * Math.random());
    roomArray = [];

    for (var nR = 0; nR < noRooms; nR++) {
      room = [];
      var rWidth = minRoomWidth + Math.round((maxRoomWidth - minRoomWidth) * Math.random());
      var rHeight = minRoomHeight + Math.round((maxRoomHeight - minRoomHeight) * Math.random());
      room.push(rWidth);
      room.push(rHeight);
      roomArray.push(room);
    }
    this.roomPositioner();
  },

  roomPositioner: function roomPositioner() {
    var roomHorzPos = borderSize + Math.round((gSize - 2 * borderSize - roomArray[0][0]) * Math.random());
    var roomVertPos = borderSize + Math.round((gSize - 2 * borderSize - roomArray[0][1]) * Math.random());

    for (var i = 0; i < roomArray[0][1]; i++) {
      for (var j = 0; j < roomArray[0][0]; j++) {
        grid[roomVertPos + i].splice(roomHorzPos + j, 1, 'path dark');
      }
    }
    noSkippedRooms = 0;
    for (var l = 1; l < roomArray.length; l++) {
      var genCount = 0;

      var xx = true;
      while (xx) {
        genCount++;

        if (genCount == noAcceptaplePositionIterations) {
          xx = false;
          console.log('!!!');
          noSkippedRooms++;
        } else {
          var initLocY = borderSize + Math.floor((gSize - 2 * borderSize - roomArray[l][1]) * Math.random());
          var initLocX = borderSize + Math.floor((gSize - 2 * borderSize - roomArray[l][0]) * Math.random());
          var initLocationType = grid[initLocY][initLocX];

          if (initLocationType == 'wall dark') {} else {
            var rObasis = [0, 1, 2, 3];
            var dirBasis = [];
            while (rObasis.length != 0) {
              var item = Math.floor(rObasis.length * Math.random());
              dirBasis.push(rObasis[item]);
              rObasis.splice(item, 1);
            }

            for (var zk = 0; zk < dirBasis.length; zk++) {
              if (xx === false) {} else {
                switch (dirBasis[zk]) {
                  case 0:
                    // UP //
                    var currYLoc = initLocY;
                    do {
                      currYLoc--;
                    } while (grid[currYLoc][initLocX] == 'path dark');

                    if (currYLoc < roomArray[l][1] + borderSize) {} else {
                      currYLoc = currYLoc - roomArray[l][1];
                      var zz = true;
                      for (var m = 0; m < roomArray[l][1]; m++) {
                        for (var n = 0; n < roomArray[l][0]; n++) {
                          if (grid[currYLoc + m][initLocX + n] == 'path dark') {
                            zz = false;
                          }
                        }
                      }

                      if (zz) {
                        for (var q = 0; q < roomArray[l][1]; q++) {
                          for (var r = 0; r < roomArray[l][0]; r++) {
                            grid[currYLoc + q].splice(initLocX + r, 1, 'path dark');
                          }
                        }
                        xx = false;
                      }
                    }
                    break;
                  case 1:
                    var currYLoc = initLocY;

                    do {
                      currYLoc++;
                    } while (grid[currYLoc][initLocX] == 'path dark');

                    if (currYLoc > gSize - (roomArray[l][1] + borderSize)) {} else {
                      currYLoc++;
                      var zz = true;
                      for (var m = 0; m < roomArray[l][1]; m++) {
                        for (var n = 0; n < roomArray[l][0]; n++) {
                          if (grid[currYLoc + m][initLocX + n] == 'path dark') {
                            zz = false;
                          }
                        }
                      }

                      if (zz) {
                        for (var q = 0; q < roomArray[l][1]; q++) {
                          for (var r = 0; r < roomArray[l][0]; r++) {
                            grid[currYLoc + q].splice(initLocX + r, 1, 'path dark');
                          }
                        }
                        xx = false;
                      }
                    }
                    // DOWN //
                    break;
                  case 2:
                    var currXLoc = initLocX;

                    do {
                      currXLoc--;
                    } while (grid[initLocY][currXLoc] == 'path dark');

                    if (currXLoc < roomArray[l][0] + borderSize) {} else {
                      currXLoc = currXLoc - roomArray[l][0];
                      var zz = true;
                      for (var m = 0; m < roomArray[l][1]; m++) {
                        for (var n = 0; n < roomArray[l][0]; n++) {
                          if (grid[initLocY + m][currXLoc + n] == 'path dark') {
                            zz = false;
                          }
                        }
                      }

                      if (zz) {
                        for (var q = 0; q < roomArray[l][1]; q++) {
                          for (var r = 0; r < roomArray[l][0]; r++) {
                            grid[initLocY + q].splice(currXLoc + r, 1, 'path dark');
                          }
                        }
                        xx = false;
                      }
                    }
                    // LEFT //
                    break;
                  case 3:
                    var currXLoc = initLocX;

                    do {
                      currXLoc++;
                    } while (grid[initLocY][currXLoc] == 'path dark');

                    if (currXLoc > gSize - (roomArray[l][0] + borderSize)) {} else {
                      currXLoc = currXLoc + 1;
                      var zz = true;
                      for (var m = 0; m < roomArray[l][1]; m++) {
                        for (var n = 0; n < roomArray[l][0]; n++) {
                          if (grid[initLocY + m][currXLoc + n] == 'path dark') {
                            zz = false;
                          }
                        }
                      }

                      if (zz) {
                        for (var q = 0; q < roomArray[l][1]; q++) {
                          for (var r = 0; r < roomArray[l][0]; r++) {
                            grid[initLocY + q].splice(currXLoc + r, 1, 'path dark');
                          }
                        }
                        xx = false;
                      }
                    }
                    // RIGHT //
                    break;

                }
              }
            }
          }
        }
      }
    }

    if (maxNoRooms - noSkippedRooms < minNoRooms) {
      this.gridGen();
    }

    this.addHorizPaths();
  },

  gridRender: function gridRender() {

    tableInner = [];
    for (var l = 0; l < gSize; l++) {
      var rowInner = [];
      for (var m = 0; m < gSize; m++) {
        rowInner.push(React.createElement('td', { className: grid[l][m] }));
      }
      tableInner.push(React.createElement(
        'tr',
        null,
        rowInner
      ));
    }
    return tableInner;
  },

  addHorizPaths: function addHorizPaths() {

    var overlapLength = 0;

    for (var vPos = 1; vPos < gSize - 1; vPos++) {

      for (var hPos = 1; hPos < gSize - 1; hPos++) {

        if (overlapLength > 0) {
          overlapLength--;
          continue;
        }

        if (grid[vPos][hPos] == 'wall dark') {

          if (grid[vPos - 1][hPos] == 'path dark' && grid[vPos + 1][hPos] == 'path dark') {

            overlapLength = 1;

            while (grid[vPos - 1][hPos + overlapLength] == 'path dark' && grid[vPos + 1][hPos + overlapLength] == 'path dark') {
              overlapLength++;
            }

            var noPaths = 0;

            while (noPaths < 1) {
              for (var i = 0; i < overlapLength; i++) {
                var pElem = Math.floor(overlapLength * Math.random());

                if (Math.random() > pathpercenter) {
                  grid[vPos].splice(hPos + pElem, 1, 'passage dark');
                  noPaths++;
                }
              }
            }
          }
        }
      }
    }

    this.addVertPaths();
  },

  addVertPaths: function addVertPaths() {

    var overlapLength = 0;
    for (var hPos = 1; hPos < gSize - 1; hPos++) {
      for (var vPos = 1; vPos < gSize - 1; vPos++) {

        if (overlapLength > 0) {
          overlapLength--;
          continue;
        }

        if (grid[vPos][hPos] == 'wall dark') {

          if (grid[vPos][hPos - 1] == 'path dark' && grid[vPos][hPos + 1] == 'path dark') {

            overlapLength = 1;

            while (grid[vPos + overlapLength][hPos - 1] == 'path dark' && grid[vPos + overlapLength][hPos + 1] == 'path dark') {
              overlapLength++;
            }

            var noPaths = 0;

            while (noPaths < 1) {
              for (var i = 0; i < overlapLength; i++) {
                var pElem = Math.floor(overlapLength * Math.random());

                if (Math.random() > pathpercenter) {
                  grid[vPos + pElem].splice(hPos, 1, 'passage dark');
                  noPaths++;
                }
              }
            }
          }
        }
      }
    }
    for (var hPos = 1; hPos < gSize - 1; hPos++) {
      for (var vPos = 1; vPos < gSize - 1; vPos++) {
        if (grid[vPos][hPos] == 'passage dark') {
          grid[vPos].splice(hPos, 1, 'path dark');
        }
      }
    }
    for (var s = 0; s < gromitIterations; s++) {
      this.addGromits();
    }
    this.mobSpawn();
  },

  addGromits: function addGromits() {
    for (var vPos = 1; vPos < gSize - 1; vPos++) {
      for (var wPos = 1; wPos < gSize - 1; wPos++) {
        if (grid[vPos][wPos] == 'path dark' || grid[vPos][wPos] == 'path gromit dark') {
          for (var i = 0; i < dirArray.length; i++) {
            var xpos = dirArray[i][0];
            var ypos = dirArray[i][1];
            if (grid[vPos + ypos][wPos + xpos] == 'wall dark') {
              if (Math.random() > gromitpercenter) {
                grid[vPos + ypos].splice(wPos + xpos, 1, 'path gromit dark');
              }
            }
          }
        }
      }
    }
  },

  mobSpawn: function mobSpawn() {
    mobArray = [];
    var zMob = 0;
    while (zMob < noMobs + (this.props.level - 1) * 3) {
      var mobXpos = Math.floor(gSize * Math.random());
      var mobYpos = Math.floor(gSize * Math.random());
      if (grid[mobYpos][mobXpos] == 'path dark') {
        if (radiusCheck(mobRadius, mobXpos, mobYpos, ['mob path dark'])) {
          grid[mobYpos].splice(mobXpos, 1, 'mob path dark');
          mobArray.push(new mobMaker(mobXpos, mobYpos, this.props.level));
          zMob++;
        }
      }
    }
    this.itemSpawn();
  },

  itemSpawn: function itemSpawn() {
    itemArray = [];
    var zItem = 0;
    while (zItem < noItems) {
      var itemXpos = Math.floor(gSize * Math.random());
      var itemYpos = Math.floor(gSize * Math.random());
      if (grid[itemYpos][itemXpos] == 'path dark' || grid[itemYpos][itemXpos] == 'path gromit dark') {

        if (radiusCheck(itemRadius, itemXpos, itemYpos, ['item path dark', 'mob path dark'])) {
          grid[itemYpos].splice(itemXpos, 1, 'item path dark');
          var passedItem = itemsArray[Math.floor(itemsArray.length * Math.random())];
          itemArray.push(new itemMaker(itemXpos, itemYpos, passedItem));
          zItem++;
        }
      }
    }
    this.heathSpawn();
  },

  heathSpawn: function heathSpawn() {
    var zItem = 0;
    while (zItem < noHealth) {
      var itemXpos = Math.floor(gSize * Math.random());
      var itemYpos = Math.floor(gSize * Math.random());
      if (grid[itemYpos][itemXpos] == 'path dark' || grid[itemYpos][itemXpos] == 'path gromit dark') {
        if (radiusCheck(healthRadius, itemXpos, itemYpos, ['health path dark', 'mob path dark'])) {
          grid[itemYpos].splice(itemXpos, 1, 'health path dark');
          zItem++;
        }
      }
    }
    this.playerSpawn();
  },

  playerSpawn: function playerSpawn() {
    var zItem = 0;
    while (zItem < 1) {
      var itemXpos = Math.floor(gSize * Math.random());
      var itemYpos = Math.floor(gSize * Math.random());
      if (grid[itemYpos][itemXpos] == 'path' || grid[itemYpos][itemXpos] == 'path gromit dark') {
        if (radiusCheck(playerRadius, itemXpos, itemYpos, ['health path dark', 'mob path dark', 'item path dark'])) {
          grid[itemYpos].splice(itemXpos, 1, 'player path');
          zItem++;
        }
      }
    }
    this.lvlEndSpawn();
  },

  lvlEndSpawn: function lvlEndSpawn() {
    if (this.props.level != 5) {
      lvlEnder = 'teleporter path dark';
    } else {
      lvlEnder = 'boss path dark';
      bossObj = {
        health: 300,
        minDmg: 35,
        maxDmg: 50
      };
    }
    var zItem = 0;
    while (zItem < 1) {
      var itemXpos = Math.floor(gSize * Math.random());
      var itemYpos = Math.floor(gSize * Math.random());
      if (grid[itemYpos][itemXpos] == 'path dark') {
        if (radiusCheck(30, itemXpos, itemYpos, ['player path']) && radiusCheck(2, itemXpos, itemYpos, ['wall dark', 'health path dark', 'mob path dark', 'item pat dark'])) {
          grid[itemYpos].splice(itemXpos, 1, lvlEnder);
          grid[itemYpos].splice(itemXpos + 1, 1, lvlEnder);
          grid[itemYpos + 1].splice(itemXpos + 1, 1, lvlEnder);
          grid[itemYpos + 1].splice(itemXpos, 1, lvlEnder);
          zItem++;
        }
      }
    }
  },

  render: function render() {
    this.gridGen();
    return React.createElement(
      'div',
      { id: 'bleb' },
      React.createElement(
        'div',
        { id: 'gameTop' },
        'Level: ',
        this.props.level
      ),
      React.createElement(
        'div',
        { id: 'gameTop2' },
        React.createElement(
          'span',
          { className: 'playerDetails', id: 'playerLevel' },
          'Player Level: ',
          playerObj.playerLevel
        ),
        React.createElement(
          'span',
          { className: 'playerDetails', id: 'playerHealth' },
          'Health: ',
          playerObj.health
        ),
        React.createElement(
          'span',
          { className: 'playerDetails', id: 'playerWeapon' },
          'Weapon: ',
          playerObj.playerWeapon
        ),
        React.createElement(
          'span',
          { className: 'playerDetails', id: 'playerDamage' },
          'Damage: ',
          playerMinDamage * ((1 + playerObj.dmgModifier) * (1 + playerObj.playerLevel)),
          ' - ',
          playerMaxDamage * ((1 + playerObj.dmgModifier) * (1 + playerObj.playerLevel)) - 1,
          ' '
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          'table',
          null,
          React.createElement(
            'tbody',
            null,
            this.gridRender()
          )
        )
      )
    );
  }

});

ReactDOM.render(React.createElement(MainContainer, { level: mapLevel, lightX: 1 }), document.getElementById('app'));

function radiusCheck(radius, currPosX, currPosY, watchArray) {
  var result = true;
  for (var i = 0; i < watchArray.length; i++) {
    for (var j = -radius; j < radius; j++) {
      for (var k = -radius; k < radius; k++) {
        if (currPosX + j > gSize - 1 || currPosX + j < 0 || currPosY + k > gSize - 1 || currPosY + k < 0) {
          continue;
        } else {
          if (grid[currPosY + k][currPosX + j] == watchArray[i]) {
            result = false;
          }
        }
      }
    }
  }
  return result;
}

///////////////////////////// PLAYER MOVEMENT ///////////////

$(document).keydown(function (e) {
  var x = e.which;
  if (x >= 37 && x <= 40) {
    e.preventDefault();
    var currPlayerXPos = $('.player').index();
    var currPlayerYPos = $('.player').parent().index();
    var xDisp = 0;
    var yDisp = 0;
    var move = 'allow';

    switch (x) {
      case 37:
        if (currPlayerXPos == 0) {} else {
          xDisp = -1;
          yDisp = 0;
        }
        break;
      case 38:
        if (currPlayerYPos == 0) {} else {
          xDisp = 0;
          yDisp = -1;
        }
        break;
      case 39:
        if (currPlayerXPos == gSize - 1) {} else {
          xDisp = 1;
          yDisp = 0;
        }
        break;
      case 40:
        if (currPlayerYPos == gSize - 1) {} else {
          xDisp = 0;
          yDisp = 1;
        }
        break;
    }

    ///////////////////////// PLAYER OBJECT INTERACTIONS ///////////////////////

    if (xDisp == 0 && yDisp == 0) {} else {
      if (grid[currPlayerYPos + yDisp][currPlayerXPos + xDisp] != 'wall dark' && $('tr:eq(' + (currPlayerYPos + yDisp) + ') > ' + 'td:eq(' + (currPlayerXPos + xDisp) + ')').hasClass('mob') === false && $('tr:eq(' + (currPlayerYPos + yDisp) + ') > ' + 'td:eq(' + (currPlayerXPos + xDisp) + ')').hasClass('boss') === false) {
        $('tr:eq(' + (currPlayerYPos + yDisp) + ') > ' + 'td:eq(' + (currPlayerXPos + xDisp) + ')').addClass('player');
        $('tr:eq(' + currPlayerYPos + ') > ' + 'td:eq(' + currPlayerXPos + ')').removeClass('player');
        areaLighter(currPlayerXPos + xDisp, currPlayerYPos + yDisp);
        if ($('tr:eq(' + (currPlayerYPos + yDisp) + ') > ' + 'td:eq(' + (currPlayerXPos + xDisp) + ')').hasClass('item')) {
          console.log('itempickedup');
          $('tr:eq(' + (currPlayerYPos + yDisp) + ') > ' + 'td:eq(' + (currPlayerXPos + xDisp) + ')').removeClass('item');
          for (var i = 0; i < itemArray.length; i++) {
            if (itemArray[i].itemX == currPlayerXPos + xDisp && itemArray[i].itemY == currPlayerYPos + yDisp) {
              playerObj.dmgModifier = itemArray[i].damage;
              playerObj.playerWeapon = itemArray[i].name;
              $('#playerWeapon').html('Weapon: ' + playerObj.playerWeapon);
              $('#playerDamage').html('Damage: ' + playerMinDamage * ((1 + playerObj.dmgModifier) * (1 + playerObj.playerLevel)) + ' - ' + (playerMaxDamage * ((1 + playerObj.dmgModifier) * (1 + playerObj.playerLevel)) - 1));
              console.log(itemArray[i].name);
              break;
            }
          }
        } else if ($('tr:eq(' + (currPlayerYPos + yDisp) + ') > ' + 'td:eq(' + (currPlayerXPos + xDisp) + ')').hasClass('health')) {
          $('tr:eq(' + (currPlayerYPos + yDisp) + ') > ' + 'td:eq(' + (currPlayerXPos + xDisp) + ')').removeClass('health');
          playerObj.health += healthObjectValue;
          $('#playerHealth').html('Health: ' + playerObj.health);
          areaLighter(currPlayerXPos + xDisp, currPlayerYPos + yDisp);
          /////////////////////////// NEXT LEVEL /////////////////////////
        } else if ($('tr:eq(' + (currPlayerYPos + yDisp) + ') > ' + 'td:eq(' + (currPlayerXPos + xDisp) + ')').hasClass('teleporter')) {
            $('#bleb').remove();
            mapLevel++;
            ReactDOM.render(React.createElement(MainContainer, { level: mapLevel, lightX: lightsMode }), document.getElementById('app'));
          }

        ////////////////// ENEMY INTERACTION //////////////////////
      } else if ($('tr:eq(' + (currPlayerYPos + yDisp) + ') > ' + 'td:eq(' + (currPlayerXPos + xDisp) + ')').hasClass('mob')) {
          for (var i = 0; i < mobArray.length; i++) {
            if (mobArray[i].mobX == currPlayerXPos + xDisp && mobArray[i].mobY == currPlayerYPos + yDisp) {
              mobArray[i].mobHealth -= (playerMinDamage + Math.floor((playerMaxDamage - playerMinDamage) * Math.random())) * ((1 + playerObj.dmgModifier) * (1 + playerObj.playerLevel));

              if (mobArray[i].mobHealth <= 0) {
                $('tr:eq(' + (currPlayerYPos + yDisp) + ') > ' + 'td:eq(' + (currPlayerXPos + xDisp) + ')').removeClass('mob');
                var currPlayerLvl = playerObj.playerLevel;
                playerObj.playerXP += mobArray[i].mobXP;
                console.log(playerObj);
                if (playerObj.playerLevel > currPlayerLvl) {
                  playerObj.health += 50;
                  $('#playerLevel').html('Player Level: ' + playerObj.playerLevel);
                  $('#playerHealth').html('Health: ' + playerObj.health);
                  $('#playerDamage').html('Damage: ' + playerMinDamage * ((1 + playerObj.dmgModifier) * (1 + playerObj.playerLevel)) + ' - ' + (playerMaxDamage * ((1 + playerObj.dmgModifier) * (1 + playerObj.playerLevel)) - 1));
                }
                console.log(playerObj);
              } else {
                playerObj.health -= mobArray[i].mobMinDamage + Math.floor((mobArray[i].mobMaxDamage - mobArray[i].mobMinDamage) * Math.random());
                console.log(playerObj.health);
                $('#playerHealth').html('Health: ' + playerObj.health);
                ////////////////////////// LOSE CONDITION ////////////////////////

                if (playerObj.health <= 0) {
                  console.log('You are dead');
                  $('.player').removeClass('.player');
                  $('#bleb').remove();
                  mapLevel = 1;
                  playerObj = {
                    health: 100,
                    dmgModifier: 0,
                    playerWeapon: 'fists',
                    playerXP: 0,
                    get playerLevel() {
                      //return Math.floor(this.playerXP/100)}
                      return Math.floor(2.5 * Math.log(this.playerXP / 100 + 1));
                    }
                  };
                  $('main, h1, #lightButtonHolder').css({
                    'display': 'none'
                  });
                  $('#gameOverOverlay').css({
                    'display': 'block'
                  });
                  $('#gameOverOverlay').html('<h3>YOU ARE DEAD!<h3><button id="NGButton" onclick="newGameStart()">Play Again</button>');
                }
              }

              break;
            }
          }
          ///////////////////////////// WIN CONDITION /////////////////////////
        } else if ($('tr:eq(' + (currPlayerYPos + yDisp) + ') > ' + 'td:eq(' + (currPlayerXPos + xDisp) + ')').hasClass('boss')) {
            bossObj.health -= (playerMinDamage + Math.floor((playerMaxDamage - playerMinDamage) * Math.random())) * ((1 + playerObj.dmgModifier) * (1 + playerObj.playerLevel));
            console.log('works');
            console.log('bossObj.health');
            if (bossObj.health <= 0) {
              console.log('You win!');
              $('.boss').removeClass('boss');
              $('.player').removeClass('.player');
              $('#bleb').remove();
              mapLevel = 1;
              playerObj = {
                health: 100,
                dmgModifier: 0,
                playerWeapon: 'fists',
                playerXP: 0,
                get playerLevel() {
                  return Math.floor(this.playerXP / 100);
                }
              };
              $('main, h1, #lightButtonHolder').css({
                'display': 'none'
              });
              $('#gameOverOverlay').css({
                'display': 'block'
              });
              $('#gameOverOverlay').html('<h3>YOU WIN!<h3><button id="NGButton" onclick="newGameStart()">Play Again</button>');
            } else {

              playerObj.health -= bossObj.minDmg + Math.floor((bossObj.maxDmg - bossObj.minDmg) * Math.random());
              console.log(playerObj.health);
              $('#playerHealth').html('Health: ' + playerObj.health);
              console.log(bossObj.health);
              if (playerObj.health <= 0) {
                console.log('You are dead');
                $('.player').removeClass('.player');
                $('#bleb').remove();
                mapLevel = 1;
                playerObj = {
                  health: 100,
                  dmgModifier: 0,
                  playerWeapon: 'fists',
                  playerXP: 0,
                  get playerLevel() {
                    return Math.floor(this.playerXP / 100);
                  }
                };
                $('main, h1, #lightButtonHolder').css({
                  'display': 'none'
                });
                $('#gameOverOverlay').css({
                  'display': 'block'
                });
                $('#gameOverOverlay').html('<h3>YOU ARE DEAD!<h3><button id="NGButton" onclick="newGameStart()">Play Again</button>');
              }
            }
          }
    }
  }
});

/////////////////////////////////// LIGHTS ////////////////////////////

function areaLighter(currXpos, currYpos) {
  if (lightsMode == 1) {
    // TRAIL PATH //
    for (var s = -lightRadius; s <= lightRadius; s++) {
      for (var t = -lightRadius; t <= lightRadius; t++) {
        if (t + s >= -lightRadius && t + s <= lightRadius && t - s <= lightRadius && s - t <= lightRadius && t != lightRadius && t != -lightRadius && s != -lightRadius && s != lightRadius) {
          if (currYpos + s < 0 || currXpos + t < 0) {} else {
            $('tr:eq(' + (currYpos + s) + ') > td:eq(' + (currXpos + t) + ')').removeClass('dark');
          }
        }
      }
    }
  } else if (lightsMode == 2) {
    // LOCAL SITE //
    for (var s = -lightRadius; s <= lightRadius; s++) {
      for (var t = -lightRadius; t <= lightRadius; t++) {
        $('tr:eq(' + (currYpos + s) + ') > ' + 'td:eq(' + (currXpos + t) + ')').addClass('dark');
        if (t + s >= -lightRadius && t + s <= lightRadius && t - s <= lightRadius && s - t <= lightRadius && t != lightRadius && t != -lightRadius && s != -lightRadius && s != lightRadius) {
          if (currYpos + s < 0 || currXpos + t < 0) {} else {
            $('tr:eq(' + (currYpos + s) + ') > td:eq(' + (currXpos + t) + ')').removeClass('dark');
          }
        }
      }
    }
  } else {
    // LIGHT ENTIRE BOARD //
    if ($('tr:eq(0) > td:eq(0)').hasClass('dark')) {
      for (var s = 0; s < gSize; s++) {
        for (var t = 0; t < gSize; t++) {
          $('tr:eq(' + s + ') > ' + 'td:eq(' + t + ')').removeClass('dark');
        }
      }
    }
  }
}

function cycleLightMode(input) {
  var currPlayerXPos = $('.player').index();
  var currPlayerYPos = $('.player').parent().index();

  for (var s = 0; s < gSize; s++) {
    for (var t = 0; t < gSize; t++) {
      $('tr:eq(' + s + ') > ' + 'td:eq(' + t + ')').addClass('dark');
    }
  }

  if (input === undefined) {
    if (lightsMode == 3) {
      lightsMode = 1;
    } else {
      lightsMode++;
    }
  } else {
    lightsMode = input;
  }
  areaLighter(currPlayerXPos, currPlayerYPos);
}

function mobMaker(xPos, yPos, level) {
  this.mobX = xPos;
  this.mobY = yPos;
  this.mobHealth = (1 + (level - 1) * 0.1) * (minMobHealth + Math.floor(Math.random() * (maxMobHealth - minMobHealth)));
  this.mobMinDamage = Math.floor((1 + (level - 1) * 0.1) * minMobDamage);
  this.mobMaxDamage = Math.floor((1 + (level - 1) * 0.1) * maxMobDamage);
  this.mobXP = 25;
}

function itemMaker(xPos, yPos, itemObj) {
  this.itemX = xPos;
  this.itemY = yPos;
  this.name = itemObj.name;
  this.msg = itemObj.message;
  this.damage = itemObj.dmg;
}

function newGameStart() {
  ReactDOM.render(React.createElement(MainContainer, { level: mapLevel, lightX: lightsMode }), document.getElementById('app'));
  $('#gameOverOverlay').css({
    'display': 'none'
  });
  $('#lightButtonHolder, h1, main').css({
    'display': 'block'
  });
}