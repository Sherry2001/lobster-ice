let email;
let id;
chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, (userInfo) => {
  email = userInfo.email; 
  id = userInfo.id;
});

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, (userInfo) => {
    email = userInfo.email; 
    id = userInfo.id;
  });
  sendResponse({
    email: email,
    id: id,
  });
});
