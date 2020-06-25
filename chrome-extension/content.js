console.log('here');
document.onmouseup = document.onkeyup = document.onselectionchange = function() {
  const content = window.getSelection().toString(); 
  console.log(content);  
  chrome.storage.sync.set({ content });
};
