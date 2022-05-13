/**
 * 작성자 : 김유석
 * 최초 작성일 : 2022-05-08
 * 마지막 변경일 : 2022-05-13
 * 목적 : csv 데이터 파일을 불러와 json 형식으로 변경
 * 현재까지 추가된 내용 : csvtojson, jsonfillter, jsonsearch
 * 저작권 CC BY-SA 4.0, (상업적, 재배포, 수정 가능)
 */


// fs 라이브러리 임포트
const fs = require('fs');

// csv 파일 참조부
// UTF-8 인코딩을 필요로함
const file_csv = fs.readFileSync('./data/data_2.csv');
const string_csv = file_csv.toString();

// json 생성부
const arr_json = csvToJSON(string_csv);
const string_json = JSON.stringify(arr_json);
fs.writeFileSync('./data/data.json', string_json);

// json 객체 생성부
// 객체 키값 업종 종류, 음식점, 이미용, 숙박업, 세탁업
const jsonobj = JSON.parse(string_json);

//csv 스트링 불러와서 json 어레이 형식으로 변경
function csvToJSON(csv_string){  
    const rows = csv_string.split("\r\n"); 
    const jsonArray = [];
    const header = rows[0].split(",");
    for(let i = 1; i < rows.length; i++){
        let obj = {}; 
        let row = rows[i].split(","); 
        for(let j=0; j < header.length; j++){ 
            obj[header[j]] = row[j]; 
        }
        jsonArray.push(obj); 
    } 
    return jsonArray; 
}

/**  객체, 필드명, 검색값 으로 객체리스트속 키값에 검색어가 포함되있으면 객체 배열로 리턴
 * console.log(getObjectsSearch(jsonobj, '품목', '국수'));
 * const a = getObjectsSearch(jsonobj, '품목', '국수');
 * console.log(a[0].품목);
*/
function getObjectsSearch(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjectsSearch(obj[i], key, val));    
        } else 
        if (i == key && obj[i].includes(val) == true) { //
            objects.push(obj);
        }
    }
    return objects;
}

/** 필드명, 키값 으로 json 리스트 출력 (위와는 다르게 필터링, 무조건 같은 단어가 매치 되어야 함)
 * console.log(getObjects(jsonobj,'업종','음식점'));
 * 소스코드 참고 : http://techslides.com/how-to-parse-and-search-json-in-javascript
 * console.log(getObjects(jsonobj,'업종','음식점'));
*/
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));    
        } else 
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}


