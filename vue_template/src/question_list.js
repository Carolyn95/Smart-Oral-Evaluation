export default {
    "1__0": {
        "lang": "1",
        "type": "0",
        "text": ["苹果", "梨子", "香蕉", "橙子", "草莓", "西瓜", "橘子", "木瓜", "蓝莓",
            "葡萄", "桃子", "凤梨", "火龙果", "芒果", "樱桃", "李子", "杏子", "密瓜", "龙眼", "榴莲", "荔枝"],
    },
    "0__0": {
        "lang": "0",
        "type": "0",
        "text": ["Apple", "Pear", "Banana", "Orange", "Strawberry", "Watermelon", "Mandarin", "Papaya", "Blueberry",
            "Grape", "Peach", "Pineapple", "Dragon fruit", "Mango", "Cherry", "Plum", "Apricot", "Honeydew melon", "Longan", "Durian", "Lychee"],
    },
    "1__1": {
        "lang": "0",
        "type": "0",
        "text": ["我吃饱了",
            "我喜欢狗",
            "我不喜欢猫",
            "爸爸妈妈在家看电视",
            "我有一个妹妹",
            "天下起雨了",
            "小草是绿色的",
            "我爱吃鱼",
            "今天天气真好",
            "我背书包上学",
            "我坐巴士上学",
            "这是太阳",
            "那里有一个苹果",
            "哥哥比我高",
            "大象比狗大",
            "你吃饭了吗",
            "今天妈妈来接我，我很开心",
            "今天天气真冷",
            "我在家读书",
            "月亮在天上"],
    },
    "0__1": {
        "lang": "0",
        "type": "0",
        "text": ["I like reading",
            "I like apple",
            "It is raining",
            "An elephant is 2.2 meters long",
            "A fish is 20 centimeters long",
            "Tiggers are bigger than cats",
            "Dad is driving",
            "Penguins are cute",
            "I will go to zoo this weekend with my sister",
            "I am happy",
            "This is a triangle",
            "This is a red apple",
            "We go to school together",
            "I don't like carrot",
            "I had an apple this morning",
            "They are singing",
            "They are dancing",
            "Could you speak Chinese",
            "How are you",
            "The baby is crying"],
    },
}

// function bubbleSort (arr, fn) {
//     var len = arr.length;
//     for (var i = 0; i < len - 1; i++) {
//         for (var j = 0; j < len - 1 - i; j++) {
//             if (fn(arr[j], arr[j + 1]) > 0) {        // 相邻元素两两对比 arr[j+1] > arr[j]
//                 var temp = arr[j + 1];        // 元素交换
//                 arr[j + 1] = arr[j];
//                 arr[j] = temp;
//             }
//         }
//     }
//     return arr;
// }

// function bubbleSort (arr, fn) {
//     var len = arr.length;
//     for (var i = 0; i < len - 1; i++) {
//         for (var j = 0; j < len - 1 - i; j++) {
//             if (arr[j + 1] < arr[j]) {        // 相邻元素两两对比 arr[j+1] > arr[j]
//                 var temp = arr[j + 1];        // 元素交换
//                 arr[j + 1] = arr[j];
//                 arr[j] = temp;
//             }
//         }
//     }
//     return arr;
// }

// test = bubbleSort([4, 2, 5, 1, 3], function (a, b) { console.log(a, b); return a - b; })