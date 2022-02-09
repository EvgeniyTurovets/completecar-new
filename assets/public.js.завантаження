(function( $ ) {
	'use strict';

	/**
	 * Public javascript for the support-chat
	 *
	 * @link       http://www.weedesign.de/weebot.html
	 * @since      1.0.0
	 *
	 * @package    weebot
	 * @subpackage weebot/public/assets
	 */
	
	/*
	*	run the support chat
	*/
	$( window ).load(function() {
		weebot.run();
	});
	
	var weebot = new function() {
	
		// running interval for checking answers to supported questions
		this.checkSupportInterval = false;
		// running interval for checking answers to fallbacked questions
		this.checkFallbackInterval = false;
		// clientside regex for checking email-addresses
		this.checkEmail = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
		// mouse position
		this.currentMousePos = { x: -1, y: -1 };
		
		/*
		*	this function runs the support chat
		*/
		this.run = function() {
			$.ajax({
				type: "POST",
				url: weebotAJAX.ajaxurl,
				data: {
					action: "weebotAJAX",
					method: "init"
				},
				xhrFields: {
					withCredentials: true
				},
				success: function(data){
					var options = JSON.parse(data);
					var chat = false;
					if($("#weebot-chat-settings").length>0) {
						if($("#weebot-chat-settings").val()==1) {
							chat = true;
						}
					}
					
					if( ( options["chat"] == 1 && options["footer"]==1 ) || chat == true ) {
					
						$.ajax({
							type: "POST",
							url: weebotAJAX.ajaxurl,
							data: {
								action: "weebotAJAX",
								method: "init:footer"
							},
							xhrFields: {
								withCredentials: true
							},
							success: function(data){
							
								$(document.body).append(data);
								
								if(options["chat:width"]!="") {
									$("#weebot, #weebot .chat").css("width",options["chat:width"]);
								}
								
								var loader = '<div id="weebot-loader" class="weebot-loader">';
								for(var i=1;i<9;i++) {
									loader+= '<div class="loader" id="weebot-loader-'+i+'"></div>';
								}
								loader+= '</div>';
								
								$("#weebot .small, #weebotBackground").bind("click",function() {

									if($("#weebot .extended").hasClass("visible")) {
										$("#weebot, #weebot .extended, #weebotBackground").removeClass("visible");
										$("#weebot .small").removeClass("open");
									} else {
										$("#weebot, #weebot .extended, #weebotBackground").addClass("visible");
										$("#weebot .small").addClass("open");
										$("#weebot textarea").keypress(function(e) {
											if(e.keyCode==13) {
												$("#weebot .button.send").trigger("click");
												return false;
											}
										});
										$("#weebot textarea").keyup(function(e) {
											if(e.keyCode!=13) {
												$(this).css("height",(this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth")))+"px");
											}
										});
										$("#weebot textarea").focus(function(e) {
											window.setTimeout(function(){
												$("#weebot").addClass("text-focused");
											},100);
										});
										$("#weebot textarea").blur(function(e) {
											window.setTimeout(function(){
												$("#weebot").removeClass("text-focused");
											},100);
										});
										$("#weebot .chat").nanoScroller();
										$("#weebot .chat").nanoScroller({ scroll: 'bottom' });
										if($("#weebot .chat .content .more").length>0) {
											$("#weebot .chat .content").bind("scroll",function() {
												if($(this).scrollTop()==0) {
													var more = $("#weebot .chat .content .more");
													if(more.length>0) {
														if(!$(more).hasClass("loading")) {
															$(more).append(loader).addClass("loading");
															var start = $(more).data("start");
															$.ajax({
																type: "POST",
																url: weebotAJAX.ajaxurl,
																data: {
																	action: "weebotAJAX",
																	method: "user:log",
																	start: start
																},
																xhrFields: {
																	withCredentials: true
																},
																success: function(data){
																	$(more).removeClass("more").html(data);
																	$("#weebot .chat").nanoScroller();
																	weebot.email();
																}
															});
														}
													}
												}
											});
										}
			
										weebot.email();
										
										$("#weebot .settings .close").bind("click",function() {
											$("#weebot .settings").addClass("hidden");
										});
										
										$("#weebot .settings .save").bind("click",function() {
											if(weebot.checkEmail.test($("#weebot-user-email").val())===false) {
												$("#weebot-user-email").addClass("error").bind("keyup",function() {
													$(this).removeClass("error").unbind("keyup");
												});
											} else {
												if(!$("#weebot .settings").hasClass("hidden")) {
													$("#weebot .settings").addClass("hidden");
												}
												weebot.settingsEmail();
											}
										});
										
										if(weebot.checkSupportInterval===false) {
											weebot.checkSupportInterval = setInterval(weebot.checkSupport, 3000);
										}
										if(weebot.checkFallbackInterval===false) {
											weebot.checkFallbackInterval = setInterval(weebot.checkFallback, 30000);
										}
									}
								});
								
								/*
								 *	Send Function
								 */
								$("#weebot .extended .button.send").bind("click",function() {
								
									var text = $("#weebot textarea").val();

									var textHTML = text.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
									   return '&#'+i.charCodeAt(0)+';';
									});
									
									$("#weebot textarea").css("height","auto").val("").attr("disabled","disabled");
									$("#weebot .extended .buttons").addClass("hide");
									
									var send = false;
									if(text!="") {
										var send = true;
										if(options["spam"]==1) {
											if(text.length<options["spam:chars"]) {
												var send = false;
											}
											if(options["spam:words"]==1) {
												var words = text.split(" ");
												if(options["spam:words:include"]!="") {
													send = false;
													var words_include = options["spam:words:include"].split(",");
													for(var i=0;i<words_include.length;i++) {
														for(var j=0;j<words.length;j++) {
															if(words_include[i].replace(/ /gi,"")==words[j]) {
																send = true;
															}
														}
													}
												}
												if(options["spam:words:exclude"]!="") {
													var words_exclude = options["spam:words:exclude"].split(",");
													for(var i=0;i<words_exclude.length;i++) {
														for(var j=0;j<words.length;j++) {
															if(words_exclude[i].replace(/ /gi,"")==words[j]) {
																send = false;
															}
														}
													}
												}
												if(options["spam:strings:exclude"]!="") {
													var strings_exclude = options["spam:strings:exclude"].split(",");
													for(var i=0;i<strings_exclude.length;i++) {
														if(text.indexOf(strings_exclude[i].replace(/ /gi,""))>-1) {
															send = false;
														}
													}
												}
											}
										}
									}
									if(send===true) {
									
										var audio = $("#weebot audio.send");
										audio[0].play();
									
										$("#weebot .chat .content").append("<div class='question'><div class='message'>"+textHTML+"</div></div>"+loader);
										$("#weebot .chat").nanoScroller();
										$("#weebot .chat").nanoScroller({ scroll: 'bottom' });
										
										var page = window.location.href;
										if( options["page:parameter"]==1 ) {
											page = page.replace(window.location.search,"");
										} 
										if( options["page:hash"]==1 ) {
											page = page.replace(window.location.hash,"");
										}
										
										var parent = 0;
										if($("#weebot .chat .answer").last().length>0) {
											if(typeof($("#weebot .chat .answer").last().data("parent"))!=typeof(undefined)) {
												parent = $("#weebot .chat .answer").last().data("parent");
											}
										}
										$.ajax({
											type: "POST",
											url: weebotAJAX.ajaxurl,
											data: {
												action: "weebotAJAX",
												question: text,
												page: page,
												parent: parent,
												method: "chat:send"
											},
											xhrFields: {
												withCredentials: true
											},
											success: function(data){
												
												var audio = $("#weebot .income");
												audio[0].play();
											
												$("#weebot textarea").removeAttr("disabled");
												$("#weebot .extended .buttons").removeClass("hide");

												var dataArr = data.split('<!weebot!>');
												
												if($("#weebot_"+dataArr[0]+"_answer").length>0) {
													$("#weebot_"+dataArr[0]+"_answer").prev().remove();
													$("#weebot_"+dataArr[0]+"_answer").remove();
												}
												
												$(".weebot-loader").remove();
												
												$("#weebot .chat .content").append(dataArr[1]);
												
												$("#weebot .chat").nanoScroller();
												$("#weebot .chat").nanoScroller({ scroll: 'bottom' });
												
												weebot.email();
												
												if(weebot.checkSupportInterval===false) {
													weebot.checkSupportInterval = setInterval(weebot.checkSupport, 3000);
												}
												if(weebot.checkFallbackInterval===false) {
													weebot.checkFallbackInterval = setInterval(weebot.checkFallback, 30000);
												}
												
											}
										});
										
									} else {
										$("#weebot textarea").removeAttr("disabled");
										$("#weebot .extended .buttons").removeClass("hide");
										if(text!="") {
											$("#weebot .chat").append(
												$("<div />")
													.attr({class:"error"})
													.html($("#weebot .button.send").data("error"))
													.animate({opacity:0},4000,function() {
														$(this).remove();
													})
											);
										}
									}
								});
								
								/*
								 *	Upload
								 */
								$("#weebot .extended .button.upload").bind("click",function() {
									$("#weebot .extended .buttons form input").trigger("click").unbind("change").bind("change",function(e) {
										if($(this).val()!="") {
											$("#weebot .extended .buttons form").trigger("submit");
										}
									});
								});
								$("#weebot .extended .buttons form").bind("submit",function(e) {
									
									e.preventDefault();
									
									var form_element = this;
									
									if (window.FileReader) {
										var input = $(this).find(".upload");
										var errorCount = 0;
										$.each(input[0].files,function() {
											if(this.size>$(form_element).data("max-upload-size")) {
												errorCount++;
											}
										});
										if(errorCount>0) {
											var errorMessage = (input[0].files.length==1) ? $(this).data("filesize") : $(this).data("filesize-multiple");
											$("#weebot .chat").append(
												$("<div />")
													.attr({class:"error"})
													.html(errorMessage)
													.animate({opacity:0},4000,function() {
														$(this).remove();
													})
											);
											return false;
										}
									}
									
									var audio = $("#weebot audio.send");
									audio[0].play();
									
									$("#weebot .extended .buttons").addClass("hide");
									$("#weebot textarea").attr("disabled","disabled");
									
									$("#weebot .chat .content").append("<div class='question question-file'><div class='message'>"+$(this).data("sending")+"</div></div>"+loader);
									$("#weebot .chat").nanoScroller();
									$("#weebot .chat").nanoScroller({ scroll: 'bottom' });
									
									var page = window.location.href;
									if( options["page:parameter"]==1 ) {
										page = page.replace(window.location.search,"");
									} 
									if( options["page:hash"]==1 ) {
										page = page.replace(window.location.hash,"");
									}
									
									var parent = 0;
									if($("#weebot .chat .answer").last().length>0) {
										if(typeof($("#weebot .chat .answer").last().data("parent"))!=typeof(undefined)) {
											parent = $("#weebot .chat .answer").last().data("parent");
										}
									}
										
									var form = new FormData(this);
									
									form.append("page",page);
									form.append("parent",parent);
									form.append("action","weebotAJAX");
									form.append("method","upload");
									
									$.ajax({
										type: "POST",
										url: weebotAJAX.ajaxurl,
										data: form,
										contentType: false,
										processData: false, 
										xhrFields: {
											withCredentials: true
										},
										success: function(data){
										
											var audio = $("#weebot .income");
											audio[0].play();
										
											$("#weebot textarea").removeAttr("disabled");
											$("#weebot .extended .buttons").removeClass("hide");
											
											var dataArr = data.split('<!weebot!>');
											
											$(".weebot-loader").remove();
											
											$("#weebot .chat .content").append(dataArr[1]);
											
											$("#weebot .chat .content .question-file").last().find(".message").html(dataArr[2]);
											
											$("#weebot .chat").nanoScroller();
											$("#weebot .chat").nanoScroller({ scroll: 'bottom' });
											
											weebot.email();
											
											if(weebot.checkSupportInterval===false) {
												weebot.checkSupportInterval = setInterval(weebot.checkSupport, 3000);
											}
											if(weebot.checkFallbackInterval===false) {
												weebot.checkFallbackInterval = setInterval(weebot.checkFallback, 30000);
											}
											
										}
									});
								});
								
								/*
								 *	Screenshot
								 */
								var screenshotTimeout = false;
								$("#weebot .extended .button.screenshot").bind("click",function() {
									$(document.body).addClass("screenshot-active");
									$(document.body)
									.append(
										$("<div />")
											.attr({id:"weebotScreenshotHowTo",class:"weebotScreenshotElement"})
											.append($("<span />")
												.html($("#weebot .extended .button.screenshot").data("howto"))
											)
									)
									.append(
										$("<div />")
											.attr({id:"weebotScreenshotArea",class:"weebotScreenshotElement"})
											.bind("mousedown",function() {
												$("#weebotScreenshot")
													.css("top",weebot.currentMousePos.y+"px")
													.css("left",weebot.currentMousePos.x+"px");
												screenshotTimeout = window.setInterval(function(){
													if($("#weebotScreenshot").length>0) {
														$("#weebotScreenshot")
															.css("height",(weebot.currentMousePos.y-($("#weebotScreenshot").css("top").replace("px","")*1))+"px")
															.css("width",(weebot.currentMousePos.x-($("#weebotScreenshot").css("left").replace("px","")*1))+"px")
													}
												}, 10);
												$("#weebotScreenshotHowTo").remove();
												
											})
											.bind("mouseup",function() {
												window.clearInterval(screenshotTimeout);
												screenshotTimeout = false
												$("#weebotScreenshotSave").addClass("visible");
											})
									)
									.append(
										$("<div />")
											.attr({id:"weebotScreenshot",class:"weebotScreenshotElement"})
											.bind("mouseup",function() {
												window.clearInterval(screenshotTimeout);
												screenshotTimeout = false
												$("#weebotScreenshotSave").addClass("visible");
											})
									)
									.append(
										$("<div />")
											.attr({id:"weebotScreenshotClose",class:"weebotScreenshotElement"})
											.bind("click",function() {
												$(document.body).removeClass("screenshot-active");
												$(".weebotScreenshotElement").remove();
											})
									)
									.append(
										$("<div />")
											.attr({id:"weebotScreenshotSave",class:"weebotScreenshotElement"})
											.html($("#weebot .extended .button.screenshot").data("save"))
											.bind("click",function() {
											
												var audio = $("#weebot audio.send");
												audio[0].play();
											
												var x = $("#weebotScreenshot").css("left").replace("px","");
												var y = $("#weebotScreenshot").css("top").replace("px","");
												var width = $("#weebotScreenshot").css("width").replace("px","");
												var height = $("#weebotScreenshot").css("height").replace("px","");
											
												$(document.body).removeClass("screenshot-active");
												$(".weebotScreenshotElement").remove();
											
												$("#weebot .extended .buttons").addClass("hide");
												$("#weebot textarea").attr("disabled","disabled");
												
												$("#weebot .chat .content").append("<div class='question question-screenshot'><div class='message'>"+$("#weebot .extended .button.screenshot").data("sending")+"</div></div>"+loader);
												$("#weebot .chat").nanoScroller();
												$("#weebot .chat").nanoScroller({ scroll: 'bottom' });
												
												var page = window.location.href;
												if( options["page:parameter"]==1 ) {
													page = page.replace(window.location.search,"");
												} 
												if( options["page:hash"]==1 ) {
													page = page.replace(window.location.hash,"");
												}
												
												var parent = 0;
												if($("#weebot .chat .answer").last().length>0) {
													if(typeof($("#weebot .chat .answer").last().data("parent"))!=typeof(undefined)) {
														parent = $("#weebot .chat .answer").last().data("parent");
													}
												}
												
												$.ajax({
													type: "POST",
													url: weebotAJAX.ajaxurl,
													data: {
														action: "weebotAJAX",
														method: "screenshot",
														x: x,
														y: y,
														width: width,
														document: $(document).width()+":"+$(document).height(),
														window: $(window).width()+":"+$(window).height(),
														height: height,
														page: page,
														parent: parent
													},
													xhrFields: {
														withCredentials: true
													},
													success: function(data){
														var audio = $("#weebot .income");
														audio[0].play();
													
														$("#weebot textarea").removeAttr("disabled");
														$("#weebot .extended .buttons").removeClass("hide");
														
														var dataArr = data.split('<!weebot!>');
														
														$(".weebot-loader").remove();
														
														$("#weebot .chat .content").append(dataArr[1]);
													
														$("#weebot .chat .content .question-screenshot").last().find(".message").html(dataArr[2]);
														
														$("#weebot .chat").nanoScroller();
														$("#weebot .chat").nanoScroller({ scroll: 'bottom' });
														
														weebot.email();
														
														if(weebot.checkSupportInterval===false) {
															weebot.checkSupportInterval = setInterval(weebot.checkSupport, 3000);
														}
														if(weebot.checkFallbackInterval===false) {
															weebot.checkFallbackInterval = setInterval(weebot.checkFallback, 30000);
														}
														
													}
												})
												
											})
									);
									
								});
								
								/*
								 *	Track online user
								 */
								if( options["online"]==1 ) {
								
									var page = window.location.href;
								
									window.setInterval(function() {
										if( options["page:parameter"]==1 ) {
											page = page.replace(window.location.search,"");
										} 
										if( options["page:hash"]==1 ) {
											page = page.replace(window.location.hash,"");
										}
										
										$.ajax({
											type: "POST",
											url: weebotAJAX.ajaxurl,
											data: {
												action: "weebotAJAX",
												method: "online",
												page: page
											},
											xhrFields: {
												withCredentials: true
											}
										})
									}, 3000);
									
								}
								
								$(document).mousemove(function(event) {
									weebot.currentMousePos.x = event.pageX;
									weebot.currentMousePos.y = event.pageY;
								});
								
								var showChat = (options["chat:seconds"]!="") ? options["chat:seconds"]*1000 : 2000;
								
								window.setTimeout(function() {
									$("#weebot .small").addClass("visible");
								}, showChat);
								
							}
						});
						
					}
				}
			});
		}
	
		/*
		*	get the users email and set email-options
		*/
		this.settingsEmail = function() {
			$.ajax({
				type: "POST",
				url: weebotAJAX.ajaxurl,
				data: {
					action: "weebotAJAX",
					question: $("#weebot .settings").attr("data-question-id"),
					email: $("#weebot-user-email").val(),
					name: $("#weebot-user-name").val(),
					method: "email"
				},
				xhrFields: {
					withCredentials: true
				},
				success: function(data){
					var el = $("#weebot_"+$("#weebot .settings").attr("data-question-id")+"_answer .email");
					$(el).removeClass("email").find(".hidden").removeClass("hidden").addClass("block");
					$(el).find(".visible").addClass("hidden");
				}
			});
		}
		
		/*
		*	get answer via email
		*/
		this.email = function() {
			$("#weebot .email").unbind("click");
			$("#weebot .email").bind("click",function() {
				$("#weebot .settings").attr("data-question-id",$(this).data("question-id"));
				if($("#weebot-user-email").val()==""||weebot.checkEmail.test($("#weebot-user-email").val())===false) {
					$("#weebot .settings").removeClass("hidden");
				} else {
					weebot.settingsEmail();
				}
			});
		}
		
		/*
		*	check for new answers to supported questions
		*/
		this.checkSupport = function(type) {
			weebot.checkAnswers("support");
		}
		
		/*
		*	check for new answers to fallbacked questions
		*/
		this.checkFallback = function(type) {
			weebot.checkAnswers("fallback");
		}
		
		/*
		*	get answers
		*/
		this.checkAnswers = function(type) {
			if($("#weebot .unanswered.type-"+type).length>0) {
				var ids = new Array();
				$.each($("#weebot .unanswered.type-"+type),function() {
					if($(this).data("question-id")!="") {
						ids.push($(this).data("question-id"));
					}
				});
				if(ids.length>0) {
					$.ajax({
						type: "POST",
						url: weebotAJAX.ajaxurl,
						data: {
							action: "weebotAJAX",
							questions: ids,
							type: type,
							method: "check"
						},
						xhrFields: {
							withCredentials: true
						},
						success: function(data){
							var dataArr = data.split('<!weebot!>');
							for(var i=0;i<dataArr.length;i++) {
								if(typeof(dataArr[i+1])!=typeof(undefined)) {
									if(dataArr[i+1]=="1") {
										$("#weebot-callback-"+dataArr[i]).removeClass("hidden");
									} else {
										if(dataArr[i+1].length>1) {
											$("#weebot-callback-"+dataArr[i]).html(dataArr[i+1]).removeClass("hidden").parent().parent().removeClass("unanswered").find(".fallback").addClass("hidden");
											var audio = $("#weebot .income");
											audio[0].play();
										}
									}
								}
								i++;
							}
						}
					});
				}
			} else {
				switch(type) {
					case "fallback":
						clearInterval(weebot.checkFallbackInterval);
						weebot.checkFallbackInterval = false;
					break;
					case "support":
						clearInterval(weebot.checkSupportInterval);
						weebot.checkSupportInterval = false;
					break;
				}
			}
		}
	
	}

})( jQuery );
