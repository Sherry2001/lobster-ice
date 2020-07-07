/**
 * Content script for all urls
 */

//Insert bulma stylesheet
//TODO: STOP USING BULMA ONCE I WRITE MY OWN CSS FOR ALL EXTENSION ELEMENTS
const bulmaLink = document.createElement('link');
bulmaLink.setAttribute(
  'href',
  'https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css'
);
bulmaLink.setAttribute('rel', 'stylesheet');
document.head.appendChild(bulmaLink);

//Inject invisible sidebar onto page
const sidebar = document.createElement('div');
sidebar.id = 'lobstericecream';
sidebar.classList.add('panel', 'injection-panel', 'px-4', 'py-4');
document.body.appendChild(sidebar);

//Inject invisible highlight icon onto page
const iconButton = document.createElement('button');
iconButton.classList.add('injection-icon');
iconButton.innerHTML = 'Save';
//TODO: CHANGE BUTTON TO AN ACTUAL ICON!!

document.body.appendChild(iconButton);

//Keep track of last used highlight
let lastContent;

//Show extension icon when selecting text on page
document.onclick = (event) => {
  if (iconButton.style.display === 'block') {
    iconButton.style.display = 'none';
  }
  const content = window.getSelection().toString();
  //TODO: Trim Text
  if (content && content !== lastContent) {
    showIcon(event, content);
    lastContent = content;
    //TODO: Keeping for now for future reference:
    //chrome.storage.sync.set({ content });
  }
};

//Execute icon from text-select listener, trigger sidebar when clicked
iconButton.onclick = (event) => {
  event.stopPropagation();
  iconButton.style.display = 'none';
  createSidebar(lastContent);
};

//Exclude sidebar from text-select listener
sidebar.onclick = (event) => {
  event.stopPropagation();
};

function showIcon(event, content) {
  iconButton.style.display = 'block';
  iconButton.style.left = event.pageX + 5 + 'px';
  iconButton.style.top = event.pageY - 45 + 'px';
}

function closeSidebar() {
  sidebar.style.display = 'none';
}

//Inject sidebar html content
function createSidebar(content) {
  sidebar.innerHTML = '';
  sidebar.style.display = 'block';
  const panelHeading = document.createElement('div');
  panelHeading.classList.add('message-header');
  panelHeading.innerText = 'Lobster Ice Cream';
  //TODO: Include icon in panelhead, update looks

  const close = document.createElement('a');
  close.classList.add('delete');
  close.onclick = closeSidebar;
  panelHeading.appendChild(close);
  sidebar.appendChild(panelHeading);

  const form = document.createElement('form');
  form.onsubmit = addItem();

  const highlightLabel = document.createElement('label');
  highlightLabel.classList.add('label', 'mt-2');
  highlightLabel.innerText = 'Highlighted Text';
  form.appendChild(highlightLabel);

  const highlightTextarea = document.createElement('textarea');
  highlightTextarea.classList.add('textarea');
  highlightTextarea.id = 'highlight';
  form.appendChild(highlightTextarea);
  highlightTextarea.value = content;

  const noteTextarea = document.createElement('textarea');
  noteTextarea.classList.add('textarea', 'mt-6');
  noteTextarea.id = 'comment';
  noteTextarea.setAttribute('placeholder', 'Note to self');
  form.appendChild(noteTextarea);
  
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('has-text-centered', 'mt-1');
  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.classList.add('button', 'is-link');
  addButton.innerHTML = 'Add Clipping';
  buttonContainer.appendChild(addButton);
  form.appendChild(buttonContainer);

  sidebar.appendChild(form);
}

function addItem() {
  newItem = {
    userId: 'dummyUserId',
    highlight: document.getElementById('highlight'),
    comment: document.getElementById('comment'),
  }
  fetch('http://localhost:8080/item/addItem', {
    method: 'POST',
    body: newItem,
  }).then(() => {
    console.log('hello');
  });
}
