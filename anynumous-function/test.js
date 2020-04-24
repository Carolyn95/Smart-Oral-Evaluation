// 实现数组转换，每一项都是当前项与下一项的和，如果下一项是不存在则视为0
// [1, 2, 3, 4, 5] => [1+2, 2+3, 3+4, 4+5, 5+0] => [3, 5, 7, 9, 5]
var arr = [1, 2, 3, 4, 5]
function map1 (arr, action) {
    let tem_arr = []
    for (let [index, value] of arr.entries()) {
        let result = action(index, value, arr)
        tem_arr.push(result)
    }
    return tem_arr
}
// 匿名函数的形式
console.log(
    'lambda',
    map1(arr, (index, value, arr) => value + (arr[index + 1] || 0))
)
console.log(
    'lambda',
    map1(arr, (index, value, arr) => { return value + (arr[index + 1] || 0) })
)
console.log(
    'lambda',
    map1(arr, function (index, value, arr) { return value + (arr[index + 1] || 0) })
)

//函数引用的形式
function action (index, value, arr) {
    return value + (arr[index + 1] || 0)
}
var action1 = function (index, value, arr) {
    return value + (arr[index + 1] || 0)
}
console.log('fn', map1(arr, action))
console.log('fn', map1(arr, action1))