/*
 * Copyright (C) 2010 MindCat. All Rights Reserved.
 *
 * http://d.hatena.ne.jp/mindcat/
 */

function canvas_image_magnify() {
  var cvs = document.getElementById("canvas");
  var g = cvs.getContext("2d");

  function test() {
    var SC = 9/16;
    var W = 160;
    var H = SC * W;

    var img = new Image;
    function draw(srcp, sc, dx, dy) {
      g.drawImage(img, srcp, srcp, sc, sc*SC, dx, dy, W, H);
    }
    img.onload = function () {
      g.drawImage(img, 0, 0);
      var p = 2.9;
      var x1 = 50, x2 = 220, x3 = 390;
      var y1 =  0, y2 = 100, y3 = 200;

      draw(p, 32, x1, y1); draw(p,  16, x2, y1); draw(p,   8, x3, y1);
      draw(p,  4, x1, y2); draw(p,   2, x2, y2); draw(p,   1, x3, y2);
      draw(p, .5, x1, y3); draw(p, .25, x2, y3); draw(p,.125, x3, y3);
      //  5,  10,  20
      // 40,  80,  160
      //320, 640, 1280
    };
    img.src = "images/griddot.png"; // 40x40 size
  }

  test();
}


