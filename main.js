let reader = new FileReader();
let xlsxflag = true;
let data;
reader.onload = function (e) {
    data = e.target.result;
    /*Converts the excel data in to object*/
    let workbook;
    if (xlsxflag) {
        workbook = XLSX.read(data, {type: 'binary'});
    }
    else {
        workbook = XLS.read(data, {type: 'binary'});
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
        let div = $('#cycler');
        let inner = '';
        let first = true;
        pictures.forEach(p => {
            inner += '<img src="' + p +
                '" class="' + (first ? 'first' : 'rest') +
                '" alt="' + p + '"/>\n';
            first = false;
        });
        div.html(inner);
        $('#cycler img:first').addClass('active');
        setInterval('cycleImages()', data.pictures[0].cycle || 7000);
    }
    let form = $('#form');
    form.hide();
    $(document).click(() => {
        if (form.is(":hidden")) form.show();
        else form.hide();
    });
    refresh();
};
function refresh() {
    alert('refresh');
    let days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let todate = new Date();
    let today = todate.getDay(); // 1
    day = days[today];
    let hour = todate.getHours(); // 11
    $('#date').html(todate.toDateString() + ', ' +
        ('0'+hour).slice(-2) + ':00 - ' +
        ('0'+(hour+1)).slice(-2) + ':00');
    let schedule = data[day];
    if (schedule) {
        schedule = schedule.filter(function (e) {
            return e.hour === hour.toString();
        });
        if (schedule) schedule = schedule[0];
    }
    let busy = false;
    let names = [];
    for (r = 1; r < 10; r++) {
        if (schedule && schedule[r] && schedule[r].trim()) {
            names.push({
               name: schedule[r],
               room: r,
            });
        }
    }
    for (let i = 0; i<3; i++) {
        let j = i+1;
        let e = {name:'', field:'', picture:'', room:''};
        let n = names[i];
        if (!!n && !!n.name) {
            let r = data.names.filter((e)=>e.id===n.name);
            if (!!r && !!r[0]) {
                e = {room: n.room, ...r[0]};
            }
            busy = busy || true;
        }
        let nameF = $('#name' + j);
        nameF.text(e.name);
        let fieldF = $('#field' + j);
        fieldF.text(e.field);
        if (!e.picture) e.picture = 'genericDoctor.jpg';
        let picF = $('#picture' + j);
        picF.attr('src', e.picture);
        let roomF = $('#room' + j);
        roomF.text((!!e.room)?('Room ' + e.room): '');
    }
    if (busy) {
        $('#display').show();
        $('#noActivity').hide();
    } else {
        $('#display').hide();
        $('#noActivity').show();
    }
    let seconds = new Date().getSeconds();
    setTimeout(refresh, (60-seconds) * 1000);
}


function cycleImages() {
    let $active = $('#cycler .active');
    let $next = ($active.next().length > 0) ? $active.next() : $('#cycler img:first');
    $next.css('z-index',2);//move the next image up the pile
    $active.fadeOut(1500,function(){//fade out the top image
        $active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
        $next.css('z-index',3).addClass('active');//make the next image the top one
    });
}
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
$(document).ready(()=> $('#form').show());
