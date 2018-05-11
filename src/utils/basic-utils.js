exports.isEmptyObject = function(object) {
    if (typeof(object) === 'object' && arguments.length === 1) {
      return Object.keys(object).length === 0;
    } else {
      throw TypeError('isEmptyObject() function only takes one object as parameter')
    } 
};