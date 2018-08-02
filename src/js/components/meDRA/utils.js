export const o = {
    '#05329': {
        'text': 'Blood and lymphatic system disorders',
        '#02086': {
            'text': 'Anaemias nonhaemolytic and marrow depression',
            '#02042': {
                'text': 'Anaemia deficiencies',
                '#02043': {
                    'text': 'Anaemia folate deficiency'
                },
                '#66468': {
                    'text': 'Anaemia of pregnancy'
                },
                '#02080': {
                    'text': 'Anaemia vitamin B12 deficiency'
                },
                '#02081': {
                    'text': 'Anaemia vitamin B6 deficiency'
                },
                '#61101': {
                    'text': 'Deficiency anaemia'
                },
                '#22972': {
                    'text': 'Iron deficiency anaemia'
                },
                '#34695': {
                    'text': 'Pernicious anaemia'
                },
                '#37006': {
                    'text': 'Protein deficiency anaemia'
                },
                '#42272': {
                    'text': 'Subacute combined cord degeneration'
                }
            }
        }
    },
    '#053429': {
        'text': 'Blood and lymphatic system disorders',
        '#020486': {
            'text': 'Anaemias nonhaemolytic and marrow depression',
            '#024042': {
                'text': 'Anaemia deficiencies',
                '#024043': {
                    'text': 'Anaemia folate deficiency'
                },
                '#664468': {
                    'text': 'Anaemia of pregnancy'
                },
                '#024080': {
                    'text': 'Anaemia vitamin B12 deficiency'
                },
                '#024081': {
                    'text': 'Anaemia vitamin B6 deficiency'
                },
                '#614101': {
                    'text': 'Deficiency anaemia'
                },
                '#224972': {
                    'text': 'Iron deficiency anaemia'
                },
                '#344695': {
                    'text': 'Pernicious anaemia'
                },
                '#374006': {
                    'text': 'Protein deficiency anaemia'
                },
                '#424272': {
                    'text': 'Subacute combined cord degeneration'
                }
            }
        }
    }
};


export function formatOneNodeForAntd(entry) {    //entry = [ key, {text: 'whatever'}  ] 
    const key = entry[0];
    const value = entry[1];
    if (Object.keys(value).length === 1 && value.hasOwnProperty('text')){
        return { value: key, key: key, title: value.text };
    } else if (Object.keys(value).length !== 1 && value.hasOwnProperty('text')){
        const text = value.text;
        delete value.text;
        return { value: key, key: key, title: text, children: Object.entries(value).map(formatOneNodeForAntd) };
    } else {
        throw Error(`${key} is wrong!`);
    }
}


export function formatToHashTable(tree) {   //tree = entries meddra tree
    //later
}
