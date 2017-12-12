var ID = 0;
/*var monsterList = [{name:"a", level:2, date:"2017/11/11"},{name:"a", level:2, date:"2017/11/11"},{name:"a", level:2, date:"2017/11/11"}];*/
var uri = "https://jsonblob.com/api/jsonBlob/1099cbca-df7d-11e7-b24c-4ffff4b310b0";

function get(){
    return $.get(uri, function(data, textStatus, jqXHR){}); /* $ -> jQuery zenklas */
}

$(document).ready(function(){
    $("#fold").text("Fold");
    $("#night").text("Night Mode");
    $.get(uri, function(data, textStatus, jqXHR){
        visualization(data);
    });
});

$("#fold").click(function(){
    var buttonName = document.getElementById("fold").innerText;
    if(buttonName == "Fold")
    {
        $("#formSec").hide();
        $("#fold").text("UnFold");
    }
    else{
        $("#formSec").show();
        $("#fold").text("Fold");
    }
});

$("#submit").click(function(e){
    e.preventDefault();
    if($("#inputDate").val() == "" || $("#inputLevel").val() == "" || $("#inputName").val() == "")
    {
        alert("Not all fields are filled.");
        return;
    }
    else{
        get().done(function(result){
            var newId = result.monsters.length + 1;
            result.monsters.push({id:newId, name:$("#inputName").val(), level:$("#inputLevel").val(), date:$("#inputDate").val()});
            updateData(JSON.stringify(result));
        });
        return;
    }
});

function updateData(data)
{
    $.ajax({
        url:uri,
        type:"PUT",
        data:data,
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data, textStatus, jqXHR){
            visualization(data);
        }
    });
}

$("#inputLevel").on( "change", function(){
    var num = $(this).val();
    if(!Number.isInteger(num) || num < 1)
    {
        alert("Disaster Level field was filled wrong. Only whole and positve number are accepted.");
        $(this).val('');
    }
});

$("#inputID").on( "change", function(){
    console.log(Number.isInteger($(this).val()));
    if(!Number.isInteger($(this).val()) || $(this).val() < 0)
    {
        alert("ID field was filled wrong. Only whole and positve number are accepted (zero is valid too).");
        $(this).val('');
    }
});

$("#delete").click(function(){
    var table = document.getElementById("tableMonster").getElementsByTagName("tbody");
    var row = table[0].childNodes;
    for(var i = 0; i < ID; i++)
    {
        var td = row[i].childNodes[0].outerText;
        if(td == $("#inputID").val())
        {
            row[i].remove();
            return;
        }
    }
});

$("#inputDate").on("change", function(){
    if(Date.parse($(this).val()) == NaN)
    {
        alert("Defeat Date field was filled wrong. Only date is allowed.");
        $(this).val('');
    }
});

$("#night").on("click", function(){
    var color = document.body.style.background;
    if(color == "rgb(78, 20, 20)")
    {
        document.body.style.background = "#F8AFAF";
        $("#night").text("Night Mode");
    }
    else{
        document.body.style.background = "#4E1414";
        $("#night").text("Day Mode");
    }
});


function visualization(objectArray)
{
    console.log(objectArray);
    var table = document.getElementById("tableMonster").getElementsByTagName("tbody")[0];
    table.innerHTML = "";
    for(var i=0, len = objectArray.monsters.length; i < len; i++)
    {
        var newRow = table.insertRow(table.rows.length);

        var cell = newRow.insertCell(0); 
        var text = document.createTextNode(objectArray.monsters[i].id);
        cell.appendChild(text);
        ID++;

        var cell = newRow.insertCell(1); 
        var text = document.createTextNode(objectArray.monsters[i].name);
        cell.appendChild(text);

        var cell = newRow.insertCell(2); 
        var text = document.createTextNode(objectArray.monsters[i].level);
        cell.appendChild(text);

        var cell = newRow.insertCell(3); 
        var text = document.createTextNode(objectArray.monsters[i].date);
        cell.appendChild(text);
    }
}

function checkDate(defDate)
{
    var Year;
    var Month;
    var Day;
    var date = defDate.replace(/-/g, "/").replace(/\./g, "/");
    var split = date.split("/");
    Month = split[1];
    if(split[0].length == 4)
    {
        Year = split[0];
        Day = split[2];
    }
    else{
        Year = split[2];
        Day = split[0];
    }
    if (((Year > 1900) && (Year < new Date().getFullYear()))) {
        if ((Month <= 12 && Month > 0)) {

            var LeapYear = (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0));   
            
            if( Day > 0)
            {
                if (Month == 2) {  
                    LeapYear ? Day <= 29 : Day <= 28;
                } 
                else {
                    if ((Month == 4) || (Month == 6) || (Month == 9) || (Month == 11)) {
                        Day <= 30;
                    }
                    else {
                        Day <= 31;
                    }
                }
            }
        }
    }
}