// JavaScript source code

var moving = false;
var img = document.createElement("IMG");

chrome.storage.sync.get('myGif', function (data) {
    createImage(data.myGif);
});
chrome.storage.sync.get('isHide', function (data) {
    switchToHide(data.isHide);
});

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
    if (message.type == "url") {
        fetch(message.txt)
            .then(response => response.json())
            .then(content => {
                console.log(content.data.images.downsized.url);
                chrome.storage.sync.set({ 'myGif': content.data.images.downsized.url });
                chrome.storage.sync.get('myGif', function (data) {
                    createImage(data.myGif);
                });
            })
    }
    else if (message.type == "bool") {

        chrome.storage.sync.set({ 'isHide': message.txt });
        chrome.storage.sync.get('isHide', function (data) {
            switchToHide(data.isHide);
        });
    }
    else if (message.type == "imageURL") {
        chrome.storage.sync.set({ 'myGif': message.txt });
        chrome.storage.sync.get('myGif', function (data) {
            createImage(data.myGif);
        });
    }
    

}
function switchToHide(hide) {


    if (hide) {
        img.style.visibility = "hidden";
        console.log("hidden");
    }
    else {
        img.style.visibility = "visible";
        console.log("visible");
    }
}

function createImage(ImgSrc) {

    
    img.setAttribute("src", ImgSrc);

    img.setAttribute("margin", 0);
    img.setAttribute("padding", 0);
    img.style['position'] = 'fixed';
    img.style['right'] = '3%';
    img.style['bottom'] = '5%';
    img.style['margin'] = '0';
    img.style['padding'] = '0';
    img.style['width'] = '15%';
    img.style['z-index'] = '1000';
    document.body.appendChild(img);

    img.addEventListener("mousedown", clicked, false);

}


function move(e)
{
    var newX = e.clientX - 10;
    var newY = e.clientY - 10;

    img.style.left = newX + "px";
    img.style.top = newY + "px";

}

function clicked(e)
{
    if (moving)
    {
        document.removeEventListener("mousemove", move);
        moving = !moving;
        return;
    }
    moving = !moving;
    //img = this;

    document.addEventListener("mousemove", move, false);


}


