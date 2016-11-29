'use strict';

var recentURL = 'https://fcctop100.herokuapp.com/api/fccusers/top/recent';
var allTimeURL = 'https://fcctop100.herokuapp.com/api/fccusers/top/alltime';
var FCCRootURL = 'https://www.freecodecamp.com/';
var rows2;

$(document).ajaxSend(function () {
  console.log('START');
});
$(document).ajaxStop(function () {
  console.log('STOP');
});

var Century = React.createClass({
  displayName: 'Century',

  getInitialState: function getInitialState() {
    return { data2: [], reqURL: recentURL };
  },
  getData: function getData(URL) {
    $.ajax({
      url: URL,
      success: function (data) {
        this.setState({ data2: data });
      }.bind(this)
    });
  },
  componentWillMount: function componentWillMount() {
    this.getData(recentURL);
  },

  render: function render() {
    var _this = this;

    return React.createElement(
      'table',
      null,
      React.createElement(
        'thead',
        null,
        React.createElement(
          'th',
          null,
          '#'
        ),
        React.createElement('th', null),
        React.createElement(
          'th',
          null,
          'Name'
        ),
        React.createElement(
          'th',
          { onClick: function onClick() {
              _this.getData(recentURL);_this.props.upd();
            } },
          'Recent Points'
        ),
        React.createElement(
          'th',
          { onClick: function onClick() {
              _this.getData(allTimeURL);_this.props.upd();
            } },
          'All Time Points'
        )
      ),
      React.createElement(CenturyRows, { UserData: this.state.data2 })
    );
  }
});

var CenturyRows = React.createClass({
  displayName: 'CenturyRows',

  dataSorter: function dataSorter() {
    var count = 0;
    rows2 = this.props.UserData.map(function (rowItem) {
      count++;
      return React.createElement(CenturyItem, { imgurl: rowItem.img, counter: count, name: rowItem.username, recent: rowItem.recent, allTime: rowItem.alltime });
    }, this);
  },
  render: function render() {
    this.dataSorter();
    return React.createElement(
      'tbody',
      null,
      rows2
    );
  }
});

var CenturyItem = React.createClass({
  displayName: 'CenturyItem',

  render: function render() {
    var currUserURL = FCCRootURL + this.props.name;
    return React.createElement(
      'tr',
      null,
      React.createElement(
        'td',
        null,
        this.props.counter
      ),
      React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { href: currUserURL },
          React.createElement('img', { src: this.props.imgurl })
        )
      ),
      React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { href: currUserURL },
          this.props.name
        )
      ),
      React.createElement(
        'td',
        null,
        this.props.recent
      ),
      React.createElement(
        'td',
        null,
        this.props.allTime
      )
    );
  }
});

var TitleBar = React.createClass({
  displayName: 'TitleBar',

  getInitialState: function getInitialState() {
    var d = new Date();
    var s = d.toUTCString();
    return { lcDate: s };
  },

  newRunner: function newRunner() {
    var d = new Date();
    var s = d.toUTCString();
    this.setState({ lcDate: s });
  },

  render: function render() {
    return React.createElement(
      'div',
      { id: 'titleContainer' },
      React.createElement(
        'h1',
        null,
        'FCC LeaderBoard'
      ),
      React.createElement(
        'h3',
        null,
        'Last Checked: ',
        this.state.lcDate
      ),
      '       ',
      React.createElement(Century, { upd: this.newRunner })
    );
  }
});

ReactDOM.render(React.createElement(TitleBar, null), document.getElementById('app'));