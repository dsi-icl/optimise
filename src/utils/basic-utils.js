exports.isEmptyObject = function(object) {
    if (typeof(object) === 'object' && arguments.length === 1) {
        return Object.keys(object).length === 0;
    } else {
        throw TypeError('isEmptyObject() function only takes one object as parameter')
    } 
};


exports.validateAndFormatDate = function(dateObj){
    //example dateObj = {"date":5, "year": 2015, "month": 1-12}
    if (dateObj.date && dateObj.year && dateObj.month){
        const daysInAMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((!(dateObj.year % 4) && dateObj.year % 100) || !(dateObj.year % 400)) {daysInAMonth[1] = 29}
        if (dateObj.date <= daysInAMonth[dateObj.month-1]) {
            return dateObj.date + '/' + dateObj.month + '/' + dateObj.year;
        } else {
            return false
        }
    } else {
        return false
    }
} 