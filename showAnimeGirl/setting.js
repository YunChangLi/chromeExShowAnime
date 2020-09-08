// JavaScript source code

var firebaseConfig = {
    apiKey: "AIzaSyBtoxEFKW6Zcdhb5p5s75lkcQh6QvS09xU",
    authDomain: "animegirl-a1a9c.firebaseapp.com",
    databaseURL: "https://animegirl-a1a9c.firebaseio.com",
    projectId: "animegirl-a1a9c",
    storageBucket: "animegirl-a1a9c.appspot.com",
    messagingSenderId: "828011982247",
    appId: "1:828011982247:web:27f0542387ed3509281a82"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log(firebase);
var database = firebase.database();
var none = true;
var currentGif;
//為展示歷史清單的圖片所建的空位
var ImageToShow = document.createElement("IMG");
//在歷史清單中可選擇要甚麼照片的按鈕
var TheNextButton = document.createElement("button");
//在歷史清單中確定要用哪張照片
var selectedHistory = document.createElement("button");
//紀錄展示到第幾張圖片
var count = 0;

let params = {
    active: true,
    currentWindow: true
}


document.addEventListener('DOMContentLoaded', function () {
    //初始化歷史清單
    InitialShowPos();
    //按鈕找到圖片連結  
    document.getElementById("find").addEventListener('click', getID);
    //按鈕隱藏圖片
    document.getElementById("switchItem").addEventListener('click', Hide);
    //按鈕儲存圖片
    document.getElementById("like").addEventListener('click', pushToDataBase);
    //查看喜歡圖片
    document.getElementById("history").addEventListener('click', showHistoryImage);
    //確認選擇喜歡的照片
    ImageToShow.addEventListener('click', settingURLToShow);
    //確認是否隱藏圖片
    chrome.storage.sync.get('isHide', function (data) {
        document.getElementById("switchItem").checked = !data.isHide;
    });


});
//生成空間並丟圖片進去
async function showHistoryImage() {
    
    const gifs = await getData('image', 'value')
    const gifURLs = getDataChildArray(gifs);
    putImageIntoShowPos(gifURLs[0]);
    TheNextButton.innerHTML = "next";
    TheNextButton.onclick = function () {
        count += 1;
        if (count >= gifURLs.length) {
            count = 0;
        }

        putImageIntoShowPos(gifURLs[count]);
    };
    document.getElementById("showPos").appendChild(TheNextButton);

}
function InitialShowPos() {

    ImageToShow.setAttribute("margin", 0);
    ImageToShow.setAttribute("padding", 0);
    ImageToShow.style['margin-left'] = '10%';
    ImageToShow.style['width'] = '80%';
    document.getElementById("showPos").appendChild(ImageToShow);

}
function putImageIntoShowPos(gifURL) {
    ImageToShow.setAttribute("src", gifURL);
    
}
//將URLdata丟到content中
function settingURLToShow() {
    chrome.tabs.query(params, gotTabsForSendURL);

    function gotTabsForSendURL(tabs) {

        let msg = {
            type: "imageURL",
            txt: ImageToShow.getAttribute('src')
        }

        chrome.tabs.sendMessage(tabs[0].id, msg);

    }
}
//將資料丟到資料庫
function pushToDataBase() {
    chrome.storage.sync.get('myGif', async function (data) {
        none = await checkNotExist(data.myGif);
        if (none) {
            
            database.ref('image').push({
                url: data.myGif
            })
            
        }
        
    });

}
//得到資料庫在某個index下的資料集
function getData(ref, content) {
    return database.ref(ref).once(content);
}
//得到資料集下所有子資料
function getDataChildArray(parent) {
    const array = [];
    parent.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        array.push(childData.url);
    });
    return array;
}
//尋找是否有重複
async function checkNotExist(url) {

    var noneL = true;

    const gifs = await getData('image', 'value')
    const gifURLs = getDataChildArray(gifs);

    for (const ele of gifURLs) {
        if (ele === url) {
            noneL = false;
            alert("1");
        }
    }

    console.log(gifURLs);
    return noneL;
}
function Hide()
{
    var isHide = true;
    if (document.getElementById("switchItem").checked) {
        isHide = false;
    }
    else {
        isHide = true;
    }
    chrome.tabs.query(params, gotTabsForHide);

    function gotTabsForHide(tabs) {
      
        let msg = {
            type: "bool",
            txt: isHide
        }

        chrome.tabs.sendMessage(tabs[0].id, msg);

    }
    
}
function getID()
{
    let userinput = document.getElementById("userinput");
    
    chrome.tabs.query(params, gotTabs);
    
    function gotTabs(tabs) {
        var link = "https://api.giphy.com/v1/gifs/";
        var ID = userinput.value + "?";
        var APIKey = "api_key=" + "gl2UtzDE7B5sfZGCKTjmmpcBPoLOJoaJ";
        var url = link + ID + APIKey;
        let msg = {
            type: "url",
            txt: url
        }

        chrome.tabs.sendMessage(tabs[0].id, msg);
       
    }
}