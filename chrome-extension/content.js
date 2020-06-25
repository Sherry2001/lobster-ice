console.log('here');
const bulmaLink = document.createElement('link');
    bulmaLink.setAttribute('href','https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css');
    bulmaLink.setAttribute('rel','stylesheet');
    document.head.appendChild(bulmaLink)

    const sidebar = document.createElement('div');
    sidebar.id = 'lobstericecream';
    sidebar.classList.add('panel');
    sidebar.classList.add('injection-panel');
    sidebar.classList.add('invisible'); 
    document.body.appendChild(sidebar); 

      
document.onmouseup = document.onkeyup = document.onselectionchange = function() {
  const content = window.getSelection().toString(); 
  console.log(content);  
  chrome.storage.sync.set({ content });
  if (sidebar.classList.contains('invisible')) {
    sidebar.classList.remove('invisible');
  }
  sidebar.innerHTML = '';
  createSidebar(content)
};

function createSidebar(content) {
    const panelHeading = document.createElement('div');
    panelHeading.classList.add('panel-heading');
    panelHeading.innerText = "Lobster Ice Cream"; 
    sidebar.appendChild(panelHeading);

    const panelBlock = document.createElement('div');
    panelBlock.classList.add('panel-block');
    panelBlock.innerText = "Hello this is a panel block inner text+" + content;
    sidebar.appendChild(panelBlock);
}
    