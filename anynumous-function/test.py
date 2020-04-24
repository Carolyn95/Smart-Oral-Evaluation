# 实现数组转换，每一项都是当前项与下一项的和，如果下一项不存在则视为0
# [1, 2, 3, 4, 5] => [1+2, 2+3, 3+4, 4+5, 5+0] => [3, 5, 7, 9, 5]
arr = [1,2,3,4,5]

def map1(arr, action):
    tem_arr = []
    for index,value in enumerate(arr):
        result = action(index, value, arr)
        tem_arr.append(result)
    return tem_arr

# 匿名函数的形式
print(
    'lambda',
    map1(arr, lambda index, value, arr: value + (arr[index+1] if index < len(arr) - 1 else 0))
)

# 函数引用的形式
def action(index, value, arr):
    return value + (arr[index+1] if index < len(arr) - 1 else 0)

print('fn',map1(arr,action))