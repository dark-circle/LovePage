var $window = $(window),
  $happyHeart,
  gardenCtx,
  gardenCanvas,
  $garden,
  garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function () {
  $happyHeart = $("#happyHeart");
  $garden = $("#garden");
  gardenCanvas = $garden[0];
  gardenCanvas.width = $happyHeart.width();
  gardenCanvas.height = $happyHeart.height();
  gardenCtx = gardenCanvas.getContext("2d");
  gardenCtx.globalCompositeOperation = "lighter";
  garden = new Garden(gardenCtx, gardenCanvas);

  setInterval(function () {
    garden.render();
  }, Garden.options.growSpeed);

  $(document).click(function () {
    showClickImage();
  });
});

$(window).resize(function () {
  var width = $(window).width();
  var height = $(window).height();
  if (width != clientWidth && height != clientHeight) {
    location.replace(location);
  }
});

function getHeartPoint(angle) {
  var point = angle / Math.PI;
  var x = 19.5 * (16 * Math.pow(Math.sin(point), 3));
  var y =
    -20 *
    (13 * Math.cos(point) -
      5 * Math.cos(2 * point) -
      2 * Math.cos(3 * point) -
      Math.cos(4 * point));
  return [offsetX + x, offsetY + y];
}

function startHappyAnimation() {
  var interval = 50;
  var angle = 10;
  var bloomPoints = [];
  var animation = setInterval(function () {
    var point = getHeartPoint(angle);
    var canCreateBloom = true;
    for (var i = 0; i < bloomPoints.length; i++) {
      var bloomPoint = bloomPoints[i];
      var distance = Math.sqrt(
        Math.pow(bloomPoint[0] - point[0], 2) +
          Math.pow(bloomPoint[1] - point[1], 2)
      );
      if (distance < Garden.options.bloomRadius.max * 1.3) {
        canCreateBloom = false;
        break;
      }
    }
    if (canCreateBloom) {
      bloomPoints.push(point);
      garden.createRandomBloom(point[0], point[1]);
    }
    if (angle >= 30) {
      clearInterval(animation);
      showMessages();
    } else {
      angle += 0.2;
    }
  }, interval);
}

(function ($) {
  $.fn.typewriter = function () {
    this.each(function () {
      var $element = $(this);
      var content = $element.html();
      var index = 0;
      $element.html("");
      var timer = setInterval(function () {
        var current = content.substr(index, 1);
        if (current == "<") {
          index = content.indexOf(">", index) + 1;
        } else {
          index++;
        }
        $element.html(content.substring(0, index) + (index & 1 ? "_" : ""));
        if (index >= content.length) {
          clearInterval(timer);
        }
      }, 75);
    });
    return this;
  };
})(jQuery);

function timeElapse(date) {
  var now = Date();
  var seconds = (Date.parse(now) - Date.parse(date)) / 1000;
  var days = Math.floor(seconds / (3600 * 24));
  seconds = seconds % (3600 * 24);
  var hours = Math.floor(seconds / 3600);
  if (hours < 10) {
    hours = "0" + hours;
  }
  seconds = seconds % 3600;
  var minutes = Math.floor(seconds / 60);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  seconds = seconds % 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var html =
    '<span class="digit">' +
    days +
    '</span> days <span class="digit">' +
    hours +
    '</span> hours <span class="digit">' +
    minutes +
    '</span> minutes <span class="digit">' +
    seconds +
    "</span> seconds";
  $("#elapseClock").html(html);
}

function showMessages() {
  adjustWordsPosition();
  $("#messages").fadeIn(5000, function () {
    showHappyForever();
  });
}

function adjustWordsPosition() {
  $("#words").css("position", "absolute");
  $("#words").css("top", $("#garden").position().top + 195);
  $("#words").css("left", $("#garden").position().left + 70);
}

function showHappyForever() {
  $("#happyForever").fadeIn(3000);
}

function getClickImageElement() {
  var $image = $("#clickImage");
  if (!$image.length) {
    $image = $(
      '<img id="clickImage" src="images/test2.png" alt="LiangBi and HanYiQing" />'
    );
    $("body").append($image);
  }
  return $image;
}

