document.getElementsByClassName("create")[0].addEventListener("click", () => {
  console.log('Test');
})

$('.basket').next('li').hide();

$('.basket').click(function() {
  let siblingLi = $($(this).next('li')[0]);
  if (siblingLi.hasClass('hidden')) {
    siblingLi.show()
    siblingLi.addClass('shown')
    siblingLi.removeClass('hidden')
  } else {
    siblingLi.hide();
    siblingLi.addClass('hidden')
    siblingLi.removeClass('shown')
  }
})