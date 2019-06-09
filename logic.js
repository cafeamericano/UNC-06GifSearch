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
                favorites.tempObjects.push(response.data[i])
            };
            favorites.render()
            favorites.clearTempIDsAndObjects()
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
    draw: function (receivingContainer, object, asFavorite) {
        if (asFavorite === true) {
            heartIcon = '<i class="fas fa-heart"></i>';
            favoriteStatus = 'true'
        } else {
            heartIcon = '<i class="far fa-heart"></i>'
            favoriteStatus = 'false'
        };
        $(receivingContainer).prepend(`
        <div id="${object.id}-div" class='m-1' style="position: relative">
            <img 
                height='150px' 
                width='150px' 
                id="${object.id}" 
                style='border-radius: 10px' 
                class="returnedGIF" 
                data-isanimated="false" 
                data-isfavorited="${favoriteStatus}" 
                data-stillurl="${object.images.original_still.url}" 
                data-animatedurl="${object.images.original.url}" 
                src=${object.images.original_still.url}>
            <div 
                class='loveButton' 
                style="position: absolute; right: 5px; top: 5px;">
                ${heartIcon}</div>
            <div 
                class='bg-light text-center' 
                style="position: absolute; left: 5px; bottom: 5px; width: 50px; opacity: 0.7">
                ${object.rating.toUpperCase()}</div>
        </div>
        `);
    },
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
}

/************************** Imported GIFs **************************/
let importedGifs = {
    render: function () {
        for (i = 0; i < global.grabbedObjects.length; i++) {
            card.draw('#gifContainer', global.grabbedObjects[i], false)
        }
    }
};

/************************** Favorites **************************/
let favorites = {
    tempIDs: [],
    tempObjects: [],
    permanentIDs: [],
    add: function (element, id) {
        let favoriteStatus = element.attr('data-isfavorited')
        if (favoriteStatus === 'false') {
            element.attr('data-isfavorited', 'true')
            favorites.tempIDs.push(id)
            favorites.permanentIDs.push(id)
            this.writeToStorage();
            element.remove() //Remove from general section
            query.searchByID(favorites.tempIDs) //Place in favorites section
        };
    },
    render: function () {
        for (i = 0; i < favorites.tempObjects.length; i++) {
            card.draw('#favoritesContainer', favorites.tempObjects[i], true)
        }
    },
    clearTempIDsAndObjects: function () {
        favorites.tempObjects = [];
        favorites.tempIDs = [];
    },
    writeToStorage: function () {
        localStorage.setItem('favorites', `${this.permanentIDs}`);
    },
    readFromStorage: function () {
        var favs = localStorage.getItem('favorites');
        this.permanentIDs.push(favs)
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
    card.toggleAnimation(id)
});

//Add to favorites
$(document).on("click", ".loveButton", function () {
    let favoriteTest = $(this).siblings(".returnedGIF").attr("data-isfavorited")
    if (favoriteTest === 'false') {
        favoriteTest = 'true'
        let id = $(this).siblings(".returnedGIF").attr("id");
        let associatedImage = $(this).siblings(".returnedGIF")
        favorites.add(associatedImage, id)
        $(this).parent().remove()
    } else if (favoriteTest === 'true'){
        let id = $(this).siblings(".returnedGIF").attr("id");
        favoriteTest = 'false'
        let locationInFavorites = favorites.permanentIDs.indexOf(id)
        favorites.permanentIDs.splice(locationInFavorites, 1)
        favorites.writeToStorage()
        $(this).html('<i class="far fa-heart"></i>')
        $(this).parent().fadeOut()
    }

});

//################## RUN PROGRAM #####################################################################################################################################

favorites.readFromStorage();
buttons.render()
