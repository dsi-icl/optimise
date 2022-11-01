function formatToJSON(obj) {
    const returnedObj = {};
    if (Array.isArray(obj) && obj.length === 1 && typeof obj[0] === 'number') {
        returnedObj.state = obj[0];
        return returnedObj;
    } else if (typeof obj === 'number') {
        returnedObj.state = obj;
        return returnedObj;
    } else if (typeof obj === 'object') {
        return obj;
    } else {
        returnedObj.success = true;
        returnedObj.message = obj;
        return returnedObj;
    }
}

export default formatToJSON;