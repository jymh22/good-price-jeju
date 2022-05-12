const searchBtn = document.querySelector('#searchBtn');
const contentsList = document.querySelector('#contentsList');
const sortBox = document.querySelector('#sortBox');

let storeAddress = [];

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
                content: '<div style="width:150px;text-align:center;padding:6px 0;">우리회사</div>'
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
                        <li>업종 : ${listObj[i].cp}</li>
                        <li>연락처 : ${listObj[i].id}</li>
                        <li>품목 : ${listObj[i].cp}</li>
                        <li id='address'>주소 : ${listObj[i].url}</li>
                    </ul>
                </span>
        </div>`;
    }
    return list;
}

const addStyle = (list) => {
    contentsList.style.visibility = 'hidden';
    contentsList.style.transition = '1s linear all';
    contentsList.style.opacity = '0';
    setTimeout(() => {
        contentsList.innerHTML = addList(list)
        contentsList.style.visibility = 'visible';
        contentsList.style.opacity = '1';
        storeAddress = document.querySelectorAll('#address');
    }, 500);
    
}

searchBtn.addEventListener('click', () => {
})

sortBox.addEventListener('change', (event) => {
    if (event.target.value === 'food') {
        addStyle(popularContents);
    }
    else if (event.target.value === 'hair') {
        addStyle(recentContents);
        const storeAddress = document.querySelectorAll('#address');
        console.log(storeAddress);
    }
    else if (event.target.value === 'laundry') {
        addStyle(viewContents);
        const storeAddress = document.querySelectorAll('#address');
        console.log(storeAddress);
    }
})

storeAddress.forEach((item) => {
    item.addEventListener('click', (event) => {
        console.log(event.target);
    })
})