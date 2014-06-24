var flat = require('flat');
var validator = require('validator');
var _ = require('underscore');
var clone = require('clone');

function NANA(args) {
  if (!(this instanceof NANA)) return new NANA(args);
  if (arguments.length === 0) throw new Error("NANA() need one parameter at least!");
  if (arguments.length > 1 || !(_.isArray(args) || _.isObject(args))) {
    args = _.toArray(arguments);
  }
  this._initArgs = args;
  this._curArgs = args;
  this._parentArgs = [];
  this.flag = true;
  this.flat = flat;
  this.validator = validator;
  this._ = _;
}

module.exports = NANA;

NANA.prototype.init = function init() {
  if (!this.flag) return this;

  this._curArgs = clone(this._initArgs);
  this._parentArgs = [];

  return this;
};

NANA.prototype.parent = function parent() {
  if (!this.flag) return this;

  this._curArgs = this._parentArgs.pop();

  return this;
};

NANA.prototype.get = function get(key) {
  if (!this.flag) return this;

  this._parentArgs.push(this._curArgs);
  this._curArgs = this._curArgs[key];

  return this;
};

NANA.prototype.slice = function slice(from, to) {
  if (!_.isArray(this._curArgs)) {
    this.flag = false;
    return this;
  }
  this._curArgs = this._curArgs.slice(from, to);
  return this;
};

NANA.prototype.prev = function prev() {
  var _parentArg = this._parentArgs[this._parentArgs.length - 1];
  if (!_.isArray(_parentArg)) {
    this.flag = false;
    return this;
  }
  var _index = _.indexOf(_parentArg, this._curArgs);
  if (_index > 0) {
    this._curArgs = _parentArg[_index - 1];
  } else {
    this.flag = false;
  }
  return this;
};

NANA.prototype.next = function next() {
  var _parentArg = this._parentArgs[this._parentArgs.length - 1];
  if (!_.isArray(_parentArg)) {
    this.flag = false;
    return this;
  }
  var _index = _.indexOf(_parentArg, this._curArgs);
  if (_index < this._curArgs.length - 1) {
    this._curArgs = _parentArg[_index + 1];
  } else {
    this.flag = false;
  }
  return this;
};

NANA.prototype.first = function first() {
  if (!_.isArray(this._curArgs)) {
    this.flag = false;
    return this;
  }
  
  this._curArgs = this._curArgs[0];
  return this;
};

NANA.prototype.last = function last() {
  if (!_.isArray(this._curArgs)) {
    this.flag = false;
    return this;
  }
  
  this._curArgs = this._curArgs[this._curArgs.length - 1];
  return this;
};

///////////////////////////////////////////////////////////////

NANA.prototype.keys = function keys() {
  if (!this.flag) return this;

  if (!_.isArray(this._curArgs) || !_.isObject(this._curArgs)) {
    throw new Error("'.keys()' must be apply for array or object!");
  }
  this._curArgs = _.keys(this._curArgs);

  return this;
};

NANA.prototype.values = function values() {
  if (!this.flag) return this;

  if (!_.isArray(this._curArgs) || !_.isObject(this._curArgs)) {
    throw new Error("'.values()' must be apply for array or object!");
  }
  this._curArgs = _.values(this._curArgs);

  return this;
};

///////////////////////////////////////////////////////////////

NANA.prototype.done = function done() {
  this._curArgs = this._initArgs;
  var _flag = this.flag;
  this.flag = true;
  return _flag;
};

NANA.prototype.error = function error() {
  if (!this.flag) throw new Error('Error!');
};

NANA.prototype.toString = function toString() {  
  try {
    return JSON.stringify(this._curArgs);
  } catch(e) {
    return this._curArgs.toString();
  }
};

///////////////////////////////////////////////////////////////

NANA.prototype.has = function has(arr) {
  if (!this.flag) return this;

  if (!_.isArray(arr) || arguments.length > 1) {
    return this.has(_.toArray(arguments));
  }

  if (_.isArray(this._curArgs)) {
    var _obj = flat.flatten(arr);
    this.flag = _.has.apply(null, [_obj].concat(arr));
  } else if (_.isObject(this._curArgs)) {
    this.flag = _.has.apply(null, [this._curArgs].concat(arr));
  } else {
    this.flag = false;
  }

  return this;
};

NANA.prototype.hasnt = function hasnt(arr) {
  if (!this.flag) return this;

  if (!_.isArray(arr) || arguments.length > 1) {
    return this.hasnt(_.toArray(arguments));
  }

  if (_.isArray(this._curArgs)) {
    var _obj = flat.flatten(arr);
    this.flag = !_.has.apply(null, [_obj].concat(arr));
  } else if (_.isObject(this._curArgs)) {
    this.flag = !_.has.apply(null, [this._curArgs].concat(arr));
  } else {
    this.flag = true;
  }

  return this;
};

