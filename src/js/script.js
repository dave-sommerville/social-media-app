'use strict';
//	Switching is currently changing for all posts
//	Images need to be fixed
//	Switch button to be made into a radio button inside nav
//	Hamburger icon for responsive design


/*------------------------------------------------------------------------->  
  Utility Functions  
<-------------------------------------------------------------------------*/

function select(selector, scope = document) {
  return scope.querySelector(selector);
}

function listen(event, element, callback) {
  return element.addEventListener(event, callback);
}

function isImageFile(file) {
  return file && file.type.startsWith('image');
}

function generateUniqueId() {
  return '#:' + Date.now();
}

function addClass(element, customClass) {
  element.classList.add(customClass);
  return element;
}

function removeClass(element, customClass) {
  element.classList.remove(customClass);
  return element;
}

function assignId(element) {
  element.id = id;
  return element;
}

function createImage(imageSrc) {
  const img = document.createElement('img');
  img.src = imageSrc;
  img.alt = imageSrc; // Because the photo could be anything
  return img;
}

function create(element) {
  const newElement = document.createElement(element);
  return newElement;
}

function addText(element, text) {
  element.textContent = text;
}

/*------------------------------------------------------------------------->  
  Initial Declarations  
<-------------------------------------------------------------------------*/

const userInput = select('.user-input');
const imageButton = select('.image-btn');
const postButton = select('.post-btn');
const imgInput = select('#image-input');
const newsfeed = select('.newsfeed');
const postTextArea = select('.input-text');
const imageInput = select('#image-input');
const inputDisplay = select('.input-display');
const profileModal = select('.profile-modal');
const avatarModal = select('.profile-pic');
const modalName = select('.name');
const modalUserName = select('.username');
const modalEmail = select('.email');
const modalGroups = select('.groups');
const modalPages = select('.pages');
const modalButton = select('.header-profile');
const switchUserButton = select('.switch-user-btn'); // Switch user button

const postsDatabase = [];
let uploadedImage = null;

/*------------------------------------------------------------------------->  
  Class Construction - USER
<-------------------------------------------------------------------------*/

class User {
  #id;
  #firstName;
  #lastName;
  #userName;
  #email;
  #profilePic;

  constructor(id, firstName, lastName, userName, email, profilePic) {
    this.setId(id);
    this.setFirstName(firstName);
    this.setLastName(lastName);
    this.setUserName(userName);
    this.setEmail(email);
    this.setProfilePic(profilePic);
  }

  setId(id) {
    if (typeof id !== 'string' || id.trim() === '') {
      throw new Error('ID must be a non-empty string.');
    }
    this.#id = id;
  }

  setUserName(userName) {
    if (typeof userName !== 'string' || userName.trim() === '') {
      throw new Error('Username must be a non-empty string.');
    }
    this.#userName = userName;
  }
  setFirstName(firstName) {
    if (typeof firstName !== 'string' || firstName.trim() === '') {
      throw new Error('First name must be a non-empty string.');
    }
    this.#firstName = firstName;
  }
  setLastName(lastName) {
    if (typeof lastName !== 'string' || lastName.trim() === '') {
      throw new Error('Last name must be a non-empty string.');
    }
    this.#lastName = lastName;
  }
  setEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (typeof email !== 'string' || !emailRegex.test(email)) {
      throw new Error('Invalid email format.');
    }
    this.#email = email;
  }
  setProfilePic(profilePic) {
    if (profilePic && typeof profilePic !== 'string') {
      throw new Error('Profile picture must be a string URL or empty.');
    }
    this.#profilePic = profilePic || '';
  }

  getFirstName() {
    return this.#firstName;
  }
  getLastName() {
    return this.#lastName;
  }
  getUserName() {
    return this.#userName;
  }
  getProfilePic() {
    return this.#profilePic;
  }
  getEmail() {
    return this.#email;
  }
  getId() {
    return this.#id;
  }
  getFullName() {
    return `${this.#firstName} ${this.#lastName}`;
  }
}

