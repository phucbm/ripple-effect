# ripple-effect

Applies a ripple effect that distributes normalized values [0; 1] from a center point. Useful for animations or visual
emphasis.

[![npm version](https://badgen.net/npm/v/@phucbm/ripple-effect?icon=npm)](https://www.npmjs.com/package/@phucbm/ripple-effect)
[![npm downloads](https://badgen.net/npm/dm/@phucbm/ripple-effect?icon=npm)](https://www.npmjs.com/package/@phucbm/ripple-effect)
[![npm dependents](https://badgen.net/npm/dependents/@phucbm/ripple-effect?icon=npm)](https://www.npmjs.com/package/@phucbm/ripple-effect)
[![github stars](https://badgen.net/github/stars/phucbm/ripple-effect?icon=github)](https://github.com/phucbm/ripple-effect/)
[![github license](https://badgen.net/github/license/phucbm/ripple-effect?icon=github)](https://github.com/phucbm/ripple-effect/blob/main/LICENSE)

## Installation

```bash
npm i @phucbm/ripple-effect
```

```bash
pnpm add @phucbm/ripple-effect
```

## Usage

```typescript
import {applyRippleEffect} from '@phucbm/ripple-effect';

const elements = document.querySelectorAll('.item');

applyRippleEffect({
    length: elements.length,
    centerIndex: 5,
    rippleRadius: 3,
    callback: (normalizedValue, index) => {
        const scale = 1 + normalizedValue; // [1.0 - 2.0]
        elements[index].style.transform = `scale(${scale})`;
    }
});

```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the package
pnpm run build

# Run tests in watch mode
pnpm run test:watch
```

## License

MIT © [phucbm](https://github.com/phucbm)
