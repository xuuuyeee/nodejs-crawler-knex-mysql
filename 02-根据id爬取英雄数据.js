// 1. 导入爬虫模块
const crawler = require('crawler');// 爬虫模块
const fs = require('fs');// 读取文件模块
const knex = require('knex')({
    client:'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'Ff332626',
        database: 'nodejs'
    }
})// 链接数据库

// 2. 准备容器
let heroArr = [];

// 3. 参加爬虫实例
const heroCrawler = new crawler({
    maxConnections: 10,
    callback: (err, res, done)=>{
        if (!err) {
            // 4. 如果进入这里,那就代表页面资源获得成功: res
            // 千万不要直接打印res,获得的是一个页面资源document文档
            let $ = res.$;// 将原生文档变成JQ文档
            // 5. 将要获得的页面内容保存到容器中
            heroArr.push(
                {
                    heroname: $('.cover-name').text(),
                    heroskill: $('.skill-name b').eq(3).text(),
                    heroicon: $('.ico-play').prev().attr('src')
                }
            )
        } else {
            console.log(err);
        }
        done();
    }
});

// 6. 给爬虫实例设置目标页面(106次)
let heroIds = JSON.parse(fs.readFileSync('./herolist.json','utf8'));
heroIds.forEach((v)=>{
    heroCrawler.queue(`https://pvp.qq.com/web201605/herodetail/${v}.shtml`);
})

// 7. 监听爬虫实例是否结束
heroCrawler.on('drain', ()=>{
    // console.log(heroArr);
    // 8. 将获取的数据保存到mysql数据库中
    knex('heroinfo').insert(heroArr)
    .then((result)=>{
        console.log(result);
    })
    .catch((err)=>{
        console.log(err);
    })
})