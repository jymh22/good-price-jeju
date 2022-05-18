const searchBtn = document.querySelector('#searchBtn');
const contentsList = document.querySelector('#contentsList');
const sortBox = document.querySelector('#sortBox');
const searchBar = document.querySelector('#searchBar');

let storeAddress = [];
let food = [];
let hair = [];
let laundry = [];
let stay = [];
let lat = 0;
let lon = 0;

navigator.geolocation.getCurrentPosition(function(position) {
        
    lat = position.coords.latitude; // 위도
    lon = position.coords.longitude; // 경도
});

var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(lat, lon),
    level: 3
};
     
var map = new kakao.maps.Map(container, options);

////////////////////////////////////////////////////////////////
if (navigator.geolocation) {
    
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {
        
        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도
        
        var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
            message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다
        
        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition, message);
            
      });
    
} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    
    var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),    
        message = 'geolocation을 사용할수 없어요..'
        
    displayMarker(locPosition, message);
}
////////////////////////////////////////////////////////////////

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 주소로 좌표를 검색합니다
const searchMap = (address) => {
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

const display_geolocation = () => {
        // HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
    if (navigator.geolocation) {
        
        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function(position) {
            
            var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도
            
            var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
                message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다
            
            // 마커와 인포윈도우를 표시합니다
            displayMarker(locPosition, message);
                
        });
        
    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
        
        var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),    
            message = 'geolocation을 사용할수 없어요..'
            
        displayMarker(locPosition, message);
    }
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

const searchKeyword = () => {
    let searchtxt = searchBar.value;
    let result = getObjectsSearch(contents,'menu', searchtxt);
    if (result.length === 0) {
        window.alert('검색 결과가 없습니다.');
    }
    else {
        contentsList.innerHTML = addList(result);
    }
}

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
        if (!obj.hasOwnProperty(i)) {
            continue;
        }
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjectsSearch(obj[i], key, val));    
        }
        else if (i == key && obj[i].includes(val) == true) { //
            objects.push(obj);
        }
    }
    return objects;
}

searchBtn.addEventListener('click', () => {
    searchKeyword();
    addressFunction();
});

sortBox.addEventListener('change', (event) => {
    if (event.target.value === 'food') {
        contentsList.innerHTML = addList(food);
        sortCategory();
        addressFunction();
    }
    else if (event.target.value === 'hair') {
        contentsList.innerHTML = addList(hair);
        sortCategory();
        addressFunction();
    }
    else if (event.target.value === 'laundry') {
        contentsList.innerHTML = addList(laundry);
        sortCategory();
        addressFunction();
    }
    else if (event.target.value === 'stay') {
        contentsList.innerHTML = addList(stay);
        sortCategory();
        addressFunction();
    }
});

searchBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchKeyword();
        addressFunction();
    }
})


window.addEventListener('load', () => {
    contentsList.innerHTML = addList(contents);
    addressFunction();
});