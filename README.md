## The Website
     https://steven-sudoku-api.herokuapp.com





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