// Select the 'h2' element
let h2 = document.querySelector('h2');
// Select the element with class 'container'
let container = document.querySelector('.container');
// Toggle the 'newyear' class on the 'container' element 
// and the 'active' class on the 'h2' element when 'h2' is clicked
h2.onclick = function() {
    container.classList.toggle('newyear'); // Toggle the 'newyear' class on the 'container'
    this.classList.toggle('active'); // Toggle the 'active' class on the 'h2' element (the one clicked)
}