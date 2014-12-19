
//
// http://incubator.apache.org/odftoolkit/conformance/ODFValidator.html
//
function markupODT(txt) {
    this.docBegin = function(pagesz, paperMarginL, paperMarginTop, FontSize0, FontSize1, NOFcolumns, cellWidth, rowHeight){
	fappend('<?xml version="1.0" encoding="UTF-8"?> ');
	fappend('<office:document');
	fappend('    xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"');
	fappend('    xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"');
	fappend('    xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"');
	fappend('    xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"');
	fappend('    xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0"');
	fappend('    xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"');
	fappend('    xmlns:xlink="http://www.w3.org/1999/xlink"');
	fappend('    xmlns:dc="http://purl.org/dc/elements/1.1/"');
	fappend('    xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0"');
	fappend('    xmlns:number="urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0"');
	fappend('    xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0"');
	fappend('    xmlns:chart="urn:oasis:names:tc:opendocument:xmlns:chart:1.0"');
	fappend('    xmlns:dr3d="urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0"');
	fappend('    xmlns:form="urn:oasis:names:tc:opendocument:xmlns:form:1.0"');
	fappend('    xmlns:script="urn:oasis:names:tc:opendocument:xmlns:script:1.0"');
	fappend('    xmlns:dom="http://www.w3.org/2001/xml-events"');
	fappend('    xmlns:xforms="http://www.w3.org/2002/xforms"');
	fappend('    xmlns:xsd="http://www.w3.org/2001/XMLSchema"');
	fappend('    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"');
	fappend('    xmlns:grddl="http://www.w3.org/2003/g/data-view#"');
	fappend('    office:mimetype="application/vnd.oasis.opendocument.text"');
	fappend('    office:version="1.0"');
	fappend('    > ');
	fappend('');
	fappend('  <office:font-face-decls>');
	fappend('    <style:font-face style:name="Arial"     svg:font-family="Arial" style:font-family-generic="swiss" style:font-pitch="variable"/>');
	fappend('    <style:font-face style:name="Helvetica" svg:font-family="Helvetica" style:font-family-generic="swiss" style:font-pitch="variable"/>');
	fappend('  </office:font-face-decls>');
	fappend('');
	fappend('  <office:automatic-styles> ');
	fappend('    <style:style style:name="T1t" style:family="table">');
	fappend('      <style:table-properties');
	fappend('	  fo:break-before="page" ');
	fappend('          style:width ="'+ (NOFcolumns * cellWidth) +'mm"');
	fappend('	  table:align="left"');
	fappend('	  />');
	fappend('    </style:style>');
	fappend('    <style:style style:name="T1c" style:family="table-column"><style:table-column-properties style:column-width="'+ cellWidth +'mm"/></style:style>');
	fappend('    <style:style style:name="T1r" style:family="table-row"   ><style:table-row-properties    style:row-height  ="'+ rowHeight +'mm"/></style:style>');
	fappend('    <style:style style:name="T1c" style:family="table-cell">');
	fappend('      <style:table-cell-properties ');
	fappend('	  fo:padding="0mm" ');
	fappend('	  fo:border-left="none" ');
	fappend('	  fo:border-right="none" ');
	fappend('	  fo:border-top="none" ');
	fappend('	  fo:border-bottom="none" ');
	fappend('	  />');
	fappend('    </style:style>');
	fappend('');
	fappend('    <style:page-layout style:name="PageLayout-1" > ');
	fappend('      <style:page-layout-properties');
	fappend('	   fo:page-width="'+  pagesz.x +'mm"');
	fappend('	  fo:page-height="'+  pagesz.y +'mm"');
	fappend('	  fo:margin-top="'+ paperMarginTop +'mm"');
	fappend('	  fo:margin-bottom="0mm"');
	fappend('	  fo:margin-left="'+ paperMarginL +'mm"');
	fappend('	  fo:margin-right="0mm"');
	fappend('	  style:print-orientation="portrait"/> ');
	fappend('    </style:page-layout> ');
	fappend('    ');
	fappend('    <style:style ');
	fappend('	style:name="P1u" ');
	fappend('	style:family="paragraph" ');
	fappend('	style:parent-style-name="Standard">');
	fappend('      <style:paragraph-properties ');
	fappend('	  fo:margin-bottom="10mm" ');
	fappend('	  />');
	fappend('      <style:text-properties ');
	fappend('	  style:font-name="Helvetica"');
	fappend('	  fo:font-size="' + FontSize0 + 'pt" ');
	fappend('	  style:font-size-asian="' + FontSize0 + 'pt" ');
	fappend('	  style:font-size-complex="' + FontSize0 + 'pt"');
	fappend('	  style:text-underline-style="solid"');
	fappend('	  style:text-underline-width="auto" ');
	fappend('	  style:text-underline-color="font-color" ');
	fappend('	  />');
	fappend('    </style:style>');
	fappend('    ');
	fappend('    <style:style ');
	fappend('	style:name="P1" ');
	fappend('	style:family="paragraph" ');
	fappend('	style:parent-style-name="Standard">');
	fappend('      <style:paragraph-properties ');
	fappend('	  fo:line-height="110%" ');
	fappend('	  />');
	fappend('      <style:text-properties ');
	fappend('	  style:font-name="Helvetica"');
	fappend('	  fo:font-size="' + FontSize1 + 'pt" ');
	fappend('	  style:font-size-asian="' + FontSize1 + 'pt" ');
	fappend('	  style:font-size-complex="' + FontSize1 + 'pt"');
	fappend('	  />');
	fappend('    </style:style>');
	fappend('    ');
	fappend('  </office:automatic-styles>');
	fappend('');
	fappend('  <office:master-styles> ');
	fappend('    <style:master-page style:name="Standard" style:page-layout-name="PageLayout-1" > ');
	fappend('    </style:master-page> ');
	fappend('  </office:master-styles> ');
	fappend('');
	fappend('  <office:settings>');
	fappend('  </office:settings>');
	fappend('');
	fappend('');
	fappend('  <office:body> ');
	fappend('    <office:text> ');
    }
    this.docEnd = function()    {
	fappend('    </office:text> ');
	fappend('  </office:body> ');
	fappend('</office:document> ');
    }
    this.tableBegin = function(NOFcolumns){
	fappend('      <table:table table:name="Table1" table:style-name="T1t">');
	fappend('	<table:table-column table:style-name="T1c" table:number-columns-repeated="'+ NOFcolumns +'"/>');
    }
    this.tableEnd = function()  {
	fappend('      </table:table>');
    }
    this.rowBegin = function()  {
	fappend('	<table:table-row table:style-name="T1r">');
    }
    this.rowEnd = function()    {
	fappend('	</table:table-row>');
    }
    this.cellBegin = function(zbRow, zbCol){
	fappend('	  <table:table-cell table:style-name="T1c" office:value-type="string">');
    }
    this.cellEnd = function()   { 
	    fappend('	    </text:p>    '); // ugly-ODT-text
	fappend('	  </table:table-cell>');
    }
    this.pagebreak = function(){
    }
}
