const searchBtn = document.querySelector('#searchBtn');
const contentsList = document.querySelector('#contentsList');
const sortCategoryBox = document.querySelector('#sortCategoryBox');
const searchBar = document.querySelector('#searchBar');
const sortRegionBox = document.querySelector('#sortRegionBox');

let storeAddress = [];
let food = [];
let hair = [];
let laundry = [];
let stay = [];

let now_content = jejuContents; // 현재 선택 지역

var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 3
};

let markers = [];
let infoWindows = [];

var map = new kakao.maps.Map(container, options);
var imageSrc = 'img/pin.png', // 마커이미지의 주소입니다    
    imageSize = new kakao.maps.Size(34, 39); // 마커이미지의 크기입니다
var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
display_gps();

/**
 * API 인용작성자 : KYS
 * @param {경도} x 
 * @param {위도} y
 * 경도 위도로 주소추출하는 함수   
 */
function getMylocation(x,y){
    var geocoder = new kakao.maps.services.Geocoder();
    var coord = new kakao.maps.LatLng(x, y);
    var callback = function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            // 이곳에 지역 구분 함수를 입력해서 참조 사용하세요
            // console.log(result[0].address.address_name);
            // console.log(result[0].address.region_1depth_name);
            // console.log(result[0].address);
            // geolocationData.innerHTML = result[0].address.address_name;
        }
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
}

const addressSearch = address => {
	return new Promise((resolve, reject) => {
		geocoder.addressSearch(address, function(result, status) {
			if (status === kakao.maps.services.Status.OK) {
				resolve(result);
			} else {
				reject(status);
			}
		});
	});
};

/**
 * 카카오 API 문서 참조
 * API 참조코드 인용, 작성 : KYS
 * Display_gps
 * 초기화된 지도에 html geolocation 함수의 gps 값을 넣는 함수
 */
function display_gps(){
    if (navigator.geolocation) {
        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function(position) {    
            var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도   
            var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
                message = '<div style="padding:5px;">현재 위치</div>'; // 인포윈도우에 표시될 내용입니다          
            // 마커와 인포윈도우를 표시합니다
            displayMarker(locPosition, message);
            
            // 현재위치 주소를 로그에 기록
            getMylocation(lat,lon);   
             
          });
    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다       
        var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),    
            message = 'geolocation을 사용할수 없어요..'
        displayMarker(locPosition, message);
    }
}


// 지도에 마커와 인포윈도우를 표시하는 함수입니다
// 지도 마커위치, 인포메이션 메세지값
function displayMarker(locPosition, message) {
    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({  
        map: map, 
        position: locPosition
    }); 
    var iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;
    // 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({
        content : iwContent,
        removable : iwRemoveable
    });
    // 인포윈도우를 마커위에 표시합니다 
    infowindow.open(map, marker); 
    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);      
}   

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

/////////////////////
var roadviewContainer = document.getElementById('roadview'); //로드뷰를 표시할 div
var roadview = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
var roadviewClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체
var rvResetValue = {};

// 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.



