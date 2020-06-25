console.log('here');
const bulmaLink = document.createElement('link');
    bulmaLink.setAttribute('href','https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css');
    bulmaLink.setAttribute('rel','stylesheet');
    document.head.appendChild(bulmaLink)

    const sidebar = document.createElement('div');
    sidebar.id = 'lobstericecream';
    sidebar.classList.add('panel','injection-panel','invisible','px-4','py-4');
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
    panelHeading.innerText = 'Lobster Ice Cream'; 
    sidebar.appendChild(panelHeading);
   
    const form = document.createElement('form');
    const highlightLabel = document.createElement('label');
    highlightLabel.classList.add('label','mt-2');
    highlightLabel.innerText = 'Highlighted Text'
    form.appendChild(highlightLabel);

    const highlightTextarea = document.createElement('textarea');
    highlightTextarea.classList.add('textarea');
    form.appendChild(highlightTextarea);
    highlightTextarea.value = content;

    const noteTextarea = document.createElement('textarea');
    noteTextarea.classList.add('textarea', 'mt-6');
    noteTextarea.setAttribute('placeholder','Note to self');
    form.appendChild(noteTextarea);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('has-text-centered','mt-1');
    const addButton = document.createElement('button');
    addButton.classList.add('button', 'is-link')
    addButton.innerHTML = 'Add Clipping';
    buttonContainer.appendChild(addButton);
    form.appendChild(buttonContainer);

    

    sidebar.appendChild(form);
}

    