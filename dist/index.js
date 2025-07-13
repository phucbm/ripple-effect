/*!
 * @phucbm/ripple-effect 1.0.0
 * https://github.com/phucbm/ripple-effect
 *
 * @license MIT
 * @author: phucbm, https://github.com/phucbm
 */
function f({length:t,centerIndex:r,rippleRadius:a=3,callback:i}){for(let e=0;e<t;e++){let l=Math.abs(e-r),n;l<=a?a===0?n=l===0?1:0:n=Math.max(0,1-l/a):n=0,i(n,e)}}export{f as applyRippleEffect};
//# sourceMappingURL=index.js.map