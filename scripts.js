const btnSpeak = document.querySelector(".btn__speak");
const listenerAnimation = document.querySelector(".listening__container");
const recognition = new webkitSpeechRecognition();
const pexelsApiKey = `563492ad6f917000010000010bd4fa0fb39949f58ffb7478067c35a8`;
const galleryContainer = document.querySelector(".gallery__container");
const loader = document.querySelector(".spinner");
const noResults = document.querySelector(".no__results");
const speaker = window.speechSynthesis;

//show the listeninng animation on click of tap to speak button
btnSpeak.addEventListener("click", () => {
  listenerAnimation.className = "listening__container show";
  btnSpeak.setAttribute("disabled", true);
  recognition.start();
});

//get images from pexels
const searchImagesBySpeech = async (query) => {
  if (!query) {
    loader.className = "spinner hide";
    window.alert("Please speak out load");
    return;
  }

  fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=15&page=1`, {
    method: "get",
    headers: {
      Authorization: pexelsApiKey,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      debugger;
      if (res.photos.length) {
        clearPreviousSearchResults();
        renderImages(res.photos);
      } else {
        showNoResults();
      }
    })
    .catch((err) => {
      window.alert("Something went wrong");
    });
};

const showNoResults = () => {
  clearPreviousSearchResults();
  noResults.className = "no__results show";
  loader.className = "spinner hide";
};

const renderImages = (images) => {
  noResults.className = "no__results hide";
  images.forEach((image) => {
    debugger;
    const {
      src: { medium },
      photographer,
    } = image;
    addImageToGallery(medium, photographer);
  });
};

const clearPreviousSearchResults = () => {
  galleryContainer.innerHTML = "";
  loader.className = "spinner hide";
};

//closing the listener UI after result or after the listening ends
const closeListenerAnimation = () => {
  listenerAnimation.className = `listening__container hide`;
};

//once speech returns a result
const handleSpeakResult = (event) => {
  const whatISpoke = event.results[0][0].transcript;
  loader.className = "spinner show";
  searchImagesBySpeech(whatISpoke);
  closeListenerAnimation();
};

const addImageToGallery = (src, photographer) => {
  const html = `
    <div
     class="item"
     style="background-image:url(${src})">
     <button class="btn__photographer btn" data-photographer='${photographer}'>Listen to photographer's name</button>
    </div> 
    `;
  galleryContainer.insertAdjacentHTML("afterbegin", html);
  const btnPhotographer = document.querySelector(
    `[data-photographer='${photographer}']`
  );
  btnPhotographer.addEventListener("click", () => {
    speakOutPhotographerName(photographer);
  });
};

const speakOutPhotographerName = (name) => {
  const utterance = new SpeechSynthesisUtterance(name);
  speaker.speak(utterance);
};

recognition.addEventListener("result", handleSpeakResult);
recognition.addEventListener("end", function (e) {
  closeListenerAnimation();
  btnSpeak.removeAttribute("disabled");
});

listenerAnimation.addEventListener("click", () => {
  listenerAnimation.className = "listening__container hide";
});
