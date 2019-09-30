import { points40 } from "./data";

class Tour {
  constructor(cities) {
    this.cities = cities;
    this.basePoints = this.cities[0];
    this.list = document.getElementById("List");
    this.canvas = document.getElementById("Canvas");
    this.ctx = this.canvas.getContext("2d");

    // Tour limited to 5 for Brute Force approach
    this.shortTour = this.cities.splice(0, 5);
    this.permutations = this.getPermutations(this.shortTour);
    this.renderRoutes();
  }

  /**
   * Get all ordered combinations of an array
   * @param {Array} array - List of all x,y coordinates
   * @return {Array} - Nested array of permutations
   */
  getPermutations(array) {
    function p(array, temp) {
      var i, x;
      if (!array.length) {
        result.push(temp);
      }
      for (i = 0; i < array.length; i++) {
        x = array.splice(i, 1)[0];
        p(array, temp.concat(x));
        array.splice(i, 0, x);
      }
    }

    var result = [];
    p(array, []);
    return result;
  }

  /**
   * Render the coordinates points and the paths on the graph
   * @param {Array} - Array of x,y coordinatess
   */
  renderCoordinates(cities) {
    // start with a fresh canvas
    this.clearCanvas();
    let dist = 0;

    for (let i = 0; i < cities.length; i++) {
      let city = cities[i];
      let nextCity = cities[i + 1];
      let x = city.x;
      let y = city.y;
      this.drawCoordinates(x, y);

      // Render a path only if an existing coordinate exists
      if (typeof nextCity !== "undefined") {
        dist += this.calcPointDistance(x, nextCity.x, y, nextCity.y);
        this.drawPath(x, y, nextCity.x, nextCity.y, i);
      }
    }

    // Add to the list
    this.renderResultsList(dist);
  }

  /**
   * Draws a circle of given coordinates on the graph
   * @param {Number} x - X-axis coordinates
   * @param {Number} y - Y-axis coordinate
   */
  drawCoordinates(x, y) {
    const size = 4;
    const ctx = this.ctx;
    ctx.fillStyle = "#f44336";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, true);
    ctx.fill();
  }

  /**
   * Draws a path from one coordinates to the next
   * @param {Number} x - X-axis coordinate
   * @param {Number} y - Y-axis coordinate
   * @param {Number} a - The next X-axis coordinate
   * @param {Number} b - The next Y-axis coordinate
   */
  drawPath(x, y, a, b) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.lineWidth = "5";
    ctx.strokeStyle = "#ddd";
    ctx.moveTo(x, y);
    ctx.lineTo(a, b);
    ctx.stroke();
  }

  swapPositions(arr, a, b) {
    let temp = arr[a];
    arr[a] = arr[b];
    return (arr[b] = temp);
  }

  renderRoutes() {
    let self = this;
    let copy = this.permutations.splice(0);
    const interval = setInterval(timer, 100);

    function timer() {
      if (!copy.length) {
        clearInterval(interval);
        return;
      }
      let citiesArr = copy.pop();
      self.renderCoordinates(citiesArr);
    }
  }

  renderResultsList(distance) {
    const listItem = document.createElement("li");
    listItem.innerHTML = distance;
    this.list.appendChild(listItem);
  }

  /**
   * Return the distance between 2 coordinates
   * @param {Number} x1 - X-axis coord
   * @param {Number} x2 - X-axis coord next
   * @param {Number} y1 - Y-axis coord
   * @param {Number} y2 - Y-axis coord next
   */
  calcPointDistance(x1, x2, y1, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // TODO: Get the shortest distance and render it out in the DOM
}

const init = new Tour(points40);
