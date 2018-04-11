 $(document).ready(function(e){
  $(".form-horizontal").validate({
    errorElement: "span",
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            if (element.attr("type") == "radio" || element.attr("type") == "checkbox") { 
                error.insertAfter($(element).closest('.form-group').children('div').children().last());
            }else if (element.attr("name") == "dd" || element.attr("name") == "mm" || element.attr("name") == "yyyy") {
                error.insertAfter($(element).closest('.form-group').children('div'));
            }else if (element.attr('class') == "js-example-basic-single val_select2 select2-hidden-accessible"){
              error.insertAfter($(element).closest('div').children().last());
            }else {
              error.insertAfter(element);
            }
        },
        ignore:'',
        rules: {
        },
        highlight: function (element) {
            $(element).closest('.help-block').removeClass('valid');
            
            $(element).closest('div').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
        },
        unhighlight: function (element) { 
            $(element).closest('div').removeClass('has-error');
        },
        success: function (label, element) {
            label.addClass('help-block valid');
            label.remove();
            $(element).closest('div').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('required').addClass('ok');

        }
    });
});