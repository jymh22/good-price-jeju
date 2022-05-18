/**
 * 작성자 : kys
 * 최초작성일 : 2022-05-18
 * 마지막수정일 ; 2022-05-18
 * 호출시 ip-api.com 무료 api를 통해서 아이피 기반 위치 데이터 호출
 * json object 형식으로 데이터 반환
 */

function getIPgeolocation(){
    const http = require('http')
    const url = "http://ip-api.com/json/?lang=en&fields=61439";
    http.get(url, res => {
    let data = '';
    res.on('data', chunk => {
        data += chunk;
    });
    res.on('end', () => {
        data = JSON.parse(data);
        console.log(data);
        console.log(data.regionName);
        return(data);
    })
    }).on('error', err => {
    console.log(err.message);
    })
}

