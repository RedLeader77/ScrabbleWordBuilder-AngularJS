
var app = angular.module('ScrabbleWordBuilderApp', []);

app.service('scrabbleService', function()
{
    var filesProcessed = 0;
    var letterInfoArray = [];
    var wordInfoArray = [];
    
    // Constructor for LetterInfo object
    function LetterInfo(letter, numPieces, numPiecesInPlay, score)
    {
        this.letter = letter;
        this.numPieces = numPieces;
        this.numPiecesInPlay = numPiecesInPlay;
        this.score = score;

        this.toString = function()
        {
            return this.letter + "(" + (this.numPieces - this.numPiecesInPlay) +
                "," + this.score + ") ";
        };
    }
    
    // Constructor for WordInfo object
    function WordInfo(word, wordScore)
    {
        this.word = word;
        this.wordScore = wordScore;
    
        this.toString = function()
        {
            return this.word + "(" + this.wordScore + ") ";
        };
    }
    
    this.processLetters = function(jsonData)
    {
        for(var i = 0; i < jsonData.length; i++)
        {
            letterInfoArray.push(new LetterInfo(jsonData[i].letter,
                jsonData[i].count, 0, jsonData[i].score));
        }
    
        filesProcessed++;
    }
        
    this.getLetterInfoArrayString = function()
    {
        var returnString = "";

        for(var i = 0; i < letterInfoArray.length; i++)
        {
            returnString += letterInfoArray[i].toString();
        }

        return returnString;
    }
    
    this.processDictionary = function(data)
    {
        var textLines = data.split('\n');
        for(var i = 0; i < textLines.length; i++)
        {
            var word = textLines[i];
            var wordScore = 0;
                
            // Calculate wordScore for word
            for(var j = 0; j < word.length; j++)
            {
                for(var k = 0; k < letterInfoArray.length; k++)
                {
                    if(word[j] == letterInfoArray[k].letter)
                    {
                        wordScore += parseInt(letterInfoArray[k].score);
                        break;
                    }
                }
            }
                
            wordInfoArray.push(new WordInfo(word, wordScore));
        }
    
        filesProcessed++;
    }
    
    this.bothFilesProcessed = function()
    {
        if(filesProcessed == 2)
        {
            alert("Data files finished being processed. Close alert to continue.");
            return true;
        }
        
        return false;
    }
    
    this.updateLetterTracking = function(rackStr, wordStr)
    {
        var currentRackString;
        var currentWordString;
        
        if(rackStr === undefined){ currentRackString = ""; }
        else{ currentRackString = rackStr.toUpperCase(); }
        
        if(wordStr === undefined){ currentWordString = ""; }
        else{ currentWordString = wordStr.toUpperCase(); }
        
        // Reset all numPiecesInPlay values to 0
        for(var i = 0; i < letterInfoArray.length; i++)
        {
            letterInfoArray[i].numPiecesInPlay = 0;
        }
    
        // Iterate through currentRackString and update numPiecesInPlay
        for(var i = 0; i < currentRackString.length; i++)
        {
            // Find correct index in letterInfoArray for character at
            // rackStr[i] and update numPiecesInPlay
            for(var j = 0; j < letterInfoArray.length; j++)
            {
                if(currentRackString[i] == letterInfoArray[j].letter)
                {
                    letterInfoArray[j].numPiecesInPlay++;
                    break;
                }
            }
        }
    
        // Iterate through currentWordString and update numPiecesInPlay
        for(var i = 0; i < currentWordString.length; i++)
        {
            // Find correct index in letterInfoArray for character at
            // wordStr[i] and update numPiecesInPlay
            for(var j = 0; j < letterInfoArray.length; j++)
            {
                if(currentWordString[i] == letterInfoArray[j].letter)
                {
                    letterInfoArray[j].numPiecesInPlay++;
                    break;
                }
            }
        }
    }
    
    this.processButtonClicked = function(rackStr, wordStr)
    {
        var wordString;
        
        // Check rack rules
        if(rackStr.length < 1 || rackStr.length > 7)
        {
            return "Invalid number of letters on rack. Must be between 1-7";
        }
        
        // If optional word provided by user, check word rules
        if(wordStr === undefined){ wordString = ""; }
        else{ wordString = wordStr.toUpperCase(); }
        
        if(wordString.length > 0) // then we have something to validate
        {
            if(wordString.length < 2 || wordString.length > 15)
            {
                return "Invalid number of letters in word. Must be between 2-15";
            }
        
            // Check that word exists in the supplied dictionary (aka wordInfoArray)
            var wordExists = false;
            for(var i = 0; i < wordInfoArray.length; i++)
            {
                if(wordString == wordInfoArray[i].word)
                {
                    wordExists = true;
                    break;
                }
            }
        
            if(!wordExists)
            {
                return "The word provided (" + wordString + ") does not exist in dictionary";
            }
        }

        // Make sure the user hasn't entered too many of any letters
        var errorLetters = "";
        for(var i = 0; i < letterInfoArray.length; i++)
        {
            if(letterInfoArray[i].numPiecesInPlay > letterInfoArray[i].numPieces)
            {
                errorLetters += letterInfoArray[i].letter + " ";
            }
        }

        if(errorLetters.length > 0)
        {
            return "Error: letters with too many entries: " + errorLetters;
        }
    
        return this.findHighestScoringWord(rackStr, wordString);
    }
    
    
    this.findHighestScoringWord = function(rackStr, wordStr)
    {
        var maxScoreIndex = 0;
    
        // Example: AIDOORW -> DRAW (8 points, 1st word alphabetically)
    
        // Case where no word is supplied: Find all words in wordInfoArray that can
        // be made from letters in rack. Keep track of index of max scoring word found.
        if(wordStr.length == 0)
        {
            for(var i = 0; i < wordInfoArray.length; i++)
            {
                if(this.isScoringWord(wordInfoArray[i].word, rackStr))
                {
                    //alert("Scoring word: " + wordInfoArray[i].word);
                
                    // Keep track of index of max scoring word found
                    if(wordInfoArray[i].wordScore > wordInfoArray[maxScoreIndex].wordScore)
                    {
                        maxScoreIndex = i;
                    }
                }
            }
        }

        // Case where word is supplied by user
        if(wordStr.length > 0)
        {
            var myWord = wordStr.toUpperCase();
        
            // Building off of word horizontally. Scoring word must include user supplied word.
            for(var i = 0; i < wordInfoArray.length; i++)
            {
                if(wordInfoArray[i].word.includes(myWord) &&
                    this.isScoringWord(wordInfoArray[i].word, rackStr + myWord))
                {
                    //alert("Scoring word: " + wordInfoArray[i].word);
                
                    // Keep track of index of max scoring word found
                    if(wordInfoArray[i].wordScore > wordInfoArray[maxScoreIndex].wordScore)
                    {
                        maxScoreIndex = i;
                    }
                }
            }
    
            // Building off of user supplied word vertically checking each letter
            for(var i = 0; i < myWord.length; i++)
            {
                var myLetter = myWord[i];
                for(var j = 0; j < wordInfoArray.length; j++)
                {
                    if(wordInfoArray[j].word.includes(myLetter) &&
                        this.isScoringWord(wordInfoArray[j].word, rackStr + myLetter))
                    {
                        //alert("Scoring word: " + wordInfoArray[j].word);
                
                        // Keep track of index of max scoring word found
                        if(wordInfoArray[j].wordScore > wordInfoArray[maxScoreIndex].wordScore)
                        {
                            maxScoreIndex = j;
                        }
                    }
                }
            }
        }
    
        return wordInfoArray[maxScoreIndex].word + " : " +
            wordInfoArray[maxScoreIndex].wordScore + " points";
    }
    
    
    this.isScoringWord = function(word, letters)
    {
        var index = 0;
        var myLetters = letters.toUpperCase();
    
        //alert("Inside isScoringWord: word = " + word + ", letters = " + letters);
    
        // Get out returning false if word has more characters than letters string
        if(word.length > myLetters.length)
        {
            return false;
        }
    
        // Iterate through each letter in word to see if exists in letters.
        // If no, return false. If yes, remove letter from letters and continue
        // iterating.
        for(var i = 0; i < word.length; i++)
        {
            index = myLetters.indexOf(word[i]);
            if(index == -1)
            {
                return false;
            }
            else
            {
                if(index == 0)
                {
                    myLetters = myLetters.substring(1, myLetters.length);
                }
                else if(index == myLetters.length - 1)
                {
                    myLetters = myLetters.substring(0, myLetters.length-1);
                }
                else
                {
                    myLetters = myLetters.substring(0, index) +
                        myLetters.substring(index+1, myLetters.length);
                }
            }
        }
    
        return true;
    }
    
});


