"use strict";

/*
 Filename:    whackamole2.js
 Student:     Krishiv Soni (cst140)
 Course:      CWEB 190 (Internet Programming/Web Applications 1)
 Instructor:  Michael Grzesina
 Date:          14-04-2022
 Purpose:     JavaScript for Whack-A-Mole game, Assignment #4, CWEB 190 Winter 2022
*/


let timeoutId;
let nCounter = 0;
let numberOfMolesWacked=0;
let numberOfSpecialMolesWacked = 0;
let totalNumberOfPoints = 0;

//preloading the images
let normalMoleImg = new Image();
normalMoleImg.src = "images/newmole.png";
let specialMoleImg = new Image();
specialMoleImg.src = "images/newmole2.png";



$(function (){


// Number of mole holes
const NUM_HOLES = 16;
// Global code
// Create the div's for the mole holes with their corresponding IDs
let holesString = "";
for (let i = 1; i <= NUM_HOLES; i++) {
    holesString += `<div id="hole${i}"></div>`
}
document.getElementById("holes").innerHTML = holesString;

    //Event handler for the start button
    $("#btnStart").on("click", function (){
        startGame();
        $(this).attr("disabled",true);

    });

});

/**
 * This method fill up divs with images with no src or alt
 */
function populateDivsWithMoleImages(){
    for(let i = 1; i < 17; i++) {
        $(`#hole${i}`).html("<img src='' alt=''/>");
        let currentImg = $(`#hole${i} img`);
        // currentImg.hide();
        currentImg.css("opacity", "0");
    }
}


//method to start the game and reset it to initial state
function startGame() {
    populateDivsWithMoleImages();
    $("#holes div img").removeClass();
    $("#holes div").removeClass();
     numberOfMolesWacked=0;
     numberOfSpecialMolesWacked = 0;
     totalNumberOfPoints = 0;
     nCounter= 0;
    $("#points").text(totalNumberOfPoints);
    $("#holes").css("opacity", "1");
    $("#holes").show();
    $("#results").hide();


    displayMoles();
    startDisplayMoleTimer();
}



//adding the mole images to the 16 div and setting its opacity to 0
function genRanMoleImgSrc(moleImg){
    //generating a random number out of 100 and
    let randomNum = getRandomInt(100,1);
    if(randomNum > 0 && randomNum <= 75){

        moleImg.attr("src", "images/newmole.png").attr("alt", "normalMole");
    }
    else {
        moleImg.attr("src", "images/newmole2.png").attr("alt", "specialMole");
    }

}

/**
 * This is a counter method to solve the error I was facing to make the game work properly
 */
function errorKiller(){
    $("#holes div > img").each(function (){
        if($(this).css("opacity") === "1" && $(this).css("display") === "none"){
            $(this).parent().removeClass();
            // console.log("its in");
        }
    });
}

function checkIfGameOver(){
    //checking the number of moles currently on the screen by summing up length of the arrays
    let numberOfMolesOnScreen = document.getElementsByClassName("normalMole");
    let numberOfSpecialOnScreen = document.getElementsByClassName("specialMole");

    // console.log(numberOfMolesOnScreen.length + numberOfSpecialOnScreen.length)
    if (numberOfMolesOnScreen.length + numberOfSpecialOnScreen.length > 6) {
        clearInterval(timeoutId);

        //Go to game over screen if there are mre than 6 moles on the screen
        showGameOver();
    }
}


/**
 * This method will be called every 0.5 second to display random moles in random holes
 */
function displayMoles() {

    // This is a counter method to solve the error I was facing to make the game work properly
    errorKiller();

    //checking if there are more than 6 moles on the screen
    checkIfGameOver();

     //generate a random hole div in which there is no mole and place new mole img in it
    let currentNum = getRandomInt(16,1);
    let currentHole = $(`#hole${currentNum}`);
    let currentGridImg = $(`#hole${currentNum} img`);

    //choosing another hole if the current hole already has a mole class
    while(currentHole.hasClass("normalMole") || currentHole.hasClass("specialMole")){
        // debugger;
        currentNum = getRandomInt(16,1);
        currentHole = $(`#hole${currentNum}`);
        currentGridImg = $(`#hole${currentNum} img`)

    }
    //If the current Hole does not already have a mole image than place a mole image in that hole
    genRanMoleImgSrc(currentGridImg);


    /**
     * I am using normalMole and specialMole class instead of target class
     */
    //Adding appropriate classes according to the type of the mole
    if(currentGridImg.attr("src") === "images/newmole.png") {
        currentHole.addClass("normalMole");
    }
    else{
        currentHole.addClass("specialMole");

    }
    //unhiding the mole image by making its opacity to 1 using a fade effect over 0.5 seconds
    currentGridImg.fadeTo("500", 1);


    /*
     *When the mole img is clicked it is fade out over 1 second and the class on the
     * hole occupying this img will be removed. It will also update the scores
     */
    currentGridImg.on("click", function (){
        currentGridImg.slideUp(1000);
        if($(this).attr("src") === "images/newmole.png"){
            if($(this).parent().hasClass("normalMole")) {
                numberOfMolesWacked++;
                totalNumberOfPoints = totalNumberOfPoints + 111;
                $(this).parent().removeClass("normalMole");
            }


        }
        else{
            if($(this).parent().hasClass("specialMole")) {
                // nCounter--;
                numberOfSpecialMolesWacked++;
                totalNumberOfPoints = totalNumberOfPoints + 10000;
                $(this).parent().removeClass("specialMole");
            }


        }
        //call a method to update the score besides the start button
       updateScore();

    });
}

/**
 * This method updates the score besides the start button
 */
function updateScore(){
    $("#points").text(totalNumberOfPoints);
}


/**
 * This method shoes the result screen and fades out the game after making its opacity to 0.5
 */
function showGameOver() {

    $("#numRegular").text(numberOfMolesWacked);
    $("#numSpecial").text(numberOfSpecialMolesWacked);
    $("#numPoints").text(totalNumberOfPoints);


    $("#holes").css("opacity", "0.5");
    $("#holes, #holes > div > img").fadeOut(2000);
    $("#btnStart").attr("disabled",false);
    $("#results").fadeIn(2000);


}

//Utility functions
/**
 * This function generates a rendom int between the specified min and max limit
 * @param max
 * @param min
 * @returns {number}
 */
function getRandomInt(max, min) {
    return Math.floor((Math.random() * ((max + 1) - min)) + min);
}

/**
 * This method starts the interval to repeat the game
 */
function startDisplayMoleTimer() {
    timeoutId = setInterval(displayMoles, 500);
}

