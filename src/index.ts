interface RippleEffectParams {
    /** The total number of elements to apply the ripple effect to */
    elements: number;
    /** The index of the center element (focal point of the ripple) */
    centerIndex: number;
    /** The radius of the ripple effect (how many elements around center are affected) */
    rippleRadius?: number;
    /**
     * Callback function executed for each element
     * @param normalizedValue - Value between 0 and 1 (1 at center, decreasing to 0 at edge)
     * @param index - The current element index
     */
    callback: (normalizedValue: number, index: number) => void;
}

/**
 * Applies a ripple effect that distributes normalized values [0;1] from a center point
 *
 * The effect creates a wave-like distribution where:
 * - Center element receives value 1.0
 * - Values decrease linearly as distance from center increases
 * - Elements outside the radius receive value 0.0
 *
 * @param params - Configuration object for the ripple effect
 * @param params.elements - Total number of elements to process
 * @param params.centerIndex - Index of the center element (focal point)
 * @param params.rippleRadius - How many elements around center are affected (default: 3)
 * @param params.callback - Function called for each element with normalized value and index
 *
 * @example
 * ```typescript
 * // Scale animation example
 * applyRippleEffect({
 *   elements: 10,
 *   centerIndex: 5,
 *   rippleRadius: 3,
 *   callback: (normalizedValue, index) => {
 *     const scaleValue = 1 + normalizedValue; // Maps [0;1] to [1;2]
 *     gsap.to(elements[index], { scaleY: scaleValue });
 *   }
 * });
 * ```
 */
export function applyRippleEffect({
                                      elements,
                                      centerIndex,
                                      rippleRadius = 3,
                                      callback
                                  }: RippleEffectParams): void {
    // Apply ripple effect to all elements
    for (let i = 0; i < elements; i++) {
        const distance = Math.abs(i - centerIndex);

        let normalizedValue: number;
        if (distance <= rippleRadius) {
            if (rippleRadius === 0) {
                // Special case: only center element gets value 1.0
                normalizedValue = distance === 0 ? 1.0 : 0.0;
            } else {
                // Calculate normalized value: 1 at center, decreasing linearly to 0 at edge
                normalizedValue = Math.max(0, 1 - (distance / rippleRadius));
            }
        } else {
            normalizedValue = 0;
        }

        // Execute callback with normalized value [0;1] and index
        callback(normalizedValue, i);
    }
}