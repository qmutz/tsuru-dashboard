jest.dontMock('../jsx/components/list.jsx');
jest.dontMock('fuzzy');

var React = require('react/addons'),
    List = require('../jsx/components/list.jsx'),
    AppList = List.AppList,
    $ = require('jquery'),
    TestUtils = React.addons.TestUtils;

describe('AppList', function() {
  it('should has app-list as className', function() {
    var list = TestUtils.renderIntoDocument(
      <AppList url="http://localhost:80/apps/list.json" />
    );
    
    expect(list.getDOMNode("div").className).toEqual("app-list");
  });

  it ('should be composed by AppSearch, Loading and AppTable', function() {
    var list = TestUtils.renderIntoDocument(
      <AppList url="http://localhost:80/apps/list.json" />
    ).getDOMNode("div");

    expect(list.children.length).toEqual(3);

    var appSearch = list.children[0];
    expect(appSearch.className).toEqual("search");

    var loading = list.children[1];
    expect(loading.textContent).toEqual('');

    var appTable = list.children[2];
    expect(appTable.className).toEqual("table");
  });

  it('should load apps on render', function() {
    var list = TestUtils.renderIntoDocument(
      React.createElement(List.AppList, {url: 'http://localhost:80/apps/list.json'})
    );

    $.ajax.mock.calls[2][0].success({apps: [{name: "appname"}, {name: "otherapp"}]});

    expect({apps: [{name: "appname"}, {name: "otherapp"}], cached: [{name: "appname"}, {name: "otherapp"}], loading: false}).toEqual(list.state);

	var items = TestUtils.scryRenderedDOMComponentsWithTag(list, "td");
	expect(items.length).toBe(2);
  });

  it('should filter list by app name', function() {
    var list = TestUtils.renderIntoDocument(
      React.createElement(List.AppList, {url: 'http://localhost:80/apps/list.json'})
    );

    $.ajax.mock.calls[3][0].success({apps: [{name: "appname"}, {name: "other"}]});

	var input = TestUtils.findRenderedDOMComponentWithTag(list, "input");
	TestUtils.Simulate.change(input, {target: {value: "oth"}});
    
    expect({apps: [{name: "other"}], cached: [{name: "appname"}, {name: "other"}], loading: false}).toEqual(list.state);

	var items = TestUtils.scryRenderedDOMComponentsWithTag(list, "td");
	expect(items.length).toBe(1);
  });

  it('should list all on empty search', function() {
    var list = TestUtils.renderIntoDocument(
      React.createElement(List.AppList, {url: 'http://localhost:80/apps/list.json'})
    );

    $.ajax.mock.calls[4][0].success({apps: [{name: "appname"}, {name: "other"}]});

	var input = TestUtils.findRenderedDOMComponentWithTag(list, "input");
	TestUtils.Simulate.change(input, {target: {value: "oth"}});
	TestUtils.Simulate.change(input, {target: {value: ""}});

	expect({apps: [{name: "appname"}, {name: "other"}], cached: [{name: "appname"}, {name: "other"}], loading: false}).toEqual(list.state);

	var items = TestUtils.scryRenderedDOMComponentsWithTag(list, "td");
	expect(items.length).toBe(2);
  });
});