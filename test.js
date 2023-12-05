
const doSomething = function (a, b) {
    return a + b
}

function doSomethingElse(a, b, f) {
    return f(a, b)
}

console.log(doSomethingElse(2, 4, (a, b) => {
    return a + b
}))