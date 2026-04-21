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
