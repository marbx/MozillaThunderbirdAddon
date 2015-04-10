/* 
Start from shell to test the non-Mozilla API JavaScript  

  USAGE
../../../js shell.js > ~/Downloads/AddressLabel.pdf
open ~/Downloads/AddressLabel.pdf

*/
var errorString1 = "";
load("shellData.js");
//load("shellCalibrationData.js");
load("addresslabel.js");
load("tableDoc.js");
load("turtlePs.js");
load("turtlePdf.js");
load("markupHTML.js");
load("markupODT.js");

senderAddress = "This is the sender";
var printTheSender = true;         // defined in XUL

var testcase = 3;
//                     0        1        2        3     4   
company_loc        = ["1"    , "1"    , "1"    , "1"     ][testcase];
name_ord           = ["LF"   , "FL"   , "FL"   , "FL"    ][testcase];
paperformat        = ["A4"   , "A4"   , "A4"   , "Letter"][testcase];
//paperformat        = "Letter";
FontSize0          = [  9    ,  16    ,  16    ,  7      ][testcase];
FontSize1          = [ 11    ,   13   ,  13    ,  9      ][testcase];
NOFcolumns         = [  3    ,   2    ,   2    ,  3      ][testcase];
NOFrows            = [  8    ,   6    ,   6    ,  8      ][testcase];
paperMarginL       = [  2    ,   2    ,   2    ,  2      ][testcase];
labelMarginL       = [  4    ,   5    ,   5    ,  3      ][testcase];
paperMarginTop     = [  5    ,   5    ,   5    ,  3      ][testcase];
primaryAddressType = ["Home" , "Work" , "Home" , "Home"  ][testcase];
outputLanguage     = ["pdf"  , "html" , "odt"  , "post"  ][testcase];

var is_markup = outputLanguage == "odt" || outputLanguage == "html";
var is_turtle = outputLanguage == "pdf" || outputLanguage == "post";

// Mozilla functions 
function alert(w)  { 
    if (is_markup) errorString1 += "<!-- "; 
    if (is_turtle) errorString1 += "% "; 
    errorString1 += " ////alert//// " + w ; 
    if (is_markup) errorString1 += "   --> \n"; 
    if (is_turtle) errorString1 += "\n"; 
}

// Functions for shell
function poorLog(w){ 
    if (is_markup) errorString1 += "<!-- "; 
    if (is_turtle) errorString1 += "% "; 
    errorString1 += " ////log////   " + w ; 
    if (is_markup) errorString1 += "   --> \n"; 
    if (is_turtle) errorString1 += "\n"; 
}


formatPages(printTheSender, addresses);

if (tturtle != null) print(tturtle.content());
else                 print(fileContent);

    
print(errorString1);
