let reader = new FileReader();
let xlsflag = true;
let data;
reader.onload = function (e) {
    data = e.target.result;
    /*Converts the excel data in to object*/
    let workbook;
    if (xlsxflag) {
        workbook = XLSX.read(data, { type: 'binary' });
    }
    else {
        workbook = XLS.read(data, { type: 'binary' });
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
        let pictures = data.pictures.map(e=>
            e.picture);
        let div = $('#cycler');
        let inner = '';
        pictures.forEach(p=>inner += '<img src="' + p + '" alt="' + p + '"/>\n');
        div.html(inner);
        $('#cycler img:first').addClass('active');
        setInterval('cycleImages()', data.pictures[0].cycle || 7000);
    }
    $('#table').show();
    let form = $('#form');
    form.hide();
    $(document).click(()=> {
        if (form.is(":hidden")) form.show();
        else form.hide();
    });
    let days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let display = $('#display');
    display = display[0];
    let todate = new Date();
    let today = todate.getDay();
    day = days[today];
    let hour = todate.getHours();
    $('#date').html(todate.toDateString() + ', ' +
        ('0'+hour).slice(-2) + ':00 - ' +
        ('0'+(hour+1)).slice(-2) + ':00');
    let msg = '';
    let schedule = data[day];
    if (schedule) {
        schedule = schedule.filter(function (e) {
            return e.hour === hour.toString();
        });
        if (schedule) schedule = schedule[0];
    }
    let busy = false;
    if (!schedule) {
        msg += '<tr><td colspan="3">No Activity</td></tr>';
    } else {
        let names = [];
        for (r = 1; r < 10; r++) {
            if (schedule[r] && schedule[r].trim()) {
                names.push({
                    name: schedule[r],
                    room: r,
                });
            }
        }
        names.forEach(function (e) {
            busy = true;
            msg += '<tr><td>Room ' + e.room + '</td><td>' +
                details(e.name, data.names) + '</td></tr>\n';
        })
        if (!busy) msg += '<span>All Free';
    }
    msg += '</span>';
    if (!display.innerHTML) display.innerHTML = '';
    display.innerHTML += msg;
    // alert(day);
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
function details(name, namesData) {
    drow = namesData.filter(function(d) {
        return d.id === name;
    });
    if (drow) {
        drow = drow[0];
        let result = drow.name + '</td><td>' + drow.field + '</td><td>';
        if (drow.picture) result += '<img class="small-img" src="' + drow.picture +
            '" alt="' + name + '"/>';
        return result;
    } else
        return name;
}
function ExportToTable() {
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
