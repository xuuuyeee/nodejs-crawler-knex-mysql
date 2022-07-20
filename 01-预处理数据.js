const fs = require('fs');

// 获得json文件的英雄数组信息
let dataArr = JSON.parse(fs.readFileSync('./herolist.json','utf8'));

// 处理原始数据,只获得英雄id值
let heroidArr = dataArr.map((v)=>{
    return v.ename;
})

fs.writeFileSync('./herolist.json',JSON.stringify(heroidArr));