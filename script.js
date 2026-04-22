// INDEX SCRIPTS



const buttons = document.querySelectorAll(".info-btn");
const texts = document.querySelectorAll(".info-text");


buttons.forEach((btn, i)=>{
   btn.onclick = () =>{
    

    const isOpen = texts[i].classList.contains("show");
    

    texts.forEach(t => t.classList.remove("show"));
    

    if(!isOpen){
    texts[i].classList.add("show");
   
    }
   };
});



// INDEX PAGE EMAIL
function getStarted(){

  const email = document.getElementById("emailInput").value.trim();

  if(!email){
    alert("Please enter your email");
    return;
  }

  let name = email
  .split("@")[0]
  .replace(/[\d._-]+/g, " ")
  .split(" ")
  .filter(Boolean)
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join(" ") || "Guest";

 
localStorage.setItem("username", name);

  document.getElementById("wecomeText").innerText = `✋welcome ${name}`;

  

  setTimeout(() => {
     window.location.href = "home.html";
  }, 4000);
  
}

// Welcome Back
if(window.location.pathname.includes("home.html")){
   document.addEventListener("DOMContentLoaded", function (){
    const user = localStorage.getItem("username");

    if(user){
      document.getElementById("welcomeBack").innerText = `Welcome back ${user}`;
    } else{
      // if no user, go back to index.html

      window.location.href = "index.html";
    }
   });
}

// LOgOut
function logout(){

  localStorage.removeItem("username");

  sessionStorage.removeItem("justLoggedIn");

  window.location.href = "index.html";
}

//  SIGNUPUP FORM

if(document.getElementById("signup")){
  
 const signup = document.getElementById("signup");
 
const show = document.getElementById("show");

 signup.addEventListener("submit", function(e){
    e.preventDefault();
 

     const name = document.getElementById("name").value.trim();

     const email = document.getElementById("email").value.trim();
  
    const password = document.getElementById("password").value.trim();
 
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if(!name || !email || !password || !confirmPassword){
      show.innerText = "⚠️please fill all fields";
      show.style.color = "red";
      return;
    }

    if(password !== confirmPassword ){
      show.innerText = "❌Passwords do not match";
      show.style.color = "red";
      return;
      
    }
      show.innerText = "✅ Account created successful";
      show.style.color = "green";

      setTimeout(()=>{
        window.location.href ="index.html";
      }, 1500);
  });
}










// SEARCH ELEMENTS

const searchBtn = document.getElementById("searchBtn");
const  searchInput = document.getElementById("searchInput");
const moviesContainer = document.getElementById("movies");
const loading = document.getElementById("loading");

