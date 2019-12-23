window.addEventListener('DOMContentLoaded',function(){
    'use strict';
    let tab = document.querySelectorAll('.info-header-tab');
    let info = document.querySelector('.info');
    let tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++){
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }
    hideTabContent(1);

    function showTabContent(b){
        if(tabContent[b].classList.contains('hide')){
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click',function(e){
        let target = e.target;
        if(target && target.classList.contains('info-header-tab')){
            for(let i = 0; i < tab.length; i++){
                if(target == tab[i]){
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });

    //Timer

    let deadline = '2020-12-21';

    function getRemainingTime(endtime){
        let diff;
        if(Date.parse(endtime) - Date.parse(new Date()) >= 0){
            diff = Date.parse(endtime) - Date.parse(new Date());
        }
        else{
            diff = 0;
        }
        let seconds = Math.floor((diff/1000)%60);
        let minutes = Math.floor((diff/1000/60)%60);
        //let hours = Math.floor((diff/(1000*60*60)));
        let hours = Math.floor((diff/1000/60/60)%24);
        let days = Math.floor((diff/(1000*60*60*24)));
        if(seconds<10){seconds = '0'+ seconds}
        if(minutes<10){minutes = '0'+ minutes}
        if(hours<10){hours = '0'+ hours}
        if(days<10){days = '0'+ days}

        return {
            'total' : diff,
            'days' : days,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        }
    }

    function setClock(id, endtime){
        let timer = document.getElementById(id);
        let days = timer.querySelector('.days');
        let hours = timer.querySelector('.hours');
        let minutes = timer.querySelector('.minutes');
        let seconds = timer.querySelector('.seconds');
        let int = setInterval(updateClock,1000);

        function updateClock(){
            let obj = getRemainingTime(endtime);
            days.textContent = obj.days + 'd';
            hours.textContent = obj.hours + 'h';
            minutes.textContent = obj.minutes + 'm';
            seconds.textContent = obj.seconds + 's';
            if(obj.total<=0){
                clearInterval(int);
            }
        }
    }
    setClock('timer', deadline);

    let more = document.querySelector('.more');
    let overlay = document.querySelector('.overlay');
    let close = document.querySelector('.popup-close');

    more.addEventListener('click',function(){
        overlay.style.display = 'block';
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden'; //zapretitj prokrutku stranici kogda otkrivajetsa modaljnoe okno
    });

    close.addEventListener('click',function(){
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        document.body.style.overflow = ''; //razrewitj prokrutku stranici kogda zakrivajetsa modaljnoe okno
    });

    //-------------------------------------------------------------------------------------------------------------
    //Form

    let message = {
        loading: 'Loading...',
        success: 'Thank you! We will contact you soon!',
        failure: 'Something went wrong...'
    };

    //--------------------------------FORM1------------------------------------------------------------------------

    let form = document.querySelector('.main-form');
    let input = form.getElementsByTagName('input');
    let statusMessage = document.createElement('div');
    statusMessage.classList.add('status');

    form.addEventListener('submit',function(e){
        e.preventDefault();
        form.appendChild(statusMessage);

        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        //request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); FORM DATA
        request.setRequestHeader('Content-type','application/json', 'charset=utf-8'); //JSON
        let formData = new FormData(form); //s pomoshju etogo objekta mi poluchajem vse chto poljzovatelj otmetil

        let obj = {};
        formData.forEach(function(value, key){
            obj[key] = value;
        });
        let json = JSON.stringify(obj);

        request.send(json);

        request.addEventListener('readystatechange', function(){
            if(request.readyState < 4){
                statusMessage.innerHTML = message.loading;
            }
            else if(request.readyState === 4 && request.status === 200){
                statusMessage.innerHTML = message.success;
            }
            else{
                statusMessage.innerHTML = message.failure;
            }
        });
        for(let i = 0; i < input.length; i++){
            input[i].value = '';
        }
    });

    //--------------------------------FORM2------------------------------------------------------------------------

    let form2 = document.getElementById('form');
    let input2 = form2.getElementsByTagName('input');
    let statusMessage2 = document.createElement('div');
    statusMessage2.classList.add('status');

    form2.addEventListener('submit',function(e){
        e.preventDefault();
        form2.appendChild(statusMessage2);
        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-type','application/json', 'charset=utf-8'); //JSON
        let formData = new FormData(form2);
        let obj = {};
        formData.forEach(function(key, value){
            obj[key] = value;
        });
        let json = JSON.stringify(obj);
        request.send(json);

        request.addEventListener('readystatechange', function(){
            if(request.readyState < 4){
                statusMessage2.innerHTML = message.loading;
            }
            else if(request.readyState === 4 && request.status === 200){
                statusMessage2.innerHTML = message.success;
            }
            else{
                statusMessage2.innerHTML = message.failure;
            }
        });
        for(let i = 0; i < input2.length; i++){
            input2[i].value = '';
        }
    });


    //------------------------SLIDER-------------------------------------------------------

    let slideIndex = 1;
    let slides = document.querySelectorAll('.slider-item');
    let prev = document.querySelector('.prev');
    let next = document.querySelector('.next');
    let dotsWrap = document.querySelector('.slider-dots');
    let dots = document.querySelectorAll('.dot');

    showSlides(slideIndex);
    function showSlides(n){
        if(n>slides.length){
            slideIndex = 1;
            n = 1;
        }
        if(n<1){
            slideIndex = slides.length;
            n = slides.length;
        }
        slides.forEach(item=>item.style.display = 'none');
        dots.forEach(item => item.classList.remove('dot-active'));
        slides[n-1].style.display = 'block';
        dots[n-1].classList.add('dot-active');
    };

    function plusSlides(n){
        showSlides(slideIndex += n);
    };
    
    function currentSlide(n){
        showSlides(slideIndex = n);
    };

    prev.addEventListener('click',function(){
        plusSlides(-1);
    });

    next.addEventListener('click',function(){
        plusSlides(1);
    });

    dotsWrap.addEventListener('click',function(e){
        for(let i = 0; i < dots.length; i++){
            if(e.target.classList.contains('dot') && e.target === dots[i]){
                currentSlide(i+1);
            }
        }
    });

    //-----------------------------------CALCULATOR----------------------------------------------------

    let persons = document.querySelectorAll('.counter-block-input')[0];
    let restDays = document.querySelectorAll('.counter-block-input')[1];
    let place = document.getElementById('select');
    let totalVlaue = document.getElementById('total');
    let personsSum = 0;
    let daysSum = 0;
    let total = 0;

    totalVlaue.textContent = 0;

    persons.addEventListener('change', function(){
        personsSum = +this.value;
        total = (daysSum + personsSum)*4000;
        if(restDays.value === '' || persons.value === ''){
            totalVlaue.textContent = 0;
        }
        else{
            totalVlaue.textContent = total;
        }
    });

    restDays.addEventListener('change', function(){
        daysSum = +this.value;
        total = (daysSum + personsSum)*4000;
        if(persons.value === '' || restDays.value === ''){
            totalVlaue.textContent = 0;
        }
        else{
            totalVlaue.textContent = total;
        }
    });

    place.addEventListener('change',function(){
        if(restDays.value === '' || persons.value === ''){
            totalVlaue.textContent = 0;
        }
        else{
            let a = total;
            totalVlaue.textContent = a * this.options[this.selectedIndex].value;
        }
    });
});

