document.getElementsByClassName("create")[0].addEventListener("click", async (event) => {
  const url = window.location.href;
  path = url.slice(-10)
  await fetch(`/create/:${path}`, {
    method: 'POST',
  })
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