/*------------------------------------------------------------------------->  
  Class Construction - SUBSCRIBER (EXTENDS USER)
<-------------------------------------------------------------------------*/


class Subscriber extends User {
  #groups;
  #pages;

  constructor(user, groups, pages) {
    if (!(user instanceof User)) {
      throw new Error('The provided user must be an instance of User.');
    }
    super(
      user.getId(),
      user.getFirstName(),
      user.getLastName(),
      user.getUserName(),
      user.getEmail(),
      user.getProfilePic()
    );

    this.setGroups(groups);
    this.setPages(pages);
  }

  setGroups(groups) {
    if (!Array.isArray(groups)) {
      throw new Error('Groups must be an array.');
    }
    if (groups.some((group) => typeof group !== 'string' || group.trim() === '')) {
      throw new Error('Each group name must be a non-empty string.');
    }
    this.#groups = groups;
  }
  setPages(pages) {
    if (!Array.isArray(pages)) {
      throw new Error('Pages must be an array.');
    }
    if (pages.some((page) => typeof page !== 'string' || page.trim() === '')) {
      throw new Error('Each page name must be a non-empty string.');
    }
    this.#pages = pages;
  }
  getGroups() {
    return this.#groups;
  }
  getPages() {
    return this.#pages;
  }

	getInfo() {
    return {
      fullName: this.getFullName(),
      userName: this.getUserName(),
      email: this.getEmail(),
      groups: this.getGroups(),
      pages: this.getPages(),
    };
  }
}
/*------------------------------------------------------------------------->  
  Class Construction - POST
<-------------------------------------------------------------------------*/

class Post {
  #postId;
  #p;
  #img;
  #date;
  #user; //To track each users posts 

  constructor(user, p, img) {
    if (!(user instanceof User)) {
      throw new Error('The user must be an instance of User.');
    } // To ensure we are using a User object
    this.#user = user;
    this.setPostId();
    this.setP(p);
    this.setImg(img);
    this.setDate();
  }

  setPostId() {
    this.#postId = generateUniqueId();
  }
  setP(p) {
    if (typeof p !== 'string') {
      throw new Error('Post content must be a string.');
    }
    this.#p = p.trim() || '';
  }
  setImg(img) {
    if (img && typeof img !== 'string') {
      throw new Error('Image URL must be a string or empty.');
    }
    this.#img = img || '';
  }
  setDate() {
    this.#date = new Date();
  }

  getDate() {
    return this.#date;
  }
  getPostId() {
    return this.#postId;
  }
  getP() {
    return this.#p;
  }
  getImg() {
    return this.#img;
  }
  getUser() {
    return this.#user;
  }
}

/*------------------------------------------------------------------------->  
  Image Staging  
<-------------------------------------------------------------------------*/

function handleImageSelect(ev) {
  const file = ev.target.files[0];

  if (file && isImageFile(file)) {
    uploadedImage = file;
    inputDisplay.textContent = file.name;
  } else {
    uploadedImage = null;
    inputDisplay.textContent = '';
  }
}

/*------------------------------------------------------------------------->  
  Initialize users and subscribers (for profile) 
<-------------------------------------------------------------------------*/

const userOne = new Subscriber(
  new User(
    'AB1234',
    'William',
    'Mackel',
    '@billythesquid',
    'billythesquid@netescape.com',
    './src/img/billy.png'
  ),
  ['Tech', 'Gaming'],  
  ['MyPage1', 'MyPage2'],  
);

const userTwo = new Subscriber(
  new User(
    'CD5678',
    'Greyson',
    'Xenobi',
    '@greyOne',
    'greysonX@jupiter.gal',
    './src/img/greyson.png'
  ),
  ['Art', 'Music'],   
  ['MyPageA', 'MyPageB'],  
);

