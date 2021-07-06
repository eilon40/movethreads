let color = sessionStorage.getItem('color');

if (color !== null) {
    let style = document.createElement("STYLE");
    style.innerText = `.actionbuttons .group .button:not([type="reset"]) {
background: ${color} !important;
}`;
    document.head.appendChild(style);
}

let group = $('.group').eq(3);

$('#destforumid').parent().eq(0).after(`<div class="blockrow ui-widget"><label for="destforumname">פורום מטרה:</label><input id="destforumname" name="destforumname" class="textbox primary ui-autocomplete-input"></div>`);
$('#destforumid').parent().eq(0).hide();

group.find('input[type=submit]').eq(0).hide();
group.prepend(`<input style="margin-top: 3px" type="button" class="button submitButton" value="העבר" title="העבר" name="העבר" tabindex="1">`);

$(function() {
    let ids;
    $('#destforumname').autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "https://www.fxp.co.il/ajax.php?do=forumdisplayqserach&name_startsWith=" + document.getElementById("destforumname").value,
                crossDomain: true,
                async: true,
                success: function(res) {
                    let forums = res = JSON.parse(res);
                    let forumsSrc = [];
                    for (var i = 0; i < res.length; i++) {
                        forumsSrc.push(res[i].title_clean);
                        ids = forums;
                        console.log(res[i].title_clean);
                    }
                    response(forumsSrc, forums);
                }
            });
        },
        select: function(event, ui) {
            let id = ids.filter(x => x.title_clean.startsWith(ui.item.value))[0].forumid;
            $('#destforumid').val(id);
        },
    });
});

group.find('input.submitButton').eq(0).click(function() {
    console.log('run');
    $.ajax({
        url: "https://www.fxp.co.il/ajax.php?do=forumdisplayqserach&name_startsWith=" + document.getElementById("destforumname").value,
        crossDomain: true,
        async: true,
        success: function(res) {
            let forums = res = JSON.parse(res);
            $('#destforumid').val(res[0].forumid);
            group.find('input[type=submit]').eq(0).click();
        }
    });
});




function splitArray(arr, n) {
    return new Array(Math.ceil(arr.length / n))
        .fill()
        .map(_ => arr.splice(0, n));
};

function buttonclick(id, name) {
    document.getElementById('destforumname').value = name;
    document.getElementById('destforumid').value = id;
    group.find('input[type=submit]').eq(0).click();
}

let obj = sessionStorage.getItem('obj');
obj = JSON.parse(obj);
console.log(obj.length);

if (obj.length > 0) {
    group.append("<br>");

    splitArray(obj, 3).forEach(forums => {
        forums.forEach(forum => {
            console.log(forum);
            group.append(`<input style="margin-top: 3px" type="button" class="button" value="${forum.name}" id="${forum.id}" title="${forum.name}" name="${forum.name}" tabindex="1" onclick="buttonclick(this.id, this.name)"> `);
            if (forums.indexOf(forum) == 2) group.append("<br>");
        });
    });
}
