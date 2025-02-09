const camelToSnake = (obj) => {
    const newObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            newObj[snakeKey] = obj[key];
        }
    }
    return newObj;
};

module.exports = {
    camelToSnake
};
