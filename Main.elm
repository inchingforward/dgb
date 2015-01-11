import Graphics.Element (..)
import Graphics.Collage (..)
import Signal
import Signal (Signal)
import Text
import Time
import Window
import List (..)
import String

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

-- The world consists of a worldDim x worldDim grid 
-- of imageDim x imageDim tiles.
worldDim = 300
imageDim = 30

type GameObjectType
    = Empty
    | Wall
    | Exit
    | Player
    | Vampire

type alias GameObject = { x:Float, y:Float, image:Element, kind:GameObjectType }

level = """
P.X
+.V
"""

toTileX : Float -> Float
toTileX tilePosition = (tilePosition * imageDim) - (worldDim / 2 - imageDim / 2)

toTileY : Float -> Float
toTileY tilePosition = worldDim / 2 - imageDim / 2

toGameObject : Char -> GameObject
toGameObject ch = 
    case ch of
        '+' -> { x=0, y=0, image=(image imageDim imageDim "images/wall_tile.png"), kind=Wall }
        '.' -> { x=0, y=0, image=(image imageDim imageDim "images/empty_tile.png"), kind=Empty }
        'X' -> { x=0, y=0, image=(image imageDim imageDim "images/exit_tile.png"), kind=Exit }
        'P' -> { x=0, y=0, image=(image imageDim imageDim "images/player.png"), kind=Player }
        'V' -> { x=0, y=0, image=(image imageDim imageDim "images/vampire.png"), kind=Vampire }

updatePositions : List GameObject -> List Float -> List GameObject
updatePositions gos fs =
    map2 (\go f -> { go | x <- toTileX f
                        , y <- toTileY f }) gos fs

findGameObject : List GameObject -> GameObjectType -> GameObject
findGameObject gos got =
    head (filter (\go -> go.kind == got) gos)

gameObjects : List GameObject
gameObjects = level
            |> String.toList
            |> filter (\s -> not (s == '\n'))
            |> map (\s -> toGameObject s)
            |> (\gos -> updatePositions gos [0.0..(toFloat (length gos))])

-- Individual gameObjects are pulled out to make updating easier.
player = findGameObject gameObjects Player
vampire = findGameObject gameObjects Vampire
exit = findGameObject gameObjects Exit

type alias GameState = 
    { player:GameObject
    , vampire:GameObject
    , exit:GameObject
    , objects:List GameObject 
    }

defaultGame : GameState
defaultGame =
    { player=player, vampire=vampire, exit=exit, objects=gameObjects }


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
    collage worldDim worldDim
      (map (\o -> (move (o.x, o.y) (toForm o.image))) gameState.objects)

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
