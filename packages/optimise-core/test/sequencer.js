const TestSequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends TestSequencer {
    sort(tests) {
        // console.log('tester', tests);
        const orderPath = ['visitController.test.js', 'pregnancyController.test.js'];
        return tests.sort((testA, testB) => {
            const indexA = orderPath.findIndex(path => testA.path.includes(path));
            const indexB = orderPath.findIndex(path => testB.path.includes(path));

            if (indexA === indexB) return 0; // do not swap when tests both not specify in order.
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA < indexB ? -1 : 1;
        });
    }
}

module.exports = CustomSequencer;
