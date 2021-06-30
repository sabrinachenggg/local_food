let arrAll = [];
let arrCity = [];
const City = document.querySelector('#City');
const Town = document.querySelector('#Town');

getData();

function getData() {
    var cors_api_url = 'https://cors-anywhere.herokuapp.com/';

    function doCORSRequest(options, printResult) {
        var x = new XMLHttpRequest();
        x.open(options.method, cors_api_url + options.url);
        x.onload = x.onerror = function() {
            printResult(
                (x.responseText || '')
            );
        };
        if (/^POST/i.test(options.method)) {
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        x.send(options.data);
    }

    // Bind event
    (function() {
        doCORSRequest({
            method: 'GET',
            url: 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx'
        }, function printResult(result) {
            arrAll = JSON.parse(result);
            appendItem(arrAll);
            document.querySelector('.loading').style.visibility = 'hidden';
            addEvents();
        });

    })();
}

function addEvents() {
    City.addEventListener('change', doChange);
    Town.addEventListener('change', doChange);
}

function doChange(e) {
    let arr = [];
    const type = e.target.id;
    if (type === 'City') {
        Town.innerHTML = '';
        arrAll.forEach(item => {
            if (item.City === e.target.value) {
                arr.push(item);
            }
        });
        addSelector(arr, type);
    } else {
        arrAll.forEach(item => {
            if (item.Town === e.target.value) {
                arr.push(item);
            }
        });
    }
    appendItem(arr, type);
}

function appendItem(items, type) {
    let str = '';
    items.forEach(item => {
        str += `<div class="intro__item">
                    <a href="${item.Url}">
                        <p class="intro__tag">${item.City}</p>
                        <div class="intro__head">
                            <p class="intro__tit">${item.Town}</p>
                            <p class="intro__subtit">${item.Name}</p>
                            <div class="intro__line"></div>
                            <p class="intro__detail">${item.HostWords}</p>
                        </div>
                        <div class="intro__body">
                            <img class="img-resp" src="${item.PicURL}" alt="" width=360 height=195>
                        </div>
                    </a></div>`;
    });
    document.querySelector('#Main').innerHTML = str;

    if (arrCity.length === 0) { //只在第一次進入畫面去新增行政區域的options
        addSelector(items, type);
    }
}

function addSelector(items, type) {
    let arr = [];
    if (type === 'City') {
        Town.innerHTML = '<option>請選擇鄉鎮區...</option>';
        items.forEach(item => {
            if (!arr.includes(item.Town)) {
                arr.push(item.Town);
                Town.innerHTML += `<option>${item.Town}</option>`;
            }
        })
    } else {
        items.forEach(item => {
            if (!arrCity.includes(item.City)) {
                arrCity.push(item.City);
                City.innerHTML += `<option>${item.City}</option>`;
            }
        })
    };

}