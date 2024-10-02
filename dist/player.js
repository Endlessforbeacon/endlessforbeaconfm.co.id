(function($){
    "use strict";
    $.fn.WebRadio=function(options){
        var settings=$.extend({
            URL:"",
            version:"2",
            stream_id:1,
            mount_point:"x1wrh2y4jj6uv",
            api_id:"",
            streampath:"",
            artwork:!0,
            logo:"Image/130295.v7.png",
            servertitle:"Endless For Beacon FM",
            show_listeners:!0,
            src:"https://stream.zeno.fm/x1wrh2y4jj6uv",
            volume:0.75,
            autoplay:!1,
            cors: "https://zeno.fm/?url=x1wrh2y4jj6uv",
            metacors: false,
        },options);
        
        var thisObj;
        thisObj=this;
        var audio;
        var ppBtn=$(".p3-ppBtn",thisObj);
        var cVolumeSlider=$(".p3-volSlider",thisObj);
        var cVolumeIcon=$(".icons-volume",thisObj);
        var cVolumeIconM=$(".icons-volumeM",thisObj);
        audio=new Audio();
        audio.volume=settings.volume;audio.preload="auto";
        
        $(".p3-artwork",thisObj).css({'background-image':'url('+settings.logo+')','background-size':'100% 100%'});
        $(".blur",thisObj).css({'background':'url('+settings.logo+')','background-size':'100% 100%'});
        
        thisObj.each(function(){
            if(settings.autoplay==!0){audio.autoplay=!0}
            if(settings.show_listeners==!1){
                $(".listeners",thisObj).addClass("nodisplay")
            }

            audio.src=settings.URL+"/listen/"+settings.radio_id+settings.streampath;
            settings.src=audio.src;
            var dataURL=settings.URL+"/api/nowplaying_static/"+settings.api_id;
            getAzuraMeta(dataURL)
        });
        
        function togglePlying(tog,bool){
            $(tog).toggleClass("playing",bool)
        }

        function playHandling(){
            if(audio.paused){
                audio.src=settings.src;
                audio.play();
                var $playing=$('.p3-ppBtn.playing');
                if($(thisObj).find($playing).length===0){
                    $playing.click()
                }
            }
            else{
                audio.pause()
            }
        }

        $(audio).on("playing",function(){
            togglePlying(ppBtn,!0);
            $(ppBtn).addClass("pauseBtn");
            $(ppBtn).removeClass("playBtn")
        });
        $(audio).on("pause",function(){
            togglePlying(ppBtn,!1);
            $(ppBtn).removeClass("pauseBtn");
            $(ppBtn).addClass("playBtn")
        });
        $(ppBtn,thisObj).on("click tap",function(){
            playHandling()
        });
        
        var volVal=audio.volume*100;
        $(cVolumeSlider).val(volVal);
        $(".volValueTxt",thisObj).text(volVal+'%');
        volumeIcon();
        
        function volumeIcon(){
            if($(cVolumeSlider).val()<55&&$(cVolumeSlider).val()>0){
                $(cVolumeIcon).removeClass("icons-volume3 icons-volume1");
                $(cVolumeIcon).addClass("icons-volume2")
            }
            if($(cVolumeSlider).val()==0){
                $(cVolumeIcon).removeClass("icons-volume2 icons-volume3");
                $(cVolumeIcon).addClass("icons-volume1")
            }
            else if($(cVolumeSlider).val()>55){
                $(cVolumeIcon).removeClass("icons-volume1 icons-volume2");
                $(cVolumeIcon).addClass("icons-volume3")
            }
        }

        $(cVolumeIconM).on("click tap",function(){
            $(cVolumeIconM).toggleClass("icons-volumeM2");
            if($(cVolumeIconM).hasClass("icons-volumeM2")){
                audio.volume=0
            }
            else{audio.volume=settings.volume}
        });
        $(".icons-volume",thisObj).on("click",function(){
            $(cVolumeSlider).toggleClass("display")
        });
        $(cVolumeSlider).mouseup(function(){
            $(this).removeClass("display")
        });

        if(navigator.userAgent=='Microsoft Internet Explorer'||!!(navigator.userAgent.match(/Trident/)||navigator.userAgent.match(/rv:11/))||(typeof $.browser!=="undefined"&&$.browser.msie==1)) {
            cVolumeSlider.change('input',function(){
                audio.volume=parseInt(this.value,10)/100;
                var volumeVal=audio.volume*100;
                var volumeVal=Math.round(volumeVal);
                $(".vol-value",thisObj).text('Volume:'+volumeVal+'%');
                volumeIcon()
            },!1)
        }
        else{
            cVolumeSlider.on('input',function(){
                var volumeVal=$(cVolumeSlider).val();
                audio.volume=volumeVal/100;
                var volumeVal=Math.round(volumeVal);
                $(".volValueTxt",thisObj).text(volumeVal+'%')
                volumeIcon()
            })
        }

        function formatArtist(artist){
            artist=artist.toLowerCase();
            artist=$.trim(artist);
            if(artist.includes("&")){
                artist=artist.substr(0,artist.indexOf(' &'))
            }
            else if(artist.includes("feat")){
                artist=artist.substr(0,artist.indexOf(' feat'))
            }else if(artist.includes("ft.")){
                artist=artist.substr(0,artist.indexOf(' ft.'))
            }
            return artist
        }

        function formatTitle(title){
            title=title.toLowerCase();
            title=$.trim(title);
            if(title.includes("&")){
                title=title.replace('&','and')
            }
            else if(title.includes("(")){
                title=title.substr(0,title.indexOf(' ('))
            }else if(title.includes("ft")){
                title=title.substr(0,title.indexOf(' ft'))
            }
            return title
        }

        function getAzuraMeta(url){
            function foo(){
                $.ajax({
                    dataType:'json',
                    url:url,
                    success:function(data){
                        if(data.now_playing.song.text!=getTag()){
                            updateTag(data.now_playing.song.text);
                            var artist=data.now_playing.song.artist;
                            var title=data.now_playing.song.title;
                            updateArtist(artist);
                            updateTitle(title);
                            if(settings.artwork==!0){
                                getCover(artist,title)
                            };
                            FBShare(data);
                            TWShare(data);
                        }
                        updateAzServerInfo(data);
                    },
                    error:function(){console.log("error getting metadata")}
                })
            }
            foo();
            setInterval(foo,12000)
        }

        function getTag(){return $(thisObj).attr("data-tag")}

        function updateArtist(name){$(".p3-artistInfo",thisObj).text(name)}

        function updateTitle(name){$(".p3-title",thisObj).text(name)}

        function updateTag(data){$(thisObj).attr("data-tag",data)}

        function getCover(artist,title){
            artist=formatArtist(artist);
            title=formatTitle(title);
            // artist=encodeURI(artist);
            // title=encodeURI(title);
            var a=artist.replace(/ *\([^)]*\) */g, "");
            var t=title.replace(/ *\([^)]*\) */g, "");
            var url = settings.cors+'https://api.deezer.com/search?q=artist:"'+a+'" track:"'+t+'"';
            
            url=encodeURI(url);
            
            $.ajax({
                dataType:'json',
                url:url,
                success: function(emmilia){
                    if(emmilia.data.length >= 1){
                        var cover=emmilia.data[0].album.cover_medium;
                    }
                    else{
                        var cover=settings.logo;
                    }

                    $(".p3-artwork",thisObj).css({
                        'background-image':'url('+cover+')','background-size':'100% 100%'
                    });
                    $(".p3-artwork",thisObj).addClass("bounceInDown");
                    setTimeout(function(){
                        $(".p3-artwork",thisObj).removeClass("bounceInDown")
                    },5000);
                    $(".blur",thisObj).css({
                        'background':'url('+cover+')','background-size':'100% 100%'
                    })
                },
                error: function(){
                    console.log("Error on track title "+encodeURI(title))
                }
            })
        }

        function updateAzServerInfo(result){
            $(".servertitle",thisObj).text(result.station.name);
            $(".cListeners",thisObj).text(result.station.mounts[0].listeners.current);
            $(".pListeners",thisObj).text(result.station.mounts[0].listeners.total);
            $(".bitrate",thisObj).text(result.station.mounts[0].bitrate + " kbps");
        }

        $(".icons-history",thisObj).on("click tap",function(){
            $(".icons-history",thisObj).toggleClass("icons-close");
            if(!$(".player-ctr",thisObj).hasClass("open")){
                $(".player-ctr",thisObj).fadeOut(400);
                $(".history-wpr",thisObj).delay(600).fadeIn(400);
                $(".player-ctr",thisObj).addClass("open")
            }
            else if($(".player-ctr",thisObj).hasClass("open")){
                $(".player-ctr",thisObj).removeClass("open");
                $(".history-wpr",thisObj).fadeOut(400);$(".player-ctr",thisObj).delay(600).fadeIn(400)
            }
        });
        $(".album-cover-wpr",thisObj).hover(function(){
            $(".social-share-wpr",thisObj).toggleClass("display");
            $(".social-link-twitter",thisObj).toggleClass("bounceIn");
            $(".social-link-facebook",thisObj).toggleClass("bounceIn")
        })

        function FBShare(result){
            var siteURL=window.location.href;
            var url="https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(siteURL);
            $("#aface",thisObj).attr("href",url)
        }

        function TWShare(result){
            var siteURL=window.location.href;
            var url="https://twitter.com/home?status=I'm listening to "+result.songtitle+" @ "+siteURL;$("#atwitter",thisObj).attr("href",url)
        }

        if(/Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)){
            $(cVolumeIcon).addClass("nodisplay");
            $(cVolumeIconM).addClass("display")
        }
    }

})(jQuery)