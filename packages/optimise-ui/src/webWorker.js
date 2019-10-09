import store from './redux/store';

const blob = new Blob([`onmessage = ${processor.toString()}`]);
const blobURL = window.URL.createObjectURL(blob);
const worker = new Worker(blobURL);

function processor({ data }) {

    let reponse = {};
    if (data.work === 'tree') {

        const constructTree = (table, parent = null) =>
            table.filter(el => el.parent === parent && el.deleted === '-').map(el => Object.assign({}, el, {
                children: el.isLeaf ? undefined : constructTree(table, el.id),
                state: { expanded: false, favorite: false, deletable: false }
            }))
            ;
        reponse = constructTree(data.payload);
        postMessage({ data, reponse });
    }
}

worker.onmessage = function ({ data: { data, reponse } }) {
    store.dispatch({
        type: data.type,
        payload: reponse
    });
};

export function start() { }
export function dispatch(data) {
    worker.postMessage(data);
}