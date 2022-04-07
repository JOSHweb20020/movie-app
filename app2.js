const API_KEY = "d48f331a6b75ea11ef5379196afb31c5";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const url =
    "https://api.themoviedb.org/3/search/movie?api_key=d48f331a6b75ea11ef5379196afb31c5";
console.log("This is my Movie app");

const moviesearchable = document.querySelector("#moviesearchable");
const inputElement = document.querySelector("#inputvalue");
const buttonElement = document.querySelector("#search");

function generateUrl(path) {
    const url = `https://api.themoviedb.org/3${path}?api_key=d48f331a6b75ea11ef5379196afb31c5`;
    return url;
}

function movieSection(movies) {
    return movies.map((movie) => {
        if (movie.poster_path) {
            return ` 
            <img src = '${IMAGE_URL + movie.poster_path}' data-movie-id = '${
                movie.id
            }'/>`;
        }
    });
}

function createMovieContainer(movies) {
    // content.innerHTML = "";
    const movieElement = document.createElement("div");
    movieElement.setAttribute("class", "movie");

    const movieTemplate = `
      <section class="section">
         ${movieSection(movies)}
        </section>
        <div class="content ">
            <p id="content-close">X</p>
        </div>
    `;
    movieElement.innerHTML = movieTemplate;
    return movieElement;
}

buttonElement.onclick = function (event) {
    event.preventDefault();
    const value = inputElement.value;

    const path = "/search/movie";
    const newUrl = generateUrl(path) + "&query=" + value;
    fetch(newUrl)
        .then((res) => res.json())
        .then((data) => {
            //data.results
            moviesearchable.innerHTML = "";
            const movies = data.results;
            const movieBlock = createMovieContainer(movies);
            moviesearchable.appendChild(movieBlock);
            console.log("Data:", data);
        })

        .catch((error) => {
            console.log("Error:", error);
        });
    inputElement.value = " ";
    console.log("Value ", value);
};

//displaymovie
function createIframe(video) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${video.key}`;
    iframe.width = 320;
    iframe.height = 315;
    iframe.allowFullscreen = true;

    return iframe;
}

function createVideoTemplate(data, content) {
    console.log("Videos:", data);
    const videos = data.results;
    const length = videos.length > 3 ? 3 : videos.length;
    const iframeContainer = document.createElement("div");

    for (let i = 0; i < length; i++) {
        const video = videos[i];
        const iframe = createIframe(video);
        iframeContainer.appendChild(iframe);
        content.appendChild(iframeContainer);
    }
}

//event delegation

document.onclick = function (event) {
    const target = event.target;
    if (target.tagName.toLowerCase() === "img") {
        console.log("Event", event);
        const movieId = target.dataset.movieId;
        console.log("Movie ID: ", movieId);
        const section = event.target.parentElement;
        const content = section.nextElementSibling;
        content.classList.add("content-display");
        console.log("HELLO WORLD!!");
        const path = `/movie/${movieId}/videos`;
        const url = generateUrl(path);

        // fetch movie videos
        fetch(url)
            .then((res) => res.json())
            .then((data) => createVideoTemplate(data, content))
            .catch((error) => {
                console.log("Error: ", error);
            });
    }

    if (target.id === "content-close") {
        const content = target.parentElement;
        content.classList.remove("content-display");
    }
};
