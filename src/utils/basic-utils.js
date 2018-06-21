exports.isEmptyObject = function(object) {
    if (typeof(object) === 'object' && arguments.length === 1) {
        return Object.keys(object).length === 0;
    } else {
        throw TypeError('isEmptyObject() function only takes one object as parameter')
    } 
};


exports.validateAndFormatDate = function(dateObj){
    //example dateObj = {"day":5, "year": 2015, "month": 1-12}
    if (dateObj.day && dateObj.year && dateObj.month){
        const daysInAMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        const months = [1,2,3,4,5,6,7,8,9,10,11,12];
        if ((!(dateObj.year % 4) && dateObj.year % 100) || !(dateObj.year % 400)) {daysInAMonth[1] = 29}
        if (dateObj.day in days && dateObj.month in months && dateObj.day <= daysInAMonth[dateObj.month-1]) {
            return dateObj.day + '/' + dateObj.month + '/' + dateObj.year;
        } else {
            return false
        }
    } else {
        return false
    }
} 