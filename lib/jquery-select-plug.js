;(function($, window, document,undefined){
    var YSelect = function(ele, opt) {
        this.$element = ele,
            this.defaults = {
                "width":200, //下拉列表的宽度
                "height":400,
                "bgColor":'',
                "moveColor":'',
                "panelStyle":{},
                "optionStyle":{},
                "childE":'', //动态添加标签
                "focused_class":'select_focused',
                "arrow":'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAGCAYAAAAVMmT4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OThGRDY1OUE1QjBFMTFFN0FCNzFFNzdDOEE5NURDMUMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OThGRDY1OUI1QjBFMTFFN0FCNzFFNzdDOEE5NURDMUMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5OEZENjU5ODVCMEUxMUU3QUI3MUU3N0M4QTk1REMxQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5OEZENjU5OTVCMEUxMUU3QUI3MUU3N0M4QTk1REMxQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjX6bzUAAAA+SURBVHjaYty7d+9/BgYGRgbC4D8TVOF/QgpB6pigHHwa4DYzIQli04DiRCY0SWQNGH5hwmItIzaFIAAQYACFnQ1DHZsxyAAAAABJRU5ErkJggg==',
                change:function(){},
            },
            this.options = $.extend({}, this.defaults, opt)
    }
    //定义Beautifier的方法
    YSelect.prototype = {
        yselect:function(){
            var _this = this;
            _this.createPanel();
            return _this;
        },
        createPanel: function() {
            var target = this.$element,
                _this = this,
                id = target.attr('id') ? (target.attr('id')+'_'+ Math.random()).replace('.', '_') : 'select_'+Math.random().toString().replace('.', '_')+'_component_'+ Math.random().toString().replace('.', '_');
            html = target.children('ul').length > 0 ? _this.getHtml(target) : _this.options.childE ;
            optionBox = $("<div style='position: absolute; top: 0px; left: 0px; width: 100%;z-index: 9999;'> <div id='option_box_"+ id +"' class='select_option option_component option_box_"+ id +"' style='display:none'>"+html+"</div></div>");
            placeholder = target.attr('placeholder') || ''; //默认值
            arrow = null,
                options = optionBox.find('li'),
                optionHeight = 36, //每个option的高度
                lineHeight = target.height(); //行高
            text = placeholder || '',
                value = '',
                option = option = $('<p style="cursor:pointer;margin:0;padding:0;line-height:'+ lineHeight+'px;height:'+  lineHeight +'px;padding-left: 10px;padding-right:23px;overflow: hidden" class="option_component_value" id="' + id + '_value" value="' + value + '">' + text + '</p>');
            arrow = $('<span class="logo_component logo_arr" style="background:url('+ _this.options.arrow +');width:11px;height:6px;background-repeat:no-repeat;margin-top: -20px;float: right;margin-right: 10px;"></span>');

            $.each(optionBox.find('li'), function(index, item) {
                if ($(item).attr('select') !== undefined) {
                    value = $(item).attr('value');
                    text = $(item).text();
                }
            });
            _this.setTagData(option,value,text); //初始化
            option.css(_this.options.optionStyle);
            target.prepend(arrow).prepend(option);
            $('body').append(optionBox);


            target.off().on('click', function(event) {
                var cid = 'option_box_' + id;
                var self = $(this);
                optionCom = $('.'+cid);
                otherOptionBox = $('body').find('.select_option.option_component') || [];

                var pos = changePosition(self);
                optionCom.css({'top':pos.top +'px','left':pos.left +'px'});

                $.each(otherOptionBox, function(index, item) {
                    if($(item).attr('id') == cid) return true;
                    _this.hidePanel($(item))
                });
                self.addClass(_this.options.focused_class)
                _this.showPanel(optionCom);
                event.stopPropagation();
            });

            $(document).on('click', function(event) {
                _this.hidePanel(optionCom)
                event.stopPropagation();
            })

            options.off().on('click', function(event) {
                var $this = $(this);
                var preValue = $this.closest('ul').find('[select]').attr('value');

                $this.attr('select','select').siblings().removeAttr('select');
                _this.hidePanel($this.closest('.select_option.option_component'));
                text = $this.html();
                value = $this.attr('value');

                _this.setTagData(target.find('p'),value,text); //初始化

                if(typeof(_this.options.change) == 'function'){
                    _this.options.change({text:text,value:value,preValue:preValue});
                }
                event.stopPropagation();
            });

            $(window).resize(function(e){ //页面尺寸变化
                var otherOptionBox = $('body').find('.select_option.option_component') || [];
                $.each(otherOptionBox, function(index, item) {
                    _this.hidePanel($(item));
                });
            });

            $(window).scroll(function(e){   //页面滚动
                var otherOptionBox = $('body').find('.select_option.option_component') || [];
                $.each(otherOptionBox, function(index, item) {
                    if($(item).css('display') != 'none'){
                        var pos =  changePosition($('#'+$(item).attr('id').substring(11)+'_value'));
                        $(item).css({'top':pos.top,'left':pos.left});
                    }
                });
            });

            function changePosition($this){
                return {top: $this.offset().top + $this.height() + 5,left:$this.offset().left}
            }
        },
        hidePanel: function(ele){ // 隐藏面板
            var _this = this
            ele.fadeOut("fast")
            $('.' + _this.options.focused_class).removeClass(_this.options.focused_class);
        },
        getHtml: function(ele){
            var _html = ele.html();
            ele.html('');
            return _html;
        },
        setTagData: function(ele,value,text){
            ele.attr('value',value).html(text);
            return ele;
        },
        setData: function(value){
            var _this = this;
            var pId =this.$element.find('p').attr('id');  //p标签 ID
            var lId = 'option_box_'+pId.split('_value')[0];  //  列表盒子 ID
            var target = $('#'+lId).find('li[value="'+value+'"]');

            if(target){
                target.siblings().removeAttr('select');
                $('#'+pId).attr('value',value).text(target.attr('select','select').text());
            }else{
                target.siblings().removeAttr('select');
                $('#'+pId).text($('#'+pId).attr('placeholder'));
            }

            return _this;
        },
        getData:function(){
            var pId =this.$element.find('p').attr('id');  //p标签 ID
            var value = $('#'+pId).attr('value').toString();

            return value;
        },
        reSize: function (){
        },
        showPanel: function(ele){
            ele.fadeIn("fast")
            return ele;
        },
        disable:function(){
        }
    }
    $.fn.yselect = function(options) {
        var ySelect = new YSelect(this, options);
        //调用其方法
        return ySelect.yselect();
    }

})(jQuery, window, document);
