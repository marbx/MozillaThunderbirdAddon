
function turtlePdf(papersize, fontsize){
    this.BAD_characters = "";
    this.BAD_outside = false;
    this._fontsize = fontsize;
    this.writeln = function (txt) {this.writelnUnderline (txt, false)}
    this.writelu = function (txt) {this.writelnUnderline (txt, true)} 
    this.fontsize = function (ff) {this._fontsize = ff}
    this.newline = function () {this._y -= this._fontsize}
    this.writelnUnderline = function (txt, underline) {
	if (this._x >= 0 && this._y >= 0) {
	    var pdf = "    BT  /F1 " + this._fontsize + " Tf  "
		+ this.prpr (this._x) + " " + this.prpr (this._y) + " TD (" + this.escape (txt) + ") Tj  ET\n";
	    if (underline) {
		var x0 = this._x;
		var x1 = this._x + this.stringwidth(txt);
		var y0 = this._y - 0.7;
		var y1 = this._y - 0.7;
		pdf += "    0.2 w          " 
		    + this.prpr(x0) +" "+ this.prpr(y0) +" m\n                   " 
		    + this.prpr(x1) +" "+ this.prpr(y1) +" l S\n";
	    }
	    if (this.writeToNewPage)  
		this.pages.push(pdf); 
	    else                    
		this.pages[this.pages.length-1] += pdf; // append to current page
	    this.writeToNewPage = false;
	    this.newline();
	} else {this.BAD_outside = true;}
    }
    this.moveto = function (x, y) {
	this._x = this.mm2points (x);
	this._y = this.xyMax[1] - this.mm2points (y) - this._fontsize;
    }
    this.newpage = function () {this.writeToNewPage = true}
    this.content = function(){
	this.make_head();    
	this.make_pages();
	this.make_tail();
	return this.out;
    }
    // ........................ private .........................................................
    this.writeToNewPage = true;
    this.xref = "";  	// Byte offset of Pdf objects
    this.out = "";
    this.pages = [];
    switch (papersize) {
    case "A4"     : this.xyMax = [595, 842]; break; 
    case "Letter" : this.xyMax = [612, 792]; break; 
    case "Test"   : this.xyMax = [300, 400];   break; 
    default       : this.xyMax = [595, 842]     
    }
    this._x = 0;                     // leftmost
    this._y = this.xyMax[1] - this._fontsize; // upmost
    this.mm2points = function (mm) { var p = mm; p *= 360; p /= 127; return p; }
    this.prpr =     function (x) { var y = x.toFixed(2); return this.zeroPad(y, 6); }
    this.append = function (txt) { this.out += txt + "\n"; }
    this.Append = function (txt) { // Pdf objects must store their offset
	this.xref += this.zeroPad(this.out.length, 10) + " 00000 n\n"; 
	this.out += txt + "\n";
    }
    // Head requires count of pages 
    // Pages need head to calculate the byte offset
    // Therefore, pages are saved in a list and assembled after head.    
    this.make_head = function () {
	this.xref += "0000000000 65535 f\n";  // First line is header
	this.append ("%PDF-1.7");
	this.Append ("1 0 obj << /Type /Catalog  /Pages 3 0 R >> endobj");
	this.Append ("2 0 obj << /Type/Font/Subtype/Type1/BaseFont/Helvetica/Encoding/WinAnsiEncoding >> endobj");
	this.Append ("3 0 obj << /Type /Pages /MediaBox [ 0 0 "+ this.xyMax[0] +" "+ this.xyMax[1] +" ]"); 
	this.append ("  /Count " + this.pages.length); 
	this.append ("  /Kids [");     
	for (var p = 1; p <= this.pages.length; p += 1) {	
	    this.append ("    " + (p*2 + 2) + " 0 R"); // Head refers to all pages.
	}
	this.append ("  ]");
	this.append (">> endobj");
    }
    this.make_pages = function () {
	for (var pi = 0; pi < this.pages.length; pi++) {
	    var n = (pi+1)*2 + 2;
	    var m = n+1;
	    this.Append (n + " 0 obj << /Type /Page /Parent 3 0 R  /Resources << /Font << /F1 2 0 R >> >>");
	    this.append ("  /Contents " + m + " 0 R");    // Content must be pdf object
	    this.append (">> endobj");
	    this.Append (m + " 0 obj << /Length " + this.pages[pi].length + " >>"); 
	    this.append ("  stream");
	    this.out += this.pages[pi];
	    this.append ("  endstream");
	    this.append ("endobj");
	}
    }
    this.make_tail = function () {    
	var COUNT_objects = this.pages.length*2 + 3;
	var ByteOffset = this.out.length;
	this.append ("xref");
	this.append ("0 " + COUNT_objects);
	this.out += this.xref;
	this.append ("trailer << /Size " + COUNT_objects + " /Root 1 0 R >>");
	this.append ("startxref");
	this.append (ByteOffset);
	this.append ("%%EOF");
    }
    this.zeroPad = function (num, count) {
	var rr = num + '';
	while (rr.length < count) {rr  = "0" + rr}
	return rr;
    }
    this.escape = function (txt) {
	var rr = "";
	for(var ii=0; ii < txt.length; ii++){    
	    var cc = txt[ii];
	    var ci = cc.charCodeAt(0);
	    if (ci < 32)                    { }  // silently ignore non-printable characters
	    else if (ci >= 161 && ci < 256) { rr += ("\\" + ci.toString (8)); } // Latin-1
	    else if (cc == "€")             { rr += ("\\200"); } 
	    else if (cc == "(")             { rr += ("\\050"); } 
	    else if (cc == ")")             { rr += ("\\051"); } 
	    else if (ci >= 256)             { rr += ("_"); this.BAD_characters += cc; } 
	    else                            { rr += cc; }
	}
	return rr;
    }
    this.stringwidth =     function (txt) { // closed shop Pdf
	var b=0;
	for (var c = 0; c < txt.length; c++) {
	    var theIndex = txt.charCodeAt(c);
	    if (txt[c] == "€") theIndex = parseInt(200,8);
	    b += charWidths[theIndex];
	}
	return b/100*this._fontsize/10
    }
    var charWidths = [255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,286,366,573,573,916,687,197,343,343,401,602,286,343,286,286,573,573,573,573,573,573,573,573,573,573,286,286,602,602,602,573,1045,687,687,744,744,687,629,801,744,286,515,687,573,858,744,801,687,801,744,687,629,744,687,972,687,687,629,286,286,286,483,573,343,573,573,515,573,573,286,573,573,229,229,515,229,858,573,573,573,573,343,515,286,573,515,744,515,515,515,344,268,344,602,0,573,0,229,573,343,1030,573,573,343,1030,687,343,1030,0,629,0,0,229,229,343,343,361,573,1030,343,1030,515,343,972,0,515,687,0,343,573,573,573,573,268,573,343,759,381,573,602,0,759,569,412,565,343,343,343,593,553,343,343,343,376,573,859,859,859,629,687,687,687,687,687,687,1030,744,687,687,687,687,286,286,286,286,744,744,801,801,801,801,801,602,801,744,744,744,744,687,687,629,573,573,573,573,573,573,916,515,573,573,573,573,286,286,286,286,573,573,573,573,573,573,573,565,629,573,573,573,573,515,573,515];
}

