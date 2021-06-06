
const DEBUG = false;
let reader = new FileReader();
let xlsxflag = true;
let data;
let serverMode = true;
// let refButton, form;
let room = parseInt(room_number);
let viewModel = new (function(){
    const self = this;
    self.room= ko.observable(room || 0);
    self.cycleImages= ko.observableArray([]);
    self.schedule= ko.observableArray([]);
    self.refresh= ko.observable(false);
    self.date= ko.observable(makeDate(new Date()));
    self.busy= ko.observable(true);
    self.roomDetails= {
        NAME: ko.observable(""),
        FIELD: ko.observable(""),
        PICTURE: ko.observable("/pictures/genericDoctor.jpg")
    };
    self.setRoom= function(slot, event) {
        let r = parseInt($(event.currentTarget.children[0]).text()) || 0;
        self.room(r);
        refresh();
        event.stopPropagation();

    };
})();

reader.onload = function (e) {
    reload(e.target.result);
    refresh();
};
function readExcelFile() {
    let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
    /*Checks whether the file is a valid excel file*/

    let excelFile = $("#excelfile");
    if (regex.test(excelFile.val().toLowerCase())) {
        xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
        if (excelFile.val().toLowerCase().indexOf(".xlsx") > 0) {
            xlsxflag = true;
        }
        /*Checks whether the browser supports HTML5*/
        if (!!FileReader) {
            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                reader.readAsArrayBuffer(excelFile[0].files[0]);
            }
            else {
                reader.readAsBinaryString(excelFile[0].files[0]);
            }
        }
        else {
            alert("Sorry! Your browser does not support HTML5!");
        }
    }
    else {
        alert("Please upload a valid Excel file!");
    }
}

let cycleTimePeriod = 7000;
let cycleTimeLapse = 1500;
let cycleInterval;
function reload(d) {
    /*Converts the excel data in to object*/
    let workbook;
    if (xlsxflag) {
        workbook = XLSX.read(d, {type: 'binary'});
    }
    else {
        workbook = XLS.read(d, {type: 'binary'});
    }
    /*Gets all the sheetnames of excel in to a letiable*/
    let sheet_name_list = workbook.SheetNames;
    data = {};
    sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
        /*Convert the cell value to Json*/
        let excelJson;
        if (xlsxflag) {
            excelJson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
        }
        else {
            excelJson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
        }
        if (excelJson.length > 0) {
            data[y] = excelJson;
        }
    });
    if (data.pictures) {
        let pictures = data.pictures.map(e =>
            e.picture);
        viewModel.cycleImages.slice(0);
        pictures.forEach(p => viewModel.cycleImages.push("/images/" + p));
        cycleTimePeriod = data.pictures[0].cycle || cycleTimePeriod;
        cycleTimeLapse = data.pictures[1].cycle || cycleTimeLapse;
        if (!!cycleInterval)
            clearInterval(cycleInterval);
        cycleInterval = setInterval('cycleImages()', cycleTimePeriod);
    }
}

function makeDate(date) {
    let hour = date.getHours(); // 11
    return date.toDateString() + ', ' +
        ('0'+hour).slice(-2) + ':00 - ' +
        ('0'+(hour+1)).slice(-2) + ':00';
}

