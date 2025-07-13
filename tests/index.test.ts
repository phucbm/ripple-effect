import {applyRippleEffect} from '../src';

describe('applyRippleEffect', () => {
    let mockCallback: jest.Mock;

    beforeEach(() => {
        mockCallback = jest.fn();
    });

    describe('Basic Functionality', () => {
        test('center element receives value 1.0', () => {
            applyRippleEffect({
                elements: 5,
                centerIndex: 2,
                rippleRadius: 2,
                callback: mockCallback
            });

            // Find the call for center index (2)
            const centerCall = mockCallback.mock.calls.find(call => call[1] === 2);
            expect(centerCall[0]).toBe(1.0);
        });

        test('values decrease linearly from center', () => {
            applyRippleEffect({
                elements: 7,
                centerIndex: 3,
                rippleRadius: 3,
                callback: mockCallback
            });

            // Check each call and verify the normalized values
            const calls = mockCallback.mock.calls;
            expect(calls[3][0]).toBeCloseTo(1.0); // center (index 3)
            expect(calls[2][0]).toBeCloseTo(2 / 3, 5); // distance 1 (index 2)
            expect(calls[4][0]).toBeCloseTo(2 / 3, 5); // distance 1 (index 4)
            expect(calls[1][0]).toBeCloseTo(1 / 3, 5); // distance 2 (index 1)
            expect(calls[5][0]).toBeCloseTo(1 / 3, 5); // distance 2 (index 5)
            expect(calls[0][0]).toBe(0.0); // distance 3 (index 0)
            expect(calls[6][0]).toBe(0.0); // distance 3 (index 6)
        });

        test('elements outside radius receive 0', () => {
            applyRippleEffect({
                elements: 10,
                centerIndex: 5,
                rippleRadius: 2,
                callback: mockCallback
            });

            // Check elements outside radius
            const outsideIndices = [0, 1, 2, 8, 9];
            outsideIndices.forEach(index => {
                const call = mockCallback.mock.calls.find(call => call[1] === index);
                expect(call[0]).toBe(0.0);
            });
        });
    });

    describe('Edge Cases', () => {
        test('single element', () => {
            applyRippleEffect({
                elements: 1,
                centerIndex: 0,
                rippleRadius: 1,
                callback: mockCallback
            });

            expect(mockCallback).toHaveBeenCalledTimes(1);
            expect(mockCallback).toHaveBeenCalledWith(1.0, 0);
        });

        test('center at first element (asymmetric ripple)', () => {
            applyRippleEffect({
                elements: 5,
                centerIndex: 0,
                rippleRadius: 2,
                callback: mockCallback
            });

            const calls = mockCallback.mock.calls;
            expect(calls[0][0]).toBe(1.0); // center
            expect(calls[1][0]).toBe(0.5); // distance 1
            expect(calls[2][0]).toBe(0.0); // distance 2
            expect(calls[3][0]).toBe(0.0); // outside radius
            expect(calls[4][0]).toBe(0.0); // outside radius
        });

        test('center at last element (asymmetric ripple)', () => {
            applyRippleEffect({
                elements: 5,
                centerIndex: 4,
                rippleRadius: 2,
                callback: mockCallback
            });

            const calls = mockCallback.mock.calls;
            expect(calls[0][0]).toBe(0.0); // outside radius
            expect(calls[1][0]).toBe(0.0); // outside radius
            expect(calls[2][0]).toBe(0.0); // distance 2
            expect(calls[3][0]).toBe(0.5); // distance 1
            expect(calls[4][0]).toBe(1.0); // center
        });
    });

    describe('Radius Variations', () => {
        test('rippleRadius = 0 (only center affected)', () => {
            applyRippleEffect({
                elements: 5,
                centerIndex: 2,
                rippleRadius: 0,
                callback: mockCallback
            });

            const calls = mockCallback.mock.calls;
            expect(calls[0][0]).toBe(0.0);
            expect(calls[1][0]).toBe(0.0);
            expect(calls[2][0]).toBe(1.0); // center
            expect(calls[3][0]).toBe(0.0);
            expect(calls[4][0]).toBe(0.0);
        });

        test('rippleRadius = 1', () => {
            applyRippleEffect({
                elements: 5,
                centerIndex: 2,
                rippleRadius: 1,
                callback: mockCallback
            });

            const calls = mockCallback.mock.calls;
            expect(calls[0][0]).toBe(0.0); // outside radius
            expect(calls[1][0]).toBe(0.0); // distance 1 = radius, so 1 - 1/1 = 0
            expect(calls[2][0]).toBe(1.0); // center
            expect(calls[3][0]).toBe(0.0); // distance 1 = radius, so 1 - 1/1 = 0
            expect(calls[4][0]).toBe(0.0); // outside radius
        });

        test('large rippleRadius (larger than available elements)', () => {
            applyRippleEffect({
                elements: 5,
                centerIndex: 2,
                rippleRadius: 10,
                callback: mockCallback
            });

            const calls = mockCallback.mock.calls;
            expect(calls[0][0]).toBeCloseTo(0.8, 5); // distance 2, value = 1 - 2/10 = 0.8
            expect(calls[1][0]).toBeCloseTo(0.9, 5); // distance 1, value = 1 - 1/10 = 0.9
            expect(calls[2][0]).toBe(1.0); // center
            expect(calls[3][0]).toBeCloseTo(0.9, 5); // distance 1
            expect(calls[4][0]).toBeCloseTo(0.8, 5); // distance 2
        });

        test('default rippleRadius should be 3', () => {
            applyRippleEffect({
                elements: 7,
                centerIndex: 3,
                callback: mockCallback
            });

            // With default radius 3, element at distance 3 should get value 0
            const calls = mockCallback.mock.calls;
            expect(calls[0][0]).toBe(0.0); // distance 3 from center
            expect(calls[6][0]).toBe(0.0); // distance 3 from center
        });
    });

    describe('Parameter Validation', () => {
        test('callback is called exactly elements number of times', () => {
            const testCases = [1, 5, 10, 100];

            testCases.forEach(elementCount => {
                mockCallback.mockReset();
                applyRippleEffect({
                    elements: elementCount,
                    centerIndex: Math.floor(elementCount / 2),
                    rippleRadius: 2,
                    callback: mockCallback
                });

                expect(mockCallback).toHaveBeenCalledTimes(elementCount);
            });
        });

        test('callback receives correct parameter types and ranges', () => {
            applyRippleEffect({
                elements: 10,
                centerIndex: 5,
                rippleRadius: 3,
                callback: mockCallback
            });

            mockCallback.mock.calls.forEach((call, index) => {
                const [normalizedValue, callIndex] = call;

                // Check parameter types
                expect(typeof normalizedValue).toBe('number');
                expect(typeof callIndex).toBe('number');

                // Check ranges
                expect(normalizedValue).toBeGreaterThanOrEqual(0);
                expect(normalizedValue).toBeLessThanOrEqual(1);
                expect(callIndex).toBe(index);
            });
        });

        test('indices go from 0 to elements-1', () => {
            applyRippleEffect({
                elements: 7,
                centerIndex: 3,
                rippleRadius: 2,
                callback: mockCallback
            });

            const indices = mockCallback.mock.calls.map(call => call[1]);
            expect(indices).toEqual([0, 1, 2, 3, 4, 5, 6]);
        });
    });

    describe('Mathematical Precision', () => {
        test('distance calculation uses Math.abs correctly', () => {
            const results: Array<{ index: number, value: number }> = [];

            applyRippleEffect({
                elements: 5,
                centerIndex: 2,
                rippleRadius: 2,
                callback: (value, index) => {
                    results.push({index, value});
                }
            });

            // Verify symmetric values around center
            expect(results[0].value).toBe(results[4].value); // distance 2 on both sides
            expect(results[1].value).toBe(results[3].value); // distance 1 on both sides
        });

        test('linear interpolation formula is correct', () => {
            applyRippleEffect({
                elements: 11,
                centerIndex: 5,
                rippleRadius: 5,
                callback: mockCallback
            });

            // Test specific distance calculations
            const calls = mockCallback.mock.calls;

            // Distance 0: 1 - 0/5 = 1.0
            expect(calls[5][0]).toBe(1.0);

            // Distance 1: 1 - 1/5 = 0.8
            expect(calls[4][0]).toBeCloseTo(0.8, 10);
            expect(calls[6][0]).toBeCloseTo(0.8, 10);

            // Distance 2: 1 - 2/5 = 0.6
            expect(calls[3][0]).toBeCloseTo(0.6, 10);
            expect(calls[7][0]).toBeCloseTo(0.6, 10);

            // Distance 5: 1 - 5/5 = 0.0
            expect(calls[0][0]).toBe(0.0);
            expect(calls[10][0]).toBe(0.0);
        });

        test('Math.max ensures no negative values', () => {
            applyRippleEffect({
                elements: 10,
                centerIndex: 5,
                rippleRadius: 2,
                callback: mockCallback
            });

            mockCallback.mock.calls.forEach(call => {
                expect(call[0]).toBeGreaterThanOrEqual(0);
            });
        });
    });

    describe('Callback Integration', () => {
        test('callback can modify external state', () => {
            const results: number[] = [];

            applyRippleEffect({
                elements: 5,
                centerIndex: 2,
                rippleRadius: 1,
                callback: (normalizedValue, index) => {
                    results[index] = normalizedValue;
                }
            });

            expect(results).toEqual([0, 0, 1, 0, 0]);
        });

        test('callback receives exact expected values for known configuration', () => {
            const expectedValues = [0, 0.5, 1.0, 0.5, 0];

            applyRippleEffect({
                elements: 5,
                centerIndex: 2,
                rippleRadius: 2,
                callback: mockCallback
            });

            mockCallback.mock.calls.forEach((call, index) => {
                expect(call[0]).toBeCloseTo(expectedValues[index], 10);
                expect(call[1]).toBe(index);
            });
        });

        test('function continues if callback throws error', () => {
            const errorCallback = jest.fn().mockImplementation((value, index) => {
                if (index === 2) {
                    throw new Error('Test error');
                }
            });

            // This test depends on implementation - if the function doesn't handle errors,
            // it will throw. If it does handle them, it should continue.
            expect(() => {
                applyRippleEffect({
                    elements: 5,
                    centerIndex: 2,
                    rippleRadius: 2,
                    callback: errorCallback
                });
            }).toThrow('Test error');

            // Verify that callback was called for elements before the error
            expect(errorCallback).toHaveBeenCalledTimes(3); // 0, 1, 2 (throws)
        });
    });

    describe('Boundary Conditions', () => {
        test('zero elements', () => {
            applyRippleEffect({
                elements: 0,
                centerIndex: 0,
                rippleRadius: 1,
                callback: mockCallback
            });

            expect(mockCallback).not.toHaveBeenCalled();
        });

        test('negative centerIndex (edge case)', () => {
            applyRippleEffect({
                elements: 5,
                centerIndex: -1,
                rippleRadius: 2,
                callback: mockCallback
            });

            // All distances will be positive, so behavior should be predictable
            const calls = mockCallback.mock.calls;
            expect(calls[0][0]).toBeCloseTo(0.5, 10); // distance 1
            expect(calls[1][0]).toBe(0.0); // distance 2
        });

        test('centerIndex beyond elements', () => {
            applyRippleEffect({
                elements: 5,
                centerIndex: 10,
                rippleRadius: 3,
                callback: mockCallback
            });

            // All elements should have distances >= 5, most will be 0
            const calls = mockCallback.mock.calls;
            calls.forEach(call => {
                expect(call[0]).toBe(0); // All should be 0 since distance > radius
            });
        });
    });
});