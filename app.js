const searchBtn = document.querySelector('#searchBtn');
const contentsList = document.querySelector('#contentsList');
const sortBox = document.querySelector('#sortBox');

let storeAddress = [];
let food = [];
let hair = [];
let laundry = [];
let stay = [];

var container = document.getElementById('map');
    var options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
    };
     
var map = new kakao.maps.Map(container, options);

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 주소로 좌표를 검색합니다
const searchMap = (address) => {
    console.log(typeof(address));
    geocoder.addressSearch(`${address}`, function(result, status) {

        // 정상적으로 검색이 완료됐으면 
         if (status === kakao.maps.services.Status.OK) {
    
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
    
            // 결과값으로 받은 위치를 마커로 표시합니다
            var marker = new kakao.maps.Marker({
                map: map,
                position: coords
            });
    
            // 인포윈도우로 장소에 대한 설명을 표시합니다
            var infowindow = new kakao.maps.InfoWindow({
                content: '<div style="width:150px;text-align:center;padding:6px 0;">장소</div>'
            });
            infowindow.open(map, marker);
    
            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);
        } 
    });
}


const addList = (listObj) => {
    let list = '';
    for (let i = 0; i < listObj.length; i++) {
        list += `<div class='list'>
                <img src=${listObj[i].img}>
                <span>
                    <ul>
                        <li>업소명 : ${listObj[i].title}</li>
                        <li id='category'>업종 : ${listObj[i].category}</li>
                        <li>연락처 : ${listObj[i].phone}</li>
                        <li>품목 : ${listObj[i].menu}</li>
                        <li id='address'>주소 : ${listObj[i].address}</li>
                    </ul>
                </span>
        </div>`;
    }
    return list;
}

const addressFunction = () => {
    storeAddress = document.querySelectorAll('#address');
    storeAddress.forEach((item) => {
        item.addEventListener('click', (event) => {
            searchMap(event.target.innerText.substring(5));
        })
    })
}

const sortCategory = () => {
    for (let i = 0; i < contents.length; i++) {
        if (contents[i].category === '음식점') {
            food[food.length] = contents[i];
        }
        else if (contents[i].category === '이미용') {
            hair[hair.length] = contents[i];
        }
        else if (contents[i].category === '세탁업') {
            laundry[laundry.length] = contents[i];
        }
        else if (contents[i].category === '숙박업') {
            stay[stay.length] = contents[i];
        }
    }
}

window.addEventListener('load', () => {
    contentsList.innerHTML = addList(contents);
    addressFunction();
    sortCategory();
});

/**
 * 작성자 : kys  
 * 객체, 필드명, 검색값 으로 객체리스트속 키값에 검색어가 포함되있으면 객체 배열로 리턴
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

searchBtn.addEventListener('click', () => {
    searchtxt = document.getElementById('searchBar').value;
    var result = getObjectsSearch(contents,'menu', searchtxt);
    contentsList.innerHTML = addList(result);
    addressFunction();
});

sortBox.addEventListener('change', (event) => {
    if (event.target.value === 'food') {
        contentsList.innerHTML = addList(food);
        addressFunction();
    }
    else if (event.target.value === 'hair') {
        contentsList.innerHTML = addList(hair);
        addressFunction();
    }
    else if (event.target.value === 'laundry') {
        contentsList.innerHTML = addList(laundry);
        addressFunction();
    }
    else if (event.target.value === 'stay') {
        contentsList.innerHTML = addList(stay);
        addressFunction();
    }
});