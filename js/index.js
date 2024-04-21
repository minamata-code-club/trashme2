/* 
 *  Copyright © 2021 EugenesWorks:zDGVDzRz.
 *  author   : EugenesWorks(https://eugenesworks.com)
 *  Version  : 1.6
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
const KONNAN = 1677861383,GYOUSYA = 297598915,KADEN = 571384392,SANPAI = 519506152,KATEI = 1627868233,CAL = 1160243702,JYOUHOU = 561607134,SETTEI = 864168104;
const GID = "1iEfRBK2hmTxA39yBrqK_AtkKuwd1xNG_zagIxINvMjw";

var gcal = "http://www.google.com/calendar/event?action=TEMPLATE&text=@TITLE&details=@DETAIL&location=@LOCN&dates=@DATE";
var SAVEVALS = [0,""];

var kateiDatas = {names:"",genre:"",method:""};
var calDatas = {year:"",names:"",alls:"",pps:""};
var jyouhouDatas = {date:"",value:""};
var setteiDatas = {about:"",contact:"",burn1:"",burn2:"",pla:""};
var setteiMotos = new Array();
var oldInfo = "";

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
        readAllDatas();
    }, 1500 );
}

async function readAllDatas(){
    const urls = [CAL,KATEI,JYOUHOU,SETTEI];
    for (const url of urls) {
        getV4data(url);
      }
}

function getV4data(PAGE){
    var v4url = "https://docs.google.com/spreadsheets/d/" + GID + "/gviz/tq?tqx=out:json&tq&gid=" + PAGE;
    var promiss = fetch(v4url);
    
    promiss.then(function(res){return res.text();})
            .then(function(data){setupView(PAGE,data);});
}

function setupView(PAGE,data){
    analysJson2(PAGE,data);
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
    return true;
}

function analysJson2(PAGE,jsonstr){
    var sectionOne = true;
    var v = jsonstr.replace("/*O_o*/","");
    v = v.replace("google.visualization.Query.setResponse","");
    v = v.replace(/\u203a/g,"※");
    v = v.substring(2,v.length - 2);
    var jd = null;
    jd = JSON.parse(v);
    if(jd !== null){
        var rs = jd.table.rows.length,cs = jd.table.rows[0].c.length;
        var tmpdata = "",tmpv = "",isP = false,ti = -1;
        if(PAGE !== SETTEI){
            for(let r = 0;r < rs;r++){
                for(let c = 0;c < cs;c++){
                    tmpdata = jd.table.rows[r].c[c];
                    if(tmpdata !== null){
                        tmpv = tmpdata.v;
                        switch(PAGE){
                            case CAL:
                                if(r === 0 && c === 0){
                                    calDatas.year = tmpv;
                                }else if(r === 34 && c === 0){
                                    if(parseInt(calDatas.year) < parseInt(tmpv)){
                                        sectionOne = false;
                                        calDatas.year = tmpv;
                                        calDatas.alls = "";
                                        calDatas.pps = "";
                                    }
                                }else if((r >= 0 && r < 34) && c === 1){
                                    if(r%2 === 0){
                                        calDatas.names += tmpv + ",";
                                    }
                                }else if(r >= 0 && c >= 1){
                                    if(c === 2){
                                        if(tmpv.indexOf("全品目") === -1){
                                            isP = true;
                                        }else{
                                            isP = false;
                                        }
                                    }else if(c > 2 && c <= (cs - 2)){
                                        if(!isP){
                                            calDatas.alls += tmpv + ",";
                                        }else if(isP){
                                            calDatas.pps += tmpv + ",";
                                        }
                                    }
                                    if(c === (cs - 2)){
                                        if(!isP){
                                            calDatas.alls += ";";
                                        }else if(isP){
                                            calDatas.pps += ";";
                                        }
                                    }
                                }
                                break;
                                case KATEI:
                                    if(r > 0){
                                        if(c === 1){
                                            kateiDatas.names += tmpv + ",";
                                        }else if(c === 2){
                                            kateiDatas.genre += tmpv + ",";
                                        }else if(c === 3){
                                            kateiDatas.method += tmpv + ",";
                                        }
                                    }
                                break;
                                case JYOUHOU:
                                    if(c === 1){
                                        jyouhouDatas.date += tmpv.replace(/,/g,"\/") + ",";
                                    }else{
                                        jyouhouDatas.value += tmpv + ",";
                                    }
                                break;
                        }
                    }
                }
            }
        }else{
            var c2 = jd.table.cols[3].label.split("@");
            setteiMotos = c2;
            setteiDatas.about = c2[1].replace(/;/g,"\n");
            setteiDatas.contact = c2[2];
            setteiDatas.burn1 = c2[3];
            setteiDatas.burn2 = c2[4];
            setteiDatas.pla = c2[5];
        }
    }else{
        callDialog("ERROR:読み込みに失敗しました。");
    }
}

function setContact(){
    var ctlink = document.getElementById("contact");
    if(setteiDatas.contact.length > 0){
        ctlink.href = setteiDatas.contact;
    }
}