NANA.prototype.match = function match(pattern, modifiers) {
  if (!this.flag) return this;

  if (_.isObject(this._curArgs)) {
    var _flatCurArgs = flat.flatten(this._curArgs);
    var _flatCompArgs = flat.flatten(pattern);
    // console.log(_flatCurArgs);
    // console.log(_flatCompArgs);
    // console.log(this._curArgs)
    if (_.keys(_flatCurArgs).length !== _.keys(_flatCompArgs).length) {
      this.flag = false;
      return this;
    }
    for (var key in _flatCurArgs) {
      if (key in _flatCompArgs) {
        if (!this.flag) return this;
        if (!_.isString(validator.toString(_flatCurArgs[key]))) {
          this.flag = false;
          return this;
        }
        // console.log(key)
        // console.log(_flatCurArgs[key])
        // console.log(_flatCompArgs[key])
        this.flag = validator.matches(_flatCurArgs[key], _flatCompArgs[key]);
      } else {
        this.flag = false;
        return this;
      }
    }
    return this;
  }

  if (_.isArray(this._curArgs)) {
    this.flag = this.match(flat.flatten(this._curArgs));
    return this;
  }

  if (_.isString(this._curArgs)) {
    this.flag = validator.matches(this._curArgs, pattern, modifiers);
    return this;
  }

  try {
    this.flag = validator.matches(validator.toString(this._curArgs), pattern, modifiers);
  } catch(e) {
    this.flag = false;
  }
  return this;
};

///////////////////////////////////////////////////////////////

NANA.prototype.isEqual = function isEqual(obj) {
  if (!this.flag) return this;
  this.flag = _.isEqual(this._curArgs, obj);
  return this;
};

NANA.prototype.isNotEqual = function isNotEqual(obj) {
  if (!this.flag) return this;
  this.flag = !_.isEqual(this._curArgs, obj);
  return this;
};

NANA.prototype.isEmpty = function isEmpty() {
  if (!this.flag) return this;
  this.flag = _.isEmpty(this._curArgs);
  return this;
};

NANA.prototype.isArray = function isArray() {
  if (!this.flag) return this;
  this.flag = _.isArray(this._curArgs);
  return this;
};

NANA.prototype.isObject = function isObject() {
  if (!this.flag) return this;
  this.flag = _.isObject(this._curArgs);
  return this;
};

NANA.prototype.isArguments = function isArguments() {
  if (!this.flag) return this;
  this.flag = _.isArguments(this._curArgs);
  return this;
};

NANA.prototype.isFunction = function isFunction() {
  if (!this.flag) return this;
  this.flag = _.isFunction(this._curArgs);
  return this;
};

NANA.prototype.isString = function isString() {
  if (!this.flag) return this;
  this.flag = _.isString(this._curArgs);
  return this;
};

NANA.prototype.isNumber = function isNumber() {
  if (!this.flag) return this;
  this.flag = _.isNumber(this._curArgs);
  return this;
};

NANA.prototype.isFinite = function isFinite() {
  if (!this.flag) return this;
  this.flag = _.isFinite(this._curArgs);
  return this;
};

NANA.prototype.isBoolean = function isBoolean() {
  if (!this.flag) return this;
  this.flag = _.isBoolean(this._curArgs);
  return this;
};

NANA.prototype.isDate = function isDate() {
  if (!this.flag) return this;
  this.flag = _.isDate(this._curArgs);
  return this;
};

NANA.prototype.isRegExp = function isRegExp() {
  if (!this.flag) return this;
  this.flag = _.isRegExp(this._curArgs);
  return this;
};

NANA.prototype.isNaN = function isNaN() {
  if (!this.flag) return this;
  this.flag = _.isNaN(this._curArgs);
  return this;
};

NANA.prototype.isNull = function isNull() {
  if (!this.flag) return this;
  this.flag = _.isNull(this._curArgs);
  return this;
};

NANA.prototype.isUndefined = function isUndefined() {
  if (!this.flag) return this;
  this.flag = _.isUndefined(this._curArgs);
  return this;
};

NANA.prototype.isDate = function isDate() {
  if (!this.flag) return this;
  this.flag = _.isDate(this._curArgs);
  return this;
};

NANA.prototype.isEmail = function isEmail() {
  if (!this.flag) return this;
  this.flag = validator.isEmail(this._curArgs);
  return this;
};

NANA.prototype.isURL = function isURL(options) {
  options = options || {};
  if (!this.flag) return this;
  this.flag = validator.isURL(this._curArgs, options);
  return this;
};

NANA.prototype.isIP = function isIP() {
  if (!this.flag) return this;
  this.flag = validator.isIP(this._curArgs, options);
  return this;
};

