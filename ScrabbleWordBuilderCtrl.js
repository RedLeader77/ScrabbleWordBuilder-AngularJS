
app.controller('ScrabbleWordBuilderCtrl', function($scope, $http, scrabbleService)
{
    $scope.showForm = false;

    $http.get("letters.json").then(function(response)
    {
        scrabbleService.processLetters(response.data.letters);
        $scope.showForm = scrabbleService.bothFilesProcessed();
        if($scope.showForm)
        {
            $scope.letterTrackerText = scrabbleService.getLetterInfoArrayString();
        }
    });

    $http.get("dictionary.txt").then(function(response)
    {
        scrabbleService.processDictionary(response.data);
        $scope.showForm = scrabbleService.bothFilesProcessed();
        if($scope.showForm)
        {
            $scope.letterTrackerText = scrabbleService.getLetterInfoArrayString();
        }
    });

    $scope.inputChanged = function()
    {
        scrabbleService.updateLetterTracking($scope.rackText, $scope.wordText);
        $scope.letterTrackerText = scrabbleService.getLetterInfoArrayString();
    };

    $scope.processButtonClicked = function()
    {
        $scope.outputText = "";
        $scope.outputText = scrabbleService.processButtonClicked($scope.rackText, $scope.wordText);
    }
    
    $scope.resetButtonClicked = function()
    {
        $scope.rackText = "";
        $scope.wordText = "";
        $scope.outputText = "";
        
        scrabbleService.updateLetterTracking($scope.rackText, $scope.wordText);
        $scope.letterTrackerText = scrabbleService.getLetterInfoArrayString();
    }

});

