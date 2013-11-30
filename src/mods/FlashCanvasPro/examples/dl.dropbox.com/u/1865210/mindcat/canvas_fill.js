/*
 * Copyright (C) 2010 MindCat. All Rights Reserved.
 *
 * http://d.hatena.ne.jp/mindcat/
 */

function canvas_fill_test() {
  var cvs = document.getElementById("canvas");
  var g = cvs.getContext("2d");
  var w = cvs.width;   // parseInt(window.getComputedStyle(cvs, null).width);
  var h = cvs.height;  // parseInt(window.getComputedStyle(cvs, null).height);

  function rect(g, x, y, w, h) {
    g.moveTo(x, y);
    g.lineTo(x + w, y);
    g.lineTo(x + w, y + h);
    g.lineTo(x, y + h);
    g.closePath();
  }

  function test_rect_fill() {
    try {
      g.save();
      g.beginPath();
      g.fillStyle = "green";
      g.strokeStyle = "red";
      g.lineWidth = 2;
      rect(g, 0, 50, 250, 50);
      rect(g, 0, 200, 250, -50);
      g.rect(50,  0, 50, 250);
      g.lineTo(125, 125);
      g.rect(200, 0, -50, 250);
      g.lineTo(125, 125);
    } catch (e) {
      alert("Exception: " + e);
    } finally {
      g.fill();
      g.stroke();
      g.restore();
    }
  }

  return {
    rect_fill: function () {
      test_rect_fill();
    }
  };
}
