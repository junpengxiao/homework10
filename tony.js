var pr;//pointer of result
var psr;//pointer of result for show result
var arr;//numbers get from table
var mode=1;//normal -h -v -h-v
var result;//Calculate result. for display
var bval,bx1,bx2,by1,by2;//Best value
var tval,tx1,tx2,ty1,ty2;//Temp value
var timmer;//auto display handle
var hide=true;//Loader's status. true means it's invisiable.
var animationSpeed=800;//animation speed
var shouldShowArea=false;//if program should highlight the current maxi-sum area. with color:yellow
var height,width;//The height and width
function FormatData(changeFlag)
{
    var rect="";
    var data=document.getElementById("inputArea");
    var tmp=data.innerText.split(/ |\n|,|\r|\n\r|[a-z]|[A-Z]/);
    height=0;
    width=0;
    var i;
    for (i=0;i<tmp.length;++i) if (tmp[i].length!=0) {
        height=parseInt(tmp[i]);
        rect="Height: "+tmp[i];
        break;
    }
    for (i=i+1;i<tmp.length;++i) if (tmp[i].length!=0) {
        width=parseInt(tmp[i]);
        rect="Weight: "+tmp[i]+rect;
        break;
    }
    var check=0;
    var pdata=i;
    for (i=i+1;i<tmp.length;++i) if (tmp[i].length!=0) check++;
    if (height!=0 && width!=0 && check==height*width) {
        if (changeFlag) ChangeTable(height,width,tmp,pdata);
        return rect;
    }
    return "";
}
function DataLoad()//Set the load button(load, or down)
{
    $(".panel").slideToggle("slow");
    if (hide) {
        hide=false;
        document.getElementById("showLoad").innerHTML="Done";
    } else {
        hide=true;
        document.getElementById("showLoad").innerHTML="Load";
        var tmp=FormatData(true);
        if (tmp=="") {
            document.getElementById("inputbar").value="";
            document.getElementById("inputbar").removeAttribute("readonly");
        } else {
            document.getElementById("inputbar").value=tmp;
            document.getElementById("inputbar").setAttribute("readonly");
        }
    }
}
function ModeChanged(innum)//set the excute mode. via drop down menu
{
    mode=innum;
    var sm=document.getElementById("selectMode");
    if (mode==0 && sm.innerHTML=="Default") {
        sm.innerHTML="Classic Mode";
    }
    if (mode==1) {
        sm.innerHTML="Classic Mode";
    }
    if (mode==2) {
        sm.innerHTML="Vertical Connected";
    }
    if (mode==3) {
        sm.innerHTML="Horizontal Connected";
    }
    if (mode==4) {
        sm.innerHTML="V &amp; H Connected";
    }
    if (mode==4) mode=3;//Not provided yet
    return mode;
}
function ChangeTable(width,height,data,pdata)//update the row and table (random value
{
    if (width==0) return;
    if (height==0) return;
    var ptable=document.getElementById("mytable");
    var prow=document.getElementById("myrow");
    var pcont=prow.parentNode;
    var tmp,subtmp,subsubtmp;
    pcont.removeChild(ptable);
    pcont.removeChild(prow);
    //row
    prow=document.createElement("table");
    prow.setAttribute("class","table table-bordered");
    prow.setAttribute("id","myrow");
    prow.setAttribute("style","Display:none;table-layout:fixed;margin-top:15px;");
    pcont.appendChild(prow);
    tmp=document.createElement("tbody");
    prow.appendChild(tmp);
    subtmp=document.createElement("tr");
    subtmp.setAttribute("align","center");
    for (var j=0;j!=width;++j) {
        subsubtmp=document.createElement("td");
        subtmp.appendChild(subsubtmp);
        subsubtmp.innerHTML=0;
        subsubtmp.setAttribute("contenteditable","false");
    }
    tmp.appendChild(subtmp);
    //table
    ptable=document.createElement("table");
    ptable.setAttribute("class","table table-bordered");
    ptable.setAttribute("id","mytable");
    ptable.setAttribute("style","Display:none;table-layout:fixed;margin-top:15px;");
    pcont.appendChild(ptable);
    tmp=document.createElement("tbody");
    ptable.appendChild(tmp);
    for (var i=0;i!=height;++i) {
        subtmp=document.createElement("tr");
        subtmp.setAttribute("align","center");
        for (var j=0;j!=width;++j) {
            subsubtmp=document.createElement("td");
            subtmp.appendChild(subsubtmp);
            if (data.length==0) subsubtmp.innerHTML=Math.floor(Math.random()*100-50);
            else {
                for (pdata=pdata+1;data[pdata].length==0;++pdata);
                subsubtmp.innerHTML=data[pdata];
            }
            subsubtmp.setAttribute("contenteditable","true");
        }
        tmp.appendChild(subtmp);
    }
    
    $(document).ready(function(){
                      $(".table").fadeIn(animationSpeed);
                      });
}
function RefreshTable()//to update the table, there are some prepareation need to be down. call this function before call ModeChanged
{
    var tmp=document.getElementById("inputbar");
    var str=tmp.value.split(/ |,|[a-z]|[A-Z]/);
    height=0,width=0;
    for (var i=0;i!=str.length;++i) {
        if (str[i].length!=0) {
            if (height==0) height=parseInt(str[i]);
            else width=parseInt(str[i]);
        }
    }
    if (height>23) height=0;
    if (width>23) width=0;
    if (height==0) width=0;
    if (width==0) height=0;
    $(document).ready(function(){
                      $(".table").fadeOut(animationSpeed);
                      });
    setTimeout(function()
               {
               ChangeTable(width,height,"","");
               },animationSpeed)
}
function HighlightRow(top,bottom)//highlight table's row from top to bottom
{
    var ptable=document.getElementById("mytable");
    var trs=ptable.getElementsByTagName("tr");
    for (var i=0;i!=trs.length;++i) {
        if (top<=i && i<=bottom) {
            trs[i].setAttribute("class","success");
        } else {
            trs[i].setAttribute("class","default");
        }
    }
}
function HighlightColumn(left,right)//highlight columns in one single row(the first table) from left to right
{
    var pcont=document.getElementById("mycont");
    var ptable=document.getElementById("myrow");
    var ths=ptable.getElementsByTagName("td");
    for (var i=0;i!=ths.length;++i) {
        if (left<=i && i<=right) {
            ths[i].setAttribute("class","success");
        } else {
            ths[i].setAttribute("class","default");
        }
    }
}
function HighlightArea(top,left,bottom,right,str)//high light rectangle in table from (top,left) to (bottom,right) with color str.
{
    var ptable=document.getElementById("mytable");
    var trs=ptable.getElementsByTagName("tr");
    var tds;
    for (var i=0;i!=trs.length;++i) {
        tds=trs[i].getElementsByTagName("td");
        for (var j=0;j!=tds.length;++j)
            if (top<=i && i<=bottom && left<=j && j<=right)
                tds[j].setAttribute("class",str);
            else tds[j].setAttribute("class","default");
    }
}
function GetMatrix(ediable)//Load matrix from table to arr. and set matrix gird to ediable(true/false)
{
    var ptable=document.getElementById("mytable");
    var trs=ptable.getElementsByTagName("tr");
    if (trs.length==0) return false;
    if (trs[0].getElementsByTagName("td").length==0) return false;
    arr=new Array();
    var ths;
    for (var i=0;i!=trs.length;++i) {
        arr[i]=new Array();
        ths=trs[i].getElementsByTagName("td");
        for (var j=0;j!=ths.length;++j) {
            arr[i][j]=parseInt(ths[j].innerHTML);
            ths[j].setAttribute("contenteditable",ediable);
        }
    }
    return true;
}
function Reverse()//rotate table 90 degree
{
    var width=arr.length;
    var height=arr[0].length;
    var pcont=document.getElementById("mycont");
    var ptable=document.getElementById("mytable");
    var tmp,subtmp,subsubtmp;
    pcont.removeChild(ptable);
    ptable=document.createElement("table");
    ptable.setAttribute("class","table table-bordered");
    ptable.setAttribute("id","mytable");
    pcont.appendChild(ptable);
    tmp=document.createElement("tbody");
    ptable.appendChild(tmp);
    for (var i=0;i!=height;++i) {
        subtmp=document.createElement("tr");
        for (var j=0;j!=width;++j) {
            subsubtmp=document.createElement("td");
            subtmp.appendChild(subsubtmp);
            subsubtmp.innerHTML=arr[j][i];
        }
        tmp.appendChild(subtmp);
    }
    GetMatrix("false");
}
function NegMatrix()//all number in table be assigned to it's opposite.
{
    for (var i=0;i!=arr.length;++i) {
        for (var j=0;j!=arr[i].length;++j) {
            arr[i][j]=-arr[i][j];
        }
    }
}
function InitResult()// Initialization result array
{
    result=new Array();
    for (var i=0;i!=10;++i) {
        result[i]=new Array();
    }
}
function Solve()//Calculate the DP problem
{
    var interResult,now,tot;//now means the connected area in interResult
    bval=-9999999;//This is not a magic number , this is NINF, initiallization best value
    for (var t=0;t!=arr.length;++t) {
        for (var b=t;b!=arr.length;++b) {
            //Get the sum number of array
            tot=0;
            interResult=new Array();
            for (var i=t;i<=b;++i) {
                for (var j=0;j!=arr[i].length;++j) {
                    if (i==t) {
                        interResult[j]=arr[i][j];
                    } else {
                        interResult[j]+=arr[i][j];
                    }
                    tot+=arr[i][j];
                }
            }
            for (var i=0;i!=interResult.length;++i) {
                if (i!=0 && (interResult[i]+interResult[i-1]>interResult[i])) {
                    interResult[i]=interResult[i]+interResult[i-1];
                } else {
                    now=i;//not connected with prev
                }
                if (interResult[i]>bval) {
                    bval=interResult[i];
                    bx1=t; by1=now;
                    bx2=b; by2=i;
                }
                result[0][pr]=t;//record the current process, top border
                result[1][pr]=b;//record the current process, bottom border
                result[2][pr]=now;//record the tmp max area in l border
                result[3][pr]=i;//record the tmp max area in r border
                result[4][pr]=bx1;//record the max area
                result[5][pr]=by1;
                result[6][pr]=bx2;
                result[7][pr]=by2;
                result[8][pr]=bval;//record best value
                result[9][pr]=tot;//record the total number
                pr++;
            }
        }
    }
}
function Display()//Display next frame(single-step)
{
    if (pr==psr) {
        document.getElementById("pause").innerHTML=="<b>&nbsp;Pause&nbsp;&nbsp;</b>"
        document.getElementById("pause").setAttribute("class","btn btn btn-warning");
        clearInterval(timmer)
        return;
    }
    //Update my row data
    var tmp=new Array();
    for (var i=result[0][psr];i<=result[1][psr];++i)
        for (var j=0;j!=arr[i].length;++j)
            if (i==result[0][psr]) tmp[j]=arr[i][j];
            else tmp[j]+=arr[i][j];
    var prow=document.getElementById("myrow");
    var tds=prow.getElementsByTagName("td");
    for (var i=0;i!=tds.length;++i)tds[i].innerHTML=tmp[i];
    HighlightRow(result[0][psr],result[1][psr]);
    HighlightColumn(result[2][psr],result[3][psr]);
    if (shouldShowArea)
        HighlightArea(result[4][psr],result[5][psr],result[6][psr],result[7][psr],"warning");
    document.getElementById("ans").innerHTML="<b>Answer: "+result[8][psr]+"</b>";
    psr++;
}
function PrevDis()//DIsplay prev frame(single-step)
{
    /*
    if (psr==0) { return; }
    psr--;//Back 1
    if (psr<=0) { psr=1; return; }
    if (psr>=pr) return;
    psr--;
    //Update my row data
    var tmp=new Array();
    for (var i=result[0][psr];i<=result[1][psr];++i)
        for (var j=0;j!=arr[i].length;++j)
            if (i==result[0][psr]) tmp[j]=arr[i][j];
            else tmp[j]+=arr[i][j];
    var prow=document.getElementById("myrow");
    var tds=prow.getElementsByTagName("td");
    for (var i=0;i!=tds.length;++i)tds[i].innerHTML=tmp[i];
    HighlightRow(result[0][psr-1],result[1][psr-1]);
    HighlightColumn(result[2][psr-1],result[3][psr-1]);
     */
    if (psr<=1) {return};//if psr<=1 then can not show prev
    psr-=2;
    Display();
}
function StopCalcu()//Pause the process
{
    var tmp=document.getElementById("pause");
    if (tmp.innerHTML=="<b>&nbsp;Pause&nbsp;&nbsp;</b>") {
        clearInterval(timmer);
        if (psr==pr) return;
        tmp.innerHTML="<b>Resume</b>";
        tmp.setAttribute("class","btn btn btn-success");
    } else {
        timmer=setInterval(Display,1000);
        tmp.innerHTML="<b>&nbsp;Pause&nbsp;&nbsp;</b>";
        tmp.setAttribute("class","btn btn btn-warning");
    }
    
}
function StopAll()//Stop current process. release table and input box. user can change the data again
{
    var tmp=document.getElementById("inputbar");
    if (FormatData(false)=="") tmp.removeAttribute("readonly");
    ChangeButtonFunc(true);
    clearInterval(timmer);
    document.getElementById("pause").innerHTML="<b>&nbsp;Pause&nbsp;&nbsp;</b>";
    document.getElementById("pause").setAttribute("class","btn btn btn-warning");
    pr=0;
    psr=0;
    HighlightRow(0,-1);
    HighlightColumn(0,-1);
    GetMatrix("true");
    document.getElementById("ans").innerHTML="<b>MaxValue</b>";
}
function ShowArea()//Set the maxi-sub rectangle shoule be draw with yellow
{
    shouldShowArea=true;
    if (psr==0) return;
    HighlightArea(result[4][psr-1],result[5][psr-1],result[6][psr-1],result[7][psr-1],"warning");
}
function HideArea()//Clear the maxi-sub rectangle's yellow color
{
    shouldShowArea=false;
    if (psr==0) return;
    HighlightArea(result[4][psr-1],result[5][psr-1],result[6][psr-1],result[7][psr-1],"default");
    psr--;
    Display();
}
function ChangeButtonFunc(flag)//Some buttons, when you click it,it's context will be changed. you can find it here.
{
    if (!flag) {
        var loadbutton=document.getElementById("run");//Load at this place means run
        var runbutton=document.getElementById("showLoad");//run means load
        loadbutton.setAttribute("class","btn btn-danger");
        runbutton.setAttribute("class","btn btn-warning");
        loadbutton.setAttribute("id","stop");
        runbutton.setAttribute("id","showArea");
        loadbutton.innerHTML="<b>Stop&nbsp;</b>";
        runbutton.innerHTML="<b>Show</b>";
        loadbutton.setAttribute("onclick","StopAll()");
        runbutton.setAttribute("onclick","");
        runbutton.setAttribute("onmouseover","ShowArea()");
        runbutton.setAttribute("onmouseout","HideArea()");
    } else {
        var loadbutton=document.getElementById("showArea");
        var runbutton=document.getElementById("stop");
        loadbutton.setAttribute("class","btn btn-success");
        runbutton.setAttribute("class","btn btn-success");
        loadbutton.setAttribute("id","showLoad");
        runbutton.setAttribute("id","run");
        loadbutton.innerHTML="<b>Load</b>";
        runbutton.innerHTML="<b>&nbsp;Run&nbsp;</b>";
        loadbutton.setAttribute("onclick","DataLoad()");
        runbutton.setAttribute("onclick","Calculation()");
        runbutton.setAttribute("onmouseover","");
    }
}
function Calculation()//When user click start, this main function will be call to clock the table, and start process.
{
    if (!GetMatrix("false")) return;
    ChangeButtonFunc(false);
    if (mode==3) {
        mode=2;
        Reverse();
    }
    InitResult();
    pr=0;
    bval=arr[0][0];
    bx1=0;by1=0;bx2=0;by2=0;
    Solve();
    if (mode==2) {
        for (var i=0;i!=arr.length;++i) {
            arr[i][pr]=-1;
        }
        NegMatrix();
        Solve();
    }
    psr=0;
    GetMatrix("false");
    timmer=setInterval(Display,1000);
    var tmp=document.getElementById("inputbar");
    tmp.setAttribute("readonly");
}