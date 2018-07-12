/* global jest */

function _setUpMockResponse(mockType) {
    return (body, init = {}) => {
        if (typeof body !== 'string')
            body = JSON.stringify(body);
        const response = Promise.resolve(new Response(body, init));
        fetch[mockType](() => response);
        return response;
    };
}

// We define mocking implementation for fetch if NO_TEST_MOCKING is not defined
if (!process.env.NO_TEST_MOCKING) {

    self.fetch = jest.fn();

    // Helpers to mock a success response
    fetch.mockResponseSuccess = _setUpMockResponse('mockImplementation');
    fetch.mockResponseSuccessOnce = _setUpMockResponse('mockImplementationOnce');

    // Helpers to mock a failure response
    fetch.mockResponseFailure = error => {
        fetch.mockImplementation(() => Promise.reject(error));
    };
    fetch.mockResponseFailureOnce = error => {
        fetch.mockImplementationOnce(() => Promise.reject(error));
    };

}