NANA.prototype.isAlpha = function isAlpha() {
  if (!this.flag) return this;
  this.flag = validator.isAlpha(this._curArgs);
  return this;
};

NANA.prototype.isNumeric = function isNumeric() {
  if (!this.flag) return this;
  this.flag = validator.isNumeric(this._curArgs);
  return this;
};

NANA.prototype.isAlphanumeric = function isAlphanumeric() {
  if (!this.flag) return this;
  this.flag = validator.isAlphanumeric(this._curArgs);
  return this;
};

NANA.prototype.isBase64 = function isBase64() {
  if (!this.flag) return this;
  this.flag = validator.isBase64(this._curArgs);
  return this;
};

NANA.prototype.isHexadecimal = function isHexadecimal() {
  if (!this.flag) return this;
  this.flag = validator.isHexadecimal(this._curArgs);
  return this;
};

NANA.prototype.isHexColor = function isHexColor() {
  if (!this.flag) return this;
  this.flag = validator.isHexColor(this._curArgs);
  return this;
};

NANA.prototype.isLowercase = function isLowercase() {
  if (!this.flag) return this;
  this.flag = validator.isLowercase(this._curArgs);
  return this;
};

NANA.prototype.isUppercase = function isUppercase() {
  if (!this.flag) return this;
  this.flag = validator.isUppercase(this._curArgs);
  return this;
};

NANA.prototype.isInt = function isInt() {
  if (!this.flag) return this;
  this.flag = validator.isInt(this._curArgs);
  return this;
};

NANA.prototype.isFloat = function isFloat() {
  if (!this.flag) return this;
  this.flag = validator.isFloat(this._curArgs);
  return this;
};

NANA.prototype.isDivisibleBy = function isDivisibleBy(number) {
  if (!this.flag) return this;
  this.flag = validator.isDivisibleBy(this._curArgs, number);
  return this;
};

NANA.prototype.isLength = function isLength(min, max) {
  if (!this.flag) return this;
  this.flag = validator.isLength(this._curArgs, min, max);
  return this;
};

NANA.prototype.isByteLength = function isByteLength(min, max) {
  if (!this.flag) return this;
  this.flag = validator.isByteLength(this._curArgs, min, max);
  return this;
};

NANA.prototype.isUUID = function isUUID(version) {
  if (!this.flag) return this;
  this.flag = validator.isUUID(this._curArgs, version);
  return this;
};

NANA.prototype.isDate = function isDate() {
  if (!this.flag) return this;
  this.flag = validator.isDate(this._curArgs);
  return this;
};

NANA.prototype.isAfter = function isAfter(date) {
  if (!this.flag) return this;
  this.flag = validator.isAfter(this._curArgs, date);
  return this;
};

NANA.prototype.isBefore = function isBefore(date) {
  if (!this.flag) return this;
  this.flag = validator.isBefore(this._curArgs, date);
  return this;
};

NANA.prototype.isIn = function isIn(values) {
  if (!this.flag) return this;
  this.flag = validator.isIn(this._curArgs, values);
  return this;
};

NANA.prototype.isCreditCard = function isCreditCard() {
  if (!this.flag) return this;
  this.flag = validator.isCreditCard(this._curArgs);
  return this;
};

NANA.prototype.isISBN = function isISBN(version) {
  if (!this.flag) return this;
  this.flag = validator.isISBN(this._curArgs, version);
  return this;
};

NANA.prototype.isJSON = function isJSON() {
  if (!this.flag) return this;
  this.flag = validator.isJSON(this._curArgs);
  return this;
};

NANA.prototype.isMultibyte = function isMultibyte() {
  if (!this.flag) return this;
  this.flag = validator.isMultibyte(this._curArgs);
  return this;
};

NANA.prototype.isAscii = function isAscii() {
  if (!this.flag) return this;
  this.flag = validator.isAscii(this._curArgs);
  return this;
};

NANA.prototype.isFullWidth = function isFullWidth() {
  if (!this.flag) return this;
  this.flag = validator.isFullWidth(this._curArgs);
  return this;
};

NANA.prototype.isHalfWidth = function isHalfWidth() {
  if (!this.flag) return this;
  this.flag = validator.isHalfWidth(this._curArgs);
  return this;
};

NANA.prototype.isVariableWidth = function isVariableWidth() {
  if (!this.flag) return this;
  this.flag = validator.isVariableWidth(this._curArgs);
  return this;
};

NANA.prototype.isSurrogatePair = function isSurrogatePair() {
  if (!this.flag) return this;
  this.flag = validator.isSurrogatePair(this._curArgs);
  return this;
};

NANA.prototype.isContain = function isContain(seed) {
  if (!this.flag) return this;
  this.flag = validator.contains(this._curArgs, seed);
  return this;
};

//TODO
// NANA.prototype.extend = function extend() {
// };
