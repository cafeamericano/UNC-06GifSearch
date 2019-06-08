//################## GLOBAL VARIABLES ##############################################################################################################################

//List of Options
let topics = ['Croissants', 'Noodles', 'Sushi', 'Pizza', 'Tacos', 'Soup', 'Salad', 'Pasta']
let grabbedObjects = []



//################## OBJECTS #######################################################################################################################################

/************************** Settings **************************/
let settings = {
    apiKey: 'totZ3Gjqp9mJMwb9urodXV1OIB0cppGk',
    rating: 'r',
    limit: 10
}

/************************** Query **************************/
let query = {
    searchByTitle: function (arg) {
        $.ajax({
            url: `http://api.giphy.com/v1/gifs/search?q=${arg}&rating=${settings.rating}&limit=${settings.limit}&api_key=${settings.apiKey}`,
            method: "GET",
        }).then(function (response) {
            console.log(response)

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
            importedGifs.render()

        });
    }
};

/************************** Buttons **************************/
let buttons = {
    add: function () {
        let wordToBeAdded = $('#keywordInput').val();
        topics.unshift(wordToBeAdded)
        this.render()
    },
    render: function () {
        $("#buttonContainer").empty()
        for (i = 0; i < topics.length; i++) {
            $("#buttonContainer").append(`<button class='btn btn-success mb-3 ml-1 mr-1 keywordButtons' value='${topics[i]}'>${topics[i]}</button>`)
        }
    }
};

/************************** Imported GIFs **************************/
let importedGifs = {
    toggleAnimation: function (arg) {
        let tag = `#${arg}`
        let animatedURL = $(tag).attr("data-animatedurl");
        let stillURL = $(tag).attr("data-stillurl");
        let isAnimated = $(tag).attr("data-isanimated");
        if (isAnimated === 'false') {
            $(tag).attr('src', animatedURL)
            $(tag).attr('data-isanimated', 'true')
        } else {
            $(tag).attr('src', stillURL)
            $(tag).attr('data-isanimated', 'false')
        }
    },
    render: function () {
        for (i = 0; i < grabbedObjects.length; i++) {
            let tempID = grabbedObjects[i].id
            $("#gifContainer").prepend(`
                <div id="${tempID}-div" class='m-2 p-2 shadow' style="background: white">
                    <img height='150px' width='150px' id="${grabbedObjects[i].id}" class="returnedGIF" data-isanimated="false" data-stillurl="${grabbedObjects[i].imgStill}" data-animatedurl="${grabbedObjects[i].imgAnimated}" src=${grabbedObjects[i].imgStill}>
                    <div class="card-footer">
                        <button><i class="far fa-heart"></i></button>
                        <br/>
                        <small>Rating: ${grabbedObjects[i].rating.toUpperCase()}</small>
                    </div>
                </div>
            `)
        }
    }
};



//################## EVENT LISTENERS #################################################################################################################################

//Show GIFs on button click
$(document).on("click", ".keywordButtons", function () {
    let searchTerms = $(this).val();
    query.searchByTitle(searchTerms)
});

//Toggle animation
$(document).on("click", ".returnedGIF", function () {
    let ID = $(this).attr("id");
    importedGifs.toggleAnimation(ID)
});



//################## RUN PROGRAM #####################################################################################################################################

buttons.render()