let refreshTimeout;
function refresh() {
    // alert('refresh');
    viewModel.refresh(false);

    let days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let todayIs = new Date();
    if (DEBUG) console.log(todayIs, 'refresh');
    let today = todayIs.getDay(); // 1
    day = days[today];
    viewModel.date(makeDate(todayIs));
    let schedule = data[day];
    let hour = todayIs.getHours();
    if (schedule) {
        schedule = schedule.filter(function (e) {
            return e.hour === hour.toString();
        });
        if (schedule) schedule = schedule[0];
    }
    let names = [];
    for (r = 1; r < 10; r++) {
        if (schedule && schedule[r] && schedule[r].trim()) {
            if (!viewModel.room() || viewModel.room() === r  ) {
                let n = {name: schedule[r].trim(), room: r};
                let e = details(n, data);
                names.push(e);
            }
        }
    }
    if (!!viewModel.room()) {
        let details = names.filter(n=> n.room === viewModel.room());
        details = !!(details.length) && details[0];
        viewModel.busy(!!details);
        viewModel.roomDetails.PICTURE(details.picture);
        viewModel.roomDetails.FIELD(details.field);
        viewModel.roomDetails.NAME(details.name);
    } else {
        viewModel.schedule.removeAll();
        names.forEach(n=> {
            viewModel.schedule.push(n);
        });
        viewModel.busy(!!(names.length));
    }
    if (!!refreshTimeout)
        clearTimeout(refreshTimeout);
    let seconds = new Date().getSeconds();
    refreshTimeout = setTimeout(checkAndRead, (60 - seconds) * 1000);
}

function details(n, data) {
    let e = {name:'', field:'', picture:'', room:'', gender:''};
    if (!!n && !!n.name) {
        let r = data.names.filter((e)=>e.id===n.name);
        if (!!r && !!r[0]) {
            e = {room: n.room, ...r[0]};
        }
        if (!e.picture) e.picture =
            'GenericDoctor' + {'':'', 'female': '-she', 'male': '-he'}[e.gender] + '.jpg';
        e.picture = '/images/' + e.picture;
    }
    return e;
}
function cycleImages() {
    let $active = $('#cycler .active');
    let $next = ($active.next().length > 0) ? $active.next() : $('#cycler img:first');
    $next.css('z-index',2);//move the next image up the pile
    $active.fadeOut(cycleTimeLapse,function(){//fade out the top image
        $active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
        $next.css('z-index',3).addClass('active');//make the next image the top one
    });
}

function printView() {
    console.log("---------");
    console.log("busy:", viewModel.busy());
    console.log("cycleImages:", viewModel.cycleImages());
    console.log("schedule:", viewModel.schedule());
    console.log("refresh:", viewModel.refresh());
    console.log("date:", viewModel.date());
    console.log("room:", viewModel.room());
    console.log("roomDetails:");
    console.log("\tPICTURE:", viewModel.roomDetails.PICTURE());
    console.log("\tNAME:", viewModel.roomDetails.NAME());
    console.log("\tFIELD:", viewModel.roomDetails.FIELD());
}
$(document).ready(()=> {
    checkServer();
    viewModel.refresh(false);
    // printView();
    ko.applyBindings(viewModel);
    if (!serverMode) {
        $(document).click(() => {
            if (viewModel.room() === 0)
                viewModel.refresh(true);
            else {
                viewModel.room(0);
                refresh();
            }
        });
    } else {
        $(document).click(() => {
            if (viewModel.room() > 0) {
                viewModel.room(0);
                refresh();
            }
        })
    }
});
function checkServer() {
    $.ajax('/', {
        error: (e)=>
            serverMode = false,
        success: (d)=>
            serverMode = true,
        complete: (xhr, msg) => {
            // alert ('serverMode: ' + serverMode);
            console.log("Working in " + (serverMode ? "server" : "local" ) + " mode.")
            if (serverMode)
                checkAndRead();
            else
                viewModel.refresh(true);
        },
    });
}

let lastUpdate;
const readData = () => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/data', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function (e) {
        if (this.status === 200) {
            reload(e.target.response);
            if (DEBUG) console.log('new data from server');
            lastUpdate = new Date();
            refresh();
        } else {
            // serverMode = false;
            // form.show();
        }
     };
    xhr.send();
};
function checkAndRead() {
    if (!serverMode) { refresh(); return;}
    $.ajax('/date',
        {
            success: (d) => {
                if (!lastUpdate || lastUpdate.getTime() < d.time) {
                    readData();
                } else refresh();
            },
            dataType: 'json',
            complete: (xhr, msg) => {
                // alert(msg);
                if (msg !== 'success') refresh();
            },
        });
}
