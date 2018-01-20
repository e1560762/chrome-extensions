// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function downloadFile(filename, text) {
        var element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
        element.setAttribute("download", filename);

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
}


document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    // Put the image URL in Google search.
    if(decodeURI("https://tr.wikipedia.org/wiki/Türkiye%27de_yayın_yapan_televizyon_kanalları_listesi") == decodeURI(url)) {
      renderStatus(url);
    }


  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
  });

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    // LOG THE CONTENTS HERE
    //console.log(request.content);
  });

chrome.tabs.getSelected(null, function(tab) {

  // Now inject a script onto the page
  chrome.tabs.executeScript(tab.id, {
       code: "function downloadFile(filename, text) { var element = document.createElement('a'); element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)); element.setAttribute('download', filename); element.style.display = 'none'; document.body.appendChild(element); element.click(); document.body.removeChild(element);} var channel_name_node = null; var channel_type_node = null; var channel_name_text = '';  var channel_type_text = '';  var category_to_channels = {}; try { var channel_name_and_category_node = document.getElementById('mw-content-text').getElementsByClassName('wikitable')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr'); for(i=0; i < channel_name_and_category_node.length; i++) { channel_name_node = channel_name_and_category_node[i].getElementsByTagName('td')[0]; channel_type_node = channel_name_and_category_node[i].getElementsByTagName('td')[1]; channel_type_text = channel_type_node.innerHTML; try { channel_name_text = channel_name_node.firstElementChild.innerHTML; } catch(name_err) { console.log(name_err); channel_name_text = channel_name_node.innerHTML; } try {category_to_channels[channel_type_text].push(channel_name_text); } catch(json_append_err) { console.log(json_append_err); category_to_channels[channel_type_text] = [channel_name_text]; }} downloadFile('wiki_channel_categories.txt', JSON.stringify(category_to_channels)); }catch(outerr) { console.log(outerr); }"
     }, function() { console.log('done'); });

});
