function markupHTML(txt) {

    this.docBegin = function(pagesz, paperMarginL, paperMarginTop, FontSize0, FontSize1, NOFcolumns, cellWidth, rowHeight){
	// margin-top does not work well, first page has 2mm offset
	fappend('<html><head><meta charset="utf-8"><style type="text/css">');
	fappend('  body     {margin-left:'+ paperMarginL +'mm; font-family:sans-serif}');
	fappend('  table    {border-spacing:0; width:'+ (NOFcolumns * cellWidth) +'mm; table-layout:fixed; border:0}');
	fappend('  tr       {height:'+ rowHeight +'mm}');
	fappend('  td       {border:0; vertical-align:top;font-size:'+ FontSize1 +'pt}');
	fappend('  p.doXS   {font-size:'+ FontSize0 +'pt; text-decoration:underline; }');
	fappend('  div.doPB {height:'+ paperMarginTop +'mm;  page-break-before:always}');
	fappend('</style></head><body>');
    }
    this.docEnd = function()    {
	fappend("</body></html>");
    }
    this.tableBegin = function(NOFcolumns){
	fappend("<table>");
    }
    this.tableEnd = function()  {
	fappend("</table>");
    }
    this.rowBegin = function()  {
	fappend("<tr>");
    }
    this.rowEnd = function()    {
	fappend("</tr>");
    }
    this.cellBegin = function(zbRow, zbCol){
	fappend("<td>");
    }
    this.cellEnd = function()   { 
	fappend("</td>");
    }
    this.pagebreak = function(){
	fappend("<div class=\"doPB\"></p>");
    }
}
