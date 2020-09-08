// JavaScript source code
chrome.runtime.onInstalled.addListener(function () {
    //chrome api創建右鍵選單項目
    chrome.contextMenus.create({
        //給予選單項目id
        "id": "selectImage",
        //給予此選單項目顯示的名稱
        "title": "selectImage",
        "contexts": ['image'],
    });


});

