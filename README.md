The ScrabbleWordBuilder application is a web app that uses the AngularJS framework. It is made up of the following files:

ScrabbleWordBuilder.html
ScrabbleWordBuilderApp.js
ScrabbleWordBuilderCtrl.js
ScrabbleWordBuilder.css
dictionary.txt
letters.json

Usage/Description: The app is launched by opening the ScrabbleWebBuilder.html page in your web browser from within the folder containing the dependent files listed above. The html page contains basic elements like the title, and a few labels to let the user know they are running the ScrabbleWordBuilder app. There is also a label letting the user know the app is initializing. An alert window appears when the application has finished initializing, which involves reading the input files (letters.json, dictionary.txt) and storing the data in local memory. After closing this alert window the main form of the app is presented to the user. I’ve included a textArea labeled ‘Letter Tracker’ which dynamically keeps track of the number of games pieces available. The number available of each letter is the first value in parenthesis. This value changes as the user enters characters in either the ‘Rack’ or ‘Word’ text areas. The second value is the number of points for the letter, a static value. I liked the idea of including Letter Tracker data for both debugging purposes as well as facilitating the user experience. Below the ‘Word’ text area are the ‘Process’ and ‘Reset’ buttons. Clicking the ‘Process’ button causes the processButtonClicked() JavaScript function to be called. This is the entry point for determining what output should be displayed (error messages, valid scoring word, word score) in the ‘Output’ text area. Clicking the ‘Reset’ button clears out the ‘Rack’, ‘Word’, ‘Output’ and text areas and resets all data in the ‘Letter Tracker’ text area to original values allowing the user to enter an new word and letters without having to clear the fields manually.
