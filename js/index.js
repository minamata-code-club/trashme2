/* 
 *  Copyright © 2021 EugenesWorks:zDGVDzRz.
 *  author : EugenesWorks(https://eugenesworks.com)
 *  version : 1.1
 *  This is MITLicense.
 */

const INFO = document.getElementById("infolbl");
const NEWINFO = document.getElementById("info");
const CALRD = document.getElementById("cal");

const INFOLAY = document.getElementById("info-ctr");
const CALLAY = document.getElementById("cal-ctr");
const METHODLAY = document.getElementById("method-ctr");
const SPLASHLAY = document.getElementById("splash");
const DIALOGLAY = document.getElementById("dialoglay");
const DIALOGMESSAGE = document.getElementById("message");
const NEXTPAGELAY = document.getElementById("page-ctr");
const RESULTBOX = document.getElementById("resultbox");

const SAVEKEY = "TRASHME2";
const KONNAN = 1,GYOUSYA = 2,KADEN = 3,SANPAI = 4,KATEI = 5,CAL = 6,JYOUHOU = 7,SETTEI = 8,QRCODE = 100;
const GID = "1iEfRBK2hmTxA39yBrqK_AtkKuwd1xNG_zagIxINvMjw";

var gcal = "http://www.google.com/calendar/event?action=TEMPLATE&text=@TITLE&details=@DETAIL&location=@LOCN&dates=@DATE";
var SAVEVALS = [0,""];

var kateiDatas = {names:"",genre:"",method:""};
var calDatas = {year:"",names:"",alls:"",pps:""};
var jyouhouDatas = {date:"",value:""};
var setteiDatas = {about:"",contact:"",burn1:"",burn2:"",pla:"",ver:""};

window.addEventListener("DOMContentLoaded", function(){
    ini();
},false);

window.addEventListener("orientation", function(){
    checkMobile();
},true);

window.addEventListener("resize", function(){
    checkMobile();
},false);

function ini(){
    setTimeout( function() {
        ajaxStart(CAL);
        ajaxStart(KATEI);
        ajaxStart(JYOUHOU);
        ajaxStart(SETTEI);
    }, 800 );
}

function setupView(PAGE,obj){
    var data = obj.responseText;
    analysJson(PAGE,JSON.parse(data));
    switch(PAGE){
        case KONNAN:
            
            break;
        case GYOUSYA:
            
            break;
        case KADEN:
            
            break;
        case SANPAI:
            
            break;
        case KATEI:
            setupKatei();
            break;
        case CAL:
            checkbeginer();
            break;
        case JYOUHOU:
            setupJyouhou();
            break;
        case SETTEI:
            setContact();
            break;
    }
}

function setContact(){
    var ctlink = document.getElementById("contact");
    if(setteiDatas.contact.length > 0){
        ctlink.href = setteiDatas.contact;
    }
}

function callAbout(){
    callDialog("Versions" + setteiDatas.ver + "\n\n" + setteiDatas.about);
}

function setupJyouhou(){
    if(jyouhouDatas.date.length > 0){
        jyouhouDatas.date = jyouhouDatas.date.split(",");
        jyouhouDatas.value = jyouhouDatas.value.split(",");
        var jsize = jyouhouDatas.date.length;
        var html = "<dl>";
        html += "<dt>" + jyouhouDatas.date[jsize - 2] + "</dt><dd>" + jyouhouDatas.value[jsize - 2] + "</dd>";
        html += (jsize > 2?"<dt>" + jyouhouDatas.date[jsize - 3] + "</dt><dd>" + jyouhouDatas.value[jsize - 3] + "</dd>":"");
        var latestlay = document.getElementById("latest");
        latestlay.innerHTML = html;
    }
}

function setupKatei(){
    if(kateiDatas.names.length > 0){
        kateiDatas.names = kateiDatas.names.split(",");
        kateiDatas.genre = kateiDatas.genre.split(",");
        kateiDatas.method = kateiDatas.method.split(",");
        var html = "";
        for(let n = 0; n < kateiDatas.names.length - 1;n++){
            html += "<li alt='" + n + "," + KATEI + "' " + (kateiDatas.genre[n].indexOf("ません") === -1?"class='sl'":"class='ng sl'") + ">" + kateiDatas.names[n] + "</li>";
        }
        RESULTBOX.innerHTML = html;
    }
}

function serchKateiList(keyword){
    var lists = document.getElementsByClassName("sl");
    for(let l = 0;l < lists.length;l++){
        if(keyword.length === 0){
            lists[l].style.display = "block";
        }else if(lists[l].innerText.indexOf(keyword) > -1){
            lists[l].style.display = "block";
        }else{
            lists[l].style.display = "none";
        }
    }
}

