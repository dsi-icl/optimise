// function formatOneNodeForAntd(entry) {    //entry = [ key, {text: 'whatever'}  ] 
//     const key = entry[0];
//     const value = entry[1];
//     if (Object.keys(value).length === 1 && value.hasOwnProperty('text')){
//         return { value: key, key: key, title: value.text };
//     } else if (Object.keys(value).length !== 1 && value.hasOwnProperty('text')){
//         const text = value.text;
//         delete value.text;
//         return { value: key, key: key, title: text, children: Object.entries(value).map(formatOneNodeForAntd) };
//     } else {
//         throw Error(`${key} is wrong!`);
//     }
// }

function makeMeddraSeeds(tree) {
    let id = 1;
    const hash = [];
    const formatToHashTable = parentId => entry => {
        const key = entry[0];
        const value = entry[1];
        if (Object.keys(value).length === 1 && value.hasOwnProperty('text')){
            hash.push({ id, meddraCode: key, value: value.text, parentId: parentId });
            id++;
        } else if (Object.keys(value).length !== 1 && value.hasOwnProperty('text')){
            const text = value.text;
            delete value.text;
            hash.push({ id, meddraCode: key, value: text, parentId: parentId });
            id++;
            Object.entries(value).forEach(formatToHashTable(id - 1));
        } else {
            throw Error(`${key} is wrong!`);
        }
    };
    Object.entries(tree).forEach(formatToHashTable(null));
    return hash;
}

module.exports = makeMeddraSeeds;