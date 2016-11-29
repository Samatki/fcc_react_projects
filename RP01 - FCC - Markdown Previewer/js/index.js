'use strict';

var introText = 'Heading\n=======\n\nSub-heading\n-----------\n \n### Another deeper heading\n \nParagraphs are separated\nby a blank line.\n\nLeave 2 spaces at the end of a line to do a  \nline break\n\nText attributes *italic*, **bold**, \n`monospace`, ~~strikethrough~~ .\n\nShopping list:\n\n  * apples\n  * oranges\n  * pears\n\nNumbered list:\n\n  1. apples\n  2. oranges\n  3. pears\n\nThe rain---not the reign---in\nSpain.\n\n *[Herman Fassett](https://freecodecamp.com/hermanfassett)*';

var Program = React.createClass({
  displayName: 'Program',

  getInitialState: function getInitialState() {
    return { introText2: introText };
  },

  blahblah: function blahblah() {
    this.setState({ introText2: $('textArea').val() });
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'textArea',
        { type: 'text', rows: '30', className: 'col-md-4 col-md-offset-2', onChange: this.blahblah },
        this.state.introText2
      ),
      React.createElement(ResultArea, { content: this.state.introText2 })
    );
  }
});

function ResultArea(props) {
  return React.createElement('div', { id: 'resultContainer', className: 'col-md-6', dangerouslySetInnerHTML: { __html: marked(props.content) } });
}

ReactDOM.render(React.createElement(Program, null), $('#app')[0]);