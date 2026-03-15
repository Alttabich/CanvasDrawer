var canvas = document.getElementById("MainCanvas");
var ctx = canvas.getContext("2d");

var WIDTH = canvas.width;
var HEIGHT = canvas.height;
const FPS = 60;
const MIN_PIXEL_SIZE = 1;
const MAX_PIXEL_SIZE = 20;

const CUBE = [
    { x: 0.5, y: 0.5, z: 0.5 },
    { x: 0.5, y: -0.5, z: 0.5 },
    { x: -0.5, y: -0.5, z: 0.5 },
    { x: -0.5, y: 0.5, z: 0.5 },

    { x: 0.5, y: 0.5, z: -0.5 },
    { x: 0.5, y: -0.5, z: -0.5 },
    { x: -0.5, y: -0.5, z: -0.5 },
    { x: -0.5, y: 0.5, z: -0.5 },
]

function translate({x, y, z}, {dx, dy, dz})
{
    return {
        x: x + dx,
        y: y + dy,
        z: z + dz,
    };
}

function rotate({x, y, z}, angle = 0)
{
    return {
        x: x * Math.cos(angle) - z * Math.sin(angle),
        y,
        z: x * Math.sin(angle) + z * Math.cos(angle)
    };
}

function toScreenSpace(p)
{
    p.x = (p.x + 1) / 2 * WIDTH;
    p.y = (1 - (p.y + 1) / 2) * HEIGHT;
    return p;
}

function projectOnScreen(p)
{
    p.x = p.x / p.z;
    p.y = p.y / p.z;
    return p;
}

function drawStars(Point, BlinkPeriod) //@TODO: make stars flick more naturally
{
    SC = Math.random();
    drawPixelOnScreen(Point, "white", BlinkPeriod);
}

function drawPixelOnScreen(ScreenCoordinate, Color = "white", PixelSize = 2)
{
    ctx.fillStyle = Color;
    if (PixelSize > MAX_PIXEL_SIZE)
        PixelSize = MAX_PIXEL_SIZE;
    if (PixelSize < MIN_PIXEL_SIZE)
        PixelSize = MIN_PIXEL_SIZE;
    ctx.fillRect(ScreenCoordinate.x - PixelSize / 2, ScreenCoordinate.y - PixelSize / 2, PixelSize, PixelSize);

}

function drawLine(a, b, color="green")
{
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.strokeStyle = color;
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
}


function clearScreen(ClearColor = "black")
{
    ctx.fillStyle = ClearColor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

var starsArray = new Array();

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

function CreateRandomPointsArray(ArrayHandle, numOfPointsX, numOfPointsY)
{
    var NumX = WIDTH / (numOfPointsX - 1);
    var NumY = HEIGHT / (numOfPointsY - 1);
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
var angle = 0;
function mainLoop()
{
    const translation = {dx: 0, dy: 0, dz: t}
    dt = 1 / FPS;
    angle = t;
    clearScreen();
    for (const Point of starsArray)
    {
        drawStars(Point, 2 * Math.sin(t));        
    }
    var projectedVertices = new Array();
    for (const Vertex of CUBE)
    {
        let ProjectedVertex = toScreenSpace(projectOnScreen(translate(rotate(Vertex, angle), translation)));
        drawPixelOnScreen(ProjectedVertex, "red", 5);
        projectedVertices.push(ProjectedVertex);
    }
    for (i = 0; i < projectedVertices.length / 2; i++)
    {
        drawLine(
                    projectedVertices[i], 
                    projectedVertices[(i+1) % (projectedVertices.length / 2)]);
        // console.log((i % (projectedVertices.length / 2)) + projectedVertices.length / 2);
        drawLine(
                    projectedVertices[i + projectedVertices.length / 2], 
                    projectedVertices[((i+1) %( projectedVertices.length / 2)) + projectedVertices.length / 2]
                );
        drawLine(
                    projectedVertices[i], 
                    projectedVertices[i + projectedVertices.length / 2]
                );
    }
    t += dt;
    setTimeout(mainLoop, 1000/FPS); 
}

CreateRandomPointsArray(starsArray, 20, 20);

setTimeout(mainLoop, 1000/FPS);