const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const socket = io();
let naira = 700;

socket.on("online", (data) => {
  count.innerText = toComma(data.count);
  naira = parseInt(data.naira);
});

socket.on("timer", (data) => {
  let minutes = parseInt(data / 60, 10);
  let seconds = parseInt(data % 60, 10);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  timer.innerText = `${minutes}:${seconds}`;
});

socket.on("profile", (result) => {
  profileImg.src = result.image;
  profileName.innerText = result.name;
  profileBio.innerText = result.bio;
  profileUrl.innerText = result.social;
  profileUrl.href = result.url;
});

postBio.addEventListener("input", (e) => {
  const target = e.currentTarget;
  const currentLength = target.value.length;
  postFieldCount.innerText = `${currentLength}/64`;
});

proceedBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const category =
    categoryList.options[categoryList.selectedIndex].dataset.category;
  const image = postImage.value;
  const name = postName.value;
  let bio = postBio.value;
  const url = postURL.value;
  const email = postEmail.value;

  if (!image || !name || !bio || !url) {
    showMsg("All fields are required except email field");
    return;
  }

  disableUI();

  try {
    bio = bio.replace("\n\n", ". ").replace("\n", " ");
    const amt = 2 * naira;
    const doc = {
      id: generateUUID(),
      image: image,
      name: name,
      bio: bio,
      url: url,
      social: category,
      next: false,
    };

    if (email === null || email === undefined || email === "") {
      socket.emit("add", doc);
      enableUI();
    } else if (!email.match(mailformat)) {
      enableUI();
      showMsg("Enter a valid email");
    } else {
      credit(amt, email, doc);
    }
  } catch (error) {
    console.log(error);
  }
});

function enableUI() {
  postImage.enabled = true;
  postName.enabled = true;
  postBio.enabled = true;
  postURL.enabled = true;
  postEmail.enabled = true;
  proceedBtn.enabled = true;
  postProgress.style.opacity = 0;
}

function disableUI() {
  postImage.enabled = false;
  postName.enabled = false;
  postBio.enabled = false;
  postURL.enabled = false;
  postEmail.enabled = false;
  proceedBtn.enabled = false;
  postProgress.style.opacity = 1;
}

socket.on("add", (data) => {
  showMsg(`${data}`);
});

function credit(amt, email, doc) {
  const handler = PaystackPop.setup({
    key: payHash(),
    email: email,
    amount: `${amt}00`,
    callback: (response) => {
      if (response.status == "success") {
        doc.next = true;
        socket.emit("add", doc);
        enableUI();
      } else {
        showMsg("Something went wrong try again");
      }
    },
    onClose: function () {
      enableUI();
      showMsg("Transaction cancelled");
    },
  });
  handler.openIframe();
}
