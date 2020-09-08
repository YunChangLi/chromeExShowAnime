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
//���i�ܾ��v�M�檺�Ϥ��ҫت��Ŧ�
var ImageToShow = document.createElement("IMG");
//�b���v�M�椤�i��ܭn�ƻ�Ӥ������s
var TheNextButton = document.createElement("button");
//�b���v�M�椤�T�w�n�έ��i�Ӥ�
var selectedHistory = document.createElement("button");
//�����i�ܨ�ĴX�i�Ϥ�
var count = 0;

let params = {
    active: true,
    currentWindow: true
}


document.addEventListener('DOMContentLoaded', function () {
    //��l�ƾ��v�M��
    InitialShowPos();
    //���s���Ϥ��s��  
    document.getElementById("find").addEventListener('click', getID);
    //���s���ùϤ�
    document.getElementById("switchItem").addEventListener('click', Hide);
    //���s�x�s�Ϥ�
    document.getElementById("like").addEventListener('click', pushToDataBase);
    //�d�ݳ��w�Ϥ�
    document.getElementById("history").addEventListener('click', showHistoryImage);
    //�T�{��ܳ��w���Ӥ�
    ImageToShow.addEventListener('click', settingURLToShow);
    //�T�{�O�_���ùϤ�
    chrome.storage.sync.get('isHide', function (data) {
        document.getElementById("switchItem").checked = !data.isHide;
    });


});
//�ͦ��Ŷ��å�Ϥ��i�h
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
//�NURLdata���content��
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
//�N��ƥ���Ʈw
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
//�o���Ʈw�b�Y��index�U����ƶ�
function getData(ref, content) {
    return database.ref(ref).once(content);
}
//�o���ƶ��U�Ҧ��l���
function getDataChildArray(parent) {
    const array = [];
    parent.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        array.push(childData.url);
    });
    return array;
}
//�M��O�_������
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