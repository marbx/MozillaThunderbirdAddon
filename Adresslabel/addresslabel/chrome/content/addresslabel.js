
var senderAddress;
var FontSize0;
var FontSize1;
var NOFcolumns;
var NOFrows;
var rowHeight;
var cellWidth;
var paperMarginL;
var labelMarginL;
var paperMarginTop;
var primaryAddressType;
var mitigation;
var ignoreCountry;
var name_ord;
var company_loc;
var outputLanguage;
var paperformat;
var paperHeight;
var NOF_cellBegin = 0;
var NOF_pagebreak = 0;
var fileContent;
var skippedPeople = "";
var tturtle = null;
var mmarkup = null;

var xymmMaxA4 = [210, 297]; 
var xymmMaxLe = [216, 279]; 
var PageSize = {x: xymmMaxA4[0], y: xymmMaxA4[1], name: "A4"};


// nimmt array von cards die wirklich properties haben.
function formatPages(printTheSender, adrARRAY){
    if (paperformat == "Letter") 
	PageSize = {x: xymmMaxLe[0], y: xymmMaxLe[1], name: "Letter"};

    
//  cellWidth = (PageSize.x - paperMarginL   )/NOFcolumns; // up until version 7
    cellWidth = (PageSize.x                  )/NOFcolumns;
    rowHeight = (PageSize.y - paperMarginTop )/NOFrows;

    if (outputLanguage == "odt") 
	rowHeight -= 0.2;

    
    var count1 = 0;
    var rowClosed = false;
    var tableClosed = false;
    var zbCol = 0;
    var zbRow = 0;
    fileContent = "";
    if (outputLanguage == "pdf")  {mmarkup = null; tturtle = new turtlePdf(paperformat, FontSize1); }
    if (outputLanguage == "post") {mmarkup = null; tturtle = new turtlePs(paperformat, FontSize1); }
    if (outputLanguage == "html") {tturtle = null; mmarkup = new markupHTML();}
    if (outputLanguage == "odt")  {tturtle = null; mmarkup = new markupODT();}

    docBegin();
    tableBegin();
    rowBegin();
    for(var index_of_ARRAY in adrARRAY){
	var formattedCard = formatCard(adrARRAY[index_of_ARRAY]);
	if (formattedCard != null) {

	    count1 += 1;
	    if (tableClosed) {
		tableClosed = false;
		pagebreak();
		tableBegin();
		zbRow = -1; // first row becomes 0 
		zbCol = 0;
	    }
	    if (rowClosed) {
		rowClosed = false;
		rowBegin();
		zbRow += 1;
		zbCol = 0;
	    }
	    cellBegin(zbRow, zbCol); 	    
	    zbCol += 1;
	    if (printTheSender) 
		printSender(senderAddress); 
	    else
		printSender(""); 

	    // ordering company and name
	    // print company 
	    //   before the name
	    //   after the name
	    //   not at all
	    if (company_loc == "1") {
		printAddress(formattedCard.company);
		printAddress(formattedCard.name);
	    }
	    if (company_loc == "2") {
		if (formattedCard.company == "") {
		    printAddress("");
		    printAddress(formattedCard.name);
		} else {
		    printAddress(formattedCard.name);
		    printAddress(formattedCard.company);
		}
	    }
	    if (company_loc == "0") {
		printAddress("");
		printAddress(formattedCard.name);
	    }

	    printAddress(formattedCard.street);
	    if (formattedCard.street2 != "") {
		printAddress(formattedCard.street2);
	    }
	    printAddress(formattedCard.zipcode + " " + formattedCard.city);
	    printAddress(formattedCard.country);
	    cellEnd();
	    if (count1 % NOFcolumns == 0) {
		rowEnd();
		rowClosed = true;
	    }
	    if (count1 % (NOFcolumns * NOFrows) == 0) {
		tableEnd();
		tableClosed = true;
	    }
	} ////// if formattedCard != null
    } //////////////////////// end for loop

    if (!rowClosed)   rowEnd();
    if (!tableClosed) tableEnd();
    docEnd();
    
    if ((tturtle != null) && (tturtle.BAD_characters.length > 0))
	alert("Characters outside ISO Latin-1 found\nReplaced by underscore (_):\n\n" 
	      + tturtle.BAD_characters);
    if ((tturtle != null) && (tturtle.BAD_outside))
	alert("Ink leaves page. Ignored.");
    if (skippedPeople.length > 0) 
	alert("Cards skipped because address incomplete:\n\n" + skippedPeople);
}


function formatCard(card){
    var isHome = primaryAddressType == "Home";
    var px = isHome?0:1; // primary Index
    var sx = (!isHome)?0:1; // secondary Index
    var rr = {};
    var name1 = (name_ord == "LF"?  card.lastName  : card.firstName)
    var name2 = (name_ord == "LF"?  card.firstName : card.lastName)
    var TBCname    = name1;
    if   (TBCname && TBCname.length > 0) {TBCname += " " + name2;}
    else                                 {TBCname  =       name2;}
    var TBCcompany = card.company;
    if (TBCname == "") { 
	TBCname  = TBCcompany; 
	TBCcompany = ""; 
    }
    rr.name    = TBCname;
    rr.company = TBCcompany;
    
    //todo logic: pass == default
    //todo logic: two variables px/sx --> one variable
    if (card.address[px].length == 0 || card.city[px].length == 0) {
	if (mitigation == "skip"){
	    skippedPeople += TBCname + "; ";
	    return null;
	}
	if (mitigation == "pass"){
	    rr.street  =  card.address [px];
	    rr.street2 =  card.address2[px];
	    rr.city    =  card.city    [px];
	    rr.zipcode =  card.zipcode [px];
	    rr.country = (card.country [px] == ignoreCountry?"": card.country[px]);
	}
	if (mitigation == "second"){
	    if (card.address[sx].length == 0 || card.city[sx].length == 0) {
		skippedPeople += TBCname + "; ";
		return null;
	    } else {
		rr.street  =  card.address [sx];
		rr.street2 =  card.address2[sx];
		rr.city    =  card.city    [sx];
		rr.zipcode =  card.zipcode [sx];
		rr.country = (card.country [sx] == ignoreCountry?"": card.country[sx]);
	    }
	}
    } else {
	rr.street  =  card.address [px];
	rr.street2 =  card.address2[px];
	rr.city    =  card.city    [px];
	rr.zipcode =  card.zipcode [px];
	rr.country = (card.country [px] == ignoreCountry?"": card.country[px]);
    }
    return rr;
}


