let email;
let id;

chrome.identity.getProfileUserInfo((userInfo) => {
  email = userInfo.email; 
  id = userInfo.id;
});

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
    sendResponse({
      email: email,
      id: id,
    })
});
