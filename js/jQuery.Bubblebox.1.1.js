/*
 * Bubblebox 1.1 - One drop-down panel can be dragged and can be filled content with inline html, iframe or ajax.
 * By laonan (http://www.laonan.net)
 * The function which is named as "bb_tb_parseQuery" comes from thickbox3.1 by Cody Lindley (http://www.codylindley.com)
 * Copyright (c) 2012 laonan
 * Licensed under the BSD License: http://www.opensource.org/licenses/bsd-license.php
*/

(function($){
	$.fn.isChildAndSelfOf = function(b){
		return ($(this).closest(b).length > 0);
	};

    var methods = {
        init : function( options ) {

            $(document).click(function (e) {
                var isTrigger = false;
                for(var i=0; i< arrLinkObj.length;i++) {
                    if(arrLinkObj[i] == e.target)
                        isTrigger = true;
                }

                var isInBubblebox = $(e.target).isChildAndSelfOf ('#Bubblebox-div');

                if( !isInBubblebox &&  !isTrigger){
                    $('#Bubblebox-div').hide();
                }
            });

            var defaults = {
                offsetY : 4,
                offsetX : 0,
                boxWidth : 120,
                boxHeight : 120,
                loadingImg : '../images/loading.gif',
                closeImg: '../images/close.gif',
                dragged: true
            };
            var options = $.extend(defaults, options);

            return this.each(function(){
                var objHeight = $(this).height();
                var topY = $(this).position().top + objHeight + options.offsetY;
                var leftX = $(this).position().left + options.offsetX;
                arrLinkObj.push(this);

                $(this).click(function(){
                    $('#Bubblebox-div').remove();

                    var bobbleBox_html = '<div id="Bubblebox-div">';
                    bobbleBox_html += '<div class="Bubblebox-header"><a href="javascript:void(0);"><img src="' + options.closeImg + '" /></a></div>';
                    bobbleBox_html += '<div class="bubblebox-loading"><img src="' + options.loadingImg + '" /></div>';
                    bobbleBox_html += '<div class="bubblebox-content">';
                    bobbleBox_html += '</div>';
                    bobbleBox_html += '</div>';

                    $('body').append(bobbleBox_html);
                    var bStyle = 'top:' + topY + 'px;left:' + leftX + 'px;width:' + options.boxWidth + 'px;height:' + options.boxHeight + 'px;';
                    if(options.dragged) {
                        bStyle += 'cursor:move;';
                    }
                    $('#Bubblebox-div').attr('style', bStyle);
                    $('.bubblebox-loading').attr('style', 'margin-top:' + (options.boxHeight/2 - 40) + 'px;');

                    var bobbleBox = $('#Bubblebox-div');
                    if(options.dragged) {
                        //drag layer
                        var _move=false;
                        var _x,_y;
                        $(bobbleBox).click(function(){
                        }).mousedown(function(e){
                                _move=true;
                                _x=e.pageX-parseInt($(bobbleBox).css('left'));
                                _y=e.pageY-parseInt($(bobbleBox).css('top'));
                                $(bobbleBox).fadeTo(20, 0.5);
                            });

                        $(document).mousemove(function(e){
                            if(_move){
                                var x=e.pageX-_x;
                                var y=e.pageY-_y;
                                $(bobbleBox).css({top:y,left:x});
                            }
                        }).mouseup(function(){
                                _move=false;
                                $(bobbleBox).fadeTo('fast', 1);
                            });
                    }

                    $(bobbleBox.find('.Bubblebox-header a')).click(function(){
                        $(bobbleBox).hide();
                    });

                    var url = $(this).attr('href');
                    var queryString = url.replace(/^[^\?]+\??/,'');
                    var params = bb_tb_parseQuery(queryString);
                    var urlNoQuery = url.split('bubblebox_type=')[0];

                    if(params['bubblebox_type'] == 'iframe') {
                        var iframe_html = '<iframe frameborder="0" hspace="0" src="' +urlNoQuery+'" id="Bubblebox_iframeContent" name="Bubblebox_iframeContent'+Math.round(Math.random()*1000)+'" style="width:'+(options.boxWidth-20)+'px;height:'+(options.boxHeight-20)+'px;display:none;" ></iframe>';
                        $('.bubblebox-content').append(iframe_html);
                        $('#Bubblebox_iframeContent').load(function(){
                            $('.bubblebox-loading').remove();
                            $('#Bubblebox_iframeContent').show();
                        });
                    }
                    else if (params['bubblebox_type'] == 'ajax') {
                        $('.bubblebox-content').hide();
                        $.get(urlNoQuery, function(data) {
                            $('.bubblebox-loading').remove();
                            $('.bubblebox-content').append(data);
                            $('.bubblebox-content').show();
                        });
                    }
                    else {
                        //html in this page, in ie8, this url sometimes is auto completed like 'http://www.domain.com/#yourid'
                        url_arr = url.split('#');
                        if(url_arr.length > 1)
                            url = '#' + url_arr[1]

                        $('.bubblebox-loading').remove();
                        $('.bubblebox-content').append($(url).html());
                    }

                    return false;
                });

            });
        },

        close :function(){
            $('#Bubblebox-div').hide();
        }
    };

	var arrLinkObj = new Array();
	$.fn.Bubblebox = function(method){

        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.Bubblebox.' );
        }

    };
	
	function bb_tb_parseQuery ( query ) {
	   var Params = {};
	   if ( ! query ) {return Params;}// return empty object
	   var Pairs = query.split(/[;&]/);
	   for ( var i = 0; i < Pairs.length; i++ ) {
	      var KeyVal = Pairs[i].split('=');
	      if ( ! KeyVal || KeyVal.length != 2 ) {continue;}
	      var key = decodeURI( KeyVal[0] );
	      var val = decodeURI( KeyVal[1] );
	      val = val.replace(/\+/g, ' ');
	      Params[key] = val;
	   }
	   return Params;
	}
	
})(jQuery);
