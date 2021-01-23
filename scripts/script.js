let imgPath = "images/"
let imgType = ".png"
let r = [0, 113]
let idx = {
    'C2V4': {
        'codes': ['10001', '10002', '10003', '10004'],
        'pos': [82.1, 62.1, 32.4, 11.8]
    },
    'C2V5': {
        'codes': ['10001', '10005', '10005', '10006'],
        'pos': [86.1, 71.1, 44.8, 10.2]
    },
    'C2V7': {
        'codes': ['10007', '10008', '10009', '10001'],
        'pos': [82.2, 50.2, 28.5, 12.1]
    },
    'C2V8': {
        'codes': ['10010'],
        'pos': [90.6]
    },

    'C2V10': {
        'codes': ['10016', '10017', '10018', '10019'],
        'pos': [88.31, 66.14, 47.5, 12.75]
    },
    'C2V11': {
        'codes': ['10020', '10021', '10022'],
        'pos': [69.89, 15.62, 10.58]
    },
    'C2V12': {
        'codes': ['10023', '10024', '10025'],
        'pos': [78.19, 58.4, 36.5]
    },
    'C2V13': {
        'codes': ['10026'],
        'pos': [15.62]
    },
    'C2V14': {
        'codes': ['10027', '10028', '10029', '10030', '10031', '10032', '10033'],
        'pos': [87.08, 76.48, 71.94, 58.94, 56.08, 45.32, 6.46]
    },
    'C2V15': {
        'codes': ['10034', '10035', '10036', '10037', '10038', '10039'],
        'pos': [85.44, 79.54, 69.8, 67.21, 49.59, 30.15]
    },
    'C2V16': {
        'codes': ['10040', '10041', '10042'],
        'pos': [80.12, 54.73, 17.9]
    },
    'C2V17': {
        'codes': ['10043', '10044', '10045'],
        'pos': [79.1, 48.7, 20.72]
    },
    'C2V18': {
        'codes': ['10046', '10047', '10048', '10049', '10050'],
        'pos': [69.82, 57.73, 38.93, 25.89, 7.22]
    },
    'C2V19': {
        'codes': ['10051'],
        'pos': [22.92]
    },
    'C2V20': {
        'codes': ['10052'],
        'pos': [52.85]
    },
    'C2V21': {
        'codes': ['10053', '10054', '10055', '10056', '10057', '10058', '10059', '10060'],
        'pos': [95.34, 87.97, 76.89, 70.01, 58.68, 50.14, 44.08, 34.73]
    },
    'C2V9': {
        'codes': ['10014', '10015'],
        'pos': [63.92, 49.86]
    }
}

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

function toggleTransCover() {
    $('.cover-tgl').toggleClass('d-none')
}

function closeImgs() {
    $('.cover').addClass('d-none').empty()
}

function toggleImg(verbid) {
    if ($('#i' + verbid).length) {
        closeImgs()
    } else {
        closeImgs()
        $('.cover').removeClass('d-none').append($('<img>').attr('class', 'timg').attr('id', "i" + verbid).attr('src', imgPath + verbid + imgType))
    }
}

$(document).ready(function () {
    let sbOpenButton = $('#sidebar-open-button');
    let fsButton = $('#fullscreen-button');
    let cvrButton = $('#cover-button');

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
            let d = $('<div>').attr('class', 'img-wrapper').append($('<img>').attr('id', id).attr('src', imgPath + chapter + id + imgType))

            let idxkey = chapter + id

            if (idxkey in idx) {
                let codes = idx[idxkey].codes
                let pos = idx[idxkey].pos

                for (let j = 0; j < codes.length; j++) {
                    let b = $('<button>').attr('class', 'tbtn btn btn-circle btn-sm').attr('id', codes[j]).css('left', 'calc(' + pos[j] + '% - 10px)').css('z-index', '950')
                    b.on('click', function () {
                        toggleImg($(this).attr('id'))
                    })
                    d.append(b)
                }
            }

            d.append($('<button>?</button>').attr('class', 'tbtn').attr('id'))
            imgWrapper.prepend(d)
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

    cvrButton.on('click', function () {
        toggleTransCover()

        if ($('.cover-tgl').hasClass('d-none')) {
            cvrButton.find('.material-icons')[0].innerHTML = 'visibility_off'
        } else {
            cvrButton.find('.material-icons')[0].innerHTML = 'visibility'
        }
    })

    $('.custom-btn').on('mouseup', function () {
        $(this).blur()
    })

    $(document).on('click', function (event) {
        if (!$(event.target).closest(".tbtn").length && !$(event.target).closest(".timg").length) {
            closeImgs()
        }
    })
});
