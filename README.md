## Technology Stack
This application was made with Nodejs, Express, Postgresql and React

## Repos
In addition to this repository, the site was built using two other repositories. 
    * The repo with the code I used to generate the puzzles: https://github.com/OrangeHoodie240/Sudoku
    * The repo I used to build the React app: https://github.com/OrangeHoodie240/sudoku-react
    
## Tests 
Both this and https://github.com/OrangeHoodie240/Sudoku have tests that can be run with jest. 


## The Website

The title of the site is Play Sudoku: https://steven-sudoku-api.herokuapp.com

The website allows users to play sudoku of three different levels of difficulty. Users are able to create an 
account and save puzzles to continue playing later. The website has a sudoku analyzer that, when the hint button is 
selected, will highlight an empty cell and specify the strategy (or strategies if it requires more than one rule) to solve. 
The analyzer always selects an empty cell for which the most simple rule possible is needed to solve. The solution is available
by clicking another button. A tutorial is provided explaining both the basic rules of sudoku as well as the strategies referenced
by the analyzer. 




## API 

Base URL: https://steven-sudoku-api.herokuapp.com/sudoku

GET random puzzle by level: https://steven-sudoku-api.herokuapp.com/sudoku?level=value  
Possible values for level are one, two and three. These correspond to the difficulty level.

    Example:GET https://steven-sudoku-api.herokuapp.com/sudoku?level=three

    Response: 
                {
                    "data": {
                                "puzzle": [["1","0","0","0","0","0","7","0","9"],
                                           ["4","0","0","0","8","9","0","3","0"],
                                           ["0","0","0","1","0","0","4","0","0"],
                                           ["0","3","0","0","5","7","6","0","0"],
                                           ["0","0","0","0","0","0","0","0","0"],
                                           ["0","0","9","0","1","2","0","0","0"],
                                           ["8","9","0","0","7","0","3","6","0"],
                                           ["0","1","0","8","0","0","9","0","4"],
                                           ["7","0","0","0","0","1","8","0","0"]],
                                "puzzleId": 754
                            }
                }

GET specific puzzle by level and puzzle id: https://steven-sudoku-api.herokuapp.com/sudoku/:level/:id
  
    Example:GET https://steven-sudoku-api.herokuapp.com/sudoku/three/754

    Response: 
                {
                    "data": {
                                "puzzle": [["1","0","0","0","0","0","7","0","9"],
                                           ["4","0","0","0","8","9","0","3","0"],
                                           ["0","0","0","1","0","0","4","0","0"],
                                           ["0","3","0","0","5","7","6","0","0"],
                                           ["0","0","0","0","0","0","0","0","0"],
                                           ["0","0","9","0","1","2","0","0","0"],
                                           ["8","9","0","0","7","0","3","6","0"],
                                           ["0","1","0","8","0","0","9","0","4"],
                                           ["7","0","0","0","0","1","8","0","0"]],
                                "puzzleId": 754
                            }
                }

GET analysis for puzzle: https://steven-sudoku-api.herokuapp.com/sudoku/analysis?puzzle=value  
Puzzle is made with comma delimited digits with 0 standing for blank cells. The values are ordered left to 
    right and top to bottom. 
The response will be a an 
    
    Example: https://steven-sudoku-api.herokuapp.com/sudoku/analysis?puzzle=2,0,4,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,7,0,0,4,0,0,1,3,0,0,1,0,7,0,0,3,9,0,4,0,9,1,8,0,0,6,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,7,0,5,6,9,0,0,6,5,1,0,7,2,0,0,0,8,0,0,0,0,3


    Response: 
               {
                "data": { 
                    "success": true,
                    "position": [1,8],
                    "value": "8",
                    "solveWith": ["sole-candidate"]
                        }
                }

    NOTE: When the number of required strategies to solve exceeds one, the solveWith array will list each strategy in the order they 
          are to be applied. 