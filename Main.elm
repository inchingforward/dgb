import Graphics.Element (..)
import Graphics.Collage (..)
import Signal
import Signal (Signal)
import Text
import Time
import Window
import List (..)

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

type GameObjectType
    = Empty
    | Wall
    | Exit
    | Player
    | Vampire

type alias GameObject = { x:Float, y:Float, image:Element, kind:GameObjectType }

gameObjects : List GameObject
gameObjects = map (\s -> asciiToTile s 30 30) ["+", ".", "X", "P", "V"]

asciiToTile : String -> Float -> Float -> GameObject
asciiToTile ascii x y = 
    case ascii of
        "+" -> { x=x, y=y, image=(image 30 30 "images/wall_tile.png"), kind=Wall }
        "." -> { x=x, y=y, image=(image 30 30 "images/empty_tile.png"), kind=Empty }
        "X" -> { x=x, y=y, image=(image 30 30 "images/exit_tile.png"), kind=Exit }
        "P" -> { x=x, y=y, image=(image 30 30 "images/player.png"), kind=Player }
        "V" -> { x=x, y=y, image=(image 30 30 "images/vampire.png"), kind=Vampire }

findGameObject : List GameObject -> GameObjectType -> GameObject
findGameObject gos got =
    head (filter (\go -> go.kind == got) gos)

player = findGameObject gameObjects Player
vampire = findGameObject gameObjects Vampire
exit = findGameObject gameObjects Exit
tiles = filter (\go -> go.kind == Wall || go.kind == Empty) gameObjects

type alias GameState = 
    { player:GameObject
    , vampire:GameObject
    , exit:GameObject
    , tiles:List GameObject 
    }

defaultGame : GameState
defaultGame =
    { player=player, vampire=vampire, exit=exit, tiles=tiles }


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
