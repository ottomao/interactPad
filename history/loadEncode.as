import flash.display.Loader;
import flash.net.URLRequest;
import flash.display.Bitmap;
import com.dynamicflash.util.Base64;
import flash.display.BitmapData
import flash.geom.Rectangle;
 
var loader:Loader;
var req:URLRequest;
var orig_mc:MovieClip;
var copy_mc:MovieClip;
var imgWidth:int;
var imgHeight:int;
var b64Img:String;
 
function loaderCompleteHandler(evt:Event):void {
	trace("Application ::: loaderCompleteHandler");
	var ldr:Loader = evt.currentTarget.loader as Loader;
	var origImg:Bitmap = (ldr.content as Bitmap);
	imgWidth = origImg.width;
	imgHeight = origImg.height;
	var origBmd:BitmapData = origImg.bitmapData;

	var rect:Rectangle = new Rectangle(0,0,origImg.width, origImg.height);
	var ba:ByteArray = origBmd.getPixels(rect);
	trace("    - bytearray length: ", ba.length);
	// Base64 encode - this is what gets stored (in xml or whatever)
	b64Img = Base64.encodeByteArray(ba);
	trace("b64Img: ", b64Img);
	// now (pretend) to load the data
	//loadImageData();
}
 
function loadImageData():void {
	trace("Application: loadImageData");
	// use b64Img as if it was loaded from xml
	// decode Base64 string to ByteArray 
	var ba:ByteArray = Base64.decodeToByteArray(b64Img);
	trace("    - bytearray length: ", ba.length);
	// create Rectangle, same size as original
	var rect:Rectangle = new Rectangle(0, 0, imgWidth, imgHeight);
	// crate BitmapData and throw bytearry at it
	var bmd:BitmapData = new BitmapData(imgWidth,imgHeight, false, 0x00000000);
	bmd.setPixels(rect, ba);
	// create (smooth) bitmap from data
	var bm:Bitmap = new Bitmap(bmd, "auto", true);
	// display bitmap in movieclip
	copy_mc.addChild(bm);
	copy_mc.x = imgWidth + 10;
}
 
loader = new Loader();
req = new URLRequest("dog.jpg");
loader.load(req);
loader.contentLoaderInfo.addEventListener(Event.COMPLETE, loaderCompleteHandler);
orig_mc = new MovieClip();
orig_mc.addChild(loader);
addChild(orig_mc);
copy_mc = new MovieClip();
addChild(copy_mc);