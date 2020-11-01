let imgPath = "images/"
let imgType = ".png"
let r = [0, 97]


function scrollToRightOf(target, duration = 1000) {
    $('#scrolling-wrapper').scrollTo(target, duration, {
        offset: {top: 0, left: -$(window).width()},
        over: {top: 0, left: 1}
    });
}

function makeVerseOption(i) {
    return new Option('Verse ' + i, 'V' + i)
}

function closeSidebar() {
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
}

$(document).ready(function () {
    let imgWrapper = $('#scrolling-wrapper')
    let chapterSelect = $('#chapter-select')
    let fromSelect = $('#from-verse-select')
    let toSelect = $('#to-verse-select')
    let gotoSelect = $('#goto-verse-select')
    let goButton = $('#go-button')

    $('#sidebar-close-button, #go-button, .overlay').on('click', function () {
        closeSidebar()
    });

    $('#sidebar-open-button').on('click', function () {
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
            gotoSelect.append(makeVerseOption(i))
        }

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
});



