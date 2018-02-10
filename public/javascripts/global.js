// let sale = {
//     customer_info: {},
//     leds: [],
//     bill_info: {}
// };


// function isValidEmailAddress(emailAddress) {
//     let pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
//     return pattern.test(emailAddress);
// }


// function updateSale(sale_data) {
//     return new Promise(function(resolve, reject){
//         $.ajaxSetup({
//             headers: {
//                 "X-CSRFToken": $("input[name='csrfmiddlewaretoken']").val()
//             }
//         });
//         $.ajax({
//             type: "POST",
//             url: "/sale/update/",
//             data: JSON.stringify(sale_data), 
//             success: function(data){
//                 resolve(data);
//             },
//             fail: function(data){
//                 reject( error);
//             }
//         });
//     });
// }

// // drag and drop: remove LED
// function allowDrop(event) {
//     event.preventDefault();
// }


// // drag and drop: remove LED
// function trashLED(event) {
//     event.preventDefault();
//     let led_id = event.dataTransfer.getData("led_id");
//     console.log(sale);
//     for(let i = 0; i < sale.leds.length; i++){
//         if( sale.leds[i].id == led_id ){
//             sale.leds.splice(i, 1);
//             $(`#${led_id}`).hide();
//         }
//     }
// }


// // drag and drop: remove LED
// function toggleTrash(event){
//     event.dataTransfer.setData("led_id", event.target.id);
//     $('.led-header, .led-trash').toggle();
// }


// $(document).on('change', ':file', function() {
//     var input = $(this),
//         numFiles = input.get(0).files ? input.get(0).files.length : 1,
//         label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
//     input.trigger('fileselect', [numFiles, label]);
// });

// function addExistingSaleData(sale_id){
//     $.ajaxSetup({
//         headers: {
//             "X-CSRFToken": $("input[name='csrfmiddlewaretoken']").val()
//         }
//     });
//     $.ajax({
//         type: "POST",
//         url: "/sale/get/data/",
//         data: JSON.stringify({sale_id: sale_id, callback_format: 'json'}), 
//         success: function(sale_data){
//             console.log(sale_data);
//         },
//         fail: function(data){
//             console.log('breaking');
//         }
//     });
// }