if(moviesContainer){


document.addEventListener("DOMContentLoaded", loadMovies);

// SEARCH BUTTON CLICK

  searchBtn.addEventListener("click", () =>{
    const query = searchInput.value.trim();

    if(!query){
      moviesContainer.innerHTML = 
      `<p style="text-align:center";>Please enter a movie name</p>`
      return;
    }
    searchMovies(query);
  });

  searchInput.addEventListener("keypress", (e) =>{
    if(e.key === "Enter"){
      searchBtn.click();
    }
  });



// LIVE MOVIE SEARCH

if(searchInput){
  searchInput.addEventListener("input", () =>{
    const query = searchInput.value.trim();

    if(query.length === 0){
      moviesContainer.innerHTML = "";
      return;
    }

    if(query.length > 2){
      fetchMovies(query);
    }
  });
}



// Loading Movies

function loadMovies() {

  loading.style.display = "block";
   moviesContainer.innerHTML = "";

  fetch("https://api.themoviedb.org/3/movie/popular?api_key=db0dda06c09b03de058e44cc73c38fcc")
  .then(res => res.json())
   .then(data => {

    loading.style.display = "none";
      
     if(data.results && data.results.length > 0){
       displayMovies(data.results);
     }
       else if(data.title){
displayMovies([data]);

     } else {
      // upgraded to movieContainer to show message when no movies found
      moviesContainer.innerHTML = `<p style="text-align:center;">No movies found.</p>`;
     }

   })
   .catch(err =>{ 
    loading.style.display = "none";
    console.error(err);

    moviesContainer.innerHTML = 
    `<p style="text-align:center;>Something went wrong</p>`;
});
}


// Search Movies
function searchMovies(query){
  loading.style.display = "block";
  moviesContainer.innerHTML = "";

  
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=db0dda06c09b03de058e44cc73c38fcc&query=${query}`)
  .then(res => res.json())
   .then(data => {

    loading.style.display = "block";

    const filtered = data.results.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );

    if(filtered.length > 0){
      displayMovies(filtered);
    } else{
      moviesContainer.innerHTML = 
      `<p style="text-align:center; margin-top: 150px;">No results found</p>`;
    }

   })
    .catch(err =>{
      loading.style.display = "none";
      console.error(err);
      moviesContainer.innerHTML =
      `<p style="text-align:center;">Something went wrong</p>`;
    });
}





function displayMovies(movies) {
   if(!moviesContainer){
    console.error("Movies container not found");
    return;
   }

   moviesContainer.innerHTML = "";


   if(!movies || movies.length === 0){
    moviesContainer.innerHTML = `<p style="text-align:center;">No movies found.</p>`;
    return;
   }

  
   movies.forEach(movie => {
     const poster = movie.poster_path
     ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
     : "https://via.placeholder.com/200x300?text=No+Image";

    const title = movie.title || "Untitled";
    const year = movie.release_date 
        ? movie.release_date.slice(0, 4) 
        : "N/A";


   const card = document.createElement("div");
     card.classList.add("movie-card");

     card.innerHTML = `
       <img src="${poster}" alt="${movie.title}">
       <h3>${title}</h3>
       <p>${year}</p>
     `;

    //  CLICK TO GO TO WATCH PAGE

  card.addEventListener("click", () => {

     
     localStorage.setItem("movieID", movie.id);

     window.location.href = "watch.html";

   });
   moviesContainer.appendChild(card);
  
});

}
}




// VOICE
function startApp(){
  const speech = playVoice();

  speech.oned = () => {
    getStarted();
  };
}

function playVoice(){
  const synth = window.speechSynthesis;
   synth.cancel();

   const name = localStorage.getItem("username") || "";
   const text = name
   ? `welcome ${name}, to my movie website`
   : "Welcome to my movie website";

   const speech = new SpeechSynthesisUtterance(text);
   speech.rate = 1;
   speech.pitch = 1;

   synth.speak(speech);
   return;
}



// HAMBURGER
function toggleMenu(){
  const ham = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const links = document.getElementById("menu a");

  ham.addEventListener("click",() =>{
         menu.classList.toggle("active");
  // ham.classList.toggle("active");


  links.forEach(link =>{
    link.addEventListener("click", ()=>{
      menu.classList.remove("active");
    });
  })

  })

  document.addEventListener("click", (event)=>{
  if(!menu.contains(event.target) && 
      !ham.contains(event.target) ){
        menu.classList.remove("active");
      }
});
  
}





// CLICK SOUND
function playClickSound(){
  const audio = new Audio("click.mp3");
  audio.play();
}




// MOVIES

document.addEventListener("DOMContentLoaded", () =>{
  const cont = document.querySelector(".movieContainer");


const film = [
  { image: "poster1.jpg"},
  {image: "poster2.jpg"},
  {image: "poster3.jpg"},
  {image: "poster4.jpg"},
  {image: "poster5.jpg"},
  {image: "poster6.jpg"},
  {image: "poster7.jpg"},
  {image: "poster8.jpg"},
  {image: "poster9.jpg"},
  {image: "poster1.jpg"},
  {image: "poster11.jpg"},
  {image: "poster12.jpg"},
  {image: "poster13.jpg"},
  {image: "poster14.jpg"},
  {image: "poster15.jpg"},
  {image: "poster16.jpg"},
  {image: "poster17.jpg"},
  {image: "poster18.jpg"},
  {image: "poster19.jpg"},
  {image: "poster20.jpg"},
];



film.forEach(movie => {
  const card = document.createElement("div");
  card.classList.add("movie-card");
    card.innerHTML = `
   <img src="${movie.image}" alt="${movie.title}">`;

  cont.appendChild(card);
});

});









// WATCH PAGE
if(document.getElementById("watchBtn")){

  
 

const movieID = localStorage.getItem("movieID");
 console.log("movieID:", movieID)

if(!movieID){
  alert("No Movie Selected");
  window.location.href = "home.html";
}

fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=db0dda06c09b03de058e44cc73c38fcc`)
.then(res => res.json())
.then(movie =>{

  // THEN
  document.getElementById("movieTitle").innerText = movie.title || "No title";
  document.getElementById("moviePlot").innerText = movie.overview || "No description";
  // POSTER
  document.getElementById("moviePoster").src = 
  movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/300x400";

  // YOUTUBE TRAILER SEARCH
  

  const query = `${movie.title} official trailer`;

  
  const watchBtn = document.getElementById("watchBtn");
 

if(watchBtn){
  watchBtn.addEventListener("click", () => { 

    window.open(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, 
      "_blank"
    );
  });
  watchBtn.innerText = `🎬Watch ${movie.title} Trailer`;
}

if(fullSearchBtn){
  fullSearchBtn.href =
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query + "full movie")}`;
  fullSearchBtn.target = "_blank";
}

})
   .catch(err => {
    console.error("ERROR:",err);

    document.getElementById("movieTitle").innerText = "Movie not found";

    document.getElementById("moviePlot").innerText = "Please try again later.";

});
}






// YORUBA MOVIES
// SEARCH ELEMENTS
if(document.getElementById("yorubaMovies")){
const container = document.getElementById("yorubaMovies");
const  input = document.getElementById("yorubaSearch");
const btn = document.getElementById("yorubaBtn");
const loading = document.getElementById("yorubaLoading");

function loadYoruba(query = "yoruba"){

  loading.style.display = "block";
  container.innerHTML = "";

  fetch(`https://api.themoviedb.org/3/search/movie?api_key=db0dda06c09b03de058e44cc73c38fcc&query=${query}`)
  .then(res => res.json())
  .then(data => {

    loading.style.display = "none";

    if(data.results && data.results.length > 0){
      display(data.results);
    } else{
      container.innerHTML = `<p style="text-align:center;">No movies found.</p>`;
    }

  })
  .catch(err => {
    loading.style.display = "none";
    console.error(err);
    container.innerHTML = `<p style="text-align:center;">Something went wrong.</p>`;
  });
}

// Display movies

function display(movies){
  container.innerHTML = "";

  movies.forEach(movie => {

    const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/200x300?text=No+Image";

    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.innerHTML = `
    <img src="${poster}" alt="${movie.title}" style="; height:auto; display:grid; grid-template-columns: ;">
    <h3>${movie.title}</h3>`;

    card.addEventListener("click", () => {
      localStorage.setItem("movieID", movie.id);
      window.location.href = "watch.html";
    });

    container.appendChild(card);
  });

}
 if(btn && input){
   btn.onclick = () => {
      loadYoruba(input.value);
   };
}

document.addEventListener("DOMContentLoaded",  () => {
  loadYoruba();
})

}