function checkbeginer(){
    SPLASHLAY.style.display = "none";
    if(window.localStorage){
        var pds = localStorage.getItem(SAVEKEY);
        loadDatas();
        if(pds !== null && pds.length > 0){
            setCalender(SAVEVALS);
        }else{
            callDialog(getFirstMessage());
            setCalender("");
        }
    }else{
        callDialog("ERROR:ブラウザが対応していません。");
    }
}

function setCalender(setting){
    CALLAY.scrollTop = 0;
    CALLAY.innerHTML = "";
    var html = "<ol onclick='evtcheck()'>";
    if(calDatas.names.length !== 0){
        if(!Array.isArray(calDatas.names)){
            calDatas.names = calDatas.names.split(",");
            calDatas.alls = calDatas.alls.split(";");
            calDatas.pps = calDatas.pps.split(";");
        }
        for(let n = 0; n < calDatas.names.length - 1;n++){
            html += "<li alt='" + n + "," + CAL + "'>" + calDatas.names[n] + "</li>";
        }
        html += "</ol>";
    }
    if(setting.length !== 0 && SAVEVALS[1].length > 0){
        checkNewInfo();
        var location = SAVEVALS[1];
        var idx = calDatas.names.indexOf(location);
        if(idx > -1){
            var dashbord = "";
            var hml = "";
            var now = new Date();
            var date = new Date(calDatas.year,"12","31");
            if(now.getFullYear() > date.getFullYear()){
                dashbord = "<p class='redbtn center'>カレンダー情報が更新されていません。</p>";
            }else{
                var mth = now.getMonth() + 1;
                var amth = mth;
                var pmth = mth;
                var allday = calDatas.alls[idx].split(",")[mth - 4];
                var ppday = calDatas.pps[idx].split(",")[mth - 4];
                if(now.getTime() >= new Date(calDatas.year,mth - 1,allday).getTime()){
                    amth++;
                    allday = calDatas.alls[idx].split(",")[amth - 4];
                }
                if(now.getTime() >= new Date(calDatas.year,mth - 1,ppday).getTime()){
                    pmth++;
                    ppday = calDatas.pps[idx].split(",")[pmth - 4];
                }
                var dayslefta = (new Date(calDatas.year,amth - 1,allday) - now);
                var daysleftp = (new Date(calDatas.year,pmth - 1,ppday) - now);
                var addcalall = gcal.replace("@TITLE",calDatas.names[idx] + "の全品目収集日");
                addcalall = addcalall.replace("@DETAIL",calDatas.names[idx] + "の全品目収集日です。午前8時30分までに所定の場所にルールを守って捨てて下さい。");
                addcalall = addcalall.replace("@LOCN",calDatas.names[idx] + "の全品目収集場所");
                var alldate = calDatas.year + (amth.toString().length === 1?"0" + amth:amth) + (allday.length === 1?"0" + allday:allday);
                alldate = alldate + "T060000/" + alldate + "T083000";
                addcalall = addcalall.replace("@DATE",alldate);
                var addcalpp = gcal.replace("@TITLE",calDatas.names[idx] + "の紙・ペットボトル収集日");
                addcalpp = addcalpp.replace("@DETAIL",calDatas.names[idx] + "の全品目収集日です。午前8時30分までに所定の場所にルールを守って捨てて下さい。");
                addcalpp = addcalpp.replace("@LOCN",calDatas.names[idx] + "の全品目収集場所");
                var ppdate = calDatas.year + (pmth.toString().length === 1?"0" + pmth:pmth) + (ppday.length === 1?"0" + ppday:ppday);
                ppdate = ppdate + "T060000/" + ppdate + "T083000";
                addcalpp = addcalpp.replace("@DATE",ppdate);
                
                dashbord = "<div class='dsb'><h4 class='left'>次の全品目収集日まで</h4><p class='bigorange allbackimg'>" + Math.floor(dayslefta / 86400000) + "日";
                dashbord += "</p><p class='right'><a class='btn bluebtn' href='" + addcalall + "' target='_blank' rel='noopener noreferrer'>カレンダーに追加</a></p>";
                dashbord += "<h4 class='left'>次の紙・ペットボトル収集日まで</h4><p class='bigorange ppbackimg'>" + Math.floor(daysleftp / 86400000) + "日";
                dashbord += "</p><p class='right'><a class='btn bluebtn' href='" + addcalpp + "'  target='_blank' rel='noopener noreferrer'>カレンダーに追加</a></p>";
                hml = "<p>次の全品目収集日は" + amth + " / " + allday + ",紙・ペットボトル収集日は" + pmth + " / " + ppday + "です。</p>";
            }
            hml += getBurnday(calDatas.names[idx]);
            hml += "<p>廃プラは" + setteiDatas.pla + "です。</p></div>";
            html = "<h3>" + calDatas.year + "年度 " + location + "</h3>" + dashbord + "<div class='left'>" + hml + "</div>" + html;
        }else{
            html = "<h5>" + calDatas.year + "年度</h5>" + html;
            html = "<img src='img/mylocation.svg' alt=''/><p>あなたが住んでいる区を登録しましょう。</p>" + html;
        }
    }else{
        html = "<h5>" + calDatas.year + "年度</h5>" + html;
        html = "<img src='img/mylocation.svg' alt=''/><p>あなたが住んでいる区を登録しましょう。</p>" + html;
    }
    CALLAY.insertAdjacentHTML("afterbegin",html);
}

