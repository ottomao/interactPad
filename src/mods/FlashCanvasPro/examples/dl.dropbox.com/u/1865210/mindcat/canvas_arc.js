/*
 * Copyright (C) 2010 MindCat. All Rights Reserved.
 *
 * http://d.hatena.ne.jp/mindcat/
 */

function canvas_arc_test() {
  var cvs = document.getElementById("canvas");
  var g = cvs.getContext("2d");
  var w = cvs.width;   // parseInt(window.getComputedStyle(cvs, null).width);
  var h = cvs.height;  // parseInt(window.getComputedStyle(cvs, null).height);
  var timer;

  clear();

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
  
  function arc(g, x, y, r, a1, a2, acw) {
    a1 = a1 * Math.PI / 180;
    a2 = a2 * Math.PI / 180;
    try {
      g.save();
      {
        g.beginPath();
        g.strokeStyle = "red";
        g.lineWidth = 1;
        g.arc(x, y, r, 0, Math.PI * 2, acw);
        g.stroke();
      }
      {
        g.beginPath();
        g.strokeStyle = "#afa";
        g.fillStyle = "rgba(255,255,0,0.5)";
        g.lineCap = "round";
        g.lineWidth = 10;
        g.arc(x, y, r, a1, a2, acw);
        g.fill();
        g.stroke();
      }
      {
        g.beginPath();
        g.strokeStyle = "blue";
        g.lineWidth = 1;
        g.moveTo(x, y);
        g.arc(x, y, r, a1, a2, acw);
        g.lineTo(x, y);
        g.stroke();
      }
    } finally {
      g.restore();
    }
  }

  function test() {
    arc(g,  50,  50, 40, -30, 100, true);
    arc(g, 150,  50, 40, -30, 100, false);
    arc(g,  50, 150, 40, -30, 100+360, true);
    arc(g, 150, 150, 40, -30-360, 100, false);
  }

  test();
}
