'use strict';

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
const modalName = select('.name');
const modalUserName = select('.username')
const modalEmail = select('.email');
const modalGroups = select('.groups');
const modalPages = select('.pages');
const modalCanMonetize = select('.can-monetize');
const modalButton = select('.header-profile');

const postsDatabase = []; 
let uploadedImage = null;

/*------------------------------------------------------------------------->
  Class Construction 
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

class Subscriber extends User {
  #groups;
  #pages;
  #canMonetize;

  constructor(user, groups, pages, canMonetize) {
    if (!(user instanceof User)) {
      throw new Error("The provided user must be an instance of User.");
    }
    super(
      user.getId(),
      user.getFirstName(),
      user.getLastName(),
      user.getUserName(),
      user.getEmail(),
      user.getProfilePic()
    );

    if (!this.isValidEmail(user.getEmail())) {
      throw new Error("Invalid email format.");
    }

    this.setGroups(groups);
    this.setPages(pages);
    this.setCanMonetize(canMonetize);
  }
  isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  
    return emailRegex.test(email);
  }

  setGroups(groups) {
    if (!Array.isArray(groups)) {
      throw new Error('Groups must be an array.');
    }
    if (groups.some(group => typeof group !== 'string' || group.trim() === '')) {
      throw new Error('Each group name must be a non-empty string.');
    }
    this.#groups = groups;
  }
  setPages(pages) {
    if (!Array.isArray(pages)) {
      throw new Error('Pages must be an array.');
    }
    if (pages.some(page => typeof page !== 'string' || page.trim() === '')) {
      throw new Error('Each page name must be a non-empty string.');
    }
    this.#pages = pages;
  }
  setCanMonetize(canMonetize) {
    if (typeof canMonetize !== 'boolean') {
      throw new Error('Can monetize must be a boolean value.');
    }
    this.#canMonetize = canMonetize;
  }

  getGroups() {
    return this.#groups;
  }
  getPages() {
    return this.#pages;
  }
  getCanMonetize() {
    return this.#canMonetize;
  }
  getInfo() {
    return {
      fullName: this.getFullName(),
      userName: this.getUserName(),
      email: this.getEmail(),
      groups: this.getGroups(),
      pages: this.getPages(),
      canMonetize: this.getCanMonetize()
    };
  }
}

class Post extends User {
  #postId;
  #p;
  #img;
  #date;

  constructor(user, p, img) {
    super(
      user.getId(), 
      user.getFirstName(), 
      user.getLastName(), 
			user.getUserName(),
      user.getEmail(), 
      user.getProfilePic()
    );
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
}

/*------------------------------------------------------------------------->
  Specialty Functions 
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

function createHeading(postObj) {
  let headingWrapper = create('div');
  addClass(headingWrapper, 'heading-wrapper');

  let avatar = createImage(postObj.getProfilePic());
  headingWrapper.appendChild(avatar);

  let fullName = create('p');
  fullName.textContent = `${postObj.getFirstName()} ${postObj.getLastName()}`;
  headingWrapper.appendChild(fullName);

  let dateStamp = create('span');
  dateStamp.textContent = postObj.getDate().toLocaleDateString('en-GB', 
    { day: 'numeric', month: 'long' }
  );
  headingWrapper.appendChild(dateStamp);

  return headingWrapper;
}

const userOne = new User(
  'AB1234', 
  'Dave', 
  'Sommerville', 
	'@thatdaveguy22',
  'dave.r.sommerville@outlook.com', 
  './src/img/profile.jpg'
);

const subscriberOne = new Subscriber(
	userOne, 
	['Tech Talk', 'Creative Corner', 'Dev Support'], 
	['Daily Funnies', 'Space Facts', 'News Now'], 
	true
);

function createPost(postObj) {
  let postWrapper = create('div');
  addClass(postWrapper, 'post-wrapper');
  let heading = createHeading(postObj);
  postWrapper.appendChild(heading);

  if (postObj.getP() !== '') {
    let postText = create('p');
    postText.textContent = postObj.getP();
    postWrapper.appendChild(postText);
    addClass(postText, 'post-text')
  }

  if (postObj.getImg() !== '') {
    let postImg = createImage(postObj.getImg());
    postWrapper.appendChild(postImg);
    addClass(postImg, 'post-image')
  }

  newsfeed.appendChild(postWrapper);
}

function postButtonClick() {
  const trimmedText = postTextArea.value.trim();
  if (trimmedText === '' && !uploadedImage) {
    inputDisplay.textContent = "Post cannot be empty.";
    inputDisplay.style.display = 'block';
    return;
  }

  try {
    const newPostObj = new Post(
      userOne,
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


function renderPosts() {
  newsfeed.innerHTML = '';
  postsDatabase.sort((a, b) => b.getDate() - a.getDate()); 
  postsDatabase.forEach(createPost);
}

function populateUserInfo(subscriber) {
  const userInfo = subscriber.getInfo(); 

  modalName.textContent = userInfo.fullName;
  modalUserName.textContent = userInfo.userName;
  modalEmail.textContent = userInfo.email;
  
  const groupsList = modalGroups;
  groupsList.innerHTML = ''; 
  userInfo.groups.forEach(group => {
    const li = create('li');
    li.textContent = group;
    groupsList.appendChild(li);
  });

  const pagesList = modalPages;
  pagesList.innerHTML = '';
  userInfo.pages.forEach(page => {
    const li = create('li');
    li.textContent = page;
    pagesList.appendChild(li);
  });

  modalCanMonetize.textContent = userInfo.canMonetize ? 'Yes' : 'No';
}

populateUserInfo(subscriberOne);

function hideModal() {
	profileModal.classList.add('hide');
}

function displayModal() {
	profileModal.classList.remove('hide');
}

/*------------------------------------------------------------------------->
  Conditional Observers 
<-------------------------------------------------------------------------*/

listen('change', imageInput, handleImageSelect);
listen('click', postButton, postButtonClick);
listen('click', modalButton, (event) => {
  displayModal();
  event.stopPropagation(); 
});
listen('click', document, (event) => {
  if (!profileModal.contains(event.target)) {
    hideModal();
  }
});