// NETWORK STATUS
document.addEventListener("DOMContentLoaded", ()=>{


const networkStatus = document.getElementById("networkStatus");

function updateNetworkStatus(){

  if(!networkStatus) return;

  if(navigator.onLine){
    networkStatus.style.display = "block";
    networkStatus.innerText = "📴Online";

    setTimeout(() =>{
      networkStatus.style.display = "none";
    }, 5000);
  } else{
      
    networkStatus.style.display = "block";
    networkStatus.innerText = "�No Internet";
  }
}
updateNetworkStatus();

window.addEventListener("Online", updateNetworkStatus);
window.addEventListener("Offline", updateNetworkStatus);

});




if(document.getElementById("backToTop")){
    const backToTop = document.getElementById("backToTop");

window.onscroll = function(){
  if(window.scrollY > 300){
    backToTop.style.display = "block";
  } else{
    backToTop.style.display = "none";
  }

  backToTop.addEventListener("click", ()=>{
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
  
}
}

// ROTATE
const boxes = document.querySelectorAll('.poster');

boxes.forEach(box => {
  box.addEventListener('click', () => {
    box.classList.add('rotate');

      const text = box.textContent;

      const speech = new SpeechSynthesisUtterance(text);

      speechSynthesis.speak(speech);

  setTimeout(()=>{
    box.classList.remove("rotate");
  }, 700);

  });
});


// SERVICE WORKER Registration
if('serviceWorker' in navigator){
  window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js")
  .then(() => 
    console.log("Service Worker Registered"))
  .catch(err =>
    console.error("SW Error", err));
  });
 
}