function evtcheck(evt){
    evt = event;
    var tgt = evt.srcElement.getAttribute("alt");
    if(tgt !== "undefind" || tgt !== null){
        var tgts = tgt.split(",");
        nextPage(eval(tgts[0]),eval(tgts[1]));
    }
}

function nextPage(n,sw){
    var title = document.getElementById("page-title");
    if(sw === CAL){
        NEXTPAGELAY.innerHTML = "";
        title.innerText = calDatas.names[n];
        var html = "<h5>" + calDatas.names[n] + "</h5>";
        html += "<p><a class='btn redbtn' onclick='savelocasion("+ n +")'>この区を端末に登録する</a><a class='btn' onclick='backPage()'>戻る</a></p>";
        html += "<h6>全品目</h6><p>";
        var all = "";
        var pp = "";
        var alls = calDatas.alls[n].split(",");
        var pps = calDatas.pps[n].split(",");
        var asize = alls.length - 1;
        for(let t = 0;t < asize;t++){
            all += (t > 8?t - 8:t + 4) + "/" + alls[t] + (t === asize - 1?"":" , ");
            pp += (t > 8?t - 8:t + 4) + "/" + pps[t] + (t === asize - 1?"":" , ");
        }
        html += all + "</p><h6>紙・ペットボトル</h6><p>" + pp + "</p>";
        html += getBurnday(calDatas.names[n]);
        html += "<p>廃プラは" + setteiDatas.pla + "です。</p>";
        NEXTPAGELAY.innerHTML = html;
        NEXTPAGELAY.style.display = "block";
    }else if(sw === KATEI){
        title.innerText = kateiDatas.names[n];
        var html = "<h6>" + kateiDatas.genre[n] + "</h6><p class='select'>" + (kateiDatas.method[n] === "_"?"特になし":kateiDatas.method[n]) + "</p>";
        NEXTPAGELAY.insertAdjacentHTML("beforeend",html);
        NEXTPAGELAY.style.display = "block";
    }else if(sw === JYOUHOU){
        title.innerText = "情報履歴";
        var html = "<dl>";
        for(let d = 0;d < jyouhouDatas.date.length;d++){
            html += "<dt>" + jyouhouDatas.date[d] + "</dt><dd>" + jyouhouDatas.value[d] + "</dd>";
        }
        html += "</dl>";
        NEXTPAGELAY.insertAdjacentHTML("beforeend",html);
        NEXTPAGELAY.style.display = "block";
    }else if(sw === KONNAN){
        title.innerText = "主な処理困難物";
        var html = '<iframe style="width:100%;height:70vh;" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9nN_5EsINp7M1_QzYYWfx29D7Hu-3LQ76lhYxlU3PqnaeGx7xqVpgbwmFw1llQAH4xSQFsx5_e4f/pubhtml?gid=1677861383&amp;single=true&amp;widget=true&amp;headers=false"></iframe>';
        NEXTPAGELAY.insertAdjacentHTML("beforeend",html);
        NEXTPAGELAY.style.display = "block";
    }else if(sw === GYOUSYA){
        title.innerText = "市内業者一覧";
        var html = '<iframe style="width:100%;height:70vh;" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9nN_5EsINp7M1_QzYYWfx29D7Hu-3LQ76lhYxlU3PqnaeGx7xqVpgbwmFw1llQAH4xSQFsx5_e4f/pubhtml?gid=297598915&amp;single=true&amp;widget=true&amp;headers=false"></iframe>';
        NEXTPAGELAY.insertAdjacentHTML("beforeend",html);
        NEXTPAGELAY.style.display = "block";
    }else if(sw === KADEN){
        title.innerText = "家電・パソコンリサイクル";
        var html = '<iframe style="width:100%;height:70vh;" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9nN_5EsINp7M1_QzYYWfx29D7Hu-3LQ76lhYxlU3PqnaeGx7xqVpgbwmFw1llQAH4xSQFsx5_e4f/pubhtml?gid=571384392&amp;single=true&amp;widget=true&amp;headers=false"></iframe>';
        NEXTPAGELAY.insertAdjacentHTML("beforeend",html);
        NEXTPAGELAY.style.display = "block";
    }else if(sw === SANPAI){
        title.innerText = "産業廃棄物の区分";
        var html = '<iframe style="width:100%;height:70vh;" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9nN_5EsINp7M1_QzYYWfx29D7Hu-3LQ76lhYxlU3PqnaeGx7xqVpgbwmFw1llQAH4xSQFsx5_e4f/pubhtml?gid=519506152&amp;single=true&amp;widget=true&amp;headers=false"></iframe>';
        NEXTPAGELAY.insertAdjacentHTML("beforeend",html);
        NEXTPAGELAY.style.display = "block";
    }else if(QRCODE){
        title.innerText = "リンク表示";
        var thislink =  location.href;
        var html = '<p><small>' + thislink + '</small></p><div id="qr" class="center"></div>';
        NEXTPAGELAY.insertAdjacentHTML("beforeend",html);
        NEXTPAGELAY.style.display = "block";
        jQuery('#qr').qrcode({width:250,height:250,text:thislink,});
    }
}

