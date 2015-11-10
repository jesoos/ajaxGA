
$(function() {
	$("#inputBtn").click(function() {			
		$("#cttName").html($("#name").val());
		var sex = $(':radio[name="sex"]:checked').val()=="male" ? "男" :"女" ;
		var sexNum = $(':radio[name="sex"]:checked').val()=="male" ? 1 : 2 ;
		var age = $("#age").val();
		var d = new Date();		
		var year = d.getFullYear();
		var mon = (d.getMonth()+1);
		var day = d.getDate();
		var toDay = year + "/" + mon + "/" + day;
		var d2 = new Date(year - age + 1, mon, day);
		sexNum += d2.getFullYear() > 1999 ? 2 : 0;
		$("#cttSexAge").html( $.datepicker.formatDate('ymmdd', d2) + "-" + sexNum +"****** "+ sex + " " + age + " 세");				
	});

});

function maxLengthCheck(object){
	if (object.value.length > object.maxLength){
		object.value = object.value.slice(0, object.maxLength);
	}    
}