const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmark-container");

let bookmarks = [];

//show modal, focus on input-:
function showModal() {
  modal.classList.add("show-modal"); //add class
  websiteNameEl.focus();
}

//modal event listeners-:
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () => {
  modal.classList.remove("show-modal");
});
window.addEventListener("click", (e) => {
  //console.log(e.target);
  e.target === modal ? modal.classList.remove("show-modal") : false; //ternary operator
});

//validate form by Regular expressions, are patterns used to match character combinations in strings-:
function validate(nameValue, urlValue) {
  const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields.");
    return false;
  }
  //   if (urlValue.match(regex)) {
  //     alert("Successful match");
  //   }
  if (!urlValue.match(regex)) {
    alert("Please provide a valid web address.");
    return false;
  }
  return true;
}

//Build Bookmarks DOM-:
function buildBookmarks() {
  //remove all bookmark elements
  bookmarksContainer.textContent = "";
  //build items
  bookmarks.forEach((singleBM) => {
    const { name, url } = singleBM;
    // console.log(name, url);

    //item-:
    const item = document.createElement("div");
    item.classList.add("item");

    //close Icon-:
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);

    //favicon / link container-:
    const linkinfo = document.createElement("div");
    linkinfo.classList.add("name");
    //favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    //link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;

    //append to bookmarks container-: The append() method inserts specified content at the end of the selected elements.
    linkinfo.append(favicon, link);
    item.append(closeIcon, linkinfo);
    bookmarksContainer.append(item);
  });
}

//Fetch Bookmarks-:
function fetchBookmarks() {
  //get bookmarks from local storage if available
  if (localStorage.getItem("BOOKMARKS")) {
    bookmarks = JSON.parse(localStorage.getItem("BOOKMARKS"));
  } else {
    bookmarks = [
      {
        name: "Google",
        url: "https://www.google.co.in",
      },
    ];
    localStorage.setItem("BOOKMARKS", JSON.stringify(bookmarks));
  }
  //console.log(bookmarks);

  buildBookmarks();
}

//delete bookmark-:
function deleteBookmark(URL) {
  //console.log("delete url", url);
  //splice() method changes the contents of an array by removing or replacing existing elements and adding new elements in place.
  bookmarks.forEach((el, i) => {
    if (el.url === URL) {
      bookmarks.splice(i, 1); //1 for remove one object
    }
  });
  //update bookmarks array in localstorage, re-populate DOM-:
  localStorage.setItem("BOOKMARKS", JSON.stringify(bookmarks));
  fetchBookmarks();
}

//handle data from form-:
function storeBookmark(e) {
  //clicking on a 'Submit' button, prevent it from submitting a form
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;

  // if (!urlValue.includes("http://", "https://")) {
  //   urlValue = `https://${urlValue}`;
  // }
  console.log(nameValue, urlValue);

  //validate(nameValue, urlValue);
  if (!validate(nameValue, urlValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  //console.log(bookmarks);
  //console.log(JSON.stringify(bookmarks));
  localStorage.setItem("BOOKMARKS", JSON.stringify(bookmarks)); //set data in local storage
  fetchBookmarks(); //fetch data from local storage
  bookmarkForm.reset();
  websiteNameEl.focus();
}

//event listner
bookmarkForm.addEventListener("submit", storeBookmark);

//ON LOAD, FETCH BOOKMARKS-:
fetchBookmarks();
