function calculatePosition(el) {
  var rect = el.getBoundingClientRect();
  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
  };
}

function move(ballDom) {
  window.moveID && clearInterval(window.moveID);
  window.moveID = setInterval(() => {
    moveDot(ballDom, window.direction);
  }, window.intervalTime);
}

function nextDirection() {
  switch (window.direction) {
    case "right-down":
      if (window.hittedBar === "bottom") {
        return "right-up";
      }
      if (window.hittedBar === "right") {
        return "left-down";
      }
    case "right-up":
      if (window.hittedBar === "right") {
        return "left-up";
      }
      if (window.hittedBar === "top") {
        return "right-down";
      }
    case "left-down":
      if (window.hittedBar === "left") {
        return "right-down";
      }
      if (window.hittedBar === "bottom") {
        return "left-up";
      }
    case "left-up":
      if (window.hittedBar === "left") {
        return "right-up";
      }
      if (window.hittedBar === "top") {
        return "left-down";
      }
    default:
      return "";
  }
}

function hideBall(ballDom) {
  ballDom.style.display = "none";
}

function isHitHole(dotPosition, barPosition) {
  switch (barPosition) {
    case "top":
    case "bottom":
      if (
        dotPosition.left >= window.mapPosition.left + window.holeRadius &&
        dotPosition.right <= window.mapPosition.right - window.holeRadius
      ) {
        return false;
      }
      return true;
    case "left":
    case "right":
      if (
        dotPosition.top >= window.mapPosition.top + window.holeRadius &&
        dotPosition.bottom <= window.mapPosition.bottom - window.holeRadius
      ) {
        return false;
      }
      return true;
    default:
      return false;
  }
}

function checkHitBorder(ballDom) {
  var dotPosition = calculatePosition(ballDom);
  if (dotPosition.top - window.mapPosition.top <= window.delta) {
    window.hittedBar = "top";
    if (isHitHole(dotPosition, "top")) {
      window.moveID && clearInterval(window.moveID);
      hideBall(ballDom);
    } else {
      window.direction = nextDirection();
      move(ballDom);
    }
  }
  if (window.mapPosition.right - dotPosition.right <= window.delta) {
    window.hittedBar = "right";
    if (isHitHole(dotPosition, "right")) {
      window.moveID && clearInterval(window.moveID);
      hideBall(ballDom);
    } else {
      window.direction = nextDirection();
      move(ballDom);
    }
  }
  if (window.mapPosition.bottom - dotPosition.bottom <= window.delta) {
    window.hittedBar = "bottom";
    if (isHitHole(dotPosition, "bottom")) {
      window.moveID && clearInterval(window.moveID);
      hideBall(ballDom);
    } else {
      window.direction = nextDirection();
      move(ballDom);
    }
  }
  if (dotPosition.left - window.mapPosition.left <= window.delta) {
    window.hittedBar = "left";
    if (isHitHole(dotPosition, "left")) {
      window.moveID && clearInterval(window.moveID);
      hideBall(ballDom);
    } else {
      window.direction = nextDirection();
      move(ballDom);
    }
  }
}

function moveDot(ballDom, direction) {
  if (!ballDom) {
    return;
  }
  var stepRanges = window.directionStepRangeMapping[direction];
  var topValue = 0;
  var leftValue = 0;
  if (ballDom.style.top) {
    topValue = Number(ballDom.style.top.split("px")[0]);
  }
  if (ballDom.style.left) {
    leftValue = Number(ballDom.style.left.split("px")[0]);
  }
  ballDom.style.top = topValue + stepRanges.top + "px";
  ballDom.style.left = leftValue + stepRanges.left + "px";
  checkHitBorder(ballDom);
}

window.onresize = function () {
  var mapDom = document.querySelector(".map");
  var rect = calculatePosition(mapDom);
  window.mapPosition = {
    top: rect.top + 2,
    right: rect.right - 2,
    bottom: rect.bottom - 2,
    left: rect.left + 2,
  };
};

function calculateMapSize(mapDom) {
  var maxMapWidth = screen.width - 44;
  var maxMapHeight = screen.height - 44;
  var height = 0;
  if (maxMapWidth / maxMapHeight >= 2) {
    height = maxMapHeight;
  } else {
    height = parseInt(maxMapWidth / 2);
  }
  mapDom.style.width = height * 2 + "px";
  mapDom.style.height = height + "px";
}

document.addEventListener("DOMContentLoaded", function () {
  var ballDom = document.querySelector(".ball");
  var mapDom = document.querySelector(".map");
  calculateMapSize(mapDom);
  var rect = calculatePosition(mapDom);
  window.mapPosition = {
    top: rect.top + 2,
    right: rect.right - 2,
    bottom: rect.bottom - 2,
    left: rect.left + 2,
  };
  window.intervalTime = 1;
  window.direction = "right-down";
  window.delta = 0.01;
  window.holeRadius = 20;
  window.initX = 1.35;
  window.initY = 2.89;
  window.directionStepRangeMapping = {
    "right-down": {
      top: window.initY,
      left: window.initX,
    },
    "right-up": {
      top: 0 - window.initY,
      left: window.initX,
    },
    "left-down": {
      top: window.initY,
      left: 0 - window.initX,
    },
    "left-up": {
      top: 0 - window.initY,
      left: 0 - window.initX,
    },
  };
  move(ballDom);
});
