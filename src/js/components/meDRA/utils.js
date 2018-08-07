/* This function was used to generate tree array structure expected by antd tree-select with <TreeSelect treeData={treeData}>;
    rendered useless when we opted for lazy loading but might need it in the future if we revert */
// export function formatTreeDataForAntd(entry) {    //entry = [ key, {text: 'whatever'}  ]
//     const key = entry[0];
//     const value = entry[1];
//     if (Object.keys(value).length === 1 && value.hasOwnProperty('text')){
//         return { value: key, key: key, title: value.text };
//     } else if (Object.keys(value).length !== 1 && value.hasOwnProperty('text')){
//         const text = value.text;
//         delete value.text;
//         return { value: key, key: key, title: text, children: Object.entries(value).map(formatTreeDataForAntd) };
//     } else {
//         throw Error(`${key} is wrong!`);
//     }
// }




/* not in used in react app but to generate seeds for data base */
export function makeMeddraSeeds(tree) {
    let id = 1;
    const hash = [];
    const formatToHashTable = parentId => entry => {
        const key = entry[0];
        const value = entry[1];
        if (Object.keys(value).length === 1 && value.hasOwnProperty('text')){
            hash.push({ id, meddraCode: key, value: value.text, parentId: parentId, isLeaf: 1 });
            id++;
        } else if (Object.keys(value).length !== 1 && value.hasOwnProperty('text')){
            const text = value.text;
            delete value.text;
            hash.push({ id, meddraCode: key, value: text, parentId: parentId, isLeaf: 0 });
            id++;
            Object.entries(value).forEach(formatToHashTable(id - 1));
        } else {
            throw Error(`${key} is wrong!`);
        }
    };
    Object.entries(tree).forEach(formatToHashTable(null));
    return hash;
}