/**
 * S = []
 * Loop:
 * From I, Walk to J where J eqauls to K, K >= I & K < J
 * Until K = MAX
 * Every loop, you have a length.
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    if (s.length < 2) return s.length
    let i = 0
    let l = 0
    const MAX = s.length
    const isRepeated = (i, j) => {
        for (let k = i; k < j; k ++) {
            if (s[k] === s[j]) {
                return k
            }
        }
        return -1
    }
    let lastJ = 0
    let c = 1
    while (true) {
        c = lastJ - i + 1
        for (let j = lastJ + 1; j < MAX; j ++) {
            let ir = isRepeated(i, j)
            if (ir === -1) {
                c += 1
            } else {
                i = ir + 1
                lastJ = j
                break
            }
        }
        if (c > l) l = c
        if (MAX - i <= l) break
    }
    return l
}

console.log(lengthOfLongestSubstring('cdd'))