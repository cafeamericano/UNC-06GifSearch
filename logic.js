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
            url: `https://api.giphy.com/v1/gifs/search?q=${arg}&rating=${settings.rating}&limit=${settings.limit}&api_key=${settings.apiKey}`,
            method: "GET",
        }).then(function (response) {
            for (i = 0; i < response.data.length; i++) {
                grabbedObjects.push(response.data[i])
            };
            console.log(grabbedObjects)
            importedGifs.render()

            //Clear out the array(s) for the next query
            grabbedObjects = [];
        });
    },
    searchByID: function (arg) {
        $.ajax({
            url: `https://api.giphy.com/v1/gifs?ids=${favorites.collection}&api_key=${settings.apiKey}`,
            method: 'GET',
        }).then(function (response) {
            for (i = 0; i < response.data.length; i++) {
                favorites.collectionObj.push(response.data[i])
            };
            console.log(favorites.collectionObj)
            favorites.render()

            //Clear out the array(s) for the next query
            favorites.collectionObj = [];
            favorites.collection = [];
        })
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
let card = {
    draw: function () {

    }
}

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
                <div id="${tempID}-div" style="position: relative">
                    <img height='150px' width='150px' id="${grabbedObjects[i].id}" class="returnedGIF" data-isanimated="false" data-isfavorited="false" data-stillurl="${grabbedObjects[i].images.original_still.url}" data-animatedurl="${grabbedObjects[i].images.original.url}" src=${grabbedObjects[i].images.original_still.url}>
                    <button class='bg-light loveButton' style="position: absolute; right: 5px; top: 5px; border-radius: 100%"><i class="far fa-heart"></i></button>
                    <div class='bg-light text-center' style="position: absolute; left: 5px; bottom: 5px; width: 50px; opacity: 0.7">${grabbedObjects[i].rating.toUpperCase()}</div>
                </div>
            `)
        }
    }
};

/************************** Favorites **************************/
let favorites = {
    collection: [],
    collectionObj: [],
    add: function (element, id) {
        let favoriteStatus = element.attr('data-isfavorited')
        if (favoriteStatus === 'false') {
            element.attr('data-isfavorited', 'true')
            favorites.collection.push(id)
            query.searchByID(favorites.collection)
            console.log(favorites.collection)
        };
    },
    render: function () {
        for (i = 0; i < favorites.collectionObj.length; i++) {
            let tempID = favorites.collectionObj[i].id
            $("#favoritesContainer").prepend(`
                <div id="${tempID}-div">
                    <img height='150px' width='150px' id="${favorites.collectionObj[i].id}-favorited" data-isanimated="false" data-stillurl="${favorites.collectionObj[i].images.original_still.url}" data-animatedurl="${favorites.collectionObj[i].images.original.url}" src=${favorites.collectionObj[i].images.original.url}>
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
    let id = $(this).attr("id");
    importedGifs.toggleAnimation(id)
});

//Add to favorites
$(document).on("click", ".loveButton", function () {
    $(this).html('<i class="fas fa-heart"></i>')
    let id = $(this).siblings( ".returnedGIF" ).attr("id");
    let associatedImage = $(this).siblings( ".returnedGIF" )
    favorites.add(associatedImage, id)
});

//################## RUN PROGRAM #####################################################################################################################################

buttons.render()