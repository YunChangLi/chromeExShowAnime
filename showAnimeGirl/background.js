// JavaScript source code
chrome.runtime.onInstalled.addListener(function () {
    //chrome api�Ыإk���涵��
    chrome.contextMenus.create({
        //������涵��id
        "id": "selectImage",
        //��������涵����ܪ��W��
        "title": "selectImage",
        "contexts": ['image'],
    });


});