function backPage(){
    NEXTPAGELAY.innerHTML = "<h5 id='page-title'></h5><p><a class='btn' onclick='backPage()'>戻る</a></p>";
    NEXTPAGELAY.style.display = "none";
}

function savelocasion(n){
    SAVEVALS[1] = calDatas.names[n];
    saveDatas();
    setCalender(SAVEVALS);
    backPage();
}

function saveDatas(){
    localStorage.setItem(SAVEKEY, JSON.stringify(SAVEVALS));
}
function loadDatas(){
    var data = localStorage.getItem(SAVEKEY);
    if(data !== null){
        SAVEVALS = JSON.parse(data);
    }
}
function clearDatas(){
    localStorage.removeItem(SAVEKEY);
    setCalender("");
    callDialog("情報の閲覧データと区の登録データを削除しました。");
}

function getBurnday(key0){
    var str = "";
    var key = key0.replace("全域","");
    if(setteiDatas.burn1.indexOf(key) > -1){
        str = "<p>燃やすごみ・生ごみは毎週月曜日と木曜日です。</p>";
    }else if(setteiDatas.burn2.indexOf(key) > -1){
        str = "<p>燃やすごみ・生ごみは毎週火曜日と金曜日です。</p>";
    }else{
        key = key.replace("区","");
        var keys = key.split("・");
        var mt = "",tf = "";
        for(let k = 0;k < keys.length;k++){
            if(setteiDatas.burn1.indexOf(keys[k]) > -1){
                mt += keys[k] + (k === keys.length - 1? "":"・");
            }else if(setteiDatas.burn2.indexOf(keys[k]) > -1){
                tf += keys[k] + (k === keys.length - 1? "":"・");
            }
        }
        if(mt.length > 0 && tf.length > 0){
            str = "<p>燃やすごみ・生ごみは" + (mt.length > 0? mt +"は毎週月曜日と木曜日です。":"") + (tf.length > 0? tf + "は毎週火曜日と金曜日です。":"") + "</p>";
        }else{
            str = mt.length > 0?"<p>燃やすごみ・生ごみは毎週月曜日と木曜日です。</p>":"<p>燃やすごみ・生ごみは毎週火曜日と金曜日です。</p>";
        }
    }
    
    return str;
}

