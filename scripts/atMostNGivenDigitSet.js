/**
 * @how:
 * 设：结果表达位 I，N 的位数为 L(N), A计算排列数；C(x,y)计算小于x的数字在y集合中的个数
 * #1 for L(I) < L(N): 则 I 符合要求，有 A(L(I), L(D)) 个结果；
 * #2 for L(I) == L(N): 
    set C = 0
    for FN(I) < FN(N): C += A(L(N) - 1, L(D)) * C(FN(I), D)
    for FN(I) == FN(N): set I = xFN(I) N = xFN(N) & do #2 with I and N.
 * @param {string[]} D
 * @param {number} N
 * @return {number}
 */
var atMostNGivenDigitSet = function(D, N) {
    var strN = String(N)
    var c = 0
    var LEN_OF_N = strN.length
    var SIZE_OF_D = D.length
    var K = function(n) {
        if (n === 0) return 1
        var r = 1
        for (var i = n; i >= 1; i-- ) {
            r = r * i
        }
        return r
    }
    var A = function(m, n) {
        var r = 1
        var min = n - m
        for (var i = n; i > min; i-- ) {
            r = r * i
        }
        return r
    }
    var AA = function(m, n) {
        // includes repeats
        // A(N,M) * C(0, N) + A(N-1,M) * C(1, N - 1) + A(N - 2, M) * C(2, N - 2)
        var c = 0
        for (var i = m; i > 0; i --) {
            c += A(i, n) * C(m - i, i)
        }
        return c
    }
    var C = function(m, n) {
        if (m === 0) return 1
        var a = K(m)
        return A(m, n) / a
    }
    var Count = function(n) {
        var i = 0
        for (var k = 0; k < SIZE_OF_D; k ++) {
            if (n < D[k]) i += 1
        }
        return i
    }
    var forEqualSize = function(n) {       
        var fn = n[0]
        if (fn == n) return Count(n, D)
        var c = 0
        c += A(n.length - 1, SIZE_OF_D) * Count(fn, D)
        c += forEqualSize(n.substr(1))
        return c
    }
    // for less eqaul
    for (var i = 1; i < LEN_OF_N; i ++) {
        c += AA(i, SIZE_OF_D)
    }
    c += forEqualSize(strN)
    // console.log(A(2,4))
    // "1", "2", "5", "7", 
    // A(N,M) + A(N-1,M) * A(1, N - 1) + A(N - 2, M) * A(2, N - 2)
    return c
}

const c = atMostNGivenDigitSet(["1", "2", "5", "7"], 100)
console.log(c)