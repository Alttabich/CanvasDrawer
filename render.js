var canvas = document.getElementById("MainCanvas");
var ctx = canvas.getContext("2d");

var WIDTH = canvas.width;
var HEIGHT = canvas.height;
//const PADDING = 100;
const FPS = 60;
const MIN_PIXEL_SIZE = 1;
var MAX_PIXEL_SIZE;


function drawPixelOnScreen(ScreenCoordinate, Color, PixelSize = 2)
{
    ctx.fillStyle = Color;
    if (PixelSize > MAX_PIXEL_SIZE)
        PixelSize = MAX_PIXEL_SIZE;
    if (PixelSize < MIN_PIXEL_SIZE)
        PixelSize = MIN_PIXEL_SIZE;
    ctx.fillRect(ScreenCoordinate.x - PixelSize / 2, ScreenCoordinate.y - PixelSize / 2, PixelSize, PixelSize);

}
function clearScreen(ClearColor = "black")
{
    ctx.fillStyle = ClearColor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

//drawPixelOnScreen({x: 0, y: 10}, "green", 10);

var pointsArray = new Array();

function CreateUniformPointsArray(ArrayHandle, numOfPointsX, numOfPointsY, PADDING = 0)
{
    var NumX = (WIDTH   - 2 * PADDING) / (numOfPointsX - 1);
    var NumY = (HEIGHT  - 2 * PADDING) / (numOfPointsY - 1);
    MAX_PIXEL_SIZE = Math.min(NumX, NumY) / 2 - 1 / 2;
    console.log("Pixel size: ", MAX_PIXEL_SIZE);
    for (var i = 0; i < numOfPointsX; i++)
    {
        for (var j = 0; j < numOfPointsY; j++)
        {   
            var Point = {};
            Point.x = i * NumX + PADDING;
            Point.y = j * NumY + PADDING;
            ArrayHandle.push(Point);
        }
    }
}

function CreateRandomPointsArray(ArrayHandle, numOfPointsX, numOfPointsY)
{
    var NumX = WIDTH / (numOfPointsX - 1);
    var NumY = HEIGHT / (numOfPointsY - 1);
    MAX_PIXEL_SIZE = Math.min(NumX, NumY) / 2 - 1 / 2;
    console.log("Pixel size: ", MAX_PIXEL_SIZE);
    for (var i = 0; i < numOfPointsX; i++)
    {
        for (var j = 0; j < numOfPointsY; j++)
        {   
            var Point = {};
            Point.x = Math.random() * WIDTH;
            Point.y = Math.random() * HEIGHT;
            ArrayHandle.push(Point);
        }
    }
}

var t = 0;
function mainLoop()
{
    clearScreen();
    for (i = 0; i < pointsArray.length; i++)
    {
        drawPixelOnScreen(pointsArray[i], "white", 2 * Math.sin(t));        
    }
    t = t + 1000/FPS;
    setTimeout(mainLoop, 1000/FPS); 
}

CreateRandomPointsArray(pointsArray, 10, 10);

setTimeout(mainLoop, 1000/FPS);