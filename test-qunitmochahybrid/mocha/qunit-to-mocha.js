//Can't duck punch here because test() is not yet defined.
_test = null;

//Duck punch module() to get around Mocha's node.js compatibility.
function module(name, lifecycle) {
	//Duck punch test().
	if(_test === null) { duckPunch_test(); }

	//Use our modified Mocha suite() so that we can set up beforeEach and afterEach.
	var _suite = suite(name);
	if(lifecycle !== undefined) {
		if(lifecycle.setup !== undefined) {
			_suite.beforeEach(lifecycle.setup);
		}
		if(lifecycle.teardown !== undefined) {
			_suite.afterEach(lifecycle.teardown);
		}
	}
};

//Duck punch test() to get around incompatibility between QUnit and Mocha's syntax.
function duckPunch_test() {
	_test = test;
	//Mocha doesn't take an "expected" parameter.
	test = function(name, expected, test) {
		_test(name, test);
	}
    asyncTest = test;
};

//Duck punch QUnit's assertions.
function ok(state, message) {
	chai.assert.ok(state, message);
};

function notEqual(actual, expected, message) {
	chai.assert.notEqual(actual, expected, message);
};

function equal(actual, expected, message) {
	chai.assert.equal(actual, expected, message);
};
//function equals(actual, expected, message) {
//	chai.assert.equal(actual, expected, message);
//};

function deepEqual(actual, expected, message) {
	chai.assert.deepEqual(actual, expected, message);
};

function strictEqual(actual, expected, message) {
	chai.assert.strictEqual(actual, expected, message);
};
