## nana

### Install

    npm i nana --save
    
### Example

    var $ = require('nana')({
      name: 'nswbmw',
      address: ['nswbmw1992@gmail.com', 'example@gmail.com']
    });

    $.get('name')
      .isEqual('nswbmw')
      .done()
    // true

    $.get('address')
      .get(1)
      .match(/EXAMPLE/i)
      .done()
    //true

    $.get('name')
      .parent()
      .match({name: 'nswbmw', address: ['nswbmw1992@gmail.com', 'example@gmail.com']})
      .done()
    // true

    $.get('address')
      .get(0).next().isEqual('example@gmail.com')
      .prev().isEqual('example@gmail.com')
      .done()
    //false

    $.get('address')
      .get(0)
      .get(0)
      .parent()
      .parent()
      .parent()
      .toString()
    // '{"name":"nswbmw","address":["nswbmw1992@gmail.com","example@gmail.com"]}'

    $.match({name: /NSWBMW/i, address: /abc@gmail.com/})
      .error()
    // Error: Error!


### API

- **match(type)** - check if the given variable(object or array and other) match the type(object or array and other)
- **match(pattern [, modifiers])** - check if string matches the pattern. Either `match('Foo', /foo/i)` or `match('Foo', 'foo', 'i')`


- **done()** - return `true` or `false`
- **error()** - if `false`, throw error
- **toString()** - print the curent variable for debug


- **keys()** - get keys from object or array
- **values()** - get values from object or array
- **init()** - change the curent variable to init variable
- **parent()** - get parent variable
- **get(index)** - get children variable from object or array or string
- **slice(from, to)** - slice array
- **prev()** - get prev variable in array
- **next()** - get next variable in array
- **first()** - get first variable in array
- **last()** - get last variable in array
- **has(type)** - check if variable has the type
- **hasnt(type)** - check if variable hasn't the type


- **isEqual(str, comparison)** - check if the string matches the comparison.
- **isNotEqual(str, comparison)** - check if the string not matches the comparison.
- **isEmpty()** - check if object contains no values (no enumerable own-properties)
- **isArray()** - check if object is an Array
- **isObject()** - check if value is an Object. Note that JavaScript arrays and functions are objects
- **isArguments()** - check if object is an Arguments object
- **isFunction()** - check if object is a Function
- **isString()** - check if object is a String
- **isNumber()** - check if object is a Number (including NaN)
- **isFinite()** - check if object is a finite Number
- **isBoolean()** - check if object is either true or false
- **isDate()** - check if object is a Date
- **isRegExp()** - check if object is a RegExp
- **isNaN()** - check if object is NaN. this is not the same as the native isNaN function, which will also return true for many other not-number values, such as undefined
- **isNull()** - check if the value of object is null
- **isUndefined()** - check if value is undefined
- **isContain(str, seed)** - check if the string contains the seed.
- **isEmail(str)** - check if the string is an email.
- **isURL(str [, options])** - check if the string is an URL. `options` is an object which defaults to `{ protocols: ['http','https','ftp'], require_tld: true, require_protocol: false, allow_underscores: false }`.
- **isIP(str [, version])** - check if the string is an IP (version 4 or 6).
- **isAlpha(str)** - check if the string contains only letters (a-zA-Z).
- **isNumeric(str)** - check if the string contains only numbers.
- **isAlphanumeric(str)** - check if the string contains only letters and numbers.
- **isBase64(str)** - check if a string is base64 encoded.
- **isHexadecimal(str)** - check if the string is a hexadecimal number.
- **isHexColor(str)** - check if the string is a hexadecimal color.
- **isLowercase(str)** - check if the string is lowercase.
- **isUppercase(str)** - check if the string is uppercase.
- **isInt(str)** - check if the string is an integer.
- **isFloat(str)** - check if the string is a float.
- **isDivisibleBy(str, number)** - check if the string is a number that's divisible by another.
- **isLength(str, min [, max])** - check if the string's length falls in a range. Note: this function takes into account surrogate pairs.
- **isByteLength(str, min [, max])** - check if the string's length (in bytes) falls in a range.
- **isUUID(str [, version])** - check if the string is a UUID (version 3, 4 or 5).
- **isDate(str)** - check if the string is a date.
- **isAfter(str [, date])** - check if the string is a date that's after the specified date (defaults to now).
- **isBefore(str [, date])** - check if the string is a date that's before the specified date.
- **isIn(str, values)** - check if the string is in a array of allowed values.
- **isCreditCard(str)** - check if the string is a credit card.
- **isISBN(str [, version])** - check if the string is an ISBN (version 10 or 13).
- **isJSON(str)** - check if the string is valid JSON (note: uses JSON.parse).
- **isMultibyte(str)** - check if the string contains one or more multibyte chars.
- **isAscii(str)** - check if the string contains ASCII chars only.
- **isFullWidth(str)** - check if the string contains any full-width chars.
- **isHalfWidth(str)** - check if the string contains any half-width chars.
- **isVariableWidth(str)** - check if the string contains a mixture of full and half-width chars.
- **isSurrogatePair(str)** - check if the string contains any surrogate pairs chars.

### TODO

- fix bugs
- make test

### License

MIT