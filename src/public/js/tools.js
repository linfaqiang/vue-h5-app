/**
 * @file
 * @author
 */
var tools = {
    MONTH_NAMES : ["\u4e00\u6708", "\u4e8c\u6708", "\u4e09\u6708", "\u56db\u6708", "\u4e94\u6708", "\u516d\u6708", "\u4e03\u6708", "\u516b\u6708", "\u4e5d\u6708", "\u5341\u6708", "\u5341\u4e00\u6708", "\u5341\u4e8c\u6708", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    DAY_NAMES : ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    //时间格式化
    formatDate : function(objDate , strFormat){
        var format = strFormat || "yyyy-mm-dd HH:nn:ss";
        var date = (objDate instanceof Date) ? objDate : new Date(objDate);
        format=format+"";
        var result="";
        var i_format=0;
        var c="";
        var token="";
        var yyyy=date.getFullYear();
        var m=date.getMonth()+1;
        var d=date.getDate();
        var w=date.getDay();
        var h=date.getHours();
        var n=date.getMinutes();
        var s=date.getSeconds();
        var sss=date.getMilliseconds();

        var value = [];
        //年份
        value["y"]=(yyyy<2000)?yyyy-1900:yyyy;
        value["yyyy"]=yyyy;
        value["yy"]=yyyy.toString().substring(2,4);
        //月份
        value["m"]=m;
        value["mm"]=this.appendZero(m);
        value["mmm"]=this.MONTH_NAMES[m-1];
        value["MM"]=this.MONTH_NAMES[m+11];
        value["M"]=this.MONTH_NAMES[m+23];
        //天
        value["d"]=d;
        value["dd"]=this.appendZero(d);
        //星期
        value["w"]=w;
        value["ww"]=this.DAY_NAMES[w];
        value["W"]=this.DAY_NAMES[w+14];
        value["WW"]=this.DAY_NAMES[w+7];
        //小时
        value["H"]=h;
        value["HH"]=this.appendZero(h);
        if (h==0){value["h"]=12;}
        else if (h>12){value["h"]=h-12;}
        else {value["h"]=h;}
        value["hh"]=this.appendZero(value["h"]);
        if (h>11){value["K"]=h-12;} else {value["K"]=h;}
        value["k"]=h+1;
        value["KK"]=this.appendZero(value["K"]);
        value["kk"]=this.appendZero(value["k"]);
        if (h > 11) { value["a"]="PM"; }
        else { value["a"]="AM"; }
        //分钟
        value["n"]=n;
        value["nn"]=this.appendZero(n);
        //秒
        value["s"]=s;
        value["ss"]=this.appendZero(s);
        //毫秒
        value["sss"]=sss;

        while(i_format < format.length){
            c=format.charAt(i_format);
            token="";
            while((format.charAt(i_format)==c) && (i_format<format.length)){
                token += format.charAt(i_format++);
            }
            if (value[token] != null) {
                result += value[token];
            }
            else{
                result += token;
            }
        }
        return result;
    },
    //时间增加(Number为负时,是减少)
    dateAdd : function(strInterval, Number,date){
        var dtTmp = date || new Date();
        switch (strInterval) {
            case 's': //秒
                return new Date(dtTmp.getTime() + (1000 * Number));
            case 'n': //分钟
                return new Date(dtTmp.getTime() + (60000 * Number));
            case 'h': //小时
                return new Date(dtTmp.getTime() + (3600000 * Number));
            case 'd': //天
                return new Date(dtTmp.getTime() + (86400000 * Number));
            case 'w': //周
                return new Date(dtTmp.getTime() + ((86400000 * 7) * Number));
            case 'q': //季度
                return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            case 'm': //月
                return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            case 'y': //年
                return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        }
    },
    appendZero : function(x){
        return(x<0||x>9?"":"0")+x;
    }
};
export {tools};
