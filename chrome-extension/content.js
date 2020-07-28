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

// TODO: get actual user id
const currentUserId = '66616b652d757365722d6964';

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
async function createSidebar(content) {
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
  highlightLabel.htmlFor = 'highlight';
  form.appendChild(highlightLabel);

  const highlightTextarea = customCreateElement('textarea', ['textarea']);
  highlightTextarea.id = 'highlight';
  form.appendChild(highlightTextarea);
  highlightTextarea.value = content;

  const commentLabel = customCreateElement('label', ['label', 'mt-2'], 'Note to Self');
  commentLabel.htmlFor = 'comment';
  form.appendChild(commentLabel);

  const commentTextarea = customCreateElement('textarea', ['textarea', 'mt-2']);
  commentTextarea.id = 'comment';
  commentTextarea.setAttribute('placeholder', 'Note to self');
  form.appendChild(commentTextarea);
  
  sidebar.appendChild(form);
  
  const userEmailNote = customCreateElement('div', []);
  chrome.extension.sendMessage({}, async (userInfo) => {
    const email = userInfo.email; 
    const googleId = userInfo.id;
    console.log('printing from userInfo.stuf');
    console.log(email);
    console.log(googleId);
   
    if(googleId) { 
      console.log('hi');
      // TODO: fetch currentUserId from server
      try {
        const response = await fetch(
          serverUrl + '/user/getUserId/' + googleId
        );

        const mongoId = await response.json();
        console.log('the response from /getUserId response.body')
        console.log(mongoId);

        // Create select dropdown with options fetched from categories db
        const dropdownLabel = customCreateElement('label', ['label', 'mt-2'], 'Add Clipping to a Category?');
        dropdownLabel.htmlFor = 'categoryDropdown';
        form.appendChild(dropdownLabel);

        const categoryDropdown = await getCategoryDropdown(mongoId);
        categoryDropdown.id = 'categoryDropdown';
        form.appendChild(categoryDropdown);

        const buttonContainer = customCreateElement('div', ['has-text-centered', 'mt-1']);

        const addButton = customCreateElement('button', ['button', 'is-link'], 'Add Clipping');
        addButton.type = 'submit';
        buttonContainer.appendChild(addButton);
        form.appendChild(buttonContainer);

        userEmailNote.innerHTML =  'Signed in as ' +  email;
        form.appendChild(userEmailNote);  
      } catch (error) {
        console.log('error', error);
        // TODO: do something if there's an error
      }
    } else {
      userEmailNote.innerHTML = 'Sign into Chrome to save your clipping'
      form.appendChild(userEmailNote);
    }
  });
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

/**
 * Returns a Promise that resolves to a <select> element,
 * a multi-select dropdown menu of category options from fetching db
 * @param {String} userId
 */
async function getCategoryDropdown(userId) {
  const categoryDropdown = customCreateElement('select', []);
  categoryDropdown.setAttribute('multiple', true);

  const defaultOption = customCreateElement('option', [], 'Option: Select a Category');
  defaultOption.value = '';
  defaultOption.disabled = true;
  categoryDropdown.options.add(defaultOption);

  try {
    const response = await fetch(
      serverUrl + '/category/getCategories/' + userId
    );
    const categories = await response.json();
    categories.map((category) => {
      const newOption = customCreateElement('option', [], category.title);
      newOption.value = category._id;
      categoryDropdown.options.add(newOption);
    });
  } catch (error) {
    alert('There was an error adding your clipping to database. Please try again!');
  }
  return categoryDropdown;
}

/**
 * Add new item to databse
 */
async function addItem() {
  // Get chrome user info
  const newItem = {
    sourceLink: window.location.toString(),
    placesId: 'something', // TODO: get actual placesId
    highlight: document.getElementById('highlight').value,
    comment: document.getElementById('comment').value,
  };

  // Get actual userId 
  chrome.extension.sendMessage({}, (userInfo) => {
    console.log("Got user:", userInfo.email);
    console.log("user Id: " + userInfo.id);
    const googleId = userInfo.id; 
    if (googleId) {
      newItem.userId = googleId;
    } else {
      alert('Please sign into Chrome to save your clipping');
    }
  });

  // Handle categories selected by user for new Item
  const selectedCategories = getSelectedOptions('categoryDropdown');
  if (selectedCategories.length > 0) {
    console.log(selectedCategories);
    newItem.categoryIds = selectedCategories;
  }

  try {
    const response = await fetch(serverUrl + '/item/addItem', {
      method: 'POST',
      body: JSON.stringify(newItem),
      headers: { 'Content-type': 'application/json' },
    });

    if (response.status !== 200) {
      throw new Error(response.statusMessage);
    } else {
      // TODO: display success message, timeOut closeSidebar
      closeSidebar();
    }
  } catch (error) {
    // TODO: display error message on frontend
  }
}

/**
 * Helper to return a list of selected options from a multi-select dropdown
 * @param {String} dropdownElementId
 */
function getSelectedOptions(dropdownElementId) {
  const selectedCategories = [];
  const categoryOptions = document.getElementById(dropdownElementId).options;
  for (option of categoryOptions) {
    if (option.selected) {
      selectedCategories.push(option.value);
    }
  }
  return selectedCategories;
}
