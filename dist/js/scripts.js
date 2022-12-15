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

function IsFilled() {
    var self = this;

    this.checkField = function (field) {
        var field = $(field),
            formField = field.closest('.field');

        if (field.val() !== '') {
            formField.addClass('filled');
        } else {
            formField.removeClass('filled');
        }
    };

    this.checkSelect = function (select) {
        var select = $(select),
            selectField = select.closest('.field');

        if (select.val() !== '') {
            $(select.data('select2').$container).addClass('filled');
            selectField.addClass('filled');
        }
    };

    this.checkAllFields = function (blockClass) {
        var formsFields;
        var selects;

        if (blockClass !== undefined) {
            formsFields = $(blockClass).find('.input, .textarea');
            selects = $(blockClass).find('.select2');
        } else {
            formsFields = $('.input, .textarea');
            selects = $('.select2');
        }

        formsFields.each(function (i) {
            self.checkField(formsFields[i]);
        });

        formsFields.on('input change', function () {
            self.checkField(this);
        });

        selects.each(function (i) {
            self.checkSelect(selects[i]);
        });

        selects.on('change', function () {
            self.checkSelect(this);
        });
    };

    this.init = function () {
        this.checkAllFields();
    };
}
////=include vendor/formMessages.js

function invertibleHeader() {
    _header.toggleClass("header--sticky", _window.scrollTop() > 20);
    // $('.mobile-menu').toggleClass('mobile-menu--sticky', _window.scrollTop() > 50);
    _window.on("scroll", function () {
        _header.toggleClass("header--sticky", _window.scrollTop() > 20);
        // $('.mobile-menu').toggleClass('mobile-menu--sticky', _window.scrollTop() > 50);
    });
}

function initSelect2() {
    $(".select2-single").each(function () {
        var _this = $(this),
            _thisDataClass = _this.data("class"),
            _thisPlaceholder = _this.data("placeholder") || "";
        _this.show();
        _this.select2({
            width: "100%",
            minimumResultsForSearch: Infinity,
            placeholder: _thisPlaceholder,
            containerCssClass: _thisDataClass,
            dropdownCssClass: _thisDataClass,
        });
        _this.val(null);
        _this.trigger("change");
    });
}

function initContactUsForm() {
    if (issetElement(".request__form")) {
        $(".request__form").submit(function (e) {
            e.preventDefault();

            var contactForm = $(this),
                fieldsArray = contactForm.serializeArray(),
                formData = {},
                url = "/send-main.php";

            fieldsArray.forEach(function (item) {
                formData[item.name] = item.value;
            });

            var btn = $('.request__action button[type="submit"]');
            btn.button("loading");
            var field = $(".request__form .field");
            field.removeClass("has-error");
            $(".help-block").remove();

            grecaptcha
                .execute("6LdUv8YUAAAAAJ-_6vLLnGlEu9eSZHSfx-DYuxNU", {
                    action: "homepage",
                })
                .then(
                    function (token) {
                        formData["recaptcha_response"] = token;

                        $.post(
                            url,
                            formData,
                            function (data) {
                                setTimeout(function () {
                                    if (data.result == "success") {
                                        setTimeout(function () {
                                            document.location =
                                                "https://jafton.com/web-and-app-thank-you";
                                        }, 500);
                                    } else if (data.result == "error") {
                                        btn.button("reset");
                                        if (data.errors != undefined) {
                                            $(".modal--popup").modal("show");

                                            $.each(
                                                data.errors,
                                                function (key, value) {
                                                    var inputParent = $(
                                                        ".request__form input[name=" +
                                                            key +
                                                            "]"
                                                    ).parent();
                                                    var selectParent = $(
                                                        ".request__form select[name=" +
                                                            key +
                                                            "]"
                                                    ).parent();
                                                    var textareaParent = $(
                                                        ".request__form textarea[name=" +
                                                            key +
                                                            "]"
                                                    ).parent();

                                                    inputParent.addClass(
                                                        "has-error"
                                                    );
                                                    inputParent.append(
                                                        '<div class="help-block"> ' +
                                                            value +
                                                            " </div>"
                                                    );
                                                    selectParent.addClass(
                                                        "has-error"
                                                    );
                                                    selectParent.append(
                                                        '<div class="help-block"> ' +
                                                            value +
                                                            " </div>"
                                                    );
                                                    textareaParent.addClass(
                                                        "has-error"
                                                    );
                                                    textareaParent.append(
                                                        '<div class="help-block"> ' +
                                                            value +
                                                            " </div>"
                                                    );
                                                }
                                            );
                                        }
                                        btn.button("reset");
                                    }
                                }, 200);
                            },
                            "json"
                        );
                    },
                    function (err) {
                        btn.button("reset");
                    }
                );
        });
    }
}

