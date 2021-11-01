/**
 * Created by Matrixes, 2021.
 */

let collectedIpAddress = {}

function sendMessageToTabs(tab) {
    browser.tabs.sendMessage(
        tab,
        {collectedIpAddress: collectedIpAddress[tab]},
        function (response) {
            if (browser.runtime.lastError) {
            }
        })
        if (tab in collectedIpAddress) {
            delete collectedIpAddress[tab]
        }
}

browser.webRequest.onCompleted.addListener(function (details) {
    console.log(details)
    if (details.type === "main_frame") {
        collectedIpAddress[details.tabId] = details.ip
    }
}, {urls: ['<all_urls>'], types: ['main_frame']}, ['responseHeaders'])

browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
    console.log(tabInfo)
    if(changeInfo.status === 'complete') {
        sendMessageToTabs(tabId)
    }
})

browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
    //console.log(tabId, removeInfo)
    if (tabId in collectedIpAddress) {
        delete collectedIpAddress[tabId]
    }
})