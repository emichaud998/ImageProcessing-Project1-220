let robot = lib220.loadImageFromURL('https://people.cs.umass.edu/~joydeepb/robot.jpg');
let redImage = removeBlueAndGreen(robot);
let grayImage = makeGrayscale(robot); 
let highlightImage = highlightEdges(robot); 
let blurImage = blur(robot);
robot.show();
redImage.show();
grayImage.show();
highlightImage.show();
blurImage.show(); 

//removeBlueAndGreen(inputImage: loaded image): red image
function removeBlueAndGreen(inputImage){
  let imageCopy = inputImage.copy(); //Creates a copy of the input image to be edited

  //Two for loops iterate through the pixel grid of the picture
  for (let x = 0; x < imageCopy.width; ++x){
    for (let y = 0; y < imageCopy.height; ++y){
      let r = imageCopy.getPixel(x, y); //Returns an array of the intensity of red, green, and blue pixels at x,y coordinate
      imageCopy.setPixel(x, y, [r[0], 0.0, 0.0]); //Sets green and blue pixels at x,y coordinate to 0 to remove them- leave red the same
    }
  }

  return imageCopy;
}

//makeGrayscale(inputImage: loaded image): grayscale image
function makeGrayscale(inputImage){
  let imageCopy = inputImage.copy(); //Creates a copy of the input image to be edited

  //Two for loops iterate through the pixel grid of the picture
  for (let x = 0; x < imageCopy.width; ++x){
    for (let y = 0; y < imageCopy.height; ++y){
      let colorArray = imageCopy.getPixel(x, y); //Returns an array of the intensity of red, green, and blue pixels at x,y coordinate
      //Takes the mean(average) of the current pixel's red, green, and blue values
      let m = (colorArray[0] + colorArray[1] + colorArray[2])/3; 
      imageCopy.setPixel(x, y, [m, m, m]); //Sets red, green, and blue values of pixel at coordinate x,y to the mean
    }
  }

  return imageCopy;
}

//highlightEdges(inputImage: loaded image): image with edges highlighted
function highlightEdges(inputImage){
  let imageCopy = inputImage.copy(); //Creates a copy of the input image to be edited

  //Two for loops iterate through the pixel grid of the picture
  for (let x = 0; x < inputImage.width; ++x){
    for (let y = 0; y < inputImage.height; ++y){
      let m1 = 0;
      let m2 = 0;
      let colorArray1 = inputImage.getPixel(x, y); //Returns an array of the intensity of red, green, and blue pixels at x,y coordinate
      //Takes the mean of the pixel's red, green, and blue values at current x,y coordinate
      m1 = (colorArray1[0] + colorArray1[1] + colorArray1[2])/3; 
    
      if (x+1 < inputImage.width){ //Checks if x+1 is out of the width boundary
        let colorArray2 = inputImage.getPixel(x+1, y); //Returns an array of the intensity of red, green, and blue pixels at x+1,y coordinate
        //Takes the mean of the pixel's red, green, and blue values at current x+1,y coordinate
        m2 = (colorArray2[0] + colorArray2[1] + colorArray2[2])/3;
      }
      else{
        m2 = m1; //If x+1 is out of bounds, set the second mean eqaul to the first mean (makes border black)
      }
      //Sets red, green, and blue values of pixel at coordinate x,y to the absolute value of the difference between the two adjacent means
      imageCopy.setPixel(x, y, [Math.abs(m1 - m2) , Math.abs(m1 - m2), Math.abs(m1 - m2)]); 
    }
  }
  return imageCopy;
}

