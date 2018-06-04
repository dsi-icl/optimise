export default {
    patientBanner: {
        backgroundColor: '#D0CECF',
        color: 'black',
        borderRadius: 10,
        fontFamily: 'sans-serif',
        fontSize: 13,
        height: 50,
        margin: '13px auto',
        width: '100%',
        paddingTop: 10,
        textAlign: 'center',
        transition: 'background-color 0.1s',
        ':hover': {backgroundColor: '#f5f6fa', cursor: 'pointer', transition: 'background-color 0.05s'}},
    
    createPatientButton: {
        backgroundColor: 'rgb(244, 66, 66)',
        color: 'black',
        borderRadius: 20,
        fontFamily: 'sans-serif',
        fontSize: 13,
        height: 20,
        margin: '13px auto',
        width: '80%',
        paddingTop: 9,
        textAlign: 'center',
        ':hover': {color: '#f5f6fa', backgroundColor: '#EA2027', cursor: 'pointer', transition: 'background-color 0.05s'}},
    
    searchBar: {
        margin: '1px auto',
        width: '55%'
    }
}