function callAbout(){
    callDialog(setteiDatas.about);
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
    var dashbord = "";
    var now = new Date();
    var date = new Date(calDatas.year,"4","1");
    if(now.getFullYear() > date.getFullYear()){
        oldInfo = "<p class='redbtn center'>カレンダー情報が更新されていません。表示されている情報は古い可能性があります。</p>";
        dashbord = oldInfo;
    }
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
        var locationname = SAVEVALS[1];
        var idx = calDatas.names.indexOf(locationname);
        if(idx > -1){
            var hml = "";
            var mth = now.getMonth() + 1;
            var mmth = now.getMonth() + 1;
            var offsetmth = mth<4?-8:4;
            var allday = calDatas.alls[idx].split(",")[mth - offsetmth];
            var ppday = calDatas.pps[idx].split(",")[mmth - offsetmth];
            if(now >= new Date(calDatas.year + (now.getFullYear() > calDatas.year?1:0),mth - 1,allday)){
                mth++;
                allday = calDatas.alls[idx].split(",")[mth - offsetmth];
            }
            if(now >= new Date(calDatas.year + (now.getFullYear() > calDatas.year?1:0),mmth - 1,ppday)){
                mmth++;
                ppday = calDatas.pps[idx].split(",")[mmth - offsetmth];
            }
            var dayslefta = (new Date(calDatas.year,mth - 1,allday) - now);
            if(now.getFullYear() > calDatas.year){
                dayslefta = (new Date(calDatas.year+1,mth - 1,allday) - now);
            }
            var daysleftp = (new Date(calDatas.year,mmth - 1,ppday) - now);
            if(now.getFullYear() > calDatas.year){
                daysleftp = (new Date(calDatas.year+1,mmth - 1,ppday) - now);
            }
            var addcalall = gcal.replace("@TITLE",calDatas.names[idx] + "の全品目収集日");
            addcalall = addcalall.replace("@DETAIL",calDatas.names[idx] + "の全品目収集日です。午前8時30分までに所定の場所にルールを守って捨てて下さい。");
            addcalall = addcalall.replace("@LOCN",calDatas.names[idx] + "の全品目収集場所");
            var alldate = calDatas.year + (mth.toString().length === 1?"0" + mth:mth) + (allday.length === 1?"0" + allday:allday);
            alldate = alldate + "T060000/" + alldate + "T083000";
            addcalall = addcalall.replace("@DATE",alldate);
            var addcalpp = gcal.replace("@TITLE",calDatas.names[idx] + "の紙・ペットボトル収集日");
            addcalpp = addcalpp.replace("@DETAIL",calDatas.names[idx] + "の全品目収集日です。午前8時30分までに所定の場所にルールを守って捨てて下さい。");
            addcalpp = addcalpp.replace("@LOCN",calDatas.names[idx] + "の全品目収集場所");
            var ppdate = calDatas.year + (mmth.toString().length === 1?"0" + mmth:mmth) + (ppday.length === 1?"0" + ppday:ppday);
            ppdate = ppdate + "T060000/" + ppdate + "T083000";
            addcalpp = addcalpp.replace("@DATE",ppdate);

            var adeff = Math.floor(dayslefta / 86400000);
            var pdeff = Math.floor(daysleftp / 86400000);
            dashbord += "<div class='dsb'><h4 class='left'>次の全品目収集日まで</h4><p class='bigorange allbackimg'>" + (adeff===0?"明":(adeff + 1)) + "日";
            dashbord += "</p><p class='right'><a class='btn bluebtn' href='" + addcalall + "' target='_blank' rel='noopener noreferrer'>カレンダーに追加</a></p>";
            dashbord += "<h4 class='left'>次の紙・ペットボトル収集日まで</h4><p class='bigorange ppbackimg'>" + (pdeff===0?"明":(pdeff + 1)) + "日";
            dashbord += "</p><p class='right'><a class='btn bluebtn' href='" + addcalpp + "'  target='_blank' rel='noopener noreferrer'>カレンダーに追加</a></p>";
            hml = "<p>次の全品目収集日は" + mth + " / " + allday + ",紙・ペットボトル収集日は" + mmth + " / " + ppday + "です。</p>";
            hml += getBurnday(calDatas.names[idx]);
            hml += "<p>廃プラは" + setteiDatas.pla + "です。</p></div>";
            hml += "<p><a class='btn redbtn' onclick='nextPage("+ idx +"," + CAL + ")'>詳しい情報をみる</a>";
            html = "<h3>" + calDatas.year + "年度 " + locationname + "</h3>" + dashbord + "<div class='left'>" + hml + "</div>" + html;
        }else{
            html = "<h5>" + calDatas.year + "年度</h5>" + html;
            html = "<img src='img/mylocation.svg' alt=''/><p>あなたが住んでいる区を登録しましょう。</p>" + html;
        }
    }else{
        html = dashbord + "<h5>" + calDatas.year + "年度</h5>" + html;
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
        var idx = -1;
        if(SAVEVALS[1].length > 0){
            idx = calDatas.names.indexOf(SAVEVALS[1]);
        }
        var recbtn = "<p><a class='btn redbtn' onclick='savelocasion("+ n +")'>この区を端末に登録する</a>";
        if(idx > -1 && idx === n){
            recbtn = "<p><a class='btn kurobtn' onclick='clearDatas2()'>この区を登録解除する</a>";
        }
        html += recbtn + "<a class='btn' onclick='backPage()'>戻る</a></p>";
        html += "<h5>" + calDatas.year + "年度</h5>";
        html += oldInfo;
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
        for(let d = 1;d < jyouhouDatas.date.length;d++){
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
    SAVEVALS = [0,""];
    callDialog("情報の閲覧データと区の登録データを削除しました。");
}
function clearDatas2(){
    backPage();
    clearDatas();
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

function checkupdate(){
    navigator.serviceWorker.getRegistration()
      .then(registration => {
        registration.update();
        location.reload(true);
      });
}