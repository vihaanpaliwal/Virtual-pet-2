var database;
var foodStock;
var foodS;
var dog, dogImg1, dogImg2;
var feedButton, addButton;
var foodObj;
var fedTime;
var lastFed;

function preload()

{
  dogImg1 = loadImage("images/dogImg.png")
  dogImg2 = loadImage("images/dogImg1.png")
	
}

function setup() {
	createCanvas(1000, 500);
  database = firebase.database();
  console.log(database);
 
  foodObj = new Food()
  dog = createSprite(700,250,10,10);
  dog.addImage(dogImg1);
  dog.scale = 0.15;
  
 

  var foodStock = database.ref('Food');
  foodStock.on("value", readPosition, showError);

  feedButton = createButton("FEED DOG");
  feedButton.position(500, 100);
  feedButton.mousePressed(feedDog);
 
  addButton = createButton("ADD FOOD");
  addButton.position(600, 100);
  addButton.mousePressed(addFood);

} 



function draw(){
  background(46,139,87);
  
  foodObj.display();

  fedTime = database.ref("fedTime");
  fedTime.on("value", function(data) {
    lastFed = data.val();
  })
  
  fill(255);
  textSize(15);

  if(lastFed >= 12){
  
    text("Last Feed : " + lastFed % 12 + " PM", 350, 65);
  } else if(lastFed === 0) {
  
    text("Last Feed : 12 AM", 350, 65)
  } else {
  
    text("Last Feed : " + lastFed + " AM", 350, 65);
  }

  drawSprites();
}

function readPosition(data){

  foodS = data.val();
  foodObj.updateFoodStock(foodS);
  
}

function showError(){
  console.log("Error");
}

function writePosition(x){
  if(x > 0){
    x = x - 1
  } else {
    x = 0
  }

  database.ref('/').set({
    Food: x
  })

}
function addFood(){
  foodS ++;

  database.ref('/').update({
    Food: foodS
  })
}

function feedDog(){

  dog.addImage(dogImg2);
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').set({
    Food: foodObj.getFoodStock(),
    fedTime: hour()
  })
}