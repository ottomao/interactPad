/*
 * Copyright (C) 2010 MindCat. All Rights Reserved.
 *
 * http://d.hatena.ne.jp/mindcat/
 */

function canvas_shadow_test() {
  var cvs = document.getElementById("canvas");
  var g = cvs.getContext("2d");
  var w = cvs.width;   // parseInt(window.getComputedStyle(cvs, null).width);
  var h = cvs.height;  // parseInt(window.getComputedStyle(cvs, null).height);
  var timer;

  clear();
  test("grad");

  function createLinearGradient(g, x1, y1, x2, y2, alpha) {
    var grad = g.createLinearGradient(x1, y1, x2, y2);
    var N = 10;
    for (var i = 0; i < N; i++) {
      var p = i/(N - 1);
      var c = getHSBColor(p, 1, 1, alpha);
      grad.addColorStop(p, c);
    }
    return grad;
  }

  /*
   * Create HSB color as CSS string.
   */
  function getHSBColor(hue, sat, brt, alpha) {
    var r = 0, g = 0, b = 0;
    if (sat == 0) {
      r = g = b = Math.round(brt * 255);
    } else {
      var h = (hue - Math.floor(hue)) * 6;
      var f = h - Math.floor(h);
      var v = Math.round(255 * brt);
      var p = Math.round(255 * brt * (1 - sat));
      var q = Math.round(255 * brt * (1 - sat * f));
      var t = Math.round(255 * brt * (1 - (sat * (1 - f))));
	
      switch (Math.floor(h)) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
      }
    }
    function hex(x) {
      var v = x.toString(16);
      if (x < 16) {
        return "0" + v;
      } else {
        return v;
      }
    }
    if (!alpha) {
      return "#" + hex(r) + hex(g) + hex(b);
    } else {
      return [ "rgba(",
               String(r), ",",
               String(g), ",",
               String(b), ",",
               String(alpha),
               ")" ].join("");
    }
  }

  /*
   * Clear the canvas and draw grid background.
   */
  function clear() {
    try {
      g.save();
      draw_grid(g, w, h, "#aaa", "#888", "#fff");
    } finally {
      g.restore();
    }
  }

  function draw_grid(g, width, height, line50, line100, bgcolor) {
    g.clearRect(0, 0, width, height);
    if (bgcolor) {
      g.fillStyle = bgcolor;
      g.fillRect(0, 0, width, height);
    }
    for (var y = 0; y <= height; y += 50) {
      g.beginPath();
      g.strokeStyle = (y % 100 == 0) ? line100 : line50;
      g.lineWidth   = (y % 100 == 0) ? 1 : 0.5;
      g.moveTo(0, y);
      g.lineTo(width, y);
      g.stroke();
    }
    for (var x = 0; x <= width; x += 50) {
      g.beginPath();
      g.strokeStyle = (x % 100 == 0) ? line100 : line50;
      g.lineWidth   = (x % 100 == 0) ? 1 : 0.5;
      g.moveTo(x, 0);
      g.lineTo(x, height);
      g.stroke();
    }
  }

  function make_timer(timer2, dur, func) {
    if (timer && timer == timer2) {
      clearInterval(timer);
      timer = null;
      return null;
    } else {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
      }, dur);
      return timer;
    }
  }

  function test(type) {
    var timer2;
    var ang = 0;
    function draw() {
      clear();
      try {
        g.save();
        g.translate(150, 150);
        g.rotate(ang);
        g.translate(-35, -35);
      
        g.shadowColor = "#0f0";
        g.shadowOffsetX = 40;
        g.shadowOffsetY = 40;
        g.shadowBlur = 20;
        var a = Math.sin(ang);
        g.globalAlpha = Math.abs(a);

        switch (type) {
        case "norm":
          g.fillStyle = "navy";
          g.fillRect(0, 0, 100, 100);
          break;
        case "grad":
          g.lineWidth = 30;
          g.strokeStyle = createLinearGradient(g, 0, 0, 100, 100);
          g.strokeRect(0, 0, 70, 70);
          break;
        case "text":
          g.translate(-80, 80);
          g.font = "Bold 80pt Serif";
          g.fillStyle = "red";
          g.fillText("ABC", 0, 0);
          break;
        case "image":
          
          break;
        }
        
      } finally {
        g.restore();
      }
    }
    draw();
    return function () {
      if (timer && timer == timer2) {
        clearInterval(timer);
        timer = timer2 = null;
      } else {
        if (timer) {
          clearInterval(timer);
        }
        timer = timer2 = setInterval(function () {
          ang += 0.2;
          draw();
        }, 100);
      }
    }
  }

  function test_image() {
    var timer2;
    var ang = 0;
    var img = new Image();
    clear();
    img.onload = function () {
      draw();
    };
    img.src = "images/alphatest.png";
    function draw() {
      clear();
      try {
        g.save();
        g.translate(150, 150);
        g.rotate(ang);
        g.translate(-150, -150);

        var a = Math.sin(ang);
        g.globalAlpha = Math.abs(a);

        g.scale(0.8, 0.8);
        g.shadowColor = "#0f0";
        g.shadowOffsetX = 40;
        g.shadowOffsetY = 40;
        g.shadowBlur = 20;
        g.lineWidth = 30;
        g.drawImage(img, 0, 0);
      } finally {
        g.restore();
      }
    }
    return function () {
      if (timer && timer == timer2) {
        clearInterval(timer);
        timer = timer2 = null;
      } else {
        if (timer) {
          clearInterval(timer);
        }
        timer = timer2 = setInterval(function () {
          ang += 0.2;
          draw();
        }, 100);
      }
    }
  }

  return {
    test_norm: test("norm"),
    test_grad: test("grad"),
    test_text: test("text"),
    test_image: test_image()
  };
}
