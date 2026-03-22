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

var grid = new Array();
var connections = new Array
function createGrid(gridArray, N)
{	
	for (let i = 0; i < N; i++)
	{
		for (let j = 0; j < N; j++)
		{
			Point = {};
			Point.x = (i / N * 2) - 1;
			Point.y = -0.25;
			Point.z = j * 5 / N;
			//0 -> N
			//0 -> 1
			//0 -> 2
			//-1 -> 1
			//console.log(Point)	
			gridArray.push(Point);
		}
	}
}

function translate({x, y, z}, translation)
{
    return {
        x: x + translation.x,
        y: y + translation.y,
        z: z + translation.z,
    };
}

function rotate({x, y, z}, angle = 0, yRotation = false)
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
    return {x: p.x / p.z, y: p.y / p.z, z: p.z};
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
	ctx.lineWidth = 5;
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

function calculateTranslation(vector, velocity, dt)
{
	if (vector.z > 5 )
		velocity.z = -VZ;
	else
		if(vector.z <=1 )
			velocity.z = VZ;
	if (vector.y > -0.25)
		velocity.y -= dt * g;
	else 
	{
		velocity.y += dt * g;
		
	}
	vector.x = vector.x + velocity.x * dt;
	vector.y = vector.y + velocity.y * dt;
	vector.z = vector.z + velocity.z * dt;
}
var g = 9.8
var t = 0;
var angle = 0;
var VZ = 1;
var velocity = {x: 0, y: 1, z: VZ}
var translation = {x:0, y:0, z:0};

createGrid(grid, 100);

function mainLoop()
{
    const dt = 1 / FPS;
	calculateTranslation(translation, velocity, dt);
	//console.log(translation)
    angle = t;
    clearScreen();
    for (const Point of starsArray)
    {
        drawStars(Point, 2 * Math.sin(t));        
    }
    var projectedVertices = new Array();
    var projectedGridVertices = new Array();
    for (const Vertex of CUBE)
    {
        let ProjectedVertex = toScreenSpace(projectOnScreen(translate(rotate(Vertex, angle), translation)));
        drawPixelOnScreen(ProjectedVertex, "red", 5);
        projectedVertices.push(ProjectedVertex);
    }
	for (const Vertex of grid)
	{
		let ProjectedVertex = toScreenSpace(projectOnScreen((Vertex)));
        drawPixelOnScreen(ProjectedVertex, "purple", 10 / (1 + Vertex.z));
        projectedGridVertices.push(ProjectedVertex);
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

CreateRandomPointsArray(starsArray, 100, 100);

setTimeout(mainLoop, 1000/FPS);