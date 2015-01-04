import Graphics.Element (..)
import Graphics.Collage (..)
import Signal
import Signal (Signal)
import Text
import Time
import Window

{-- Part 1: Model the user input ----------------------------------------------

What information do you need to represent all relevant user input?

Task: Redefine `UserInput` to include all of the information you need.
      Redefine `userInput` to be a signal that correctly models the user
      input as described by `UserInput`.

------------------------------------------------------------------------------}

type alias UserInput = {}


userInput : Signal UserInput
userInput =
    Signal.constant {}


type alias Input =
    { timeDelta : Float
    , userInput : UserInput
    }


-- Model

type alias Mover = { x:Float, y:Float, image:Element }

player : Mover
player =  { x=0, y=0, image=image 30 30 "images/player.png" }

vampire : Mover
vampire = { x=100, y=100, image=image 30 30 "/images/vampire.png" }

type alias GameState = { player:Mover, vampire:Mover }

defaultGame : GameState
defaultGame =
    { player=player, vampire=vampire }



{-- Part 3: Update the game ---------------------------------------------------

How does the game step from one state to another based on user input?

Task: redefine `stepGame` to use the UserInput and GameState
      you defined in parts 1 and 2. Maybe use some helper functions
      to break up the work, stepping smaller parts of the game.

------------------------------------------------------------------------------}

stepGame : Input -> GameState -> GameState
stepGame {timeDelta,userInput} gameState =
    gameState



{-- Part 4: Display the game --------------------------------------------------

How should the GameState be displayed to the user?

Task: redefine `display` to use the GameState you defined in part 2.

------------------------------------------------------------------------------}

display : (Int,Int) -> GameState -> Element
display (w,h) gameState =
    collage 400 400
     [ move (gameState.player.x, gameState.player.y) (toForm gameState.player.image)
     , move (gameState.vampire.x, gameState.vampire.y) (toForm gameState.vampire.image)
     ]



{-- That's all folks! ---------------------------------------------------------

The following code puts it all together and shows it on screen.

------------------------------------------------------------------------------}

delta : Signal Float
delta =
    Time.fps 30


input : Signal Input
input =
    Signal.sampleOn delta (Signal.map2 Input delta userInput)


gameState : Signal GameState
gameState =
    Signal.foldp stepGame defaultGame input


main : Signal Element
main =
    Signal.map2 display Window.dimensions gameState
