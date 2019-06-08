// Example queryURL for Giphy API
let apiKey = 'totZ3Gjqp9mJMwb9urodXV1OIB0cppGk';


//List of Options
let topics = ['Croissants', 'Noodles', 'Sushi', 'Pizza', 'Tacos', 'Soup', 'Salad', 'Pasta']
let grabbedObjects = []

//Render Buttons
for (i = 0; i < topics.length; i++) {
    $("#buttonContainer").append(`<button class='btn btn-success mb-3 ml-1 mr-1' value='${topics[i]}'>${topics[i]}</button>`)
};

//Event Listeners
$(document).on("click", "button", function () {

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
            grabbedObjects.push(response.data[i])
        };
        console.log(grabbedObjects)
        for (i = 0; i < grabbedObjects.length; i++) {
            $("#gifContainer").prepend(`<img height='100px' width='100px' id="${grabbedObjects[i].id}" class="returnedGIF" data-isanimated="false" data-stillurl="${grabbedObjects[i].images.original_still.url}" data-animatedurl="${grabbedObjects[i].images.original.url}" src=${grabbedObjects[i].images.original_still.url}>`)
        };
    });

    //End

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