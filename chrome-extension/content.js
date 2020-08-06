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

const serverUrl = 'http://localhost:8080';
// TODO: select between dev host and prod host

// Inject invisible sidebar onto page
const sidebar = customCreateElement('div', ['panel', 'px-4', 'py-4']);
sidebar.id = 'extension-sidebar';
document.body.appendChild(sidebar);

// Inject invisible highlight icon onto page
const iconButton = customCreateElement('button', [], 'Save');
iconButton.id = 'highlight-icon';
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

  const panelHeading = customCreateElement('div', ['message-header'],
    '<a href="http://localhost:3000" target="_blank">Lobster Ice Cream</a>');
  // TODO: Include icon in panelhead, update looks
  panelHeading.id = 'panelHeading';

  const close = customCreateElement('a', ['delete']);
  close.onclick = closeSidebar;
  panelHeading.appendChild(close);
  sidebar.appendChild(panelHeading);

  const form = document.createElement('form');
  form.id = 'sidebarForm';

  const highlightLabel = customCreateElement('label', ['label', 'mt-2'], 'Highlighted Text');
  highlightLabel.htmlFor = 'highlight';
  form.appendChild(highlightLabel);

  const highlightInput = customCreateElement('input', ['input', 'mb-2']);
  highlightInput.id = 'highlight';
  form.appendChild(highlightInput);
  highlightInput.value = content;

  // Get search results and selector for places api search results
  const placesSelector = await getPlacesSelection(content);
  if (placesSelector) {
    placesSelector.id = 'placesSelector';

    const placesResultLabel = customCreateElement('label', ['label'], 'Google Maps Search Results')
    placesResultLabel.htmlFor = 'placesSelector';
    form.appendChild(placesResultLabel);
    form.appendChild(placesSelector);
  } else {
    // TODO: Show that Places API did not find place?
  }

  const commentLabel = customCreateElement('label', ['label', 'mt-2'], 'Note to Self');
  commentLabel.htmlFor = 'comment';
  form.appendChild(commentLabel);

  const commentTextarea = customCreateElement('textarea', ['textarea', 'mt-2']);
  commentTextarea.id = 'comment';
  commentTextarea.setAttribute('placeholder', 'Note to self');
  form.appendChild(commentTextarea);

  sidebar.appendChild(form);

  const userEmailNote = customCreateElement('div', []);
  let mongoId;

  // Get logged-in user info
  chrome.extension.sendMessage({}, async (userInfo) => {
    const email = userInfo.email;
    const googleId = userInfo.id;

    if (googleId) {
      try {
        const response = await fetch(serverUrl + '/user/getUserId/' + googleId);
        mongoId = await response.json();

        const dropdownLabel = customCreateElement('label', ['label', 'mt-2'], 'Add Clipping to a Category?');
        dropdownLabel.htmlFor = 'categoryDropdown';
        form.appendChild(dropdownLabel);

        // Create tiny form to add category
        const newCategoryForm = createNewCategoryForm(mongoId);
        form.appendChild(newCategoryForm);
        // Create select dropdown with options fetched from categories db
        const categoryDropdown = await getCategoryDropdown(mongoId);
        categoryDropdown.id = 'categoryDropdown';
        form.appendChild(categoryDropdown);

        userEmailNote.innerHTML = 'Signed in as ' + email;
      } catch (error) {
        // TODO: better error handling
        userEmailNote.innerHTML = 'Error while getting user information';
        console.log(error);
      }
    } else {
      userEmailNote.innerHTML = 'Sign into Chrome to save your clipping';
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      addItem(mongoId);
    });

    const buttonContainer = customCreateElement('div', ['has-text-centered', 'mt-1']);
    const addButton = customCreateElement('button', ['button', 'is-link'], 'Add Clipping');
    addButton.type = 'submit';
    addButton.id = 'lobster-submit-button';
    buttonContainer.appendChild(addButton);
    form.appendChild(buttonContainer);
    form.appendChild(userEmailNote);
  });
}

/**
 * Helper to create a small new category form
 * @param {String} userId 
 */
function createNewCategoryForm(userId) {
  const newCategoryForm = document.createElement('form');
  newCategoryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addNewCategory(userId);
  });

  const newCategoryBar = customCreateElement('div', ['field', 'has-addons']);
  const inputControl = customCreateElement('div', ['control']);
  const categoryInput = customCreateElement('input', ['input']);
  categoryInput.setAttribute('placeholder', 'Add new category');
  categoryInput.setAttribute('type', 'text');
  categoryInput.id = 'newCategoryInput';
  inputControl.appendChild(categoryInput);

  const buttonControl = customCreateElement('div', ['control']);
  const categoryButton = customCreateElement('button', ['button'], 'Create');
  categoryButton.id = 'newCategoryButton';
  categoryButton.type = 'submit';
  buttonControl.appendChild(categoryButton);
  newCategoryBar.append(inputControl, buttonControl);
  newCategoryForm.appendChild(newCategoryBar);

  return newCategoryForm;
}

