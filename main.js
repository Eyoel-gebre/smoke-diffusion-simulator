var canvas = document.getElementById("canvasElement");
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//custimizable vars
var pixelDims =  10; //how big a single pixel is
var fps = 80;
var thickness = 10; //how thick the smoke is lol


//mouse object
var mousedown = false;
var mouse = {
    x:null,
    y:null
}

//Sets grid
var Grid = new Array(Math.round(window.innerWidth/pixelDims)).fill(0);
for(var i = 0; i<Grid.length; i++){
    Grid[i] = new Array(Math.round(window.innerHeight/pixelDims)).fill(0);
}

//resizes grid
window.addEventListener('resize',
    function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var newX = Math.round(window.innerWidth/pixelDims);
        var newY = Math.round(window.innerHeight/pixelDims);
        if(Grid.length < newX){
            for(var i = 0; i<newX - Grid.length; i++){
                Grid.push(new Array(newY).fill(0));
            } 
        }
        if(Grid.length > newX){
            for(var i = 0; i<Grid.length - newX; i++){
                Grid.pop();
            } 
        }
        if(Grid[0].length < newY){
            for(var i = 0; i < Grid.length; i++){
                for(var j = 0; j<newY-Grid[i].length; j++){
                    Grid[i].push(0);
                }
            }
        }
        if(Grid[0].length > newY){
            for(var i = 0; i < Grid.length; i++){
                for(var j = 0; j<Grid[i].length-newY; j++){
                    Grid[i].pop();
                }
            }
        }
    }
)

window.addEventListener('mousedown',  function(){ mousedown = true;})
window.addEventListener('mouseup',  function(){ mousedown = false;})
window.addEventListener('mousemove', function(e){
    if(e.x >= 0 && e.x <= window.innerWidth){mouse.x = e.x;}
    if(e.y >= 0 && e.y <= window.innerHeight){mouse.y = e.y;}
})

function draw(){
    if(mousedown){
        var x = Math.round(mouse.x/pixelDims);
        var y = Math.round(mouse.y/pixelDims);
        Grid[x][y] = thickness;
    }
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
    for(var i = 0; i<Grid.length; i++){
        for(var j = 0;j<Grid[i].length; j++){
            ctx.fillStyle = 'rgb(255,255,255,'+Grid[i][j]+')';
            ctx.fillRect(i*pixelDims, j*pixelDims, pixelDims, pixelDims);
        }
    }
}

function diffuse(){
    //diffusion logic
    for(var i = 0; i<Grid.length; i++){
        for(var j = 0; j<Grid[i].length; j++){
            if(i==0 && j==0){
                Grid[i][j] = (Grid[i+1][j] + Grid[i+1][j+1] + Grid[i][j+1] + Grid[i][j])/4;
            }            
            else if(i==0 && j==Grid[0].length-1){
                Grid[i][j] = (Grid[i][j-1] + Grid[i+1][j-1] + Grid[i+1][j] + Grid[i][j])/4;
            }            
            else if(j==Grid[0].length-1 && i==Grid.length-1){
                Grid[i][j] =(Grid[i][j-1] + Grid[i-1][j] + Grid[i-1][j-1] + Grid[i][j])/4;        
            }           
            else if(i==Grid.length-1 && j == 0){
                Grid[i][j] = (Grid[i][j+1] + Grid[i-1][j+1] + Grid[i-1][j] + Grid[i][j])/4;
            }
            else if(i==0){
                Grid[i][j] = (Grid[i][j-1] + Grid[i+1][j-1] + Grid[i+1][j] + Grid[i+1][j+1] + Grid[i][j+1] + Grid[i][j])/6;
            }
            else if(j==Grid[0].length-1){
                Grid[i][j] = (Grid[i][j-1] + Grid[i+1][j-1] + Grid[i+1][j] + Grid[i-1][j] + Grid[i-1][j-1] + Grid[i][j])/6;
            }
            else if(i==Grid.length-1){
                Grid[i][j] = (Grid[i][j-1] + Grid[i][j+1] + Grid[i-1][j+1] + Grid[i-1][j] + Grid[i-1][j-1] + Grid[i][j])/6;
            }
            else if(j == 0){
                Grid[i][j] =(Grid[i+1][j] + Grid[i+1][j+1] + Grid[i][j+1] + Grid[i-1][j+1] + Grid[i-1][j] + Grid[i][j])/6;
            }
            else{
                Grid[i][j] = (Grid[i][j-1] + Grid[i+1][j-1] + Grid[i+1][j] + Grid[i+1][j+1] + Grid[i][j+1] + Grid[i-1][j+1] + Grid[i-1][j] + Grid[i-1][j-1] + Grid[i][j])/9;
            }
        }
    }
}

Grid[30][30] = 100; //small when program start

//main loop
setInterval(
    function(){
        diffuse();
        draw();
    },
Math.round(1000/fps));