//////////////////////
// 주소로 좌표를 검색합니다
const searchMap = (address, title) => {
    console.log(title);
    geocoder.addressSearch(`${address}`, function(result, status) {
        // 정상적으로 검색이 완료됐으면 
         if (status === kakao.maps.services.Status.OK) {   
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            // 결과값으로 받은 위치를 마커로 표시합니다
            var marker = new kakao.maps.Marker({
                map: map,
                position: coords,
                image: markerImage
            });   
            // 인포윈도우로 장소에 대한 설명을 표시합니다
            var infowindow = new kakao.maps.InfoWindow({
                content: `<div style="width:150px;text-align:center;padding:6px 0;">${title}</div>`
            });
            infowindow.open(map, marker);    
            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);
            
            roadviewClient.getNearestPanoId(coords, 50, function(panoId) {
                roadview.setPanoId(panoId, coords);
                rvResetValue.panoId = panoId; //panoId와 중심좌표를 통해 로드뷰 실행
            });
            var rMarker = new kakao.maps.Marker({
                position: coords,
                map: roadview //map 대신 rv(로드뷰 객체)로 설정하면 로드뷰에 올라갑니다.
            });
            var rLabel = new kakao.maps.InfoWindow({
                position: coords,
                content: `<div style="width:80px;text-align:center;padding:6px 0px;margin:0px 35px;">${title}</div>`
            });
            rLabel.open(roadview, rMarker);
            markers.push(marker);
            infoWindows.push(infowindow);
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

function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
        infoWindows[i].setMap(null);
    }   
    markers = [];
    infoWindows = [];
}


const addList = (listObj) => {
    let list = '';
    for (let i = 0; i < listObj.length; i++) {
        list += `<div class='list'>
                <span>
                    <ul>
                        <li id='title'>${listObj[i].title}</li>
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

// 주소 맵 검색
const addressFunction = () => {
    storeAddress = document.querySelectorAll('#address');
    storeAddress.forEach((item) => {
        item.addEventListener('click', (event) => {
            let parentNode = item.parentNode;
            roadviewContainer.style.transform = 'translateX(0%)';
            searchMap(event.target.innerText.substring(5), parentNode.childNodes[1].innerText);
        })
    })
}

const sortCategory = (now_content) => {
    for (let i = 0; i < now_content.length; i++) {
        if (now_content[i].category === '음식점') {
            food[food.length] = now_content[i];
        }
        else if (now_content[i].category === '이미용') {
            hair[hair.length] = now_content[i];
        }
        else if (now_content[i].category === '세탁업') {
            laundry[laundry.length] = now_content[i];
        }
        else if (now_content[i].category === '숙박업') {
            stay[stay.length] = now_content[i];
        }
    }
}

const searchKeyword = () => {
    let searchtxt = searchBar.value;
    let result = getObjectsSearch(checkRegionValue(),'menu', searchtxt);
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

// 작성자 kys
// 현재 sortRegionBox 값에 따라서 컨텐츠 값을 리턴해주는 함수
// 자바스크립트 미흡으로 함수로 비동기식으로 인한 오류가 발생할 수 있음
function checkRegionValue(){
    if (sortRegionBox.value === 'jeju') {
        return jejuContents;
    }
    else if (sortRegionBox.value === 'chungnam') {
        return chungnamContents;
    }
    else if (sortRegionBox.value === 'kyungbuk') {
        return gyeongbukContents;
    }
    else if (sortRegionBox.value === 'jeonnam') {
        return jeonnamContents;
    }
    else if (sortRegionBox.value === 'jeonbuk') {
        return jeonbukContents;
    }
    else if (sortRegionBox.value === 'chungbuk') {
        return chungbukContents;
    }
    else if (sortRegionBox.value === 'kangwon') {
        return kangwondoContents;
    }
    else if (sortRegionBox.value === 'ulsan') {
        return ulsancontents;
    }
    else if (sortRegionBox.value === 'daejeon') {
        return daejeonContents;
    }
    else if (sortRegionBox.value === 'gwangju') {
        return gwangjuContents;
    }
    else if (sortRegionBox.value === 'daegu') {
        return daeguContents;
    }
    else if (sortRegionBox.value === 'seoul') {
        return seoulContents;
    } else{
        //기본 출력
        return jejuContents;
    }
}

/**
 * 기존 정렬 펑션 수정
 * 작성자 KYS;
 * @param {*} now_content 원본 데이터값을 넣으면됩니다 (content 객체)
 * @param {*} key // 1 음식점, 2 이미용, 3 세탁업, 4 숙박업
 * @returns key 값에 따라서 리턴값 변경
 */
function sortCategory2(now_content, key){
    let food = [];
    let hair = [];
    let laundry = [];
    let stay = [];
    for (let i = 0; i < now_content.length; i++) {
        if (now_content[i].category === '음식점') {
            food[food.length] = now_content[i];
        }
        else if (now_content[i].category === '이미용') {
            hair[hair.length] = now_content[i];
        }
        else if (now_content[i].category === '세탁업') {
            laundry[laundry.length] = now_content[i];
        }
        else if (now_content[i].category === '숙박업') {
            stay[stay.length] = now_content[i];
        }
    }
    switch(key){
        //음식점
        case 1:
            return food;
        //이미용
        case 2:
            return hair;
        //세탁업
        case 3:
            return laundry;
        //숙박업
        case 4:
            return stay;
        default:
            return null;
    }
}

const contentsHide = () => {
    contentsList.style.transform = 'translateX(-120%)';
}
const contentsShow = () => {
    contentsList.style.transform = 'translateX(0%)';
}

sortRegionBox.addEventListener('change', () => {
    contentsHide();
    removeMarker();
})

sortCategoryBox.addEventListener('change', (event) => {
    contentsShow();
    if (event.target.value === 'food') {
        //기존코드
        //sortCategory(checkRegionValue());
        //contentsList.innerHTML = addList(food);
        
        //변경코드
        a = sortCategory2(checkRegionValue(),1);
        contentsList.innerHTML = addList(a);
        addressFunction();
        removeMarker();
    }
    else if (event.target.value === 'hair') {
        a = sortCategory2(checkRegionValue(),2);
        contentsList.innerHTML = addList(a);   
        addressFunction();
        removeMarker();
    }
    else if (event.target.value === 'laundry') {
        a = sortCategory2(checkRegionValue(),3);
        contentsList.innerHTML = addList(a);  
        addressFunction();
        removeMarker();
    }
    else if (event.target.value === 'stay') {
        a = sortCategory2(checkRegionValue(),4);
        contentsList.innerHTML = addList(a);      
        addressFunction();
        removeMarker();
    }
});

searchBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchKeyword();
        addressFunction();
    }
})


window.addEventListener('load', () => {
    contentsList.innerHTML = addList(checkRegionValue());
    addressFunction();
});