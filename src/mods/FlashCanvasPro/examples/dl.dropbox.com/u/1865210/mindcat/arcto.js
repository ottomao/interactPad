/*
 * Copyright (C) 2010 MindCat. All Rights Reserved.
 *
 * http://d.hatena.ne.jp/mindcat/
 */

function canvas_arcTo_test() {
  var elem1 = document.getElementById("canvas1");
  var g1 = elem1.getContext("2d");
  var w1 = elem1.width;  // parseInt(window.getComputedStyle(elem1, null).width);
  var h1 = elem1.height; // parseInt(window.getComputedStyle(elem1, null).height);

  var elem2 = document.getElementById("canvas2");
  var g2 = elem2.getContext("2d");
  var w2 = elem2.width;  // parseInt(window.getComputedStyle(elem2, null).width);
  var h2 = elem2.height; // parseInt(window.getComputedStyle(elem2, null).height);
  
  clear(g1, w1, h1);
  clear(g2, w2, h2);

  test_face(g1, elem1, w1, h1);
  test_anim(g2, elem2, w2, h2);
  
  /*   1,1  x,1   2,1
   *     +---+---+
   *     |       |
   * 1,y +  x,y  + 2,y
   *     |       |
   * 1,2 +---+---+ 2,2
   *        x,2  
   */
  function circle1(g, x, y, r, opt) {
    var x1 = -r;
    var x2 = r;
    var y1 = -r;
    var y2 = r;
    test_arcTo(g, x,y,  x1,0,  x1,y1,  0,y1,  r, opt);
    test_arcTo(g, x,y,  0,y1,  x2,y1,  x2,0,  r, opt);
    test_arcTo(g, x,y,  x2,0,  x2,y2,  x,y2,  r, opt);
    test_arcTo(g, x,y,  x,y2,  x1,y2,  x1,0,  r, opt);
  }
  function circle2(g, x, y, r, opt) {
    var x1 = -r;
    var x2 = r;
    var y1 = -r;
    var y2 = r;
    test_arcTo(g, x,y, 0,y1, 1000,0, 0,y2, r, opt);
    test_arcTo(g, x,y, 0,y1, -1000,0, 0,y2, r, opt);
  }
  function circle3(g, x, y, r, opt) {
    var x1 = -r;
    var x2 = r;
    var y1 = -r;
    var y2 = r;
    test_arcTo(g, x,y, x1,0, 0,-1000, x2,0, r, opt);
    test_arcTo(g, x,y, x1,0, 0,1000, x2,0, r, opt);
  }

  function test_face(g, elem, w, h) {
    try {
      g.save();
      g.translate(150, 150);
      g.scale(0.8, 0.8);

      // outline of face
      circle1(g, 0,0, 150);

      // right eye
      circle2(g, -60,-30, 20, { strokeStyle: "blue"} );
      circle2(g, -60,-30, 1, { strokeStyle: "#088"} );
      test_arcTo(g, -85,-70, 0,0, 25,-20, 50,0, 40, { strokeStyle: "brown" } );
      
      // left eye
      circle3(g,  60,-30, 20, { strokeStyle: "green"} );
      //circle3(g,  60,-30, 0, { strokeStyle: "#880"} );
      test_arcTo(g, 60,-30, 0,0, 0,0, 50,0, 50, { strokeStyle: "#880"} );
      test_arcTo(g, 40,-70, 0,0, 25,-20, 50,0, 40, { strokeStyle: "brown" } );

      // nose
      test_arcTo(g, 0,-20, 0,0, -30,90, 0,80, 15);
      test_arcTo(g, 0,-20, 0,0,  30,90, 0,80, 15);

      // mouth
      test_arcTo(g, 0,0, -100,50, 0,140, 100,50, 145, { strokeStyle: "red" } );
      test_arcTo(g, 0,0, -100,50, 0,250, 100,50, 110, { strokeStyle: "red" } );

      // streight lines
      test_arcTo(g, -120,10, 0,0, 30,0, 50,0, 10, { strokeStyle: "#0a0" });
      test_arcTo(g, -120,25, 0,0, 50,0, 50,0, 10, { strokeStyle: "#08f" });
      test_arcTo(g, -120,40, 0,0, 50,0, 30,0, 10, { strokeStyle: "#a0f" });

      test_arcTo(g, 80,10, 0,0, 30,0, 50,50, 0, { strokeStyle: "#f8f" });
      test_arcTo(g, 80,30, 0,0, 0,0,  50,50, 20, { strokeStyle: "#444" });
      test_arcTo(g,100,30, 0,0, 0,0,  50,50, 0, { strokeStyle: "#888" });

      test_arcTo(g,100,80, 0,0, 50,0,  0,0, 0, { strokeStyle: "blue" });
      
    } finally {
      g.restore();
    }
  }

  function test_anim(g, elem, w, h) {
    var cx = 200;
    var cy = 200;
    var len1 = 150;
    var len2 = 120;
    var radius = 35;
    var cnt = 0;
    var timer;
    var started = false;

    var msgx = 50;
    var msgy = 350;

    draw();
    
    elem.onclick = function (evt) {
      if (started) {
        clearInterval(timer);
        timer = null;
        clear(g, w, h);
        draw();
      } else {
        timer = setInterval(draw, 150);
      }
      started = !started;
    };
    
    function draw() {
      clear(g, w, h);
      var ang1 = cnt * Math.PI / 180;
      var ang2 = (ang1 + Math.PI) / 4;
      var x0 = len1 * Math.cos(ang1);
      var y0 = len1 * Math.sin(ang1);
      var x1 = len2 * Math.cos(ang2);
      var y1 = len2 * Math.sin(ang2);
      test_arcTo(g, cx,cy, x0,y0, 0,0, x1,y1, radius, { guide: 1} );
      cnt += 15;
      cnt %= 360 * 4;
    }
  }

  /*
   * Clear the canvas and draw grid background.
   */
  function clear(g, w, h) {
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

  function test_arcTo(g, x, y, x0, y0, x1, y1, x2, y2, r, option) {
    try {
      g.save();
      g.translate(x, y);

      option = option || {};
      g.strokeStyle = option.strokeStyle || "#f80";
      g.lineWidth = option.lineWidth || 12;
      
      g.beginPath();
      g.lineCap = "round";
      g.moveTo(x0, y0);
      try {
        g.arcTo(x1, y1, x2, y2, r);
        g.stroke();
      } catch (ex) {
        if (r == 0) {
          try {
            g.save();
            g.strokeStyle = "magenta";
            g.lineWidth = 5;
            g.arcTo(x1, y1, x2, y2, 0.01);
            g.stroke();
          } finally {
            g.restore();
          }
        }
      }

      if (option.guide) {
        g.beginPath();
        g.strokeStyle = "blue";
        g.lineWidth = 2;
        g.moveTo(x0, y0);
        g.lineTo(x1, y1);
        g.lineTo(x2, y2);
        g.stroke();
      }
      
    } catch (ex2) {
      alert("Exception: " + ex2);
    } finally {
      g.restore();
    }
  }
}