//blur(inputImage: loaded image): blurred image
function blur(inputImage){
  let imageCopy = inputImage.copy(); //Creates a copy of the input image to be edited
  let indexLast = 0; //Holds x value for the last pixel used
  let reds = []; //Array of red values for adjacent pixels
  let greens = []; //Array of green values for adjacent pixels
  let blues = []; //Array of blue values for adjacent pixels

  //Two for loops iterate through the pixel grid of the picture
  for (let y = 0; y < inputImage.height; ++y){
    for (let x = 0; x < inputImage.width; ++x){
      let count = 0; //Used to count up to 5 pixels to the right
      let sumR = 0; //Used to add sum of red values for adjacent pixels
      let sumG = 0; //Used to add sum of green values for adjacent pixels
      let sumB = 0; //Used to add sum of blue values for adjacent pixels

      //If starting a new row of pixels make a new array
      if (x === 0){
        reds = [];
        greens = [];
        blues = [];
        indexLast = 0;
      }

      //Starts at the last x coordinate used and adds red, green, and blue values to arrays
      for (let n = indexLast; n < inputImage.width; ++n){

        //Adds the color values of 5 adjacent pixels to arrays- first column only
        if (count === 6){
          break;
        }

        // If not in first column adds color values of 1 adjacent pixel to arrays
        if (x!==0 && count === 1){
          break;
        }

        //Adds color values of pixel to respective arrays
        let colorArray = inputImage.getPixel(n, y);
        reds.push(colorArray[0]);
        greens.push(colorArray[1]);
        blues.push(colorArray[2]);
        
        ++count;
        ++indexLast;
      }

      //Starts at index of current x coordinate and adds 5 values stored in array after it
      let countR = 0;
      for (let i = x; i < reds.length; ++i){
        sumR = sumR + reds[i];
        sumG = sumG + greens[i];
        sumB = sumB + blues[i];
        ++countR;
      }
      
      //Starts at 1 x coordinate before current and adds up to 4 values stored in array before it
      let countL = 0; 
      for (let i = x-1; i >= 0; --i){
        if (countL === 5){
          break;
        }
        sumR = sumR + reds[i];
        sumG = sumG + greens[i];
        sumB = sumB + blues[i];
        ++countL;
      } 

        //Average of calculated coloy values of adjacent pixels 
        let r = (sumR)/(countR + countL);
        let g = (sumG)/(countR + countL);
        let b = (sumB)/(countR + countL);

      //Sets pixel of copied image at coordinate x,y to the means for red, green, and blue from helper function
      imageCopy.setPixel(x, y, [r, g, b]); 
    }
  }
  return imageCopy;
}


test('removeBlueAndGreen function definition is correct', function() {
const white = lib220.createImage(10, 10, [1,1,1]);
removeBlueAndGreen(white).getPixel(0,0);
// Need to use assert
});

test('No blue or green in removeBlueAndGreen result', function() {
// Create a test image, of size 10 pixels x 10 pixels, and set it to all white.
const white = lib220.createImage(10, 10, [1,1,1]);
// Get the result of the function.
const shouldBeRed = removeBlueAndGreen(white);
// Read the center pixel.
const pixelValue = shouldBeRed.getPixel(5, 5);
// The red channel should be unchanged.
assert(pixelValue[0] === 1);
// The green channel should be 0.
assert(pixelValue[1] === 0);
// The blue channel should be 0.
assert(pixelValue[2] === 0);
});

function pixelEq (p1, p2) {
const epsilon = 0.002;
for (let i = 0; i < 3; ++i) {
if (Math.abs(p1[i] - p2[i]) > epsilon) {
return false;
}
}
return true;
};

test('Check pixel equality', function() {
const inputPixel = [0.5, 0.5, 0.5]
// Create a test image, of size 10 pixels x 10 pixels, and set it to the inputPixel
const image = lib220.createImage(10, 10, inputPixel);
// Process the image.
const outputImage = removeBlueAndGreen(image);
// Check the center pixel.
const centerPixel = outputImage.getPixel(5, 5);
assert(pixelEq(centerPixel, [0.5, 0, 0]));
// Check the top-left corner pixel.
const cornerPixel = outputImage.getPixel(0, 0);
assert(pixelEq(cornerPixel, [0.5, 0, 0]));
});


test('highlight edges', function() {
const inputPixel = [0.0, 0.0, 0.0]
// Create a test image, of size 10 pixels x 10 pixels, and set it to the inputPixel
const image = lib220.createImage(10, 1, inputPixel);
for (let i = 0; i<5; ++i){
  image.setPixel(i, 0, [1.0, 1.0, 1.0]);
}
// Process the image.
const output = highlightEdges(image);
let outpix = output.getPixel(4,0);
assert(pixelEq(outpix, [1.0, 1.0, 1.0]));

outpix = output.getPixel(5,0);
assert(pixelEq(outpix, [0.0, 0.0, 0.0]));
});

test('blur image', function() {
// Create a test image, of size 10 pixels x 10 pixels, and set it to the inputPixel
const image = lib220.createImage(11, 1, [0.6, 0.6, 0.6]);
for (let i = 0; i<5; ++i){
  image.setPixel(i, 0, [0.2, 0.2, 0.2]);
}
image.setPixel(5, 0, [0.8, 0.8, 0.8]);
// Process the image.
const output = blur(image);
let outpix = output.getPixel(5,0);
assert(pixelEq(outpix, [0.4363636364, 0.4363636364, 0.4363636364]));

outpix = output.getPixel(8,0);
assert(pixelEq(outpix, [0.525, 0.525, 0.525]));

});