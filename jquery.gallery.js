/*!
 * jQuery wmuSlider v2.1
 * 
 * Copyright (c) 2011 Brice Lechatellier
 * http://brice.lechatellier.com/
 *
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

;(function($) {


    
    $.fn.wmuSlider = function(options) {

        /* Default Options
        ================================================== */       
        var defaults = {
            animation: 'slide',
            animationDuration: 600,
            slideToStart: 1,
            navigationControl: true,
            previousText: 'Previous',
            nextText: 'Next',
            slide: 'article',
            items: 1,
            firstLoad: true
        };
        var options = $.extend(defaults, options);
        
        return this.each(function() {

            /* Variables
            ================================================== */
            var $this = $(this);
            var currentIndex = options.slideToStart;
            var wrapper = $this.find('.wmuSliderWrapper');
            var defaultImage = $this.find('.default_image');
            var slides = $this.find(options.slide);
            var slidesCount = slides.length;
            var shiftDist = [];
            
            /* Load Slide
            ================================================== */ 
            var loadSlide = function(index, infinite) {
                currentIndex = index;
                
                if ( !options.firstLoad ) {    
                    var slide = $(slides[index]);
                    $this.animate({ height: slide.innerHeight() });
                    if (!infinite) {
                        wrapper.animate({ marginLeft: shiftDist[currentIndex-1] }, options.animationDuration, function() {
                            isAnimating = false;
                        });
                    } else {
                        if (index == 2) {
                            wrapper.animate({ marginLeft: shiftDist[slidesCount-1] }, options.animationDuration, function() {
                                wrapper.css('marginLeft', shiftDist[currentIndex-1]);
                                isAnimating = false;
                            });
                        } else {
                            //wrapper.css('marginLeft',  );
                            wrapper.animate({ marginLeft: shiftDist[0] }, options.animationDuration, function() {
                                wrapper.css('marginLeft', shiftDist[currentIndex-1]);
                                isAnimating = false;
                            });
                        }
                    }

                     // Trigger Event
                    $this.trigger('slideLoaded', index);
                };
            };
            
            
            /* Navigation Control
            ================================================== */
            var navigation = function() {
                if (options.navigationControl) {
                    var prev = $('<a class="wmuSliderPrev">' + options.previousText + '</a>');
                    prev.click(function(e) {
                        e.preventDefault();
                        if (currentIndex == 2) {
                            loadSlide(slides.length - 2, true);
                        } else {
                            loadSlide(currentIndex - 1);
                        }
                    });
                    $this.append(prev);  

                    var next = $('<a class="wmuSliderNext">' + options.nextText + '</a>');
                    next.click(function(e) {
                        e.preventDefault();
                        if (currentIndex + 1 == slides.length - 1) {    
                            loadSlide(2, true);
                        } else {
                            loadSlide(currentIndex + 1);
                        }
                    });       
                    $this.append(next);
                } else {
                    $( ".wmuSliderPrev" ).remove();
                    $( ".wmuSliderNext" ).remove();
                }
            }
            
            // var navigation = function() {
            //     wrapper.css('marginLeft', -$this.width() / options.items * slidesCount);
            //     // currentIndex = index;
            //     // var slide = $(slides[index]);
            //     // $this.animate({ height: slide.innerHeight() });
            //     // if (currentIndex == 0) {
            //     //     wrapper.animate({ marginLeft: -$this.width() / options.items * index }, options.animationDuration, function() {
            //     //             isAnimating = false;
            //     //         });
            //     // }
            // }
                        
            /* Resize Slider
            ================================================== */ 
            var resize = function() {
                var slide = $(slides[currentIndex]);
                $this.animate({ height: slide.innerHeight() });
                var wrapperWidth = 0;
                for(var i = 0; i < slides.length; i++) {
                    var padRight = 0;
                    var padLeft = 0;
                    // if ( i != slides.length-1 )
                    //     padRight = ( $this.width()/2 - slides[i].clientWidth/2 - slides[i+1].clientWidth/4 ) / 2
                    if ( i != 0 )
                        padLeft = ( $this.width()/2 - slides[i].clientWidth/2 - slides[i-1].clientWidth/4 )
                    slides[i].style.paddingLeft=padLeft+"px"
                    //slides[i].style.paddingRight=padRight+"px"
                    wrapperWidth += padRight + padLeft + slides[i].clientWidth;
                }
                calculateShiftDist();
                //shiftDist[1]
                wrapper.css({
                    marginLeft: -1500,
                    width: wrapperWidth
                });
                var temp = wrapper
            };
            
            var calculateShiftDist = function() {
                shiftDist.push(-1 * slides[0].clientWidth*3/4);
                for(var i = 1; i < slides.length-1; i++) {
                    var padLeft = parseFloat( slides[i].style.paddingLeft.replace(/[^0-9\.]+/g,'') );
                    //var padRight = parseFloat( slides[i-1].style.paddingRight.replace(/[^0-9\.]+/g,'') );
                    var padRight = 0
                    var dist = -1 * ( slides[i-1].clientWidth*1/4 + padLeft + padRight + slides[i].clientWidth*3/4 );
                    shiftDist.push(dist+shiftDist[i-1])
                }
            }
            
            /* Init Slider
            ================================================== */ 
            var init = function() {
                var slide = $(slides[currentIndex]);
                var img = slide.find('img');
                img.load(function() {
                    wrapper.show();
                    $this.animate({ height: slide.innerHeight() });
                });
                if (options.items > slidesCount) {
                    options.items = slidesCount;
                }
                slides.css('float', 'left');                    
                slides.each(function(i){
                    var slide = $(this);
                    slide.attr('data-index', i);
                });
                wrapper.prepend($(slides[slidesCount-1]).clone());
                wrapper.prepend($(slides[slidesCount-2]).clone());
                wrapper.append($(slides[0]).clone());
                wrapper.append($(slides[1]).clone());
                // for(var i = 0; i < options.items; i++) {
                //     wrapper.append($(slides[i]).clone());
                // }
                slides = $this.find(options.slide);
                resize();
                
                $this.trigger('hasLoaded');
                
                loadSlide(currentIndex);

                options.firstLoad = false;
            }

            init();

            defaultImage.click(function(){
                navigation();
                options.navigationControl = !options.navigationControl;
            })
                                                
            /* Bind Events
            ================================================== */
            // Resize
            $(window).resize(resize); //may not be needed
            
            //dont think this is needed
            // // Load Slide
            $this.bind('loadSlide', function(e, i) {
                clearTimeout(slideshowTimeout);
                loadSlide(i);
            });
                        
        });
    }
    
})(jQuery);