import Graphics.Element (..)
import Graphics.Collage (..)
import Signal
import Signal (Signal)
import Text
import Time
import Window
import List (..)
import String
import Keyboard

-- User input model
-- The only user input required are the directional arrow keys.  They 
-- are what drives the stepping of the game state.

type alias UserInput = { x : Int, y : Int }

-- Game Model
-- The world consists of a worldDim x worldDim grid 
-- of imageDim x imageDim GameObjects.

worldDim : Int
worldDim = 300

imageDim : Int
imageDim = 30

numTilesInRow : Int
numTilesInRow = worldDim // imageDim

type GameObjectType
    = Empty
    | Wall
    | Exit
    | Player
    | Vampire

type alias GameObject = { x:Float, y:Float, image:Element, kind:GameObjectType }

level = """
++++++++++
++++++++++
++++++++++
++++++++++
..........
P...X....V
..........
++++++++++
++++++++++
++++++++++
"""

toTileX : Int -> Float
toTileX tilePosition = ((toFloat (tilePosition % numTilesInRow)) * (toFloat imageDim)) - ((toFloat worldDim) / 2 - (toFloat imageDim) / 2)

toTileY : Int -> Float
toTileY tilePosition = ((toFloat worldDim) / 2 - (toFloat imageDim) / 2) - (toFloat (tilePosition // numTilesInRow)) * toFloat imageDim

toGameObject : Char -> GameObject
toGameObject ch = 
    case ch of
        '+' -> { x=0, y=0, image=(image imageDim imageDim "images/wall_tile.png"), kind=Wall }
        '.' -> { x=0, y=0, image=(image imageDim imageDim "images/empty_tile.png"), kind=Empty }
        'X' -> { x=0, y=0, image=(image imageDim imageDim "images/exit_tile.png"), kind=Exit }
        'P' -> { x=0, y=0, image=(image imageDim imageDim "images/player.png"), kind=Player }
        'V' -> { x=0, y=0, image=(image imageDim imageDim "images/vampire.png"), kind=Vampire }

updatePositions : List GameObject -> List Int -> List GameObject
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
            |> (\gos -> updatePositions gos [0..(length gos)])

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


-- Update

stepPlayer : GameObject -> GameObject
stepPlayer player = 
    { player | x <- 0 
             , y <- 0 } 

stepGame : UserInput -> GameState -> GameState
stepGame userInput gameState = 
    { gameState | player <- stepPlayer player }


-- Display

type alias Keys = { x:Int, y:Int }
display : Keys -> GameState -> Element
display keys gameState =
    collage worldDim worldDim
      (map (\o -> (move (o.x, o.y) (toForm o.image))) gameState.objects)

gameState : Signal GameState
gameState = Signal.foldp stepGame defaultGame Keyboard.arrows

main : Signal Element
main = Signal.map2 display (Signal.sampleOn Keyboard.arrows Keyboard.arrows) gameState
