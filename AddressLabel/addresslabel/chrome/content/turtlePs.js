
function turtlePs(papersize, fontsize){
    var _lastCommandShowpage = false;

    this.writeln    = function (txt) { this.write (txt, false); }

    this.writelu    = function (txt) { this.write (txt, true);  }

    this.fontsize    = function (ff) {
	if (this._fontsize != ff) {
	    this._fontsize = ff;
	    this.append ("/F1 " + this._fontsize + "        selectfont");
	}
    }

    this.newpage    = function () { 
	_lastCommandShowpage = true;
	this.append("              showpage"); 
	// ........ libspectre "structuring comments" (Read libspectre/ps.c)!!!!!!!!!!
	this.append ("%%Page 1"); 
    }

    this.newline    = function () { this._y -= this._fontsize; }

    // x mm -- horizontal, left to right
    // y mm -- vertical, top to bottom 
    this.moveto     = function (x, y) {
	this._x = this.mm2points (x);
	this._y = this.xyMax[1] - this.mm2points (y) - this._fontsize;
    }

    this.content    = function(){ 
	//this.append ("% BAD_characters " + this.BAD_characters);
	if (!_lastCommandShowpage) {
	    this.append("              showpage"); 	// libspectre needs
	}
	return this.out; 
    }

    // ........................ private .........................................................

    this.append = function (txt) { this.out += txt + "\n"; }

    this.mm2points = function (mm) { var p = mm; p *= 360; p /= 127; return p; }

    // pseudo consctructor Start
    this.out = "";
    switch (papersize) {
    case "A4"     : this.xyMax = [595, 842]; break; 
    case "Letter" : this.xyMax = [612, 792]; break; 
    case "Test"   : this.xyMax = [300, 400];   break; 
    default       : this.xyMax = [595, 842]     
    }
    var _x;
    var _y;
    this.BAD_characters = ""; 
    this.BAD_outside = false; 
    this._fontsize = fontsize;
    this.append ("%!PS");

    // ........ libspectre "structuring comments" (Read libspectre/ps.c)
    if (papersize == "A4") {
	this.append ("%%BoundingBox: 0 0 595 842");
	this.append ("%%DocumentPaperSizes: a4");
	this.append ("%%EndComments");
	this.append ("");
	this.append ("%%BeginSetup");
	this.append ("%%PaperSize: a4");
	this.append ("%%EndSetup");
    }

    // libspectre does not care!
    this.append ("<< /PageSize ["+ this.xyMax[0] +" "+ this.xyMax[1] +"] >> setpagedevice");

    // Function found in Glenn C. Reid (1990) "Thinking in PostScript", Addison Wesley
    // Appendix "Answers to exercices" "chapter 5", page 191
    // Exercise is on page 64
    // Problem 1: does not scale well on font size
    // Problem 2: needs 2 parameters 
    this.append ("/ushow");
    this.append ("    { % def");
    this.append ("      gsave");
    this.append ("        exch 0 exch rmoveto");
    this.append ("        dup stringwidth rlineto");
    this.append ("        exch setlinewidth stroke");
    this.append ("      grestore");
    this.append ("      show ");
    this.append ("    } bind def");
    //
    //
    this.append ("/Helvetica");
    this.append ("    findfont dup length dict begin");
    this.append ("      { %forall");
    this.append ("        1 index /FID ne {def} {pop pop} ifelse");
    this.append ("      } forall");
    this.append ("    /Encoding ISOLatin1Encoding def");
    this.append ("    currentdict end");
    this.append ("    /F1  exch definefont pop");
    this.append ("/F1 " + this._fontsize + "        selectfont");

    // ........ libspectre "structuring comments" (Read libspectre/ps.c)!!!!!!!!!!
    this.append ("%%Page 1"); 
    this.moveto(0, 0);
    // pseudo consctructor End

    this.write = function (txt, uu) {
	if (this._x >= 0 && this._y >= 0) {
	    _lastCommandShowpage = false;
	    this.append (this.prpr(this._x) +" "+ this.prpr(this._y) +" moveto " 
			 + (uu?"0.3 -2 ":"") + "("+ this.escape (txt) +") " + (uu?"ushow":"show"));    
	    this._y -= this._fontsize;
	} else {this.BAD_outside = true;}
    }

    this.prpr = function (x) { var y = x.toFixed(2); return this.zeroPad(y, 6); }

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
	    else if (cc == "(")             { rr += ("\\050"); } 
	    else if (cc == ")")             { rr += ("\\051"); } 
	    else if (ci >= 256)             { rr += ("_"); this.BAD_characters += cc; } 
	    else                            { rr += cc; }
	}
	return rr;
    }
}

