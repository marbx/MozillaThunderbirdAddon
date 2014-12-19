/*
Bla bla description
its called tabledoc because it has one table on a page.
It encapsulates either a markup or a turtle document.

todo JavaScript organisation issues
This is just a flat list of functions that the 'main program' utilizes.
Are global functions bad?
Why?
Is there any value in "OO"ing this list?
So there would be a "object/function" that "is" a TableDoc?
How?

Now the file could be called "funtions that adresslabel needs"

What does the code in this file?
The general idea for most of the functions is:
If the mmarkup object/function exists, it is called for processing
If the tturtle object/function exists, it is called for processing

Is there is a smarter way?
The test for mmarkup needs sometimes is not enough and tests for html and odt, both mmarkup.



*/


/*
In JavaScript/Scheme there is no output.
So we have to assemble all output in a variable.
This is OK.

These 2 functions are unaware of the tturtle-mmarkup thing that happens.
So I have to test for tturtle-markup 100 times.
This is ugly.
Can I do (some of) the tests a 'lower leve'?
What do I mean?

Why does nappend exist? 
It is called 3 times.
Why?

*/

function fappend(txt) { fileContent += txt + "\n";}
function nappend(txt) { fileContent += txt;}


/*
todo: this should go into markupODT, but this is a object/function thing and that confuses me.
Object/functions in JavaScript/Scheme don't need/have a class interface. 


*/
function escapeODT (txt) {
    var rr = "";
    for(var ii=0; ii < txt.length; ii++){    
	var cc = txt[ii];
	if (cc == "&") { rr += ("&amp;"); } 
	else           { rr += cc; }
    }
    return rr;
}

function printSender(txt) {
    if (outputLanguage == "html")	fappend("<p class=\"doXS\">" + txt +  "</p>");
    if (outputLanguage == "odt") {
	nappend('	    <text:p text:style-name="P1u">' + escapeODT(txt) + '</text:p>');    
	nappend('	    <text:p text:style-name="P1">');    // ugly-ODT-text
    } 
    if (tturtle) {
	tturtle.fontsize (FontSize0); 
	tturtle.writelu (txt); 
	tturtle._y -= (FontSize0%2 + FontSize1);
	tturtle._x += 1.2;
    }
}

/*
 for ODT, this code assumes that printSender is called before and cellEnd after. 
Ugly
There are three places tagged ugly-ODT-text
*/
function printAddress(txt) {
    if (outputLanguage == "html")	fappend(txt + "<br/>");
    if (outputLanguage == "odt") {
	nappend(escapeODT(txt) + '<text:line-break/>'); // ugly-ODT-text
    }
    if (tturtle) {
	tturtle.fontsize (FontSize1);
	tturtle.writeln (txt);
	tturtle._y -= 0.1;
    }
}

function docBegin(){
    if (mmarkup) 
	mmarkup.docBegin(PageSize, paperMarginL, paperMarginTop, FontSize0, FontSize1, NOFcolumns, cellWidth, rowHeight);
}

function docEnd() {
    if (mmarkup) mmarkup.docEnd();
}

function tableBegin(){
    if (mmarkup) mmarkup.tableBegin(NOFcolumns);
}

function tableEnd()  {
    if (mmarkup) mmarkup.tableEnd();
}

function rowBegin()  {
    if (mmarkup) mmarkup.rowBegin();
}

function rowEnd()    {
    if (mmarkup) mmarkup.rowEnd();
}

/*todo: remove these parameters, 
the counting is housekepping and should be done inside, not from the outside.
AS-IS: the commands that 'tell' the structure are called and the counting is done at the same level.
the 'structure command' (tableBegin etc) do not count.
This is ugly.
History: the tturtle that needs the paramters came later, and I did not wanted to change the 'running team' functions.
So the housekeeping was added at the outside.
TO-BE: *Begin and *End count, so cellBegin knows the cell.

The turtle is more powerfull than the markup, so it could keep this cellBegin(r,c) as an additional command.
But does this make sense?
*/ 
function cellBegin(zbRow, zbCol){
    NOF_cellBegin += 1;
    if (mmarkup) mmarkup.cellBegin();
    if (tturtle) {
	// fancy JavaScript: create an "object"
	var cursor = {
	    x: paperMarginL + zbCol * cellWidth,
	    y: paperMarginTop + (FontSize0 / 4) + zbRow * rowHeight // ... fontsize heigth approximation
	}
	//poorLog("zbCol=" + zbCol + " cellWidth=" + cellWidth + " paperMarginL=" + paperMarginL + " x=" + cursor.x);
	tturtle.moveto (cursor.x, cursor.y);
    }
}

function cellEnd()   { 
    if (mmarkup) mmarkup.cellEnd();
}

function pagebreak(){
    NOF_pagebreak += 1;
    if (mmarkup) mmarkup.pagebreak();
    if (tturtle) tturtle.newpage();
}

