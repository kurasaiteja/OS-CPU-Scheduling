recalculateServiceTime();
recalcualtettime();
$('.priority-only').hide();
$('.servvtime').show();

$(document).ready(function () {
  $('input[type=radio][name=algorithm]').change(function () {
    if (this.value == 'priority') {
      $('.priority-only').show();
      $('.servtime').show();
      $('.servvtime').show();
      $('.turnaroundtime').show();
      $(".turnaroundtimet").show();
      $('#quantumParagraph').hide();
      $('.hey').show();
      
      $('#minus').css('left', '95px');
    }
    else if (this.value == 'robin') {
      $('.priority-only').hide();
      $('.servvtime').hide();
      $('.servtime').hide();
      $('#quantumParagraph').show();
      $('.turnaroundtime').hide();
      $(".turnaroundtimet").hide();
      
    $('.hey').hide();

    }
    else {
      $('.priority-only').hide();
      $('#quantumParagraph').hide();
      $('.servtime').show();
      $('.servvtime').show();
      $('.turnaroundtime').show();
      $(".turnaroundtimet").show();
      $('#minus').css('left', '85px');
      $('.hey').show();
    }

    
   

    recalculateServiceTime();
    recalcualtettime();
  });
});

function addRow() {
  var lastRow = $('#inputTable tr:last');
  var lastRowNumebr = (lastRow.children()[0].innerText);
  
 var convert=lastRowNumebr.slice(1,2);
 var numb= Number(convert);

  var newRow = '<tr><td>P'+ (numb + 1)
  + '</td>' 
  + '<td><input name="bt" class="exectime"  type="text"/></td><td class="servtime" name="wt"></td>'
  //if ($('input[name=algorithm]:checked', '#algorithm').val() == "priority")
  + '<td class="priority-only"><input type="text"/></td>'
  + '<td class="turnaroundtime"></td></tr>';

  lastRow.after(newRow);

  var minus = $('#minus');
  minus.show();
  minus.css('top', (parseFloat(minus.css('top')) + 38) + 'px');

  if ($('input[name=algorithm]:checked', '#algorithm').val() != "priority")
    $('.priority-only').hide();
  if ($('input[name=algorithm]:checked', '#algorithm').val() == "robin"){
    $('.priority-only').hide();
    $('.servvtime').hide();
      $('.servtime').hide();
      
      $('.turnaroundtime').hide();
      $(".turnaroundtimet").hide();
  }
 

 
   
    


  $('#inputTable tr:last input').change(function () {
    recalculateServiceTime();
    recalcualtettime();
  });
}

function deleteRow() {
  var lastRow = $('#inputTable tr:last');
  lastRow.remove();

  var minus = $('#minus');
  minus.css('top', (parseFloat(minus.css('top')) - 38) + 'px');

  if (parseFloat(minus.css('top')) < 190)
    minus.hide();
}

$(".initial").change(function () {
  recalculateServiceTime();
  recalcualtettime();
});

function recalcualtettime(){
  var totalttime=0;
  var inputTable = $('#inputTable tr')
  $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      
      var btf = parseInt($(value.children[1]).children().first().val());
    
      var wtf= ($(value.children[2]).text());
      var bt=Number(btf);
      var wt=Number(wtf)
      totalttime=wt+bt;
      $(value.children[4]).text(totalttime);
      
      
     });
}

