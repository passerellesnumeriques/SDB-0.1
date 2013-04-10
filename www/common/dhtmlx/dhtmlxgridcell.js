//v.3.5 build 120822

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
*/
function dhtmlXGridCellObject(a){this.destructor=function(){return this.base=this.grid=this.cell=this.cell.obj=null};this.cell=a;this.getValue=function(){return this.cell.firstChild&&this.cell.firstChild.tagName=="TEXTAREA"?this.cell.firstChild.value:this.cell.innerHTML._dhx_trim()};this.getMathValue=function(){return this.cell.original?this.cell.original:this.getValue()};this.getFont=function(){arOut=Array(3);if(this.cell.style.fontFamily)arOut[0]=this.cell.style.fontFamily;if(this.cell.style.fontWeight==
"bold"||this.cell.parentNode.style.fontWeight=="bold")arOut[1]="bold";if(this.cell.style.fontStyle=="italic"||this.cell.parentNode.style.fontWeight=="italic")arOut[1]+="italic";arOut[2]=this.cell.style.fontSize?this.cell.style.fontSize:"";return arOut.join("-")};this.getTextColor=function(){return this.cell.style.color?this.cell.style.color:"#000000"};this.getBgColor=function(){return this.cell.bgColor?this.cell.bgColor:"#FFFFFF"};this.getHorAlign=function(){return this.cell.style.textAlign?this.cell.style.textAlign:
this.cell.style.textAlign?this.cell.style.textAlign:"left"};this.getWidth=function(){return this.cell.scrollWidth};this.setFont=function(a){fntAr=a.split("-");this.cell.style.fontFamily=fntAr[0];this.cell.style.fontSize=fntAr[fntAr.length-1];if(fntAr.length==3){if(/bold/.test(fntAr[1]))this.cell.style.fontWeight="bold";if(/italic/.test(fntAr[1]))this.cell.style.fontStyle="italic";if(/underline/.test(fntAr[1]))this.cell.style.textDecoration="underline"}};this.setTextColor=function(a){this.cell.style.color=
a};this.setBgColor=function(a){a==""&&(a=null);this.cell.bgColor=a};this.setHorAlign=function(a){this.cell.style.textAlign=a.length==1?a=="c"?"center":a=="l"?"left":"right":a};this.wasChanged=function(){return this.cell.wasChanged?!0:!1};this.isCheckbox=function(){var a=this.cell.firstChild;return a&&a.tagName=="INPUT"?(type=a.type,type=="radio"||type=="checkbox"?!0:!1):!1};this.isChecked=function(){if(this.isCheckbox())return this.cell.firstChild.checked};this.isDisabled=function(){return this.cell._disabled};
this.setChecked=function(a){if(this.isCheckbox())a!="true"&&a!=1&&(a=!1),this.cell.firstChild.checked=a};this.setDisabled=function(a){a!="true"&&a!=1&&(a=!1);if(this.isCheckbox())this.cell.firstChild.disabled=a,this.disabledF&&this.disabledF(a);this.cell._disabled=a}}
dhtmlXGridCellObject.prototype={getAttribute:function(a){return this.cell._attrs[a]},setAttribute:function(a,b){this.cell._attrs[a]=b},getInput:function(){if(this.obj&&(this.obj.tagName=="INPUT"||this.obj.tagName=="TEXTAREA"))return this.obj;var a=(this.obj||this.cell).getElementsByTagName("TEXTAREA");a.length||(a=(this.obj||this.cell).getElementsByTagName("INPUT"));return a[0]}};
dhtmlXGridCellObject.prototype.setValue=function(a){typeof a!="number"&&(!a||a.toString()._dhx_trim()=="")?(a="&nbsp;",this.cell._clearCell=!0):this.cell._clearCell=!1;this.setCValue(a)};dhtmlXGridCellObject.prototype.getTitle=function(){return _isIE?this.cell.innerText:this.cell.textContent};dhtmlXGridCellObject.prototype.setCValue=function(a){this.cell.innerHTML=a};dhtmlXGridCellObject.prototype.setCTxtValue=function(a){this.cell.innerHTML="";this.cell.appendChild(document.createTextNode(a))};
dhtmlXGridCellObject.prototype.setLabel=function(a){this.cell.innerHTML=a};dhtmlXGridCellObject.prototype.getMath=function(){return this._val?this.val:this.getValue()};function eXcell(){this.val=this.obj=null;this.changeState=function(){return!1};this.edit=function(){this.val=this.getValue()};this.detach=function(){return!1};this.getPosition=function(a){for(var b=a,c=0,d=0;b.tagName!="BODY";)c+=b.offsetLeft,d+=b.offsetTop,b=b.offsetParent;return[c,d]}}eXcell.prototype=new dhtmlXGridCellObject;
function eXcell_ed(a){if(a)this.cell=a,this.grid=this.cell.parentNode.grid;this.edit=function(){this.cell.atag=!this.grid.multiLine&&(_isKHTML||_isMacOS||_isFF)?"INPUT":"TEXTAREA";this.val=this.getValue();this.obj=document.createElement(this.cell.atag);this.obj.setAttribute("autocomplete","off");this.obj.style.height=this.cell.offsetHeight-(_isIE?4:4)+"px";this.obj.className="dhx_combo_edit";this.obj.wrap="soft";this.obj.style.textAlign=this.cell.style.textAlign;this.obj.onclick=function(a){(a||event).cancelBubble=
!0};this.obj.onmousedown=function(a){(a||event).cancelBubble=!0};this.obj.value=this.val;this.cell.innerHTML="";this.cell.appendChild(this.obj);this.obj.onselectstart=function(a){a||(a=event);return a.cancelBubble=!0};_isIE&&this.obj.focus();this.obj.focus()};this.getValue=function(){return this.cell.firstChild&&this.cell.atag&&this.cell.firstChild.tagName==this.cell.atag?this.cell.firstChild.value:this.cell._clearCell?"":this.cell.innerHTML.toString()._dhx_trim()};this.detach=function(){this.setValue(this.obj.value);
return this.val!=this.getValue()}}eXcell_ed.prototype=new eXcell;function eXcell_edtxt(a){if(a)this.cell=a,this.grid=this.cell.parentNode.grid;this.getValue=function(){return this.cell.firstChild&&this.cell.atag&&this.cell.firstChild.tagName==this.cell.atag?this.cell.firstChild.value:this.cell._clearCell?"":_isIE?this.cell.innerText:this.cell.textContent};this.setValue=function(a){!a||a.toString()._dhx_trim()==""?(a=" ",this.cell._clearCell=!0):this.cell._clearCell=!1;this.setCTxtValue(a)}}
eXcell_edtxt.prototype=new eXcell_ed;
function eXcell_ch(a){if(a)this.cell=a,this.grid=this.cell.parentNode.grid;this.disabledF=function(a){this.cell.innerHTML=a==!0||a==1?this.cell.innerHTML.replace("item_chk0.","item_chk0_dis.").replace("item_chk1.","item_chk1_dis."):this.cell.innerHTML.replace("item_chk0_dis.","item_chk0.").replace("item_chk1_dis.","item_chk1.")};this.changeState=function(a){a===!0&&!this.grid.isActive&&(window.globalActiveDHTMLGridObject!=null&&window.globalActiveDHTMLGridObject!=this.grid&&window.globalActiveDHTMLGridObject.isActive&&
window.globalActiveDHTMLGridObject.setActive(!1),this.grid.setActive(!0));if(this.grid.isEditable&&!this.cell.parentNode._locked&&!this.isDisabled())this.grid.callEvent("onEditCell",[0,this.cell.parentNode.idd,this.cell._cellIndex])?(this.val=this.getValue(),this.val=="1"?this.setValue("0"):this.setValue("1"),this.cell.wasChanged=!0,this.grid.callEvent("onEditCell",[1,this.cell.parentNode.idd,this.cell._cellIndex]),this.grid.callEvent("onCheckbox",[this.cell.parentNode.idd,this.cell._cellIndex,this.val!=
"1"]),this.grid.callEvent("onCheck",[this.cell.parentNode.idd,this.cell._cellIndex,this.val!="1"])):this.editor=null};this.getValue=function(){return this.cell.chstate?this.cell.chstate.toString():"0"};this.isCheckbox=function(){return!0};this.isChecked=function(){return this.getValue()=="1"?!0:!1};this.setChecked=function(a){this.setValue(a.toString())};this.detach=function(){return this.val!=this.getValue()};this.edit=null}eXcell_ch.prototype=new eXcell;
eXcell_ch.prototype.setValue=function(a){this.cell.style.verticalAlign="middle";if(a&&(a=a.toString()._dhx_trim(),a=="false"||a=="0"))a="";a?(a="1",this.cell.chstate="1"):(a="0",this.cell.chstate="0");var b=this;this.setCValue("<img src='"+this.grid.imgURL+"item_chk"+a+".gif' onclick='new eXcell_ch(this.parentNode).changeState(true); (arguments[0]||event).cancelBubble=true; '>",this.cell.chstate)};
function eXcell_ra(a){this.base=eXcell_ch;this.base(a);this.grid=a.parentNode.grid;this.disabledF=function(a){this.cell.innerHTML=a==!0||a==1?this.cell.innerHTML.replace("radio_chk0.","radio_chk0_dis.").replace("radio_chk1.","radio_chk1_dis."):this.cell.innerHTML.replace("radio_chk0_dis.","radio_chk0.").replace("radio_chk1_dis.","radio_chk1.")};this.changeState=function(a){if(!(a===!1&&this.getValue()==1)&&this.grid.isEditable&&!this.cell.parentNode._locked)this.grid.callEvent("onEditCell",[0,this.cell.parentNode.idd,
this.cell._cellIndex])!=!1?(this.val=this.getValue(),this.val=="1"?this.setValue("0"):this.setValue("1"),this.cell.wasChanged=!0,this.grid.callEvent("onEditCell",[1,this.cell.parentNode.idd,this.cell._cellIndex]),this.grid.callEvent("onCheckbox",[this.cell.parentNode.idd,this.cell._cellIndex,this.val!="1"]),this.grid.callEvent("onCheck",[this.cell.parentNode.idd,this.cell._cellIndex,this.val!="1"])):this.editor=null};this.edit=null}eXcell_ra.prototype=new eXcell_ch;
eXcell_ra.prototype.setValue=function(a){this.cell.style.verticalAlign="middle";if(a&&(a=a.toString()._dhx_trim(),a=="false"||a=="0"))a="";if(a){if(!this.grid._RaSeCol)this.grid._RaSeCol=[];if(this.grid._RaSeCol[this.cell._cellIndex]){var b=this.grid.cells4(this.grid._RaSeCol[this.cell._cellIndex]);b.setValue("0");this.grid.rowsAr[b.cell.parentNode.idd]&&this.grid.callEvent("onEditCell",[1,b.cell.parentNode.idd,b.cell._cellIndex])}this.grid._RaSeCol[this.cell._cellIndex]=this.cell;a="1";this.cell.chstate=
"1"}else a="0",this.cell.chstate="0";this.setCValue("<img src='"+this.grid.imgURL+"radio_chk"+a+".gif' onclick='new eXcell_ra(this.parentNode).changeState(false);'>",this.cell.chstate)};
function eXcell_txt(a){if(a)this.cell=a,this.grid=this.cell.parentNode.grid;this.edit=function(){this.val=this.getValue();this.obj=document.createElement("TEXTAREA");this.obj.className="dhx_textarea";this.obj.onclick=function(a){(a||event).cancelBubble=!0};var a=this.grid.getPosition(this.cell);this.obj.value=this.val;this.obj.style.display="";this.obj.style.textAlign=this.cell.style.textAlign;if(_isFF){var c=document.createElement("DIV");c.appendChild(this.obj);c.style.overflow="auto";c.className=
"dhx_textarea";this.obj.style.margin="0px 0px 0px 0px";this.obj.style.border="0px";this.obj=c}document.body.appendChild(this.obj);if(_isOpera)this.obj.onkeypress=function(a){if(a.keyCode==9)return!1};this.obj.onkeydown=function(a){var b=a||event;if(b.keyCode==9)return globalActiveDHTMLGridObject.entBox.focus(),globalActiveDHTMLGridObject.doKey({keyCode:b.keyCode,shiftKey:b.shiftKey,srcElement:"0"}),!1};this.obj.style.left=a[0]+"px";this.obj.style.top=a[1]+this.cell.offsetHeight+"px";var d=this.cell.offsetWidth<
200?200:this.cell.offsetWidth;this.obj.style.width=d+(_isFF?18:16)+"px";if(_isFF)this.obj.firstChild.style.width=parseInt(this.obj.style.width)+"px",this.obj.firstChild.style.height=this.obj.offsetHeight-3+"px";if(_isIE)this.obj.select(),this.obj.value=this.obj.value;_isFF?this.obj.firstChild.focus():this.obj.focus()};this.detach=function(){var a="",a=_isFF?this.obj.firstChild.value:this.obj.value;this.cell._clearCell=a==""?!0:!1;this.setValue(a);document.body.removeChild(this.obj);this.obj=null;
return this.val!=this.getValue()};this.getValue=function(){return this.obj?_isFF?this.obj.firstChild.value:this.obj.value:this.cell._clearCell?"":this.grid.multiLine?this.cell.innerHTML.replace(/<br[^>]*>/gi,"\n")._dhx_trim():this.cell._brval||this.cell.innerHTML}}eXcell_txt.prototype=new eXcell;
function eXcell_txttxt(a){if(a)this.cell=a,this.grid=this.cell.parentNode.grid;this.getValue=function(){return this.cell.firstChild&&this.cell.firstChild.tagName=="TEXTAREA"?this.cell.firstChild.value:this.cell._clearCell?"":!this.grid.multiLine&&this.cell._brval?this.cell._brval:_isIE?this.cell.innerText:this.cell.textContent};this.setValue=function(a){this.cell._brval=a;!a||a.toString()._dhx_trim()==""?(a=" ",this.cell._clearCell=!0):this.cell._clearCell=!1;this.setCTxtValue(a)}}
eXcell_txttxt.prototype=new eXcell_txt;eXcell_txt.prototype.setValue=function(a){!a||a.toString()._dhx_trim()==""?(a="&nbsp;",this.cell._clearCell=!0):this.cell._clearCell=!1;this.cell._brval=a;this.grid.multiLine?this.setCValue(a.replace(/\n/g,"<br/>"),a):this.setCValue(a,a)};
function eXcell_co(a){if(a)this.cell=a,this.grid=this.cell.parentNode.grid,this.combo=this.cell._combo||this.grid.getCombo(this.cell._cellIndex),this.editable=!0;this.shiftNext=function(){var a=this.list.options[this.list.selectedIndex+1];if(a)a.selected=!0;this.obj.value=this.list.options[this.list.selectedIndex].text;return!0};this.shiftPrev=function(){if(this.list.selectedIndex!=0){var a=this.list.options[this.list.selectedIndex-1];if(a)a.selected=!0;this.obj.value=this.list.options[this.list.selectedIndex].text}return!0};
this.edit=function(){this.val=this.getValue();this.text=this.getText()._dhx_trim();var a=this.grid.getPosition(this.cell);this.obj=document.createElement("TEXTAREA");this.obj.className="dhx_combo_edit";this.obj.style.height=this.cell.offsetHeight-4+"px";this.obj.wrap="soft";this.obj.style.textAlign=this.cell.style.textAlign;this.obj.onclick=function(a){(a||event).cancelBubble=!0};this.obj.onmousedown=function(a){(a||event).cancelBubble=!0};this.obj.value=this.text;this.obj.onselectstart=function(a){a||
(a=event);return a.cancelBubble=!0};var c=this;this.obj.onkeyup=function(a){var b=(a||event).keyCode;if(!(b==38||b==40||b==9))for(var d=this.readonly?String.fromCharCode(b):this.value,f=c.list.options,e=0;e<f.length;e++)if(f[e].text.indexOf(d)==0)return f[e].selected=!0};this.list=document.createElement("SELECT");this.list.className="dhx_combo_select";this.list.style.width=this.cell.offsetWidth+"px";this.list.style.left=a[0]+"px";this.list.style.top=a[1]+this.cell.offsetHeight+"px";this.list.onclick=
function(a){var b=a||window.event,d=b.target||b.srcElement;if(d.tagName=="OPTION")d=d.parentNode;c.editable=!1;c.grid.editStop();b.cancelBubble=!0};for(var d=this.combo.getKeys(),g=!1,e=0,f=0;f<d.length;f++){var l=this.combo.get(d[f]);this.list.options[this.list.options.length]=new Option(l,d[f]);d[f]==this.val&&(e=this.list.options.length-1,g=!0)}g==!1&&(this.list.options[this.list.options.length]=new Option(this.text,this.val===null?"":this.val),e=this.list.options.length-1);document.body.appendChild(this.list);
this.list.size="6";this.cstate=1;this.editable?this.cell.innerHTML="":(this.obj.style.width="1px",this.obj.style.height="1px");this.cell.appendChild(this.obj);this.list.options[e].selected=!0;if(!_isFF||this.editable)this.obj.focus(),this.obj.focus();if(!this.editable)this.obj.style.visibility="hidden",this.list.focus(),this.list.onkeydown=function(a){a=a||window.event;c.grid.setActive(!0);if(a.keyCode<30)return c.grid.doKey({target:c.cell,keyCode:a.keyCode,shiftKey:a.shiftKey,ctrlKey:a.ctrlKey})}};
this.getValue=function(){return this.cell.combo_value==window.undefined?"":this.cell.combo_value};this.detach=function(){if(this.val!=this.getValue())this.cell.wasChanged=!0;if(this.list.parentNode!=null)if(this.editable){var a=this.list.options[this.list.selectedIndex];if(a&&a.text==this.obj.value)this.setValue(this.list.value);else{var c=this.cell._combo||this.grid.getCombo(this.cell._cellIndex),d=c.values._dhx_find(this.obj.value);d!=-1?this.setValue(c.keys[d]):this.setCValue(this.cell.combo_value=
this.obj.value)}}else this.setValue(this.list.value);this.list.parentNode&&this.list.parentNode.removeChild(this.list);this.obj.parentNode&&this.obj.parentNode.removeChild(this.obj);return this.val!=this.getValue()}}eXcell_co.prototype=new eXcell;eXcell_co.prototype.getText=function(){return this.cell.innerHTML};
eXcell_co.prototype.setValue=function(a){if(typeof a=="object"){var b=this.grid.xmlLoader.doXPath("./option",a);if(b.length)this.cell._combo=new dhtmlXGridComboObject;for(var c=0;c<b.length;c++)this.cell._combo.put(b[c].getAttribute("value"),b[c].firstChild?b[c].firstChild.data:"");a=a.firstChild.data}if((a||"").toString()._dhx_trim()=="")a=null;this.cell.combo_value=a;if(a!==null){var d=(this.cell._combo||this.grid.getCombo(this.cell._cellIndex)).get(a);this.setCValue(d===null?a:d,a)}else this.setCValue("&nbsp;",
a)};function eXcell_coro(a){this.base=eXcell_co;this.base(a);this.editable=!1}eXcell_coro.prototype=new eXcell_co;function eXcell_cotxt(a){this.base=eXcell_co;this.base(a)}eXcell_cotxt.prototype=new eXcell_co;eXcell_cotxt.prototype.getText=function(){return _isIE?this.cell.innerText:this.cell.textContent};
eXcell_cotxt.prototype.setValue=function(a){if(typeof a=="object"){var b=this.grid.xmlLoader.doXPath("./option",a);if(b.length)this.cell._combo=new dhtmlXGridComboObject;for(var c=0;c<b.length;c++)this.cell._combo.put(b[c].getAttribute("value"),b[c].firstChild?b[c].firstChild.data:"");a=a.firstChild.data}if((a||"").toString()._dhx_trim()=="")a=null;a!==null?this.setCTxtValue((this.cell._combo||this.grid.getCombo(this.cell._cellIndex)).get(a)||a,a):this.setCTxtValue(" ",a);this.cell.combo_value=a};
function eXcell_corotxt(a){this.base=eXcell_co;this.base(a);this.editable=!1}eXcell_corotxt.prototype=new eXcell_cotxt;
function eXcell_cp(a){try{this.cell=a,this.grid=this.cell.parentNode.grid}catch(b){}this.edit=function(){this.val=this.getValue();this.obj=document.createElement("SPAN");this.obj.style.border="1px solid black";this.obj.style.position="absolute";var a=this.grid.getPosition(this.cell);this.colorPanel(4,this.obj);document.body.appendChild(this.obj);this.obj.style.left=a[0]+"px";this.obj.style.zIndex=1E3;this.obj.style.top=a[1]+this.cell.offsetHeight+"px"};this.toolDNum=function(a){a.length==1&&(a="0"+
a);return a};this.colorPanel=function(a,b){var g=document.createElement("TABLE");b.appendChild(g);g.cellSpacing=0;g.editor_obj=this;g.style.cursor="default";g.onclick=function(a){var b=a||window.event,c=b.target||b.srcElement,d=c.parentNode.parentNode.parentNode.editor_obj;d.setValue(c._bg);d.grid.editStop()};for(var e=256/a,f=0;f<=256/e;f++)for(var l=g.insertRow(f),i=0;i<=256/e;i++)for(var j=0;j<=256/e;j++){R=new Number(e*f)-(f==0?0:1);G=new Number(e*i)-(i==0?0:1);B=new Number(e*j)-(j==0?0:1);var k=
this.toolDNum(R.toString(16))+""+this.toolDNum(G.toString(16))+""+this.toolDNum(B.toString(16)),h=l.insertCell(i);h.width="10px";h.innerHTML="&nbsp;";h.title=k.toUpperCase();h.style.backgroundColor="#"+k;h._bg="#"+k;if(this.val!=null&&"#"+k.toUpperCase()==this.val.toUpperCase())h.style.border="2px solid white"}};this.getValue=function(){return this.cell.firstChild._bg||""};this.getRed=function(){return Number(parseInt(this.getValue().substr(1,2),16))};this.getGreen=function(){return Number(parseInt(this.getValue().substr(3,
2),16))};this.getBlue=function(){return Number(parseInt(this.getValue().substr(5,2),16))};this.detach=function(){this.obj.offsetParent!=null&&document.body.removeChild(this.obj);return this.val!=this.getValue()}}eXcell_cp.prototype=new eXcell;eXcell_cp.prototype.setValue=function(a){this.setCValue("<div style='width:100%;height:"+(this.grid.multiLine?this.cell.offsetHeight-2:16)+";background-color:"+(a||"")+";border:0px;'>&nbsp;</div>",a);this.cell.firstChild._bg=a};
function eXcell_img(a){try{this.cell=a,this.grid=this.cell.parentNode.grid}catch(b){}this.getValue=function(){if(this.cell.firstChild.tagName=="IMG")return this.cell.firstChild.src+(this.cell.titFl!=null?"^"+this.cell._brval:"");else if(this.cell.firstChild.tagName=="A"){var a=this.cell.firstChild.firstChild.src+(this.cell.titFl!=null?"^"+this.cell._brval:"");a+="^"+this.cell.lnk;this.cell.trg&&(a+="^"+this.cell.trg);return a}};this.isDisabled=function(){return!0}}eXcell_img.prototype=new eXcell;
eXcell_img.prototype.getTitle=function(){return this.cell._brval};eXcell_img.prototype.setValue=function(a){var b=a;if(a.indexOf("^")!=-1){var c=a.split("^"),a=c[0],b=this.cell._attrs.title||c[1];if(c.length>2&&(this.cell.lnk=c[2],c[3]))this.cell.trg=c[3];this.cell.titFl="1"}this.setCValue("<img src='"+this.grid.iconURL+(a||"")._dhx_trim()+"' border='0'>",a);if(this.cell.lnk)this.cell.innerHTML="<a href='"+this.cell.lnk+"' target='"+this.cell.trg+"'>"+this.cell.innerHTML+"</a>";this.cell._brval=b};
function eXcell_price(a){this.base=eXcell_ed;this.base(a);this.getValue=function(){return this.cell.childNodes.length>1?this.cell.childNodes[1].innerHTML.toString()._dhx_trim():"0"}}eXcell_price.prototype=new eXcell_ed;eXcell_price.prototype.setValue=function(a){isNaN(parseFloat(a))&&(a=this.val||0);var b="green";a<0&&(b="red");this.setCValue("<span>$</span><span style='padding-right:2px;color:"+b+";'>"+a+"</span>",a)};
function eXcell_dyn(a){this.base=eXcell_ed;this.base(a);this.getValue=function(){return this.cell.firstChild.childNodes[1].innerHTML.toString()._dhx_trim()}}eXcell_dyn.prototype=new eXcell_ed;
eXcell_dyn.prototype.setValue=function(a){if(!a||isNaN(Number(a)))a!==""&&(a=0);if(a>0)var b="green",c="dyn_up.gif";else a==0?(b="black",c="dyn_.gif"):(b="red",c="dyn_down.gif");this.setCValue("<div style='position:relative;padding-right:2px; width:100%;overflow:hidden; white-space:nowrap;'><img src='"+this.grid.imgURL+""+c+"' height='15' style='position:absolute;top:0px;left:0px;'><span style=' padding-left:20px; width:100%;color:"+b+";'>"+a+"</span></div>",a)};
function eXcell_ro(a){if(a)this.cell=a,this.grid=this.cell.parentNode.grid;this.edit=function(){};this.isDisabled=function(){return!0};this.getValue=function(){return this.cell._clearCell?"":this.cell.innerHTML.toString()._dhx_trim()}}eXcell_ro.prototype=new eXcell;
function eXcell_ron(a){this.cell=a;this.grid=this.cell.parentNode.grid;this.edit=function(){};this.isDisabled=function(){return!0};this.getValue=function(){return this.cell._clearCell?"":this.grid._aplNFb(this.cell.innerHTML.toString()._dhx_trim(),this.cell._cellIndex)}}eXcell_ron.prototype=new eXcell;
eXcell_ron.prototype.setValue=function(a){if(a!==0&&(!a||a.toString()._dhx_trim()==""))return this.setCValue("&nbsp;"),this.cell._clearCell=!0;this.cell._clearCell=!1;this.setCValue(a?this.grid._aplNF(a,this.cell._cellIndex):"0")};
function eXcell_rotxt(a){this.cell=a;this.grid=this.cell.parentNode.grid;this.edit=function(){};this.isDisabled=function(){return!0};this.setValue=function(a){a?this.cell._clearCell=!1:(a=" ",this.cell._clearCell=!0);this.setCTxtValue(a)};this.getValue=function(){return this.cell._clearCell?"":_isIE?this.cell.innerText:this.cell.textContent}}eXcell_rotxt.prototype=new eXcell;
function dhtmlXGridComboObject(){this.keys=new dhtmlxArray;this.values=new dhtmlxArray;this.put=function(a,b){for(var c=0;c<this.keys.length;c++)if(this.keys[c]==a)return this.values[c]=b,!0;this.values[this.values.length]=b;this.keys[this.keys.length]=a};this.get=function(a){for(var b=0;b<this.keys.length;b++)if(this.keys[b]==a)return this.values[b];return null};this.clear=function(){this.keys=new dhtmlxArray;this.values=new dhtmlxArray};this.remove=function(a){for(var b=0;b<this.keys.length;b++)if(this.keys[b]==
a)return this.keys._dhx_removeAt(b),this.values._dhx_removeAt(b),!0};this.size=function(){for(var a=0,b=0;b<this.keys.length;b++)this.keys[b]!=null&&a++;return a};this.getKeys=function(){for(var a=[],b=0;b<this.keys.length;b++)this.keys[b]!=null&&(a[a.length]=this.keys[b]);return a};this.save=function(){this._save=[];for(var a=0;a<this.keys.length;a++)this._save[a]=[this.keys[a],this.values[a]]};this.restore=function(){if(this._save){this.keys[a]=[];this.values[a]=[];for(var a=0;a<this._save.length;a++)this.keys[a]=
this._save[a][0],this.values[a]=this._save[a][1]}};return this}function Hashtable(){this.keys=new dhtmlxArray;this.values=new dhtmlxArray;return this}Hashtable.prototype=new dhtmlXGridComboObject;

//v.3.5 build 120822

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
*/