// Map number x from range [a, b] to [c, d]
const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c

/**
 * Linear interpolation
 * @param {Number} a - first value to interpolate
 * @param {Number} b - second value to interpolate
 * @param {Number} n - amount to interpolate
 */
const lerp = (a, b, n) => (1 - n) * a + n * b

const clamp = (num, min, max) => (num <= min ? min : num >= max ? max : num)

const average = (arr) => (arr.reduce((a, b) => a + b, 0) / arr.length)

export { map, lerp, clamp, average }
