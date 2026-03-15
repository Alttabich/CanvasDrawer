var canvas = document.getElementById("MainCanvas");
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext("2d");

var WIDTH = canvas.width;
var HEIGHT = canvas.height;
//const PADDING = 100;
const FPS = 60;
const MIN_PIXEL_SIZE = 1;
const MAX_PIXEL_SIZE = 20;
var pointsArray = new Array();
var verticesArray = [
    {x: 0.5, y: 0.5, z:1},
    {x: 0.5, y:-0.5, z:1},
    {x:-0.5, y:-0.5, z:1},
    {x:-0.5, y: 0.5, z:1},

    {x: 0.5, y: 0.5, z:0.5},
    {x: 0.5, y:-0.5, z:0.5},
    {x:-0.5, y:-0.5, z:0.5},
    {x:-0.5, y: 0.5, z:0.5},
]

function toNDC(x, y, z = 0)
{
    var Point = {};
    x = x / WIDTH;
    y = y / HEIGHT;
    // 0 -> 1
    x = (x * 2) - 1;
    y = (y * 2) - 1;
    //-1 -> 1
    Point.x = x;
    Point.y = y;
    Point.z = z;
    return Point
}

function ProjectToScreen({x, y, z})
{
    x = x/z;
    y = y/z;
    Point = {x, y, z}
    return Point
}

function toScreenCoordinates({x, y, z})
{
    var Point = {};
    x = (x + 1) / 2 * WIDTH;
    y = (1 - (y + 1) / 2) * HEIGHT;

    Point.x = x;
    Point.y = y;
    Point.z = z;
    return Point
}

function drawLine(a, b, color="green")
{
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.strokeStyle = color;
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
}

function drawPixelOnScreen(ScreenCoordinate, Color="green", PixelSize = 10)
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

function CreateUniformPointsArray(ArrayHandle, numOfPointsX, numOfPointsY, PADDING = 0)
{
    var NumX = (WIDTH   - 2 * PADDING) / (numOfPointsX - 1);
    var NumY = (HEIGHT  - 2 * PADDING) / (numOfPointsY - 1);
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

function CreateRandomPointsArray(ArrayHandle, numOfPointsX, numOfPointsY, PADDING = 0)
{
    var NumX = (WIDTH   - 2 * PADDING) / (numOfPointsX - 1);
    var NumY = (HEIGHT  - 2 * PADDING) / (numOfPointsY - 1);
    for (var i = 0; i < numOfPointsX; i++)
    {
        for (var j = 0; j < numOfPointsY; j++)
        {   
            var Point = {};
            Point.x = Math.random() * (WIDTH   - 2 * PADDING)  + PADDING;
            Point.y = Math.random() * (HEIGHT   - 2 * PADDING) + PADDING;
            ArrayHandle.push(Point);
        }
    }
}

function rotate({x, y, z}, angle)
{
    x = x * Math.cos(angle) - z * Math.sin(angle);
    z = x * Math.sin(angle) + z * Math.cos(angle);
    Point = {x, y, z};
    return Point;
}

var t = 0;
var angle = 0;
var dz = 0.01;
var color = ["red", "orange", "yellow", "green", "blue", "purple", "cyan", "magenta"]

function mainLoop()
{
    clearScreen();
    for (i = 0; i < verticesArray.length; i++)
    {
        var projected_a = rotate(verticesArray[i], angle);
        var projected_b = rotate(verticesArray[(i+1)%verticesArray.length], angle);
        projected_a = ProjectToScreen(projected_a);       
        projected_b = ProjectToScreen(projected_b);       
        projected_a = toScreenCoordinates(projected_a);
        projected_b = toScreenCoordinates(projected_b);
        drawPixelOnScreen(projected_a, color[i%color.length]);
        drawLine(projected_a, projected_b);
    }
    t = t + 1000/FPS;
    angle += dz;
    setTimeout(mainLoop, 1000/FPS); 
}
CreateRandomPointsArray(pointsArray, 10, 10);

setTimeout(mainLoop, 1000/FPS);