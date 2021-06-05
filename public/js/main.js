
const DEBUG = false;
let reader = new FileReader();
let xlsxflag = true;
let data;
let serverMode = true;
// let refButton, form;
let room = number(room_number);
let viewModel = {
    room: ko.observable(room),
    cycleImages: ko.observableArray(),
    schedule: ko.observableArray(),
    refresh: ko.observable(false),
    date: ko.observable(makeDate(new Date())),
    busy: ko.observable(true),
    roomDetails: {
        NAME: ko.observable(""),
        FIELD: ko.observable(""),
        PICTURE: ko.observable("/pictures/genericDoctor.jpg")
    },
}

reader.onload = function (e) {
    reload(e.target.result);
    ko.applyBindings(viewModel);
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
        // let display = document.getElementById(y);
        // let display = $('#Monday')[0];
        // display.innerText=JSON.stringify(exceljson);
        // $(display).show();
        // }
    });
    if (data.pictures) {
        let pictures = data.pictures.map(e =>
            e.picture);
        // let div = $('#cycler');
        // let inner = '';
        // let first = true;
        viewModel.cycleImages.slice(0);
        pictures.forEach(p => viewModel.cycleImages.push("/images/" + p))
            // inner += '<img src="/images/' + p +
            //     '" class="' + (first ? 'first' : 'rest') +
            //     '" alt="' + p + '"/>\n';
            // first = false;
        cycleTimePeriod = data.pictures[0].cycle || cycleTimePeriod;
        cycleTimeLapse = data.pictures[1].cycle || cycleTimeLapse;
        // div.html(inner);
        // $('#cycler img:first').addClass('active');
        if (!!cycleInterval)
            clearInterval(cycleInterval);
        cycleInterval = setInterval('cycleImages()', cycleTimePeriod);
    }
}

function makeDate(date) {
    return date.toDateString() + ', ' +
        ('0'+hour).slice(-2) + ':00 - ' +
        ('0'+(hour+1)).slice(-2) + ':00';
}

let refreshTimeout;
function refresh() {
    // alert('refresh');
    myViewModel.refresh(false);

    let days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let todayIs = new Date();
    if (DEBUG) console.log(todayIs, 'refresh');
    let today = todayIs.getDay(); // 1
    day = days[today];
    let hour = todayIs.getHours(); // 11
    viewModel.date(makeDate(todayIs));
    // $('#date').html(todayIs.toDateString() + ', ' +
    //     ('0'+hour).slice(-2) + ':00 - ' +
    //     ('0'+(hour+1)).slice(-2) + ':00');
    let schedule = data[day];
    if (schedule) {
        schedule = schedule.filter(function (e) {
            return e.hour === hour.toString();
        });
        if (schedule) schedule = schedule[0];
    }
    let names = [];
    for (r = 1; r < 10; r++) {
        if (schedule && schedule[r] && schedule[r].trim()) {
            if (!room || room === r  ) {
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
    // for (let i = 0; i<3; i++) {
    //     let j = i+1;
    //     let nameF = $('#name' + j);
    //     let fieldF = $('#field' + j);
    //     let picF = $('#picture' + j);
    //     let roomF = $('#room' + j);
    //     let row = $('.row' + j);
    //     if (!!room) {
    //         if (i > 0) break;
    //         $('#room').show();
    //         $('#main').hide();
    //         nameF = $('#NAME');
    //         fieldF = $('#FIELD');
    //         picF = $('#PICTURE');
    //         $('#roomHeader').show();
    //         $('#roomNumber').text('' + room);
    //         $('#roomColumn').hide();
    //     } else {
    //         $('#room').hide();
    //         $('#main').show();
    //         $('#roomHeader').hide();
    //         $('#roomColumn').show();
    //     }
    //     let e = details(names[i], data);
    //     if (!!e.name) {
    //         busy = busy || true;
    //         row.show();
    //     } else {
    //         row.hide();
    //     }

        // if (!!e.name) {
        //     nameF.text(e.name);
        //     fieldF.text(e.field);
        //     if (!e.picture) e.picture =
        //         'GenericDoctor' + {'':'', 'female': '-she', 'male': '-he'}[e.gender] + '.jpg';
        //     picF.attr('src', 'images/' + e.picture);
        //     roomF.text((!!e.room)?('Room ' + e.room): '');
        // }
    // if (busy) {
    //     if (!!room) $('#cycler').hide();
    //     $('.noActivity').hide();
    //     $('#activeRoom').show();
    // } else {
    //     $('#cycler').show();
    //     $('#main').hide();
    //     $('#room').hide();
    //     $('.noActivity').show();
    // }
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

$(document).ready(()=> {

    viewModel.refresh(false);
    // refButton = $('#refresh');
    // form = $('#form');
    // form.hide();
    // refButton.hide();
    checkServer();
    $(document).click(() => {
        viewModel.refresh(true);
        // if (serverMode) {
        //     if (refButton.css('display') === 'none')
        //         refButton.show();
        //     else
        //         refButton.hide();
        // } else {
        //     if (form.is(':hidden'))
        //         form.show();
        //     else
        //         form.hide();
        // }
    });
});
const checkServer = ()=> {
    $.ajax('/', {
        error: (e)=>
            serverMode = false,
        success: (d)=>
            serverMode = true,
        complete: (xhr, msg) => {
            // alert ('serverMode: ' + serverMode);
            if (serverMode)
                checkAndRead();
            else
                form.show();
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
const checkAndRead = () => {
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