const userThree = new Subscriber(
  new User(
    'EF9123',
    'Eyegore',
    'Field',
    '@eyeSpy',
    'Eyegore2020@underthebed.com',
    './src/img/eyegore.png'
  ),
  ['Art', 'Music'],   
  ['MyPageA', 'MyPageB'],  
);

let currentUser = userOne;

/*------------------------------------------------------------------------->  
	Profile Display
<-------------------------------------------------------------------------*/

function populateUserInfo(user) {
  modalName.textContent = user.getFullName();
  modalUserName.textContent = user.getUserName();
  modalEmail.textContent = user.getEmail();

  // Populate Groups as a list
  modalGroups.innerHTML = ''; // Clear any previous content
  const groupsList = document.createElement('ul');
  user.getGroups().forEach((group) => {
    const li = document.createElement('li');
    li.textContent = group;
    groupsList.appendChild(li);
  });
  modalGroups.appendChild(groupsList);

  // Populate Pages as a list
  modalPages.innerHTML = ''; // Clear any previous content
  const pagesList = document.createElement('ul');
  user.getPages().forEach((page) => {
    const li = document.createElement('li');
    li.textContent = page;
    pagesList.appendChild(li);
  });
  modalPages.appendChild(pagesList);

  avatarModal.src = user.getProfilePic();
}

function switchUser(user) {
  currentUser = user;
  populateUserInfo(currentUser);
  renderPosts();
}

/*------------------------------------------------------------------------->  
  Create Post  
<-------------------------------------------------------------------------*/

//	HEADING
function createHeading(userObj) {
  let headingWrapper = create('div');
  addClass(headingWrapper, 'heading-wrapper');

  let avatar = createImage(userObj.getProfilePic());
  headingWrapper.appendChild(avatar);

  let fullName = create('p');
  fullName.textContent = `${userObj.getFirstName()} ${userObj.getLastName()}`;
  headingWrapper.appendChild(fullName);

  let dateStamp = create('span');
  dateStamp.textContent = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  });
  headingWrapper.appendChild(dateStamp);

  return headingWrapper;
}

//	POST OBJECT
function createPost(userObj, postObj) {
  let post = create('div');
  addClass(post, 'post-wrapper');

  let postHeading = createHeading(userObj); // Pass the correct user for the header
  post.appendChild(postHeading);

  let content = create('p');
  content.textContent = postObj.getP();
  post.appendChild(content);

  if (postObj.getImg()) {
    let postImage = createImage(postObj.getImg());
    post.appendChild(postImage);
  }

  newsfeed.appendChild(post);
}


//	POST RENDERING (FROM ARRAY)
function renderPosts() {
  newsfeed.innerHTML = '';
  postsDatabase.sort((a, b) => b.getDate() - a.getDate());
  postsDatabase.forEach((post) => createPost(post.getUser(), post)); // Use the user who created the post
}


//	CREATE FUNCTIONS TRIGGER SET
function postButtonClick() {
  const trimmedText = postTextArea.value.trim();
  if (trimmedText === '' && !uploadedImage) {
    inputDisplay.textContent = "Post cannot be empty.";
    inputDisplay.style.display = 'block';
    return;
  }

  try {
    const newPostObj = new Post(
      currentUser, // Pass currentUser here
      trimmedText,
      uploadedImage ? URL.createObjectURL(uploadedImage) : ''
    );

    postsDatabase.unshift(newPostObj);
    renderPosts();

    postTextArea.value = '';
    uploadedImage = null;
    imageInput.value = '';
    inputDisplay.textContent = '';
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

/*------------------------------------------------------------------------->  
  Event Listeners  
<-------------------------------------------------------------------------*/
populateUserInfo(currentUser);

listen('click', postButton, postButtonClick);
listen('change', imgInput, handleImageSelect);

listen('click', switchUserButton, () => switchUser(userTwo));

listen('click', modalButton, () => populateUserInfo(currentUser));

