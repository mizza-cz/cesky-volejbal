$(".js-select, .accreditation-select").select2({
  width: "100%",
  minimumResultsForSearch: -1,
});

$(function () {
  $(".js-select").change(function () {
    $(".subPageFilter").submit();
  });
});
