// Thunderbird code

var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
    .getService(Components.interfaces.nsIConsoleService);

function poorLog(aMessage) {
    consoleService.logStringMessage("Adress label: " + aMessage);
}

// create data structure with array of home/work properties
function ca2upi(card){
    try{ 
	//todo new Array ???
   	addressA  = new Array(card.getProperty("HomeAddress", ""),  card.getProperty("WorkAddress", ""));
  	address2A = new Array(card.getProperty("HomeAddress2", ""), card.getProperty("WorkAddress2", ""));
	zipcodeA  = new Array(card.getProperty("HomeZipCode", ""),  card.getProperty("WorkZipCode", ""));
	cityA     = new Array(card.getProperty("HomeCity"   , ""),  card.getProperty("WorkCity"   , ""));
	countryA  = new Array(card.getProperty("HomeCountry", ""),  card.getProperty("WorkCountry", ""));
	
	return {
	    lastName   : card.lastName ,
	    firstName  : card.firstName,
	    company    : card.getProperty("Company"    , ""),	    
	    address    : addressA,
	    address2   : address2A,
	    zipcode    : zipcodeA,
	    city       : cityA,
	    country    : countryA
	}
    } catch (e) {
	alert("ca2upi " + e); 
    }
}


function walkSelectedAddresses(){
    try {
	poorLog("walkSelectedAddresses START  = ");
	var cards = GetSelectedAbCards(); // FIND THE DOKU 
	var addresses = new Array();
	for(var i in cards){
	    var card = cards[i];
	    if(cards[i].isMailList){ continue; }
	    var c123 = ca2upi(card);
	    addresses.push(c123);
	}
	poorLog("walkSelectedAddresses STOP   = ");
	return addresses;
    } catch (e) {
	alert(e); 
    }
}        

function writeToFile(contents){
    try {
	poorLog("writeToFile START");
	function fp_(filePicker, txt, ext, preset){
	    filePicker.appendFilter(txt, ext);
	    filePicker.defaultString = preset;
	    filePicker.defaultExtension = txt;  
	}
	var filePicker = Components.classes["@mozilla.org/filepicker;1"]
	    .createInstance(Components.interfaces.nsIFilePicker);
	filePicker.init(window, "" + NOF_cellBegin + " labels on " + (NOF_pagebreak + 1) + " page" + (NOF_pagebreak==0?"":"s"), 1);
	if (outputLanguage == "html") fp_(filePicker, "html"      , "*.html", "AddressLabel.html");
	if (outputLanguage == "odt")  fp_(filePicker, "odt"       , "*.odt",  "AddressLabel.odt");
	if (outputLanguage == "pdf")  fp_(filePicker, "pdf"       , "*.pdf" , "AddressLabel.pdf");
	if (outputLanguage == "post") fp_(filePicker, "PostScript", "*.ps"  , "AddressLabel.ps");
	if(filePicker.show() != 1){	// user did not hit "cancel"
	    poorLog("writeToFile stream START");
	    var stream = Components.classes["@mozilla.org/network/file-output-stream;1"] 
		.createInstance(Components.interfaces.nsIFileOutputStream);  
	    stream.init(filePicker.file, 0x04 | 0x08 | 0x20, 0644, 0); 
	    var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
                createInstance(Components.interfaces.nsIConverterOutputStream);
	    converter.init(stream, "UTF-8", 0, 0);
	    converter.writeString(contents);
	    converter.close(); 
	    stream.close();
	    poorLog("writeToFile stream DONE");
/*
This Thunderbird add-on generates a file and opens it with nsIFile.launch.
Launch is flagged. Looking for alternatives for launch I only found Jorges comment at
https://forums.mozilla.org/addons/viewtopic.php?f=7&t=14616&p=29594&hilit=launch+disallowed#p29594

Quote
launch should always be flagged because it can be potentially used to
run executables in the system, so this needs to be looked at carefully
by reviewers. You shouldn't worry about it if you're just opening a file.
Quote end
*/
	    filePicker.file.launch();//How else open pdf/ps/HTML output?
	}
	poorLog("writeToFile DONE");
    } catch (e) {
	alert("writeToFile " + e); 
    }
}

function XUL_main(printTheSender){ 
    try {
	poorLog("XUL_main START");
	poorLog("XUL_main prefs START"); 
	var prefs = Components.classes["@mozilla.org/preferences-service;1"]
	    .getService(Components.interfaces.nsIPrefService)
	    .getBranch("extensions.addresslabel.");
	prefs.QueryInterface(Components.interfaces.nsIPrefBranch);
	// More than ASCII in Preferences? 
	// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/Preferences
	function P2s(prefs, X){ return prefs.getCharPref(X); }
	function P2S(prefs, X){ return prefs.getComplexValue(X, Components.interfaces.nsISupportsString).data;}
	function P2i(prefs, X){ return parseInt(prefs.getCharPref(X),10); }
	senderAddress      = P2S(prefs, "senderAddress");
	ignoreCountry      = P2S(prefs, "ignoreCountry");
	name_ord           = P2s(prefs, "name_ord");
	company_loc        = P2s(prefs, "company_loc");
	NOFcolumns         = P2i(prefs, "NOFcolumns");
	NOFrows            = P2i(prefs, "NOFrows");
	paperMarginL       = P2i(prefs, "paperMarginL");
	labelMarginL       = P2i(prefs, "labelMarginL");
	paperMarginTop     = P2i(prefs, "paperMarginTop");
	primaryAddressType = P2s(prefs, "addressType");
	mitigation         = P2s(prefs, "addressFailure");
	FontSize0          = P2i(prefs, "FontSize0");
	FontSize1          = P2i(prefs, "FontSize1");
	paperformat        = P2s(prefs, "paperformat");
	outputLanguage     = P2s(prefs, "outputformat");

	poorLog("XUL_main prefs DONE"); 

	// init variables in formatPages fails!?!?!?!?!?!??!?!?!?!??!?!
	skippedPeople = "";
	NOF_cellBegin = 0; 
	NOF_pagebreak = 0; 
	
	formatPages(printTheSender, walkSelectedAddresses());
	
	poorLog("XUL_main write START ");
	if (tturtle != null) writeToFile(tturtle.content());
	else                 writeToFile(fileContent);
	poorLog("XUL_main write DONE");
	poorLog("XUL_main START");
    } catch (e) {
	alert("XUL_main " + e); 
    }
}
