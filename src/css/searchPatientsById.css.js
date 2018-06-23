export default {
    patientBanner: {
        backgroundColor: 'darkgrey',
        color: 'black',
        borderRadius: 0,
        fontFamily: 'sans-serif',
        fontSize: 12,
        minHeight: 30,
        borderBottom: '1px solid grey',
        margin: '13px auto',
        width: '100%',
        padding: '5px 5px',
        textAlign: 'center',
        ':hover': { backgroundColor: '#f5f6fa', cursor: 'pointer' } },
    
    createPatientButton: {
        backgroundColor: '#ff5151',
        color: 'black',
        borderRadius: 20,
        fontFamily: 'sans-serif',
        fontSize: 12,
        minHeight: 17,
        margin: '13px auto',
        width: '80%',
        paddingTop: 5,
        textAlign: 'center',
        overflow: 'hidden',
        ':hover': { color: '#f5f6fa', backgroundColor: '#EA2027', cursor: 'pointer' } },
    
    searchBar: {
        margin: '1px auto',
        width: '55%'
    },

    searchBarInput: {
        backgroundColor: 'white',
        margin: '1px auto',
        width: '100%'
    }
}