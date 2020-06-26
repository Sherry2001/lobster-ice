console.log('here');
const bulmaLink = document.createElement('link');
bulmaLink.setAttribute('href','https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css');
bulmaLink.setAttribute('rel','stylesheet');
document.head.appendChild(bulmaLink)

const sidebar = document.createElement('div');
sidebar.id = 'lobstericecream';
sidebar.classList.add('panel','injection-panel','px-4','py-4');
document.body.appendChild(sidebar); 

    


const iconContainer = document.createElement('div');
iconContainer.classList.add('injection-icon');
iconContainer.id = 'icon-container';
const iconButton = document.createElement('button');
iconButton.classList.add('button','is-info');
iconButton.innerHTML = 'Add to Lobster';
iconContainer.appendChild(iconButton);
    // const icon = document.createElement('img');
    // icon.src = 'assets/lobster.jpg';
    // iconButton.appendChild(icon);
document.body.appendChild(iconContainer);

let lastContent; 

document.onclick = (event) => {
    console.log('got in here');
    const dontListen = '.injection-panel, .injection-icon';
    //if (!event.target.matches(dontListen)) {
    console.log(iconContainer.style.display);
    if (iconContainer.style.display === 'block') {
        console.log('current block, change to none')
        iconContainer.style.display ='none'; 
    } 
   
        console.log('currently none');
        const content = window.getSelection().toString();
        if (content && content.length > 0 && content !== lastContent) {
            console.log( 'change to block');
            showIcon(event, content);
            lastContent = content;
            chrome.storage.sync.set({ content });

        }
        
        console.log(content); 
   // }
};

iconButton.onclick = (event) => {
    event.stopPropagation(); 
    iconContainer.style.display = 'none';
    createSidebar(lastContent);
}

sidebar.onclick = (event) => {
    event.stopPropagation();
}

function showIcon(event, content) {
    iconContainer.style.display = 'block';
    iconContainer.style.left = event.pageX - 10 + 'px';
    iconContainer.style.top = event.pageY - 55 + 'px';
}; 

function closeSidebar() {
  sidebar.style.display = 'none';
}

function createSidebar(content) {
    console.log('createSidebar called');
    sidebar.innerHTML = '';
    sidebar.style.display = 'block';
    const panelHeading = document.createElement('div');
    panelHeading.classList.add('message-header');
    panelHeading.innerText = 'Lobster Ice Cream'; 

    const close = document.createElement('a');
    close.classList.add('delete');
    close.onclick = closeSidebar;
    panelHeading.appendChild(close);
    sidebar.appendChild(panelHeading);
    // const sidebarHeader = document.createElement('div');
    // sidebarHeader.classList.add('navbar');

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