$(document).ready(function(){

    // //signin/register indentifiers
    // $("login, register").on('click',function() {
    //     //remove active identfier
    //     $("login, register").removeClass('login-active');

    //     //Add active class to clicked element
    //     $(this).addClass('login-active');

    //     //toggle shown forms
    //     $("#login-card, #register-card").toggle();
    // });


    // //Register form
    // $("form[name='register-form']").submit(function(event) {
    //     //Stop html form submission
    //     event.preventDefault(); 
        
    //     // check password confirm
    //     if( $("input[name='register_password']").val() !== $("input[name='confirm-password']").val() ){
    //         $("input[name='register_password'], input[name='confirm-password']").val('').focus();
    //         $.notify({
    //             // options
    //             message: 'Password/ Confirm password didn\'t match.'
    //         },{
    //             // settings
    //             type: 'danger'
    //         });
    //         return;
    //     }

    //     // serialize and submit register form
    //     $.ajax({
    //         type: "PUT",
    //         url: $(this).attr('action'),
    //         data: $(this).serialize(), 
    //         success: function(data){
    //             if( data.status == 'success'){
    //                 $.notify({
    //                     message: 'User has been created please login now'
    //                 },{
    //                     type: 'success'
    //                 });

    //                 //remove active identfier
    //                 $("register").removeClass('login-active');

    //                 //Add active class to clicked element
    //                 $("login").addClass('login-active');

    //                 //toggle shown forms
    //                 $("#login-card, #register-card").toggle();
    //             } else {
    //                 $.notify({
    //                     message: data.error_msg
    //                 },{
    //                     type: 'success'
    //                 });
    //             } 
    //         },
    //         fail: function(data){
    //             $.notify({
    //                 // options
    //                 message: 'Unknown server occured.'
    //             },{
    //                 // settings
    //                 type: 'danger'
    //             });
    //         }
    //     });
    // });


    // //login form
    // $("form[name='login-form']").submit(function(event) {
    //     //Stop html form submission
    //     event.preventDefault();

    //     // serialize and submit login form
    //     $.ajax({
    //         type: "POST",
    //         url: $(this).attr('action'),
    //         data: $(this).serialize(), 
    //         success: function(data){
    //             if( data.status == 'success'){
    //                 window.location.href = window.location.protocol + "//" + window.location.host + "/dashboard/";
    //             }else{
    //                 $.notify({
    //                     // options
    //                     message: data.error_msg 
    //                 },{
    //                     // settings
    //                     type: 'danger'
    //                 });
    //             }
                
    //         },
    //         fail: function(data){
    //             $.notify({
    //                 // options
    //                 message: 'Unknown server error occured' 
    //             },{
    //                 // settings
    //                 type: 'danger'
    //             });
    //         }
    //     });
    // });


    // // renewal
    // $(".renewal-option").on('click',function() {
    //     $(".renewal-option").removeClass('renewal-option-selected');

    //     //Add active class to clicked element
    //     $(this).addClass('renewal-option-selected');

    //     // set sale value
    //     if( $(this).attr('data-type') == 'renewal' ){
    //         sale.customer_info.renewal = true;
    //     }else{
    //         sale.customer_info.renewal = false;
    //     }
    // });


    // // subtype/HOO autofill
    // $("#subtype-dropdown").on('change',function() {
    //     // get HOO info from dropdown
    //     let subtype = $("#subtype-dropdown option:selected").val();
        
    //     if( !subtype ){
    //         sale.customer_info.subtype = null;
    //         return;
    //     }else{
    //         sale.customer_info.subtype = subtype;
    //     }

    //     let hours_of_operation = JSON.parse($("#subtype-dropdown option:selected").attr('data'));
    //     //  auto fill values
    //     $("input[name='monday']").val(hours_of_operation.monday);
    //     $("input[name='tuesday']").val(hours_of_operation.tuesday);
    //     $("input[name='wednesday']").val(hours_of_operation.wednesday);
    //     $("input[name='thursday']").val(hours_of_operation.thursday);
    //     $("input[name='friday']").val(hours_of_operation.friday);
    //     $("input[name='saturday']").val(hours_of_operation.saturday);
    //     $("input[name='sunday']").val(hours_of_operation.sunday);
    //     $("input[name='total']").val(hours_of_operation.total);
    //     console.log(sale);
    // });


    // // autocalculate HOO
    // $(".weekly-hours").keyup(function() {
    //     let current_input_value = $(this);
    //     let all_other_hours = 0;
        
    //     // get all other hours
    //     $(".weekly-hours").not(current_input_value).each(function(){
    //         all_other_hours += Number($(this).val());
    //     });

    //     // get weekly total and multiple for the yearly
    //     new_total = (Number(current_input_value.val()) + all_other_hours) * 52.143;
    //     $("input[name='total']").val(Math.trunc(new_total));
    // });


    // // New Sale: customer info
    // $("form[name='new-sale-customer-info']").submit(function(event){
    //     //Stop html form submission
    //     event.preventDefault();


    //     if( $('.renewal-option-selected').attr('data-type') == 'renewal' ){
    //         sale.customer_info.renewal = true;
    //     }else{
    //         sale.customer_info.renewal = false;
    //     }
    //     // check renewal selected
    //     if( sale.customer_info.renewal != true && sale.customer_info.renewal != false ){

    //         $.notify({
    //             // options
    //             message: 'Please choose renewal or new customer.' 
    //         },{
    //             // settings
    //             type: 'danger'
    //         });
    //         $(".renewal-option").attr("tabindex",-1).focus();
    //         return;
    //     }


    //     // check subtype
    //     sale.customer_info.subtype = $("#subtype-dropdown option:selected").val();
    //     if( isNaN(sale.customer_info.subtype) ){
    //         $.notify({
    //             // options
    //             message: 'Please choose a subtype.' 
    //         },{
    //             // settings
    //             type: 'danger'
    //         });
    //         $("#subtype-dropdown").attr("tabindex",-1).focus();
    //         return;
    //     }


    //     // update sale obj
    //     sale.customer_info.business_name = $("input[name='business-name']").val();
    //     sale.customer_info.auth_rep = $("input[name='auth-rep']").val();
    //     sale.customer_info.service_address = $("input[name='service-address']").val();
    //     sale.customer_info.service_city = $("input[name='service-city']").val();
    //     sale.customer_info.service_state = $("input[name='service-state']").val();
    //     sale.customer_info.service_zip_code = $("input[name='service-zip-code']").val();
    //     sale.customer_info.annual_hours_of_operation = $("input[name='total']").val();

    //     // UpdateSale
    //     updateSale(sale).then(function(data){
    //         if( data.status === 'success'){
    //             $.notify({
    //                 // options
    //                 message: 'Sale data saved.' 
    //             },{
    //                 // settings
    //                 type: 'success',
    //                 delay: 3000,
    //             });
    //             sale.id = data.sale_id;
    //             return data;
    //         }else{
    //             $.notify({
    //                 // options
    //                 message: data.error_msg 
    //             },{
    //                 // settings
    //                 type: 'danger'
    //             });
    //             return;
    //         }
    //     }, function(error){
    //         $.notify({
    //             // options
    //             message: 'Unknown error occured' 
    //         },{
    //             // settings
    //             type: 'danger',
    //         });
    //     });

    //     // toggle cards
    //     $("#customer-info-card, #led-selection-card").toggle();
    // });


    // // led selection back
    // $(".led-selection-back").click(function(e){
    //     // stop form submission
    //     event.preventDefault();
    //     // toggle cards
    //     $("#led-selection-card").hide();
    //     $("#customer-info-card").show();
    // });


    // // sales table
    // let sales_table = $('#sales-table').DataTable( {
    //     stateSave: true
    // } );

    // $('#sales-table tbody').on('click', 'tr', function () {
    //     let table = $('#sales-table');
    //     var data = sales_table.row( this ).data();
    //     window.location = window.location.protocol + "//" + window.location.host + "/sale/"+data[0]+"/details/"
    // } );


    // // show led counting  
    // $('.led-option').click(function(e){
    //     let led_id = $(this).attr('data-id');
    //     $('.led-counts').slideUp();
    //     $(`.led-counts[data-id=${led_id}]`).slideToggle();
    // });


    // // led counting
    // $("input[name='led-count'], input[name='led-total'], input[name='led-delamping']").keyup(function(e){
    //     let led_id = $(this).attr('data-id');
    //     let total = Number($(`input[name='led-total'][data-id=${led_id}]`).val());
    //     let led_count = Number($(`input[name='led-count'][data-id=${led_id}]`).val());
    //     let delamping = Number($(`input[name='led-delamping'][data-id=${led_id}]`).val());
    //     $(`input[name='led-not-replacing'][data-id=${led_id}]`).val(total - (led_count + delamping));    
    // });


    // // add led to sale
    // $("form[name='led-to-sale-form']").submit(function(event) {
    //     //Stop html form submission
    //     event.preventDefault(); 

    //     // gen LED obj
    //     let led_id = Number($(this).attr('data-id'));
    //     let total = Number($(`input[name='led-total'][data-id=${led_id}]`).val());
    //     let led_count = Number($(`input[name='led-count'][data-id=${led_id}]`).val());
    //     let delamping = Number($(`input[name='led-delamping'][data-id=${led_id}]`).val());
    //     let not_replacing = Number($(`input[name='led-not-replacing'][data-id=${led_id}]`).val()); 
    //     let color = $(`.led-color[data-id=${led_id}] option:selected`).val();
    //     let installation = $(this).find(".active").attr('data-type');
    //     let ceiling_height = $(`.ceiling-height-dropdown[data-id=${led_id}] option:selected`).val();
    //     let led = {
    //         id: Math.floor((Math.random() * 100) + 1),
    //         led_id: led_id,
    //         total_lights: total,
    //         led_count: led_count,
    //         delamping: delamping,
    //         not_replacing: not_replacing,
    //         color: color,
    //         installation: installation,
    //         ceiling_height: ceiling_height
    //     };
    //     // add led to sale
    //     sale.leds.push(led);
        
    //     // clone element into selected
    //     $(`.led-counts[data-id=${led_id}]`).slideUp();
    //     $(`.led-option[data-id=${led_id}]`).clone().addClass('led-on-sale').prop({'id': led.id, "draggable": true}).appendTo('#selected-leds');
    // });


    // // LED selection: next
    // $("form[name='new-sale-leds']").submit(function(e) {
    //     //Stop html form submission
    //     e.preventDefault(); 

    //     console.log(sale);
    //     if( sale.leds.length > 0 ){
    //         updateSale(sale).then(function(data){
    //             if( data.status === 'success'){
    //                 $.notify({
    //                     // options
    //                     message: 'Sale data saved.' 
    //                 },{
    //                     // settings
    //                     type: 'success',
    //                     delay: 3000,
    //                 });
    //                 sale.id = data.sale_id;
    //                 return data;
    //             }else{
    //                 $.notify({
    //                     // options
    //                     message: data.error_msg 
    //                 },{
    //                     // settings
    //                     type: 'danger'
    //                 });
    //                 return;
    //             }
    //         }, function(error){
    //             $.notify({
    //                 // options
    //                 message: 'Unknown error occured' 
    //             },{
    //                 // settings
    //                 type: 'danger',
    //             });
    //         });
    //     }else{
    //         $.notify({
    //             // options
    //             message: 'No LEDs added.' 
    //         },{
    //             // settings
    //             type: 'warning'
    //         });
    //     }

    //     // toggle cards
    //     $("#led-selection-card, #bill-info-card").toggle();
    // });


    // // Bill info back
    // $(".bill-info-back").click(function(e){
    //     $("#led-selection-card, #bill-info-card").toggle();
    // });


    // // service billing same
    // $("#billing-service-address-same").click(function(e){
    //     if( $(this).prop('checked') ){
    //         $("#billing-address").slideUp("fold");
    //         $("input[name='billing-address']," +
    //           "input[name='billing-city']," + 
    //           "input[name='billing-state']," + 
    //           " input[name='billing-state']," + 
    //           " billing-zip-code").prop('required', false);
    //     }else {
    //         $("#billing-address").slideDown("fold");
    //         $("input[name='billing-address']," +
    //           "input[name='billing-city']," + 
    //           "input[name='billing-state']," + 
    //           " input[name='billing-state']," + 
    //           " billing-zip-code").prop('required', true);
    //     }
    // });


    // // utility dropdown
    // $("#utility-dropdown").change(function(e){
    //     let utility = $("#utility-dropdown option:selected");
    //     let account_length = JSON.parse(utility.attr('data')).account_length

    //     // add utility to sale obj
    //     sale.utility = utility.val();

    //     // add account limit length to account input
    //     $("input[name='account-number'").val('');
    //     $("input[name='account-number'").attr({maxlength:account_length, minlength: account_length});
    // });


    // // monthly/yearly usage
    // $(".usage-option").click(function(){
    //     // show selected
    //     $(".usage-option").removeClass("usage-option-selected");
    //     $(this).addClass("usage-option-selected");

    //     // change require fields
    //     if( $(this).attr("data-type") == 'monthly' ){
    //         $("#yearly-usage").hide("fold");
    //         $("#monthly-usage").slideDown();
    //         $("input[name='monthly-kwh'], input[name='monthly-supply-charges'],input[name='monthly-delivery-charges']").prop('required', true);
    //         $("input[name='yearly-kwh'], input[name='yearly-supply-rate']").prop('required', false);
    //     }else {
    //         $("#monthly-usage").hide("fold");
    //         $("#yearly-usage").slideDown();
    //         $("input[name='yearly-kwh'], input[name='yearly-supply-rate']").prop('required', true);
    //         $("input[name='monthly-kwh'], input[name='monthly-supply-charges'],input[name='monthly-delivery-charges']").prop('required', false);
    //     }

    //     // update sale obj
    //     sale.bill_info.bill_type = $(this).attr("data-type");
    // });


    // // bill image
    // $('#bill-image').on('fileselect', function(e) {
    //     let bill_image = document.getElementById('bill-image').files[0];
    //     let formData = new FormData();
    //     console.log(sale);
    //     formData.append('bill_image', bill_image, bill_image.name);
    //     formData.append('sale_id', sale.id);

    //     $.ajax({
    //         type: "POST",
    //         url: "/sale/upload/image/",
    //         data: formData, 
    //         cache: false,
    //         contentType: false,
    //         processData: false,
    //         success: function(){
    //             $.notify({
    //                 // options
    //                 message: 'image uploaded' 
    //             },{
    //                 // settings
    //                 type: 'success'
    //             });
    //         },
    //         fail: function(){
    //             $.notify({
    //                 // options
    //                 message: 'Unknown error occured' 
    //             },{
    //                 // settings
    //                 type: 'danger',
    //             });
    //         }
    //     });
    // });


    // // service satrt date
    // $("input[name='service-start-date']").datepicker();


    // // service satrt date notification 
    // $("input[name='service-start-date']").on('change', function(e){
    //     service_date = $(this).val();
    //     if( service_date.substring(3, 5) !== '01'){
    //         $.notify({
    //             // options
    //             message: 'Most rates start on the first of each month. Choosing any other day reduces likelyhood of finding a rate.' 
    //         },{
    //             // settings
    //             type: 'danger',
    //             delay: 3000,
    //         });
    //     }
    // });


    // // bill info form
    // $("form[name='bill-info-form']").submit(function(e){
    //     //Stop html form submission
    //     e.preventDefault(); 
    //     console.log('bill info form');
    //     // handle billing address
    //     if( !$("#billing-service-address-same").prop('checked') ){
    //         sale.bill_info.billing_address = $("input[name='billing-address']").val();
    //         sale.bill_info.billing_city = $("input[name='billing-city']").val();
    //         sale.bill_info.billing_state = $("input[name='billing-state']").val();
    //         sale.bill_info.billing_zip_code = $("input[name='billing-zip-code']").val();
    //     }else{
    //         sale.bill_info.billing_address = sale.customer_info.service_address;
    //         sale.bill_info.billing_city = sale.customer_info.service_city;
    //         sale.bill_info.billing_state = sale.customer_info.service_state;
    //         sale.bill_info.billing_zip_code = sale.customer_info.service_zip_code;
    //     }
        
    //     // update sale obj
    //     sale.bill_info.utility = $("#utility-dropdown option:selected").val();
    //     sale.bill_info.service_class = $("#service-class-dropdown option:selected").val();
    //     sale.bill_info.account_number = $("input[name='account-number']").val();
    //     sale.bill_info.service_start_date = $("input[name='service-start-date']").val();
    //     sale.bill_info.month_of_bill = $("#month-of-bill-dropdown option:selected").val();
    //     sale.bill_info.bill_type = $(".usage-option-selected").attr('data-type');
        
    //     // handle bill type
    //     if( sale.bill_info.bill_type === 'monthly'){
    //         sale.bill_info.kwh = $("input[name='monthly-kwh']").val();
    //         sale.bill_info.supply_charges = $("input[name='monthly-supply-charges']").val();
    //         sale.bill_info.delivery_charges = $("input[name='monthly-delivery-charges']").val();
    //     }else if( sale.bill_info.bill_type === 'yearly'){
    //         sale.bill_info.kwh = $("input[name='yearly-kwh']").val();
    //         sale.bill_info.supply_rate = $("input[name='yearly-supply-rate']").val();
    //     }else{
    //         $.notify({
    //             // options
    //             message: 'Please choose a usage type monthly/yearly.' 
    //         },{
    //             // settings
    //             type: 'danger'
    //         });
    //     }

    //     // check utility selected
    //     if( !sale.bill_info.utility ){
    //         $.notify({
    //             // options
    //             message: 'Please choose a utility.' 
    //         },{
    //             // settings
    //             type: 'danger'
    //         });
    //         $("#utility-dropdown").focus();
    //         $("input[name='account-number']").val('');
    //         return;
    //     }

    //     // check service selected
    //     if( !sale.bill_info.service_class ){
    //         $.notify({
    //             // options
    //             message: 'Please choose a service class.' 
    //         },{
    //             // settings
    //             type: 'danger'
    //         });
    //         $("#service-class-dropdown").focus();
    //         return;
    //     }

    //     //  update sale 
    //     updateSale(sale).then(function(data){
    //         if( data.status === 'success'){
    //             $.notify({
    //                 // options
    //                 message: 'Sale data saved.' 
    //             },{
    //                 // settings
    //                 type: 'success',
    //                 delay: 3000,
    //             });
    //             $.notify({
    //                 // options
    //                 title: 'Sale Ready!',
    //                 message: 'Click this notification to see your savings now!',
    //                 url: window.location.protocol + "//" + window.location.host + "/sale/"+sale.id+"/details/",
    //                 target: '_blank'
    //             },{
    //                 // settings
    //                 element: '#bill-info-card',
    //                 type: "info",
    //                 allow_dismiss: false,
    //                 newest_on_top: true,
    //                 placement: {
    //                     from: "bottom",
    //                     align: "center"
    //                 },
    //                 delay: 30000,
    //                 url_target: '_blank',
    //                 mouse_over: 'pause',
    //             });
    //         }else{
    //             $.notify({
    //                 // options
    //                 message: data.error_msg 
    //             },{
    //                 // settings
    //                 type: 'danger'
    //             });
    //         }
    //     }, function(error){
    //         $.notify({
    //             // options
    //             message: 'Unknown error occured' 
    //         },{
    //             // settings
    //             type: 'danger',
    //         });
    //     });
    // }); 


    // // 
    // $(".led-on-sale-card").click(function(e){
    //     $(this).children(".back").slideToggle();
    // }); 
});