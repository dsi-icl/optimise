const height = 700; //for dev
const padding = 0; //for dev

export default {
    menuBar: {
        backgroundColor: '#313E51',
        height: height,
        padding: padding,
        gridColumn: '1/2'
    },

    middlePanel: {
        backgroundColor: '#E7E5E6',
        height: height,
        padding: padding,
        gridColumn: '2/3',
        overflow: 'auto'
    },

    rightPanel: {
        backgroundColor: '#f5f6fa',
        height: height,
        padding: padding,
        gridColumn: '3/4',
        overflow: 'auto'
    },

    farRightPanel: {
        backgroundColor: '#E7E5E6',
        height: height,
        padding: padding,
        gridColumn: '4/5',
        overflow: 'auto'
    }
}