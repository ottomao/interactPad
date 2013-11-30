/*
 * Copyright (C) 2010 MindCat. All Rights Reserved.
 *
 * http://d.hatena.ne.jp/mindcat/
 */

function canvas_pixscale() {
  var cvs = document.getElementById("canvas");
  var g = cvs.getContext("2d");
  var w = cvs.width;   // parseInt(window.getComputedStyle(cvs, null).width);
  var h = cvs.height;  // parseInt(window.getComputedStyle(cvs, null).height);
  
  var cvs2 = document.getElementById("canvas2");
  var g2 = cvs2.getContext("2d");
  var w2 = cvs2.width;  // parseInt(window.getComputedStyle(cvs2, null).width);
  var h2 = cvs2.height; // parseInt(window.getComputedStyle(cvs2, null).height);

  clear(g, w, h);
  clear(g2, w2, h2);

  /*
   * Clear the canvas and draw grid background.
   */
  function clear(g, w, h) {
    try {
      g.save();
      draw_grid(g, w, h, "#aaa", "#888", "#ddd");
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
    for (var y = 0; y <= height; y += 25) {
      g.beginPath();
      g.strokeStyle = (y % 100 == 0) ? line100 : line50;
      g.lineWidth   = (y % 100 == 0) ? 1 : ((y % 50 == 0) ? 0.8 : 0.4);
      g.moveTo(0, y);
      g.lineTo(width, y);
      g.stroke();
    }
    for (var x = 0; x <= width; x += 25) {
      g.beginPath();
      g.strokeStyle = (x % 100 == 0) ? line100 : line50;
      g.lineWidth   = (x % 100 == 0) ? 1 : ((x % 50 == 0) ? 0.8 : 0.4);
      g.moveTo(x, 0);
      g.lineTo(x, height);
      g.stroke();
    }
  }

  function draw_line(g, x1, y1, x2, y2, style, w) {
    try {
      g.save();
      g.beginPath();
      g.strokeStyle = style;
      g.lineWidth = w;
      g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
      g.closePath();
    } finally {
      g.restore();
    }
  }

  function createScaledImageData(g, x, y, w, h, scale) {
    var idat = g.getImageData(x, y, w, h);
    var pix = idat.data;
    var w2 = w * scale;
    var h2 = h * scale;
    var idat2 = g.createImageData(w2, h2);
    var pix2 = idat2.data;
    for (var j = 0; j < h2; j++) {
      for (var i = 0; i < w2; i++) {
        var p = 4 * (j * w2 + i);
        var i0 = Math.floor(i / scale);
        var j0 = Math.floor(j / scale);
        var p0 = 4 * (j0 * w + i0);
        pix2[p    ] = pix[p0];
        pix2[p + 1] = pix[p0 + 1];
        pix2[p + 2] = pix[p0 + 2];
        pix2[p + 3] = pix[p0 + 3];
      }
    }
    return idat2;
  }

  function magnify() {
    g2.putImageData(createScaledImageData(g, 0, 0, 50, 50, 10), 0, 0);
  }

  function clear_all() {
    clear(g, w, h);
    clear(g2, w2, h2);
  }

  function test_line(w) {
    var color = "red";
    draw_line(g, 15.0, 4, 15.0, 25, color, w);
    draw_line(g, 18.3, 4, 18.3, 25, color, w);
    draw_line(g, 20.5, 4, 20.5, 25, color, w);
    draw_line(g, 22.7, 4, 22.7, 25, color, w);
    
    draw_line(g, 2, 2, 50, 2, "red", w);
    draw_line(g, 6, 5, 50, 20, "green", w);
    draw_line(g, 8, 8, 50, 50, "blue", w);
    draw_line(g, 5, 6, 20, 50, "red", w);
    draw_line(g, 2, 2, 2,  50, "green", w);

    //draw_line(g, 25.5,25, 25.5, 50, "black", w);
    //draw_line(g, 30,40.3, 50, 40.3, "black", 0.29);
  }

  function test_line2(w) {
    for (var i = 0; i < 20; i += 1.5) {
      var x = i + 2.2;
      draw_line(g, x, 2, x, 25, "blue", w);
    }
  }

  function test_fill(w) {
    for (var x = 0, n = 0; x < 50; x += w, n++) {
      var p = x + w/2;
      draw_line(g, p, 0, p, 50, (n % 2 == 0) ? "blue" : "red", w);
    }
  }

  function test_fill2() {
    //      0.00781250000000000000; 1/128
    //      0.00392156862745098039; 1/255
    //      0.00390625000000000000; 1/256
    var w = 0.0043;
    //var w =   0.0039062509; // Firefox
    for (var x = 0, n = 0; x < 50; x += w, n++) {
      var p = x + w/2;
      draw_line(g, p, 0, p, 50, (n % 2 == 0) ? "blue" : "red", w);
    }
  }

  function test_fill_rect() {
    try {
      g.save();
      g.fillStyle = "green";
      g.fillRect( 5,    5,    5, 5);
      g.fillRect(15.5,  5,    5, 5);
      g.fillRect( 5,   15.5,  5, 5);
      g.fillRect(15.5, 15.5,  5, 5);
    } finally {
      g.restore();
    }
  }

  function test_clip() {
    try {
      g.save();
      g.fillStyle = "red";
      g.beginPath();
      g.arc(12, 12, 10, 0, Math.PI*2, false);
      g.clip();
      g.fillRect(0, 0, 30, 30);
      g.closePath();
    } finally {
      g.restore();
    }
  }

  function test_text() {
    try {
      g.save();
      
      g.beginPath();
      g.fillStyle = "Green";
      g.textBaseline = "top";
      g.font = "Bold Italic 20px serif";
      g.fillText("G", 1, 1.5);
      g.closePath();

      g.beginPath();
      g.strokeStyle = "Blue";
      g.fillStyle = "Blue";
      g.textBaseline = "top";
      g.font = "Bold Italic 20px serif";
      g.strokeText("G", 20, 1.5);
      
      g.closePath();
      
    } finally {
      g.restore();
    }
  }

  return {
    clear: function () {
      clear_all();
    },
    line: function (w) {
      clear_all();
      test_line(w);
      magnify();
    },
    line2: function (w) {
      clear_all();
      test_line2(w);
      magnify();
    },
    fill: function (w) {
      clear_all();
      test_fill(w);
      magnify();
    },
    fill2: function () {
      clear_all();
      test_fill2();
      magnify();
    },
    fill_rect: function () {
      clear_all();
      test_fill_rect();
      magnify();
    },
    clip: function () {
      clear_all();
      test_clip();
      magnify();
    },
    text: function () {
      clear_all();
      test_text();
      magnify();
    }
  };
}
