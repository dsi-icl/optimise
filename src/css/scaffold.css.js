
const padding = 0; //for dev

export default {
    menuBar: {
        backgroundColor: '#3a3c46',
        padding: padding,
        gridColumn: '1/2',
        position: 'relative'
    },

    middlePanel: {
        backgroundColor: '#E7E5E6',
        padding: padding,
        gridColumn: '2/3',
        overflow: 'auto'
    },

    rightPanel: {
        backgroundColor: '#f5f6fa',
        padding: 0,
        gridColumn: '3/4',
        overflow: 'auto'
    },

    farRightPanel: {
        backgroundColor: '#E7E5E6',
        padding: padding,
        gridColumn: '4/5',
        height: 'calc(100% - 1.2em)',
        overflow: 'auto'
    },

    statusBar: {
        position: 'fixed',
        backgroundColor: '#ff5151',
        width: '100%',
        minHeight: '1.2em',
        overflow: 'auto',
        color: 'white',
        bottom: 0,
        left: 0,
        zIndex: 1001
    }
}