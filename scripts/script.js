let imgPath = "images/"
let imgType = ".png"
let r = [0, 113]


function scrollToRightOf(target, duration = 1000) {
    $('#scrolling-wrapper').scrollTo(target, duration, {
        offset: {top: 0, left: -$(window).width()},
        over: {top: 0, left: 1}
    });
}

function scrollPrev(target, duration = 1000) {
    $('#scrolling-wrapper').scrollTo(target, duration, {
        offset: {top: 0, left: -$(window).width()}
    })
}

function scrollNext(target, duration = 1000) {
    $('#scrolling-wrapper').scrollTo(target, duration)
}

function makeVerseOption(i) {
    return new Option('Verse ' + i, 'V' + i)
}

function getSepPos() {
    let pos = $(".separator").map(function () {
        let $this = $(this);
        return {
            el: $this,
            os: $this.offset().left
        };
    }).get();

    return {
        left: pos.filter(el => Math.round(el.os) < 0).sort((a, b) => b.os - a.os)[0],
        right: pos.filter(el => Math.round(el.os) > 0).sort((a, b) => a.os - b.os)[0]
    }
}

$(document).ready(function () {
    let sbOpenButton = $('#sidebar-open-button');
    let fsButton = $('#fullscreen-button');

    let imgWrapper = $('#scrolling-wrapper')
    let chapterSelect = $('#chapter-select')
    let fromSelect = $('#from-verse-select')
    let toSelect = $('#to-verse-select')
    let gotoSelect = $('#goto-verse-select')
    let goButton = $('#go-button')

    function closeSidebar() {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    }

    fsButton.on('click', function () {
        if ($.fullscreen.isFullScreen()) {
            $.fullscreen.exit();
            fsButton.find('.material-icons')[0].innerHTML = "fullscreen"
        } else {
            $('html').fullscreen()
            fsButton.find('.material-icons')[0].innerHTML = "fullscreen_exit"
        }
    })

    $('#sidebar-close-button, #go-button, .overlay').on('click', function () {
        closeSidebar()
    });

    $('#sidebar-close-button, #go-button, .overlay, .custom-btn').on('click', function () {
        imgWrapper.focus()
    })

    sbOpenButton.on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });

    // on chapter select
    chapterSelect.on('change', function () {
        fromSelect.empty()
        toSelect.empty()
        gotoSelect.empty()

        let k = parseInt(this.value.substr(1)) - 1

        for (let i = 1; i <= r[k]; i++) {
            fromSelect.append(makeVerseOption(i))
            toSelect.append(makeVerseOption(i))
            gotoSelect.append(makeVerseOption(i))
        }

        fromSelect.selectpicker('refresh')
        toSelect.selectpicker('refresh')
        gotoSelect.selectpicker('refresh')
    })

    // on from verse
    fromSelect.on('change', function () {
        toSelect.empty()
        let j = parseInt(this.value.substr(1))
        let k = parseInt(chapterSelect.val().substr(1)) - 1

        for (let i = j; i <= r[k]; i++) {
            toSelect.append(makeVerseOption(i))
        }

        toSelect.selectpicker('refresh')
    })

    // on go
    goButton.on('click', function () {
        let chapter = chapterSelect.val()
        let from = parseInt(fromSelect.val().substr(1))
        let to = parseInt(toSelect.val().substr(1))

        imgWrapper.empty()
        gotoSelect.empty()

        for (let i = from; i <= to; i++) {
            let id = 'V' + i
            imgWrapper.prepend($('<img>').attr('id', id).attr('src', imgPath + chapter + id + imgType))
            imgWrapper.prepend($('<span>').attr('class', 'separator'))
            gotoSelect.append(makeVerseOption(i))
        }
        imgWrapper.append($('<span>').attr('class', 'separator'))

        imgWrapper.imagesLoaded().done(function () {
            scrollToRightOf('#V' + from, 0)
        })

        gotoSelect.selectpicker('refresh')
    })

    // on go to select
    gotoSelect.on('change', function () {
        scrollToRightOf('#' + this.value)
        gotoSelect.selectpicker('val', '')
        gotoSelect.selectpicker('refresh')

        closeSidebar()
    })

    chapterSelect.trigger('change')
    goButton.trigger('click')


// Run the following when the window is resized, and also trigger it once to begin with
    $(window).resize(function () {
        // Get the buttons
        let buttons = $('.custom-btn')

        // Get the current height of the button, assuming they are all the same height
        let height = buttons.height()

        // Get the icons
        buttons = buttons.find('.material-icons')

        buttons.each((i) => {
            // Current button
            let btn = buttons[i]

            // Set the font-size and line-height of the text within the button according to the current height
            btn.style.fontSize = (height / 2) + "px"
            btn.style.lineHeight = height + "px"
            btn.style.width = height + "px"
        })
    }).trigger('resize')

    $('#next-button').on('click', function () {
        scrollNext(getSepPos().right.el)
    })

    $('#prev-button').on('click', function () {
        let pos = getSepPos()

        if (typeof pos.left !== "undefined") {
            if (Math.ceil(pos.right.os) < $(window).width()) {
                scrollPrev(pos.right.el)
            } else {
                scrollPrev(pos.left.el)
            }
        }
    })
});
