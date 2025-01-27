$("#js-scoreboard").slick({
  slidesToShow: 7,
  slidesToScroll: 1,
  variableWidth: true,
  prevArrow:
    '<button class="scoreboard__btn scoreboard__btnprev"><img src="./images/ico/scoreboard-left.svg" alt="" ></button> ',
  nextArrow:
    ' <button class="scoreboard__btn  scoreboard__btnnext"><img  src="./images/ico/scoreboard-right.svg" alt = "" ></button>',
  responsive: [
    {
      breakpoint: 1800,
      settings: {
        slidesToShow: 10,
      },
    },
    {
      breakpoint: 1520,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 780,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 580,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
});
