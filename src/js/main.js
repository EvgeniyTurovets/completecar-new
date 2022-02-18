$(function(){
    new WOW().init();
    lazyload();
    function headerFix(){
        var scroll = $(document).scrollTop();
        var offsetTop = $('.header__top').height()
        if(scroll > offsetTop){
            $('.header__fix').addClass('active')
        }else{
            $('.header__fix').removeClass('active')
        }
    }
    headerFix()

    function srollTopFade(){
        if($(document).scrollTop() > 300){
            $('#toTop').addClass('active')
        }else{
            $('#toTop').removeClass('active')
        }
    }
    srollTopFade()

    $('#toTop').on('click', function(){
        $("html, body").animate({ scrollTop: 0 }, "slow");
    })

    $(document).on('scroll', function (){
        headerFix()
        srollTopFade()
    })

    const swiper = new Swiper('#sliders-container', {
        loop: true,
        effect: 'fade',
        slidesPerView: 1,

        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });

    const swiper2 = new Swiper('.block4__swiper', {
        loop: true,
        slidesPerView: 1,
        autoHeight: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });

    

    $('#burger').on('click', function(){
        $('.nav-mob').fadeIn().css('display', 'flex')
    })
    $('.nav-mob__close').on('click', function(){
        $('.nav-mob').fadeOut()
    })


    $('.mob-acordion__row').on('click', function(){
        $(this).toggleClass('active')
        $(this).find('ul').slideToggle()
    })

    $('.fusion-panel').on('click', function(){
        
        if(!$(this).hasClass('active')){
            $(this).closest('.panel-group').find('.fusion-panel').removeClass('active')
            $(this).closest('.panel-group').find('.panel-body').slideUp()

            $(this).addClass('active')
            $(this).find('.panel-body').slideDown()
        }else{
            $(this).closest('.panel-group').find('.fusion-panel').removeClass('active')
            $(this).closest('.panel-group').find('.panel-body').slideUp()
        }
    })
})