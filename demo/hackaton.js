window.onload = function () {
    var cw1 = $('#holder').canvasWidget().data('ui-canvasWidget');
    
    setTimeout(function(){
       cw1.setImage("@forest", "images/jungle.jpg");
       cw1.setImage("#lion", "images/simba.png", 0, 0, 0.6);
       cw1.setImage("#lion2", "images/simba.png", 200, 300, 0.4);
    }, 300);
    
    setTimeout(function(){
        cw1.setImage("#lion", "images/lion2.png");
    }, 3000);
    
    

};