function recalculateServiceTime() {
  var inputTable = $('#inputTable tr');
  var totalExectuteTime = 0;
 
  

  var algorithm = $('input[name=algorithm]:checked', '#algorithm').val();
  if (algorithm == "fcfs") {
    $('#minus').css('left', '580px');
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      $(value.children[2]).text(totalExectuteTime);

      var executeTime = parseInt($(value.children[1]).children().first().val());
      totalExectuteTime += executeTime;
    });
  }
  else if (algorithm == "sjf") {
    $('#minus').css('left', '580px');
    var exectuteTimes = [];
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      exectuteTimes[key - 1] = parseInt($(value.children[1]).children().first().val());
    });

    var currentIndex = -1;
    for (var i = 0; i < exectuteTimes.length; i++) {
      currentIndex = findNextIndex(currentIndex, exectuteTimes);

      if (currentIndex == -1) return;

      $(inputTable[currentIndex + 1].children[2]).text(totalExectuteTime);

      totalExectuteTime += exectuteTimes[currentIndex];
    }
  }
  else if (algorithm == "priority") {
    $('#minus').css('left', '680px');
    var exectuteTimes = [];
    var priorities = [];

    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      exectuteTimes[key - 1] = parseInt($(value.children[1]).children().first().val());
      priorities[key - 1] = parseInt($(value.children[3]).children().first().val());
    });

    var currentIndex = -1;
    for (var i = 0; i < exectuteTimes.length; i++) {
      currentIndex = findNextIndexWithPriority(currentIndex, priorities);

      if (currentIndex == -1) return;

      $(inputTable[currentIndex + 1].children[2]).text(totalExectuteTime);

      totalExectuteTime += exectuteTimes[currentIndex];
    }
  }
  else if (algorithm == "robin") {
    $('#minus').css('left', '238px');

    
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      $(value.children[2]).text("");
    });
  }
}

function findNextIndexWithPriority(currentIndex, priorities) {
  var currentPriority = 1000000;
  if (currentIndex != -1) currentPriority = priorities[currentIndex];
  var resultPriority = 0;
  var resultIndex = -1;
  var samePriority = false;
  var areWeThereYet = false;

  $.each(priorities, function (key, value) {
    var changeInThisIteration = false;

    if (key == currentIndex) {
      areWeThereYet = true;
      return true;
    }
    if (value <= currentPriority && value >= resultPriority) {
      if (value == resultPriority) {
        if (currentPriority == value && !samePriority) {
          samePriority = true;
          changeInThisIteration = true;
          resultPriority = value;
          resultIndex = key;                            
        }                        
      }
      else if (value == currentPriority) {
        if (areWeThereYet) {
          samePriority = true;
          areWeThereYet = false;
          changeInThisIteration = true;
          resultPriority = value;
          resultIndex = key;
        }
      }
      else {
        resultPriority = value;
        resultIndex = key;
      }

      if (value > resultPriority && !changeInThisIteration)
        samePriority = false;
    }
  });
  return resultIndex;
}

function findNextIndex(currentIndex, array) {
  var currentTime = 0;
  if (currentIndex != -1) currentTime = array[currentIndex];            
  var resultTime = 1000000;
  var resultIndex = -1;
  var sameTime = false;
  var areWeThereYet = false;

  $.each(array, function (key, value) {
    var changeInThisIteration = false;

    if (key == currentIndex) {
      areWeThereYet = true;
      return true;
    }
    if (value >= currentTime && value <= resultTime) {
      if (value == resultTime) {                        
        if (currentTime == value && !sameTime) {
          sameTime = true;
          changeInThisIteration = true;
          resultTime = value;
          resultIndex = key;                            
        }                        
      }
      else if (value == currentTime) {
        if (areWeThereYet) {
          sameTime = true;
          areWeThereYet = false;
          changeInThisIteration = true;
          resultTime = value;
          resultIndex = key;
        }
      }
      else {
        resultTime = value;
        resultIndex = key;
      }

      if (value < resultTime && !changeInThisIteration)
        sameTime = false;
    }
  });
  return resultIndex;
}