function analysJson(PAGE,json){
    var fsize = json.feed.entry.length;
    var content = "";
    var tmpcts = new Array();
    var tmps = new Array();
    for(let i = 0;i < fsize;i++){
        content = json.feed.entry[i].content.$t;
        switch(PAGE){
            case CAL:
                if(i === 0){
                    calDatas.year = json.feed.entry[i].title.$t;
                }
                tmpcts = content.split(",");
                for(let c =  0;c < tmpcts.length;c++){
                    tmps = tmpcts[c].split(":",2);
                    if(c === 0){
                        if(calDatas.names.indexOf(tmps[1].trim()) === -1){
                            calDatas.names += tmps[1].trim() + ",";
                        }
                    }else if(c > 1){
                        if(content.indexOf("全品目") !== -1){
                            calDatas.alls += tmps[1].trim() + ",";
                        }else{
                            calDatas.pps += tmps[1].trim() + ",";
                        }
                    }
                }
                if(content.indexOf("全品目") !== -1){
                    calDatas.alls += ";";
                }else{
                    calDatas.pps += ";";
                }
                break;
            case KATEI:
                tmpcts = content.split(",");
                for(let c =  0;c < tmpcts.length;c++){
                    tmps = tmpcts[c].split(":",2);
                    if(c === 0){
                        kateiDatas.names += tmps[1].trim() + ",";
                    }else if(c === 1){
                        kateiDatas.genre += tmps[1].trim() + ",";
                    }else{
                        kateiDatas.method += tmps[1].trim() + ",";
                    }
                }
                break;
            case JYOUHOU:
                tmpcts = content.split(",");
                for(let c =  0;c < tmpcts.length;c++){
                    tmps = tmpcts[c].split(":",2);
                    if(c === 0){
                        jyouhouDatas.date += tmps[1].trim() + ",";
                    }else{
                        jyouhouDatas.value += tmps[1].trim() + ",";
                    }
                }
                break;
            case SETTEI:
                tmpcts = content.split(",");
                for(let c =  0;c < tmpcts.length;c++){
                    tmps = tmpcts[c].split(":");
                    if(i === 0){
                        setteiDatas.about = tmps[1].replace(/;/g,"\n");
                    }else if(i === 1){
                        setteiDatas.contact = "https:" + tmps[2];
                    }else if(i === 2){
                        setteiDatas.burn1 = tmps[1];
                    }else if(i === 3){
                        setteiDatas.burn2 = tmps[1];
                    }else if(i === 4){
                        setteiDatas.pla = tmps[1];
                    }else if(i === 5){
                        setteiDatas.ver = tmps[1];
                    }
                }
                break;
        }
    }
}

function ajaxStart(PAGE){
    var httpobj = new XMLHttpRequest();
        if(httpobj){
            httpobj.onreadystatechange = function(){
                if(httpobj.readyState === 4 && httpobj.status === 200){
                    setupView(PAGE,httpobj);
                }else if(httpobj.readyState === 4 && httpobj.status === 0){
                        callDialog("ERROR:読み込みに失敗しました。");
                }
            };
            httpobj.open("get",getGSjsonURL(PAGE));
            httpobj.send(null);
        }else{
            callDialog("ERROR:ブラウザが対応していません。");
        }
}

function callDialog(message){
    if(message.indexOf("ERROR:") === 0){
        DIALOGMESSAGE.style.color = "red";
        document.getElementById("diaclose").style.display = "none";
    }
    DIALOGMESSAGE.innerText = message.replace(":",":\n ");
    DIALOGLAY.style.display = "block";
}
function closeDialog(){
    DIALOGMESSAGE.innerText = "";
    DIALOGLAY.style.display = "none";
}

function getGSjsonURL(i){
    var url = "https://spreadsheets.google.com/feeds/list/" + GID + "/" + i + "/public/values?alt=json";
    return url;
}

function checkNewInfo(){
    if(jyouhouDatas.date.length === eval(SAVEVALS[0])){
        INFO.classList.remove("new");
    }
}

function saveNewInfo(){
    if(jyouhouDatas.date.length !== eval(SAVEVALS[0])){
        SAVEVALS[0] = jyouhouDatas.date.length;
        saveDatas();
        INFO.classList.remove("new");
    }
}

function ischecked(obj){
    var idname = obj.id;
    switch(idname){
        case "info":
            INFOLAY.style.display = "block";
            CALLAY.style.display = "none";
            METHODLAY.style.display = "none";
            saveNewInfo();
            break;
        case "cal":
            INFOLAY.style.display = "none";
            CALLAY.style.display = "block";
            METHODLAY.style.display = "none";
            break;
        case "method":
            INFOLAY.style.display = "none";
            CALLAY.style.display = "none";
            METHODLAY.style.display = "block";
            break;
    }
    checkMobile();
}

function checkMobile(){
    if(window.innerWidth >= 812){
        INFOLAY.style.display = "block";
        if(NEWINFO.checked){
            CALRD.checked = true;
            CALLAY.style.display = "block";
            METHODLAY.style.display = "none";
        }
        saveNewInfo();
    }else{
        if(!NEWINFO.checked && INFOLAY.style.display === "block"){
            INFOLAY.style.display = "none";
        }
    }
}