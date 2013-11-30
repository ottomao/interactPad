/*
 * Canvas globalCompositeOperation tests
 *
 * Copyright (C) 2010 mindcat http://d.hatena.ne.jp/mindcat/
 */

function clear_canvas(g) {
  g.clearRect(0, 0, 400, 400);
}

function clear_all() {
  for (var y = 0; y < 6; y++) {
    for (var x = 0; x < 8; x++) {
      var cvs = document.getElementById("cvs" + y + x);
      var g = cvs.getContext("2d");
      clear_canvas(g);
    }
  }
}

function paint(y, x, op, alpha, globalAlpha) {
  var cvs = document.getElementById("cvs" + y + x);
  var g = cvs.getContext("2d");
  clear_canvas(g);
  alpha = (alpha === undefined) ? 1.0 : alpha;
  globalAlpha = (globalAlpha === undefined) ? 1.0 : globalAlpha;
  try {
    g.save();
    g.clearRect(5, 5, 90, 90);
    // comment outed for Opera workaround
    //g.beginPath(); g.rect(5, 5, 90, 90); g.clip(); 
    g.globalAlpha = globalAlpha;
    g.fillStyle = "rgba(0,0,255," + alpha + ")";
    g.fillRect(5, 5, 65, 65);
    g.globalCompositeOperation = op;
    g.fillStyle = "rgba(255,0,0," + alpha + ")";
    g.beginPath(); g.arc(60, 60, 35, 0, 2 * Math.PI, true); g.fill();

    g.globalAlpha = 1.0;
    g.globalCompositeOperation = "source-over";
    g.font = "normal 8pt sans-serif";
    g.fillStyle = "yellow";
    g.fillText(op, 10, 20);
  } catch (ex) {
      //AssertNoException(ex);
  } finally {
    g.restore();
  }
}

function canvas_composite_test() {
  try {
      var a =  0.7;       // alpha
      var ga = 0.7;       // globalAlpha
      var x = 0;
      var y = 0;
      paint(y, x++, "source-atop");
      paint(y, x++, "source-in"); 
      paint(y, x++, "source-out");
      paint(y, x++, "source-over");
      paint(y, x++, "destination-atop");
      paint(y, x++, "destination-in");
      paint(y, x++, "destination-out");
      paint(y, x++, "destination-over");

      x = 0;
      y++;
      paint(y, x++, "source-atop",      a);
      paint(y, x++, "source-in",        a);
      paint(y, x++, "source-out",       a);
      paint(y, x++, "source-over",      a);
      paint(y, x++, "destination-atop", a);
      paint(y, x++, "destination-in",   a);
      paint(y, x++, "destination-out",  a);
      paint(y, x++, "destination-over", a);

      x = 0;
      y++;
      paint(y, x++, "lighter");
      paint(y, x++, "copy");
      paint(y, x++, "xor");
      paint(y, x++, "darker");  // non specified spec
      paint(y, x++, "lighter",         a);
      paint(y, x++, "copy",            a);
      paint(y, x++, "xor",             a);
      paint(y, x++, "darker",          a); // non specified spec

      //-----------------------------------------------------------
      x = 0;
      y++;
      paint(y, x++, "source-atop",      1.0, ga);
      paint(y, x++, "source-in",        1.0, ga);
      paint(y, x++, "source-out",       1.0, ga);
      paint(y, x++, "source-over",      1.0, ga);
      paint(y, x++, "destination-atop", 1.0, ga);
      paint(y, x++, "destination-in",   1.0, ga);
      paint(y, x++, "destination-out",  1.0, ga);
      paint(y, x++, "destination-over", 1.0, ga);

      x = 0;
      y++;
      paint(y, x++, "source-atop",      a, ga);
      paint(y, x++, "source-in",        a, ga);
      paint(y, x++, "source-out",       a, ga);
      paint(y, x++, "source-over",      a, ga);
      paint(y, x++, "destination-atop", a, ga);
      paint(y, x++, "destination-in",   a, ga);
      paint(y, x++, "destination-out",  a, ga);
      paint(y, x++, "destination-over", a, ga);

      x = 0;
      y++;
      paint(y, x++, "lighter",         1.0, ga);
      paint(y, x++, "copy",            1.0, ga);
      paint(y, x++, "xor",             1.0, ga);
      paint(y, x++, "darker",            a, ga); // non specified spec
      paint(y, x++, "lighter",           a, ga);
      paint(y, x++, "copy",              a, ga);
      paint(y, x++, "xor",               a, ga);
      paint(y, x++, "darker",            a, ga); // non specified spec
  } finally {
    // g.restore();
  }
}
