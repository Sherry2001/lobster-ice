/**
 * Content script for all urls
 */

// Insert bulma stylesheet
// TODO: STOP USING BULMA ONCE I WRITE MY OWN CSS FOR ALL EXTENSION ELEMENTS
const bulmaLink = document.createElement('link');
bulmaLink.setAttribute(
  'href',
  'https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css'
);
bulmaLink.setAttribute('rel', 'stylesheet');
document.head.appendChild(bulmaLink);

// Inject invisible sidebar onto page
const sidebar = customCreateElement('div', ['panel', 'injection-sidebar', 'px-4', 'py-4']);
sidebar.id = 'lobstericecream';
document.body.appendChild(sidebar);

// Inject invisible highlight icon onto page
const iconButton = customCreateElement('button', ['injection-icon'], 'Save');
// TODO: CHANGE BUTTON TO AN ACTUAL ICON!!

document.body.appendChild(iconButton);

// Keep track of last used highlight
let lastContent;

// Show extension icon when selecting text on page
document.onclick = (event) => {
  if (iconButton.style.display === 'block') {
    iconButton.style.display = 'none';
  }
  const content = window.getSelection().toString();
  // TODO: Trim Text
  if (content && content !== lastContent) {
    showIcon(event);
    lastContent = content;
  }
};

// Exclude icon from text-select listener, trigger sidebar when clicked
iconButton.onclick = (event) => {
  event.stopPropagation();
  iconButton.style.display = 'none';
  createSidebar(lastContent);
};

// Exclude sidebar from text-select listener
sidebar.onclick = (event) => {
  event.stopPropagation();
};

function showIcon(event) {
  iconButton.style.display = 'block';
  iconButton.style.left = event.pageX + 5 + 'px';
  iconButton.style.top = event.pageY - 45 + 'px';
}

function closeSidebar() {
  sidebar.style.display = 'none';
}

// Inject sidebar html content
function createSidebar(content) {
  sidebar.innerHTML = '';
  sidebar.style.display = 'block';

  const panelHeading = customCreateElement('div', ['message-header'], 'Lobster Ice Cream');
  // TODO: Include icon in panelhead, update looks

  const close = customCreateElement('a', ['delete']);
  close.onclick = closeSidebar;
  panelHeading.appendChild(close);
  sidebar.appendChild(panelHeading);

  const form = document.createElement('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    addItem();
  });

  const highlightLabel = customCreateElement('label', ['label', 'mt-2'], 'Highlighted Text');
  form.appendChild(highlightLabel);

  const highlightTextarea = customCreateElement('textarea', ['textarea']);
  highlightTextarea.id = 'highlight';
  form.appendChild(highlightTextarea);
  highlightTextarea.value = content;

  const commentTextarea = customCreateElement('textarea', ['textarea', 'mt-6']);
  commentTextarea.id = 'comment';
  commentTextarea.setAttribute('placeholder', 'Note to self');
  form.appendChild(commentTextarea);

  const buttonContainer = customCreateElement('div', ['has-text-centered', 'mt-1']);

  const addButton = customCreateElement('button', ['button', 'is-link'], 'Add Clipping');
  addButton.type = 'submit';
  buttonContainer.appendChild(addButton);
  form.appendChild(buttonContainer);

  sidebar.appendChild(form);
}

/**
 * Helper to create an HTML Element
 * @param {String} type
 * @param {Array of Strings} classList
 * @param {String} innerHTML
 */
function customCreateElement(type, classList, innerHTML = '') {
  const newElement = document.createElement(type);
  newElement.classList.add(...classList);
  newElement.innerHTML = innerHTML;
  return newElement;
}


const serverUrl = 'http://localhost:8080';
// TODO: select between dev host and prod host

async function addItem() {
  newItem = {
    sourceLink: window.location.toString(), // TODO: get actual sourceLink
    placesId: 'something', // TODO: get actual placesId
    userId: '5f050952f516f3570ee26724', // TODO: get actual userID
    highlight: document.getElementById('highlight').value,
    comment: document.getElementById('comment').value,
  }
  
  try {
    const response = await fetch(serverUrl + '/item/addItem', {
        method: 'POST',
        body: JSON.stringify(newItem),
        headers: { 'Content-type': 'application/json' }
    });
    
    if (response.status !== 200) {
      throw new Error(response.statusMessage);
    } else {
      // TODO: display success message, timeOut closeSidebar
      closeSidebar();
    }
  } catch(error) {
    // TODO: display error message on frontend
  }
}