function initPopUp() {
    _document.ready(function () {
        const options = {
            root: null,
            rootMargin: "79px 0px 0px 0px",
            threshold: 0,
        };

        let permission = 0;

        const showPopUp = function (entries, observer) {
            entries.forEach((entry) => {
                if (permission === 1) {
                    $(".pop-up").addClass("open");
                    permission++;
                }
                if (entry.isIntersecting) {
                    permission++;
                }
            });
        };

        const observer = new IntersectionObserver(showPopUp, options);

        if (issetElement("#portfolio")) {
            const targetMain = document.querySelector("#portfolio");
            observer.observe(targetMain);
        }

        if (issetElement(".developed")) {
            const targetPage = document.querySelector(".developed");
            observer.observe(targetPage);
        }

        if (issetElement(".pop-up")) {
            _document.on("click", function (e) {
                if (
                    e.target == document.querySelector(".pop-up__close a") ||
                    e.target == document.querySelector(".pop-up")
                ) {
                    e.preventDefault();
                    $(".pop-up").removeClass("open");
                }
            });
            $(".pop-up__actions").on("click", function(e) {
                e.preventDefault();
                $(".pop-up").removeClass("open");
            })
        }
    });
}

function initAccordion() {
    _document.on(_touchTap, ".js-accordion-trigger", function (e) {
        e.preventDefault();
        var _this = $(this);
        var _thisItem = _this.closest(".js-accordion-item");
        var _thisItemParent = _thisItem.parent();
        var _thisContent = _thisItem.find(".js-accordion-content");

        if (_thisItem.hasClass("active")) {
            _thisItemParent.find(".js-accordion-item").removeClass("active");
            _thisContent.slideUp(150);
        } else {
            _thisItemParent.find(".js-accordion-item").removeClass("active");
            _thisItemParent.find(".js-accordion-content").slideUp(200);
            _thisItem.addClass("active");
            _thisContent.slideDown(300);
        }
    });
}

function initSliders() {
    var brands = new Swiper(".features__brand-list", {
        slidesPerView: 6,
        spaceBetween: 20,
        autoplay: {
            delay: 5000,
        },
        loop: true,
        preloadImages: false,
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },

        breakpoints: {
            320: {
                slidesPerView: 2.3,
            },
            400: {
                slidesPerView: 2.8,
            },
            480: {
                slidesPerView: 3.2,
                spaceBetween: 10,
            },
            576: {
                slidesPerView: 4,
                spaceBetween: 15,
            },
            768: {
                slidesPerView: 3.2,
                spaceBetween: 15,
            },
            992: {
                slidesPerView: 3.2,
                spaceBetween: 15,
            },
            1200: {
                slidesPerView: 6.2,
                spaceBetween: 20,
            },
        },

        scrollbar: {
            el: ".specialists__scrollbar",
        },
    });

    var cards = new Swiper(".features__cards-list", {
        slidesPerView: 1,
        spaceBetween: 24,
        preloadImages: false,
        autoHeight: false,
        loop: true,
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },

        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            370: {
                slidesPerView: 1.2,
            },
            410: {
                slidesPerView: 1.2,
            },
            480: {
                slidesPerView: 1.5,
            },
            576: {
                slidesPerView: 1.8,
            },
            768: {
                slidesPerView: 2.4,
            },
            992: {
                slidesPerView: 2.7,
            },
            1200: {
                slidesPerView: 2,
            },
        },

        scrollbar: {
            el: ".reviews__scrollbar",
        },
    });

    var news = new Swiper(".news__slider", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoHeight: true,
        preloadImages: false,
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },

        breakpoints: {
            480: {
                slidesPerView: 1,
                spaceBetween: 30,
                autoHeight: true,
            },
            576: {
                slidesPerView: 1.6,
                spaceBetween: 30,
                autoHeight: true,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
                autoHeight: true,
            },
            1200: {
                slidesPerView: 3,
                spaceBetween: 30,
                autoHeight: false,
            },
        },

        navigation: {
            nextEl: ".news__nav-next",
            prevEl: ".news__nav-prev",
        },

        scrollbar: {
            el: ".news__scrollbar",
        },
    });
}