function getImageContentBounds(image) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  if (!context) {
    return null;
  }
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  context.drawImage(image, 0, 0);

  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  var pixels = imageData.data;
  var corners = [
    [0, 0],
    [canvas.width - 1, 0],
    [0, canvas.height - 1],
    [canvas.width - 1, canvas.height - 1],
  ];
  var background = { red: 0, green: 0, blue: 0 };

  for (var i = 0; i < corners.length; i++) {
    var x = corners[i][0];
    var y = corners[i][1];
    var index = (y * canvas.width + x) * 4;
    background.red += pixels[index];
    background.green += pixels[index + 1];
    background.blue += pixels[index + 2];
  }

  background.red /= corners.length;
  background.green /= corners.length;
  background.blue /= corners.length;

  var threshold = 42;
  var bounds = {
    top: canvas.height,
    right: -1,
    bottom: -1,
    left: canvas.width,
  };

  for (var y = 0; y < canvas.height; y++) {
    for (var x = 0; x < canvas.width; x++) {
      var pixelIndex = (y * canvas.width + x) * 4;
      var alpha = pixels[pixelIndex + 3];
      if (alpha === 0) {
        continue;
      }

      var redDiff = pixels[pixelIndex] - background.red;
      var greenDiff = pixels[pixelIndex + 1] - background.green;
      var blueDiff = pixels[pixelIndex + 2] - background.blue;
      var distance = Math.sqrt(
        redDiff * redDiff + greenDiff * greenDiff + blueDiff * blueDiff
      );

      if (distance > threshold) {
        if (x < bounds.left) {
          bounds.left = x;
        }
        if (x > bounds.right) {
          bounds.right = x;
        }
        if (y < bounds.top) {
          bounds.top = y;
        }
        if (y > bounds.bottom) {
          bounds.bottom = y;
        }
      }
    }
  }

  if (bounds.right === -1 || bounds.bottom === -1) {
    return {
      top: 0,
      left: 0,
      width: canvas.width,
      height: canvas.height,
    };
  }

  var padding = 8;
  var left = Math.max(bounds.left - padding, 0);
  var top = Math.max(bounds.top - padding, 0);
  var right = Math.min(bounds.right + padding, canvas.width - 1);
  var bottom = Math.min(bounds.bottom + padding, canvas.height - 1);

  return {
    top: top,
    left: left,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

function drawTrimmedImage(canvas, image) {
  var bounds = getImageContentBounds(image);
  if (!bounds) {
    return false;
  }
  var viewportWidth = Math.floor(window.innerWidth * 0.8);
  var viewportHeight = Math.floor(window.innerHeight * 0.8);
  var scale = Math.min(
    viewportWidth / bounds.width,
    viewportHeight / bounds.height,
    1
  );
  var drawWidth = Math.max(Math.round(bounds.width * scale), 1);
  var drawHeight = Math.max(Math.round(bounds.height * scale), 1);
  var context = canvas.getContext("2d");

  canvas.width = drawWidth;
  canvas.height = drawHeight;
  context.clearRect(0, 0, drawWidth, drawHeight);
  context.drawImage(
    image,
    bounds.left,
    bounds.top,
    bounds.width,
    bounds.height,
    0,
    0,
    drawWidth,
    drawHeight
  );
  return true;
}

function trimClickImage($image) {
  var sourceImage = new Image();
  sourceImage.onload = function () {
    var canvas = document.createElement("canvas");
    if (!drawTrimmedImage(canvas, sourceImage)) {
      $image.data("ready", true);
      return;
    }

    try {
      $image.attr("src", canvas.toDataURL("image/png"));
      $image.data("ready", true);
    } catch (error) {
      $image.data("ready", true);
    }
  };
  sourceImage.onerror = function () {
    $image.data("ready", true);
  };
  sourceImage.src = $image.attr("src");
}

function showClickImage() {
  var $image = getClickImageElement();
  if (!$image.data("trimStarted")) {
    $image.data("trimStarted", true);
    trimClickImage($image);
  }
  $image.fadeIn(300);
}
