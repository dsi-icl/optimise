
const padding = 0; //for dev

export default {
    menuBar: {
        backgroundColor: '#3a3c46',
        padding: padding,
        gridColumn: '1/2',
        gridRow: '1/2'
    },

    middlePanel: {
        backgroundColor: '#E7E5E6',
        padding: padding,
        gridColumn: '2/3',
        overflow: 'auto',
        gridRow: '1/2'
    },

    rightPanel: {
        backgroundColor: '#f5f6fa',
        padding: padding,
        gridColumn: '3/4',
        overflow: 'auto',
        gridRow: '1/2'
    },

    farRightPanel: {
        backgroundColor: '#E7E5E6',
        padding: padding,
        gridColumn: '4/5',
        overflow: 'auto',
        gridRow: '1/2'
    },

    statusBar: {
        backgroundColor: '#ff5151',
        gridColumn: '1/5',
        overflow: 'auto',
        gridRow: '2/3',
        color: 'white'
    }
}