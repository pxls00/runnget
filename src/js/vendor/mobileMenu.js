function MobileMenu() {
	var mobileMenu = $('.mobile-menu'),
		toggleMenuElement = $('.js-mobile-menu-toggle');

	this.open = function () {
		toggleMenuElement.addClass('open');
		mobileMenu.addClass('open');
        if(mobileMenu.hasClass('mobile-menu--main')){
            _html.addClass('overflow-hidden--lg mobile-open');
        }else if(mobileMenu.hasClass('mobile-menu--landing')){
            _html.addClass('overflow-hidden--sm mobile-open');
        }else if(mobileMenu.hasClass('mobile-menu--dashboard')){
            _html.addClass('overflow-hidden--1339 mobile-open');
        }else{
            _html.addClass('overflow-hidden mobile-open');
        }
	};

	this.close = function () {
		toggleMenuElement.removeClass('open');
		mobileMenu.removeClass('open');
        if(mobileMenu.hasClass('mobile-menu--main')){
            _html.removeClass('overflow-hidden--lg mobile-open');
        }else if(mobileMenu.hasClass('mobile-menu--landing')){
            _html.removeClass('overflow-hidden--sm mobile-open');
        }else if(mobileMenu.hasClass('mobile-menu--dashboard')){
            _html.removeClass('overflow-hidden--1339 mobile-open');
        }else{
            _html.removeClass('overflow-hidden mobile-open');
        }
	};

	this.init = function () {
        
		toggleMenuElement.on(_touchTap, function (e){
			e.preventDefault();
			toggleMenuElement.toggleClass('open');
			mobileMenu.toggleClass('open');
			if(mobileMenu.hasClass('mobile-menu--main')){
                _html.toggleClass('overflow-hidden--lg mobile-open');
            }else if(mobileMenu.hasClass('mobile-menu--landing')){
                _html.toggleClass('overflow-hidden--sm mobile-open');
            }else if(mobileMenu.hasClass('mobile-menu--dashboard')){
                _html.toggleClass('overflow-hidden--1339 mobile-open');
            }else{
                _html.toggleClass('overflow-hidden mobile-open');
            }
			return false;
		});
	};
}
