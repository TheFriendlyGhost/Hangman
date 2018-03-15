var userText = document.getElementById("user-text")
var guessText = document.getElementById("guesses-text")
var numText = document.getElementById("num-text")
var winText = document.getElementById("win-text")

var wins = 0

var audioElement = document.createElement('audio');



var hangman = {
	optionsEasy:["DOC","MARTY","BIFF","MCFLY","ALMANAC"],
	optionsMedium:["DELOREAN","LIBYANS","LIGHTNING", "MICHAELJFOX"],
	optionsHard:["PLUTONIUM","TIMEMACHINE","FLUXCAPACITOR","HOVERBOARD","EIGHTYEIGHTMPH"],
	guesses: 15,
	win: false,
	wordLength: 0,
	word: "",
	guessed: [],
	gameOngoing: false,
	lettersRemaining: 0,



	// GETTERS
	getOptions: function(){
		return	this.options
	},

	getGuesses: function(){
		return this.guesses
	},

	getWin: function(){
		return this.win
	},

	getwordLength: function(){
		return this.wordLength
	},

	getWord: function(){
		return this.word
	},

	getGuessed: function(){
		return this.guessed
	},

	// OTHER METHODS
	startnewGame: function(difficulty){
		this.guesses = 15
		this.win = false
		this.guessed = []
		this.gameOngoing = true
		this.getnewWord(difficulty)
		this.setwordLength()
		this.lettersRemaining = this.wordLength
		userText.textContent = ""
			guessText.textContent = ""
		numText.textContent = 15
	},

	getnewWord: function(difficulty){
		switch(difficulty){
			case "easy":
				this.word = this.optionsEasy[Math.floor(Math.random()*this.optionsEasy.length)]
				break
			case "medium":
				this.word = this.optionsMedium[Math.floor(Math.random()*this.optionsMedium.length)]
				break
			case "hard":
				this.word = this.optionsHard[Math.floor(Math.random()*this.optionsHard.length)]
				break
		}
	},

	setwordLength: function(){
		this.wordLength = this.word.length
	},

	letterinWord: function(key){
		var letter = key
		var tot = 0

		for(var i = 0; i < this.wordLength; i++){				
			if(this.word[i] === letter){
				tot++
			}
		}

		this.addtoGuessed(letter)
		return tot
	},

	addtoGuessed: function(key){
		this.guessed.push(key)
	},

	hasbeenGuessed: function(key){
		for(var i = 0; i<this.guessed.length; i++){
			if (this.guessed[i] === key) {
				return false
			}
		}
		return true
	},

	popWord: function(key){
		var re = new RegExp(key,"gi");
		this.word = this.word.replace(re, "")
	}

}

$( "#easy" ).click(function() {
		hangman.startnewGame("easy")
		makedisplayLetters()
		// console.log(totalSpace)
});

$( "#medium" ).click(function() {
		hangman.startnewGame("medium")
		makedisplayLetters()
});		

$( "#hard" ).click(function() {
		hangman.startnewGame("hard")
		makedisplayLetters()
});		


function makedisplayLetters(){
	$('#letter-blocks').empty()
	$('#win-lose').empty()
	for(var i = 0; i<hangman.getwordLength();i++){
			var letter = $("<div>");
			var box = $("<div>");

    	letter.addClass("letter fridge-color")
    	box.addClass("fridge-color box")

    	letter.attr("data-letter", hangman.word[i])
    	box.attr("data-letter", hangman.word[i])

    	letter.text(hangman.word[i])

    	$("#letter-blocks").append(letter)
    	$("#letter-blocks").append(box)

    	letter.hide()
    	box.show()
    	// subspace  += 34
    }

    // var rowpad = (totalSpace - subspace)/2

    // $("#letter-blocks").css('padding-left',''+rowpad+'px')
}

function displayGuessed(keyPress){
	$('.box').filter('[data-letter='+keyPress+']').hide()
	$('.letter').filter('[data-letter='+keyPress+']').show()
}

document.onkeyup = function(event) {
	var keyPress = event.key.toUpperCase()

	if(hangman.gameOngoing === false){
		alert("you must start a new game to make guesses")
		return
	}else if(keyPress === "CTRL" || event.keyCode === 13){
			keyPress = ""
	}else{
		if(hangman.hasbeenGuessed(keyPress) && ((event.keyCode >= 65 && event.keyCode <= 90)||(event.keyCode >= 97 && event.keyCode <= 122))){
			var tot = hangman.letterinWord(keyPress)
			if( tot > 0){
				hangman.popWord(keyPress)
				displayGuessed(keyPress)
				if(hangman.word === ""){
					wins++
					winText.textContent = wins
					userText.textContent = keyPress
					guessText.textContent = hangman.getGuessed()
					numText.textContent = hangman.getGuesses()

					var win = $("<h1>");
		        	win.text("YOU WON!!!")
		        	$("#win-lose").append(win)


					audioElement.setAttribute('src', 'Assets/dontneedroads.mp3');
					audioElement.play()
					hangman.gameOngoing = false
				}
				hangman.guesses--
			}else{
				hangman.guesses--
			}
		}else{
			alert("That is not a letter or has already been guessed")
		}

	}

	if(hangman.gameOngoing === true){
		userText.textContent = keyPress
		guessText.textContent = hangman.getGuessed()
		numText.textContent = hangman.getGuesses()
	}

	if (hangman.guesses === 0){
		var lose = $("<h1>");
    	lose.text("YOU LOSE!!!")
    	$("#win-lose").append(lose)
    	audioElement.setAttribute('src', 'Assets/thinkmcfly.mp3');
    	audioElement.play()
		hangman.gameOngoing = false
	}
}
