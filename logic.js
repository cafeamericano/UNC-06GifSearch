//################## OBJECTS #######################################################################################################################################

/************************** Global **************************/
let global = {
    topics: ['Croissants', 'Noodles', 'Sushi', 'Pizza', 'Tacos', 'Soup', 'Salad', 'Pasta'],
    grabbedObjects: []
}

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
                global.grabbedObjects.push(response.data[i])
            };
            console.log(global.grabbedObjects)
            importedGifs.render()

            //Clear out the array(s) for the next query
            global.grabbedObjects = [];
        });
    },
    searchByID: function (arg) {
        $.ajax({
            url: `https://api.giphy.com/v1/gifs?ids=${arg}&api_key=${settings.apiKey}`,
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
        global.topics.unshift(wordToBeAdded)
        this.render()
    },
    render: function () {
        $("#buttonContainer").empty()
        for (i = 0; i < global.topics.length; i++) {
            $("#buttonContainer").append(`<button class='btn btn-warning mb-3 ml-1 mr-1 keywordButtons' value='${global.topics[i]}'>${global.topics[i]}</button>`)
        }
    }
};

/************************** Imported GIFs **************************/
let card = {
    draw: function (receivingContainer, object) {
        $(receivingContainer).prepend(`
        <div id="${object.id}-div" class='m-1' style="position: relative">
            <img height='150px' width='150px' id="${object.id}" class="returnedGIF" data-isanimated="false" data-isfavorited="false" data-stillurl="${object.images.original_still.url}" data-animatedurl="${object.images.original.url}" src=${object.images.original_still.url}>
            <div class='loveButton' style="position: absolute; right: 5px; top: 5px;"><i class="far fa-heart"></i></div>
            <div class='bg-light text-center' style="position: absolute; left: 5px; bottom: 5px; width: 50px; opacity: 0.7">${object.rating.toUpperCase()}</div>
        </div>
        `)
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
        for (i = 0; i < global.grabbedObjects.length; i++) {
            let temp = global.grabbedObjects[i]
            card.draw('#gifContainer', temp)
        }
    }
};

/************************** Favorites **************************/
let favorites = {
    collection: [],
    collectionObj: [],
    package: [],
    add: function (element, id) {
        let favoriteStatus = element.attr('data-isfavorited')
        if (favoriteStatus === 'false') {
            element.attr('data-isfavorited', 'true')
            favorites.collection.push(id)
            favorites.package.push(id)
            this.writeToStorage();
            query.searchByID(favorites.collection)
            console.log(favorites.collection)
        };
    },
    render: function () {
        for (i = 0; i < favorites.collectionObj.length; i++) {
            let tempID = favorites.collectionObj[i].id
            $("#favoritesContainer").prepend(`
                <div id="${tempID}-div" class='m-1'>
                    <img height='150px' width='150px' id="${favorites.collectionObj[i].id}-favorited" class='returnedGIF' data-isanimated="false" data-stillurl="${favorites.collectionObj[i].images.original_still.url}" data-animatedurl="${favorites.collectionObj[i].images.original.url}" src=${favorites.collectionObj[i].images.original_still.url}>
                </div>
            `)
        }
    },
    writeToStorage: function () {
        localStorage.setItem('favorites', `${this.package}`);
    },
    readFromStorage: function () {
        var favs = localStorage.getItem('favorites');
        console.log('favs are ' + favs)
        this.package.push(favs)
        query.searchByID(favs)
    }
};


//################## EVENT LISTENERS #################################################################################################################################


//Show GIFs on button click
$(document).on("click", ".keywordButtons", function () {
    let searchTerms = $(this).val();
    alert(`Hunting for ${searchTerms.toLowerCase()}...`)
    query.searchByTitle(searchTerms)
});

//Toggle animation
$(document).on("click", ".returnedGIF", function () {
    let id = $(this).attr("id");
    importedGifs.toggleAnimation(id)
});

//Add to favorites
$(document).on("click", ".loveButton", function () {
    let favoriteTest = $(this).siblings(".returnedGIF").attr("data-isfavorited")
    if (favoriteTest === 'false') {
        favoriteTest = 'true'
        $(this).html('<i class="fas fa-heart"></i>')
        let id = $(this).siblings(".returnedGIF").attr("id");
        let associatedImage = $(this).siblings(".returnedGIF")
        favorites.add(associatedImage, id)
    } else {
        alert('not false')
        favoriteTest = 'false'
        $(this).html('<i class="far fa-heart"></i>')
    }

});

//################## RUN PROGRAM #####################################################################################################################################

favorites.readFromStorage();
buttons.render()