/**
 * Helper to add a new category to db upon form submission
 * and add a new option to categoryDropdown
 * @param {String} userId 
 */
async function addNewCategory(userId) {
  const newCategoryTitle = document.getElementById('newCategoryInput').value;
  const newCategory = {userId: userId,
                       title: newCategoryTitle};
  try {
    const response = await fetch(serverUrl + '/category/createCategory', {
      method: 'POST',
      body: JSON.stringify(newCategory),
      headers: { 'Content-type': 'application/json' },
    });

    if (response.status !== 200) {
      throw new Error(response.statusMessage);
    } else {
      const newOption = customCreateElement('option', [], newCategoryTitle);
      const newCategoryId = await response.json();
      newOption.value = newCategoryId;
      categoryDropdown.options.add(newOption);
      document.getElementById('newCategoryInput').value = '';
    }
  } catch (error) {
    console.log(error);
    alert('Sorry, there was an error adding new category');
  }
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

/**
 * Returns a Promise that resolves to a <select> element,
 * a multi-select dropdown menu of category options from fetching db
 * @param {String (Mongoose.ObjectId)} userId
 */
async function getCategoryDropdown(userId) {
  const categoryDropdown = customCreateElement('select', ['select', 'is-multiple', 'mb-2']);
  categoryDropdown.setAttribute('multiple', true);
  categoryDropdown.id = 'categoryDropdown';

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
    // TODO: Handle error
  }
  return categoryDropdown;
}

/**
 * Returns select HTML element of places search result options
 * @param {String} text 
 */
async function getPlacesSelection(text) {
  const searchResults = await placesSearch(text);
  if (searchResults && searchResults.length > 0) {
    const returnDiv = document.createElement('div');
    const placesSelection = customCreateElement('select', ['select']);
    placesSelection.id = 'placesDropdown';
    const defaultOption = customCreateElement('option', [], 'Optional: Select a Location');
    defaultOption.value = '';
    defaultOption.selected = true;
    defaultOption.disabled = true;
    placesSelection.options.add(defaultOption);

    searchResults.map((place) => {
      const previewCard = customCreateElement('div', ['card', 'mb-2']);
      const cardContent = customCreateElement('div', ['card-content']);
      const cardMedia = customCreateElement('div', ['media']);
      const mediaImage = customCreateElement('div', ['media-left']);
      const figure = customCreateElement('figure', ['image', 'is-48x48']);
      const image = document.createElement('img');

      image.src = place.icon;
      image.alt = 'place icon';
      figure.appendChild(image);
      mediaImage.appendChild(figure);

      const mediaContent = customCreateElement('div', ['media-content']);
      const placeName = customCreateElement('p', ['title', 'is-6'], place.name);
      const rating = customCreateElement('p', ['subtitle', 'is-6'], 'Rating: ' + place.rating);
      mediaContent.append(placeName, rating);

      cardMedia.append(mediaImage, mediaContent);

      const cardDetails = customCreateElement('div', ['content', 'is-size-6'], place.formatted_address);
      cardContent.append(cardMedia, cardDetails);
      previewCard.appendChild(cardContent);
      returnDiv.appendChild(previewCard);

      const newOption = customCreateElement('option', [], place.name);
      newOption.value = place.place_id
      placesSelection.options.add(newOption);
    })
    returnDiv.appendChild(placesSelection);
    return returnDiv;
  }
  return null;
}

/**
 * Helper function that sends a request to Google Places Search and returns a list of
 * search results, if there are.
 * @param {String} text 
 */
async function placesSearch(text) {
  try {
    const response = await fetch(
      serverUrl + '/extension/placesSearch/' + text
    );
    const candidates = await response.json();
    return candidates
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * Add new item to database
 * Side bar turns to success message panel once item successfully added  
 */
async function addItem(mongoId) {
  const newItem = {
    sourceLink: window.location.toString(),
    highlight: document.getElementById('highlight').value,
    comment: document.getElementById('comment').value,
  };
  if (document.getElementById('placesDropdown')) {
    newItem.placesId = document.getElementById('placesDropdown').value;
  }

  if (mongoId) {
    newItem.userId = mongoId;
  } else {
    // TODO: alert message coming from website, not extension
    alert('Please sign into Chrome to save your clipping');
    return;
  }

  // Handle categories selected by user for new Item
  const selectedCategories = getSelectedOptions('categoryDropdown');
  if (selectedCategories.length > 0) {
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
      sidebar.removeChild(document.getElementById('sidebarForm'));
      sidebar.appendChild(
        //TODO: To be styled
        customCreateElement('div', [], 'Succesfully added clipping to your account!')
      );
      setTimeout(closeSidebar, 3000);
    }
  } catch (error) {
    alert('There was an error adding this clipping to your account');
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
