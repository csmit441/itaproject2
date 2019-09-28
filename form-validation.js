$(function() {
    $("form[name='mainForm']").validate({
        rules: {
            subject: "required",
            assignment: "required",
            score: {
            required: true,
            number: true
            }
        },
        messages: {
            subject: "Please enter a subject",
            assignment: "Please enter an assignment",
            score: {
            required: "Please provide a score",
            number: "Your score must be a number"
            },
        },
        submitHandler: function(form) {
            form.submit();
        }
    });
});