function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

function initPortfolioTabs() {
    if (issetElement(".portfolio__tabs-content")) {
        $(".portfolio__tabs-inner li a").first().addClass("active");
        $(".portfolio__tabs-content").first().addClass("active");
    } else {
        $(".portfolio__tabs-content").first().addClass("active");
    }

    _document.on(_touchTap, ".portfolio__tabs-inner li a", function (e) {
        e.preventDefault();

        var _this = $(this),
            tabName = _this.data("portfolio"),
            content = $(
                '.portfolio__tabs-content[data-portfolio="' + tabName + '"]'
            );

        $(".portfolio__tabs-inner li a.active").removeClass("active");
        _this.addClass("active");

        $(".portfolio__tabs-content.active").removeClass("active");
        content.addClass("active");

        return false;
    });
}

function portfolioHover1() {
    let item = $(".portfolio__item");
    item.mouseenter(function () {
        $(this).toggleClass("active");
    }).mouseleave(function () {
        $(this).toggleClass("active");
    });
}

function portfolioHover() {
    let needHover;
    const itemsClass = ".portfolio__item";

    function onItemMouseEnter() {
        let commentHeight = $(this)
            .children(".portfolio__item-comment")
            .outerHeight();
        $(this)
            .toggleClass("active")
            .css({
                "padding-bottom": commentHeight + 14,
            });
    }

    function onItemMouseLeave() {
        $(this).toggleClass("active").css({
            "padding-bottom": "0px",
        });
    }

    function checkNeedHover() {
        const isWidthIsSmaller = _window.innerWidth() < 1200;
        if (isWidthIsSmaller && needHover) {
            needHover = false;
            _document.off("mouseenter", itemsClass, onItemMouseEnter);
            _document.off("mouseleave", itemsClass, onItemMouseLeave);
        }
        if (!isWidthIsSmaller && !needHover) {
            needHover = true;
            _document.on("mouseenter", itemsClass, onItemMouseEnter);
            _document.on("mouseleave", itemsClass, onItemMouseLeave);
        }

        $(itemsClass).removeClass("active");
    }

    checkNeedHover();
    _window.on("resize", checkNeedHover);
}

function hideShowServices() {
    $(".js-services-list-hide").hide();
    $(".js-services-toggle").on("click", function (e) {
        e.preventDefault();
        $(this).toggleClass("active");
        $(".js-services-list-hide").slideToggle();
    });
}

function disableLink() {
    $(".portfolio__item-comment-action a").on("click", function (e) {
        e.preventDefault();
    });
}

function App() {
    return {
        mobileMenu: new MobileMenu(),
        isFilled: new IsFilled(),
        init: function () {
            invertibleHeader();
            initSliders();
            initAccordion();
            this.mobileMenu.init();
            this.isFilled.init();
        },
    };
}

testWebP(function (support) {
    if (support == true) {
        document.querySelector("body").classList.add("webp");
    } else {
        document.querySelector("body").classList.add("no-webp");
    }
});

_document.ready(function () {
    app = new App();
    app.init();

    _document.on("click", 'a[href*="#"]:not([href="#"])', function (e) {
        var _headerHeight = _header.height(),
            _thisHref = $(this).attr("href"),
            _sectionId = _thisHref.substr(_thisHref.indexOf("#")),
            _thisSection = $(_sectionId);

        app.mobileMenu.close();
        if (_thisSection.length > 0) {
            e.preventDefault();
            $("html, body").animate(
                {
                    scrollTop: _thisSection.offset().top - _headerHeight,
                },
                500
            );
            return false;
        }
    });

    $("[data-mask]").each(function () {
        $(this).mask($(this).attr("data-mask"));
    });

    autosize($(".textarea"));

    _document.on(_touchTap, ".mklbItem", function (e) {
        $(".mklbItem").blur();
        if (issetElement("#mkLightboxContainer")) {
            _html.addClass("overflow-hidden");
        } else {
            _html.removeClass("overflow-hidden");
        }
    });

    _document.on(_touchTap, "#overlay", function (e) {
        _html.removeClass("overflow-hidden");
    });

    _document.on(_touchTap, "#closeIconContainer", function (e) {
        _html.removeClass("overflow-hidden");
    });

    _document.keyup(function (e) {
        if (e.keyCode == 27) {
            $("#mkLightboxContainer").remove();
            _html.removeClass("overflow-hidden");
        }
    });
});
