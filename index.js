// $Id: index.js 23863 2015-09-14 00:27:14Z 1070356 $

$(function() {
  var id, nick, name, mail;  // 사용자: 번호, 아이디, 이름, 이메일 주소
  var awaitingServerReply;   // 서버 응답을 기다리는 중

  // 서버 에러 메시지를 출력한다 (서버 프로그램 이름, 메시지)
  function serverError(serverProgramName, message) {
    $("#tip").html("서버(" + serverProgramName + ") 에러: " + message);
  }

  // 입력 에러를 표시하고 에러 메시지를 출력한다 (객체, 메시지[, 출력 객체])
  function setError(o, message, oMessage) {
    o.addClass("ui-state-error");
    oMessage? oMessage.html(message): o.attr("title", message);
  }

  // 에러 표시와 에러 메시지를 제거한다 (객체[, 출력 객체])
  function resetError(o, oMessage) {
    o.removeClass("ui-state-error");
    oMessage? oMessage.text(""): o.removeAttr("title");
  }

  // 메시지를 보여주거나 지운다 (객체, 정상인가?, 에러 메시지)
  function check(o, isOk, message) {
    isOk? resetError(o): setError(o, message);
    return isOk;  // 정상일 때 true를 넘긴다
  }

  // 보이는 것의 메시지를 보여주거나 지운다 (객체, 정상인가?, 에러 메시지)
  function checkWhileVisible(o, isOk, message) {
    return o.is(":visible")? check(o, isOk, message): true;
  }

/* HTML5 validation 기능이 지원되는 브라우저에서 사용한다.
  // HTML5 checkValidity()로 검사한다 (객체, 에러 메시지)
  function checkValidity(o, message) {
    return checkWhileVisible(o, o[0].checkValidity(), message);
  }

  function 이름_검사() {
    return checkValidity($("#name"), "이름을 넣으시오.");
  }

  function 이메일_주소_검사() {
    return checkValidity($("#mail"), "이메일 주소 형식이 맞지 않습니다.");
  }

  function 새_비밀번호_검사(final) {
    if ($("#pass1").is(":visible")) {
      resetError($("#pass1,#pass2"));
      var o1 = $("#pass1"), p1 = o1.val();
      var o2 = $("#pass2"), p2 = o2.val();
      if (final || p1.length && p2.length) {
        var o = p1.length <= p2.length? o1: o2;  // 짧은 쪽에 에러 표시
        return check(o, p1 === p2 && o[0].checkValidity(),
                     "네 자리 이상 비밀번호를 두 번 넣으시오.");
      }
    }
    return true;
  }
*/

///* HTML5 validation 기능이 지원되지 않는 브라우저에서 사용한다.
  function 이름_검사() {
    var o = $("#name");
    return checkWhileVisible(o, o.val(), "이름을 넣으시오.");
  }

  function 이메일_주소_검사() {
    var o = $("#mail");
    return checkWhileVisible(o, /^\S+?@\S+?[.]\S+?$/.test(o.val()),
                              "이메일 주소 형식이 맞지 않습니다.");
  }

  function 새_비밀번호_검사(final) {
    if ($("#pass1").is(":visible")) {
      resetError($("#pass1,#pass2"));
      var o1 = $("#pass1"), p1 = o1.val();
      var o2 = $("#pass2"), p2 = o2.val();
      if (final || p1.length && p2.length) {
        var o = p1.length <= p2.length? o1: o2;     // 짧은 쪽에 에러 표시
        return check(o, p1 == p2 && (4 <= p2.length ||
                                     0 == p2.length && !o.attr("required")),
                                 "네 자리 이상 비밀번호를 두 번 넣으시오.");
      }
    }
    return true;
  }
//*/

  // 이름이 바뀌면 검사한다
  $("#name").change(function() { 이름_검사(); });
 
  // 이메일 주소가 바뀌면 검사한다
  $("#mail").change(function() { 이메일_주소_검사(); });

  // 새 비밀번호가 바뀌면 검사한다
  $("#pass1,#pass2").change(function() { 새_비밀번호_검사(); });

  // 탭을 만든다
  $("#tabs").tabs();                                 // jQuery UI Tabs

  // 사용자 로그인/등록/수정
  var form = $("#user").keydown(function(event) {
    if (event.keyCode === $.ui.keyCode.ESCAPE) {
      doCancel();
    }
  }).tooltip({ show: false, hide: false });          // jQuery UI Tooltip

  // 팝업 창  <==  사용자 로그인/등록/수정
  var dialog = form.dialog({                         // jQuery UI Dialog
    buttons: {
      "확인": doOk,
      "취소": doCancel
    },
    open: function() {
      $("#nick,#name").change(function() {
        $(this).val($(this).val().replace(/[<>'"%&;\\]/g, ""));
      });  // 입력 칸에 특수 글자가 들어가지 않게 막는다
      awaitingServerReply = false;
    },
    close: function() {
      $("#nick,#pass").off();            // 이벤트 핸들러를 제거한다
      $("#pass,#pass1,#pass2").val("");  // 비밀번호를 지운다
      $("#tip").text("");                // 서버 에러 표시를 제거한다
      resetError($("#user input"));      // 에러 표시를 모두 제거한다
    },
    width: 450,
    modal: true,
    autoOpen: false,
    closeOnEscape: false
  });

  // 제목 줄에 제목을 넣고 팝업 창을 띄운다 (제목)
  function openDialog(title) {
    dialog.dialog("option", "title", title).dialog("open");
  }

  // [들어가기] 버튼 클릭  -- 로그인, 사용자 등록
  $("#enter").click(function() {
    $("#signup").hide();                    // 사용자 등록
    $("#signin").show();                    // 로그인
    $(".new_pass").attr("required", true);  // 새 비밀번호 필수 입력
    openDialog("들어가기");                 // 팜업 창 제목 "들어가기"

    $("#nick,#pass").change(function() {
      var thisId = this.id;
      if (thisId === "nick") {         // 사용자 아이디(nick)가 변경된 경우
        resetError($("#pass,#signup input").val("")); // 그것 빼고 모두 지운다
      }
      awaitingServerReply = true;
      $.post("checkPass.php", $("#nick,#pass"), function(user) {
        if (user.id) {                 // -- 로그인
          resetError($("#pass"), $("#tip")); // 비밀번호 에러 표시를 제거한다
          $("#tip").text("");
          if (user.name) {                // 비밀번호가 맞은 경우
            id = user.id;                    // 사용자 번호도 넣어 둔다
            $("#name").val(user.name);       // 이름과
            $("#mail").val(user.mail);       // 이메일 주소를 양식에 넣는다
          } else if (thisId === "pass") { // 비밀번호를 방금 잘못 입력한 경우
            setError($("#pass"), "임시 비밀번호를 메일로 알려드릴까요?" +
                     " &nbsp; <button id='yes' class='ui-widget'>예</button>",
                     $("#tip"));
            $("#yes").click(function() {     // 예, 알려주세요.
              $.post("sendPass.php", "id=" + user.id, function(count) {
               if (count == 1) {
                  setError($("#pass").val(""),
                           "알려드렸습니다. 받은 비밀번호를 넣으시오.",
                           $("#tip"));
                } else {
                  serverError("sendPass.php", count);
                }
              });
            });
          }
          $("#signup").hide();            // 사용자 등록 양식
          $("#signin").show();            // 비밀번호 입력 줄
          $("#pass").focus();             // 비밀번호 입력 줄로 이동한다
        } else {                       // -- 사용자 등록
          $("#signin").hide();            // 비밀번호 입력 줄
          $("#signup").show();            // 사용자 등록 양식
          $("#name").focus();             // 이름 입력 줄로 이동한다
        }
        awaitingServerReply = false;
      }, "json").fail(function(xhr) {
        serverError("checkPass.php", xhr.responseText);
      })
    });
  });

  // [(이름)] 버튼 클릭  -- 사용자 정보 변경
  $("#name_button").click(function() {
    $("#signin").hide();                     // 로그인
    $("#signup").show();                     // 사용자 정보 변경
    $(".new_pass").attr("required", false);  // 새 비밀번호 필수 입력 아님
    openDialog(name);                        // 팝업 창 제목에 사용자 이름

    $("#nick").change(function() {           // 아이디(nick) 변경
      var nick1 = $(this).val();
      if (nick1) {
        awaitingServerReply = nick1 !== nick;
        if (awaitingServerReply) {           // 아이디가 사용 중인지 검사한다
          $.post("getUserId.php", $(this), function(id1) {
            if (0 <= id1) {
              check($("#nick"), 0 == id1, "사용 중인 아이디입니다.");
              awaitingServerReply = false;
            } else {
              serverError("getUserId.php", id1);
            }
          });
        } else {
          resetError($(this));
        }
      } else {
        setError($(this), "아이디를 넣으시오.");
      }
    });
  });

  // [나가기] 버튼 클릭
  $("#exit").click(function() {
    $("#exit_div").hide();         // [(이름)]과 [나가기] 버튼을 숨기고
    $("#enter").show();            // [들어가기] 버튼을 보여준다
    eraseValues();                 // 입력 받은 값을 모두 지운다
  });

  // 입력한 값을 저장한다
  function saveValues() {
    nick = $("#nick").val();       // 아이디
    mail = $("#mail").val();       // 이메일 주소
    name = $("#name").val();       // 이름
    $("#name_button").text(name);  // [(이름)] 버튼에 이름을 넣는다
  }

  // 입력한 값을 모두 지운다
  function eraseValues() {
    $("#user input").val("");
    saveValues();
  }

  // 정상 로그인 후 입력 받은 값을 저장하고 팝업 창을 닫는다
  function enter() {
    saveValues();                  // 입력 받은 값을 저장한다
    $("#enter").hide();            // [들어가기] 버튼을 숨기고
    $("#exit_div").show();         // [(이름)]과 [나가기] 버튼을 보여준다
    dialog.dialog("close");        // 팝업 창을 닫는다
  }

  // 데이터가 변경되었으면 파라미터로 만든다 (저장된 값, 데이터 선택자)
  function serialize(saved, current) {
    var  current = $(current);
    return saved === current.val()? "": "&" + current.serialize();
  }

  // [확인] 버튼 처리
  function doOk() {
    if (!이름_검사() || !이메일_주소_검사() || !새_비밀번호_검사(true)
                                            || $(".ui-state-error").length) {
      return;
    }
    if (awaitingServerReply) {
      return;
    }
    if ($("#exit_div").is(":visible")) {      // -- 사용자 정보 수정
      var s = serialize(nick, "#nick") + serialize(name, "#name")
            + serialize(mail, "#mail") + serialize("", "#pass1");
      if (s) {                                   // 수정 사항이 있으면
        $.post("updateUser.php", "id=" + id + s, function(count) { // 업데이트
          if (count == 1) {                         // DB 업데이트 성공
            saveValues();                              // 값을 저장하고
            dialog.dialog("close");                    // 팝업 창을 닫는다
          } else {                                  // DB 업데이트 실패
            serverError("updateUser.php", count);      // 메시지 출력
          }
        });
      } else {                                   // 수정 사항이 없으면
        dialog.dialog("close");                     // 팝업 창을 닫는다
      }
    } else if ($("#signin").is(":visible")) { // -- 로그인
      if ($("#name").val()) {                    // 비밀번호가 맞으면
        enter();                                    // 팝업 창을 닫는다
      }
    } else {                                  // -- 사용자 등록
      $.post("addUser.php", $("#nick,#signup input"), function(idNew) { // 추가
        if (0 < idNew) {                         // 사용자 정보 넣기 성공
          id = idNew;                               // 사용자 번호를 받아두고
          enter();                                  // 팝업 창을 닫는다
        } else {                                 // 사용자 정보 넣기 실패
          serverError("addUser.php", idNew);        // 메시지 출력
        }
      });
    }
  }

  // [취소] 버튼 처리
  function doCancel() {
    if ($("#enter").is(":visible")) {      // 사용자 등록/로그인 중이었으면
      eraseValues();                          // 입력한 것을 모두 지운다
    } else {                               // 사용자 정보 수정 중이었으면
      $("#nick").val(nick);                   // 아이디(nick)와
      $("#mail").val(mail);                   // 이메일 주소와
      $("#name").val(name);                   // 이름을 되돌린다
    }
    dialog.dialog("close");                // 팝업 창을 닫는다
  }
});
