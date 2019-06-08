// Example queryURL for Giphy API
let apiKey = 'totZ3Gjqp9mJMwb9urodXV1OIB0cppGk';


//List of Options
let topics = ['Croissants', 'Noodles', 'Sushi', 'Pizza', 'Tacos', 'Soup', 'Salad', 'Pasta']
let grabbedObjects = []

//Render Buttons
renderButtons()

//Event Listeners
$(document).on("click", ".keywordButtons", function () {

    //Search Parameters
    let searchTerms = $(this).val();
    let rating = 'r';
    let limit = '10';

    //Compiled Query
    var queryURL = `http://api.giphy.com/v1/gifs/search?q=${searchTerms}&rating=${rating}&limit=${limit}&api_key=${apiKey}`;

    //Upon calling
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        for (i = 0; i < response.data.length; i++) {
            var obj = {};
            obj.id = response.data[i].id
            obj.imgAnimated = response.data[i].images.original.url
            obj.imgStill = response.data[i].images.original_still.url
            obj.rating = response.data[i].rating
            obj.isFavorite = false;
            grabbedObjects.push(obj)
        };
        console.log(grabbedObjects)
        renderGrabbedObjects()
    });

});

//Animate or deanimate a GIF upon clicking
$(document).on("click", ".returnedGIF", function () {
    let ID = $(this).attr("id");
    let animatedURL = $(this).attr("data-animatedurl");
    let stillURL = $(this).attr("data-stillurl");
    let isAnimated = $(this).attr("data-isanimated");
    if (isAnimated === 'false') {
        $(`#${ID}`).attr('src', animatedURL)
        $(`#${ID}`).attr('data-isanimated', 'true')
    } else {
        $(`#${ID}`).attr('src', stillURL)
        $(`#${ID}`).attr('data-isanimated', 'false')
    }
});

function addNewSearchWord() {
    let wordToBeAdded = $('#keywordInput').val();
    topics.unshift(wordToBeAdded)
    renderButtons()
    //$("#buttonContainer").prepend(`<button class='btn btn-success mb-3 ml-1 mr-1' value='${wordToBeAdded}'>${wordToBeAdded}</button>`)
};

function renderButtons() {
    $("#buttonContainer").empty()
    for (i = 0; i < topics.length; i++) {
        $("#buttonContainer").append(`<button class='btn btn-success mb-3 ml-1 mr-1 keywordButtons' value='${topics[i]}'>${topics[i]}</button>`)
    }
};

function renderGrabbedObjects() {
    for (i = 0; i < grabbedObjects.length; i++) {
        let tempID = grabbedObjects[i].id
        $("#gifContainer").prepend(`
            <div id="${tempID}-div" class='m-2 shadow'>
                <img height='150px' width='150px' id="${grabbedObjects[i].id}" class="returnedGIF" data-isanimated="false" data-stillurl="${grabbedObjects[i].imgStill}" data-animatedurl="${grabbedObjects[i].imgAnimated}" src=${grabbedObjects[i].imgStill}>
                <div class="card-footer">
                    <button><i class="far fa-heart"></i></button>
                    <br/>
                    <small>Rating: ${grabbedObjects[i].rating.toUpperCase()}</small>
                </div>
            </div>
        `)
    };
};