function animate() {
	$('fresh').prepend('<div id="curtain" style="position: absolute; right: 0; width:100%; height:100px;"></div>');
  
  $('#curtain').width($('#resultTable').width());
  $('#curtain').css({left: $('#resultTable').position().left});
  
  var sum = 0;
  $('.exectime').each(function() {
      sum += Number($(this).val());
    
  });
  
  
  console.log($('#resultTable').width());
  
  
  var count = $('#inputTable tr').length;
   var sum1 = 0;
   $('.servtime').each(function() {
     sum1 += Number($(this).text());
   });
  var avgwtm = (sum1)/(count-1)
  $('.grdtotal').html(avgwtm);
  //alert(avgwtm);
  

   var sum2 = 0;
   $('.turnaroundtime').each(function() {
     sum2 += Number($(this).text());
   });
  var avgtat = (sum2)/(count-1)
  //alert(avgtat)
  $('.gtotal').html(avgtat);
   
 
  
  var distance = $("#curtain").css("width");
  
  animationStep(sum, 0);
  jQuery('#curtain').animate({ width: '500', marginLeft: distance}, sum*1000/2);
}

function animationStep(steps, cur) {
	$('#timer').html(cur);
	if(cur < steps) {
		setTimeout(function(){ 
   	     animationStep(steps, cur + 1);
  	}, 500);
  }
  else {
  }
}

function draw() {
  $('fresh').html('');
  var inputTable = $('#inputTable tr');
  var th = '';
  var td = '';

  var algorithm = $('input[name=algorithm]:checked', '#algorithm').val();
  if (algorithm == "fcfs") {
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      var executeTime = parseInt($(value.children[1]).children().first().val());
      th += '<th style="height: 60px; width: ' + executeTime * 20 + 'px;">P' + (key-1) + '</th>';
      td += '<td>' + executeTime + '</td>';
    });

    $('fresh').html('<table id="resultTable"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }
  else if (algorithm == "sjf") {
    var executeTimes = [];

    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      var executeTime = parseInt($(value.children[1]).children().first().val());
      executeTimes[key - 1] = { "executeTime": executeTime, "P": key - 1 };
    });

    executeTimes.sort(function (a, b) {
      if (a.executeTime == b.executeTime)
        return a.P - b.P;
      alert(a.executeTime-b.executeTime)
      return a.executeTime - b.executeTime

    });

    $.each(executeTimes, function (key, value) {
      alert(value.executeTime)
      th += '<th style="height: 60px; width: ' + value.executeTime * 20 + 'px;">P' + value.P + '</th>';
      td += '<td>' + value.executeTime + '</td>';
    });

    $('fresh').html('<table id="resultTable"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }
  else if (algorithm == "priority") {
    var executeTimes = [];

    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      var executeTime = parseInt($(value.children[1]).children().first().val());
      var priority = parseInt($(value.children[3]).children().first().val());
      executeTimes[key - 1] = { "executeTime": executeTime, "P": key - 1, "priority": priority };
    });

    executeTimes.sort(function (a, b) {
      if (a.priority == b.priority)
        return a.P - b.P;
      return b.priority - a.priority
    });

    $.each(executeTimes, function (key, value) {
      th += '<th style="height: 60px; width: ' + value.executeTime * 20 + 'px;">P' + value.P + '</th>';
      td += '<td>' + value.executeTime + '</td>';
    });

    $('fresh').html('<table id="resultTable" style="width: 70%"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }
  else if (algorithm == "robin") {
    var quantum = $('#quantum').val();
    var executeTimes = [];

    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      var executeTime = parseInt($(value.children[1]).children().first().val());
      executeTimes[key - 1] = { "executeTime": executeTime, "P": key - 1 };
    });

    var areWeThereYet = false;
    while (!areWeThereYet) {
      areWeThereYet = true;
      $.each(executeTimes, function (key, value) {
        if (value.executeTime > 0) {
          th += '<th style="height: 60px; width: ' + (value.executeTime > quantum ? quantum : value.executeTime) * 20 + 'px;">P' + value.P + '</th>';
          td += '<td>' + (value.executeTime > quantum ? quantum : value.executeTime) + '</td>';
          value.executeTime -= quantum;
          areWeThereYet = false;
        }
      });
    }
    $('fresh').html('<table id="resultTable" style="width: 70%"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }
  animate();
}