let new_sale = {
    leds: [],
    bill_image: null
};

// led drag and drop: remove LED
function allowDrop(event) {
    event.preventDefault();
}

// led drag and drop: remove LED
function trashLED(event) {
    event.preventDefault();

    let led_id = event.dataTransfer.getData("led_id");

    for(let i = 0; i < new_sale.leds.length; i++){
        if( new_sale.leds[i].id == led_id ){
            new_sale.leds.splice(i, 1);
            $(`#${led_id}`).remove();
        }
    }
}

// led drag and drop: trash toggle
function toggleTrash(event){
    event.dataTransfer.setData("led_id", event.target.id);
    $('.led-list, .led-trash').toggle();
}

function estimateYearlyUsage(){
    let monthly_kwh = $('input[name="monthly_usage"]').val();
    if( monthly_kwh ){
        let state = $('input[name="service_state"]').val();
        let utility = $( "#utility-dropdown option:selected" ).val();
        let service_class = $("#service-class-dropdown option:selected").val();
        let bill_month = $("#month-of-bill-dropdown option:selected").val();

        if( !state ){
            // send notification
            $.notify({
                message: 'Please input a state in service address for yearly usage estimate.' 
            },{
                type: 'danger'
            });
            // rest input
            $('input[name="monthly_usage"]').val('');
            return;
        } else if( !utility || !service_class){
            // send notification
            $.notify({
                message: 'Please select a utility and service class for yearly usage estimate.' 
            },{
                type: 'danger'
            }); 
            // rest input
            $('input[name="monthly_usage"]').val('');
            return;           
        } else if( !bill_month ){
            // send notification
            $.notify({
                message: 'Please select a month of bill for yearly usage estimate.' 
            },{
                type: 'danger'
            });
            // rest input
            $('input[name="monthly_usage"]').val('');
            return;
        } else {
            // estimate with annual scaler on backend
            $.ajax({
                type: "POST",
                url: "/sales/estimate/yearly/",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    monthly_kwh: monthly_kwh,
                    state: state,
                    utility: utility,
                    service_class: service_class,
                    bill_month: bill_month
                }), 
                success: function(data){
                    if( data.status === 200){
                        $('input[name="yearly_usage"]').parent().removeClass('is-empty');
                        $('input[name="yearly_usage"]').val(data.estimated_annual_usage);
                    } else {
                        $.notify({
                            message: data.error_msg
                        },{
                            type: 'danger'
                        });
                    }
                    console.log(data);
                },
                fail: function(data){
                    $.notify({
                        message: data.error_msg
                    },{
                        type: 'danger'
                    });
                }
            });
        }
    }  
}

// Dropzone.options.repRateUpload = {
//     paramName: 'rate_sheet',
//     maxFilesize: 10,
//     method: 'post',
//     maxFiles: 1,
//     acceptedFiles: '.csv',
//     dictDefaultMessage: 'Drop rate sheet here.',
//     dictInvalidFileType: 'Rate sheets need to be in .csv format.',
//     url: document.URL,
//     accept: function(file, done) {
//         console.log(file);
//         // if (file.name == $('.dz-success-mark').show(); 
//         done();
//     },
//     init: function() {
//         this.on("complete", function(file) { 
//             $('.dz-success-mark').show(); 
//         });
//     }
// };


$(document).ready(function(){
    // Dashboard: daily sales
    if( $('#dailySalesChart').length ){
        let daily_sales_chart_data = JSON.parse($('#dailySalesChart').attr('data'));

        let daily_sales_chart_options = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: 20,
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
        }

        let daily_sales_chart = new Chartist.Line('#dailySalesChart', daily_sales_chart_data, daily_sales_chart_options);

        md.startAnimationForLineChart(daily_sales_chart);

        // handle time since
        let timer_start = moment();
        setInterval(function(timerStart){
            let time_since = moment().diff(timer_start, 'minutes');
            $('#daily-chart-time-since').text(`Updated ${time_since} minutes ago.`);
        }, 60000);    
    }

    // Dashboard: utility sales
    if( $('#utility-sales-chart').length ){
        let utility_chart_data = JSON.parse($('#utility-sales-chart').attr('data'));

        let utility_chart_options = {
            axisX: {
                showGrid: false
            },
            low: 0,
            high: 20,
            chartPadding: {
                top: 0,
                right: 5,
                bottom: 0,
                left: 0
            }
        };
        let responsive_options = [
            ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function(value) {
                        return value[0];
                    }
                }
            }]
        ];
        let utility_chart = Chartist.Bar('#utility-sales-chart', utility_chart_data, utility_chart_options, responsive_options);

        //start animation for the Emails Subscription Chart
        md.startAnimationForBarChart(utility_chart);

        // handle time since
        let timer_start = moment();
        setInterval(function(timerStart){
            let time_since = moment().diff(timer_start, 'minutes');
            $('#utility-chart-time-since').text(`Updated ${time_since} minutes ago.`);
        }, 60000);    
    }

    // use current location for service address
    $( '#autofill-service-address' ).click(function(e){
        let currgeocoder;

        navigator.geolocation.getCurrentPosition(function(position, html5Error) {

            geo_loc = processGeolocationResult(position);
            currLatLong = geo_loc.split(",");
            initializeCurrent(currLatLong[0], currLatLong[1]);

        });

        function processGeolocationResult(position) {
            html5Lat = position.coords.latitude;
            html5Lon = position.coords.longitude;
            html5TimeStamp = position.timestamp;
            html5Accuracy = position.coords.accuracy;
            return (html5Lat).toFixed(8) + ", " + (html5Lon).toFixed(8);
        }

        function initializeCurrent(latcurr, longcurr) {
            currgeocoder = new google.maps.Geocoder();

            if (latcurr != '' && longcurr != '') {
                let myLatlng = new google.maps.LatLng(latcurr, longcurr);
                return getCurrentAddress(myLatlng);
            }
        }

        function getCurrentAddress(location) {
            currgeocoder.geocode({
                'location': location

            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    let location = results[0].address_components;
                    // autofill: street address
                    $( 'input[name="service_address"], input[name="billing_address"]' )
                    .val(`${location[0].long_name} ${location[1].long_name}`)
                    .parent().removeClass('is-empty');

                    // autofill: city
                    $( 'input[name="service_city"], input[name="billing_city"]' )
                    .val(location[2].long_name)
                    .parent().removeClass('is-empty');

                    // autofill: state
                    $( 'input[name="service_state"], input[name="billing_state"]' )
                    .val(location[4].short_name)
                    .parent().removeClass('is-empty');

                    // autofill: zip code
                    $( 'input[name="service_zip_code"], input[name="billing_zip_code"]' )
                    .val(`${location[6].long_name}-${location[7].long_name}`)
                    .parent().removeClass('is-empty');
                } else {
                    alert('Location lookup was not successful for the following reason: ' + status);
                }
            });
         }
    });

    // duplicating service to billing address: street address
    $( 'input[name="service_address"]' ).keyup( function(e){
        let bill_input = $('input[name="billing_address"]');
        let parent = bill_input.parent();
        bill_input.val( $(this).val() );
        parent.removeClass('is-empty');
    });

    // duplicating service to billing address: city
    $( 'input[name="service_city"]' ).keyup( function(e){
        let bill_input = $('input[name="billing_city"]');
        let parent = bill_input.parent();
        bill_input.val( $(this).val() );
        parent.removeClass('is-empty');
    });

    // duplicating service to billing address: state
    $( 'input[name="service_state"]' ).keyup( function(e){
        let bill_input = $('input[name="billing_state"]');
        let parent = bill_input.parent();
        bill_input.val( $(this).val() );
        parent.removeClass('is-empty');
    });

    // duplicating service to billing address: zip code
    $( 'input[name="service_zip_code"]' ).keyup( function(e){
        let bill_input = $('input[name="billing_zip_code"]');
        let parent = bill_input.parent();
        bill_input.val( $(this).val() );
        parent.removeClass('is-empty');
    });

    // HOO autofill: subtype selection
    $( "#subtype-dropdown" ).on( 'change',function() {
        // get HOO info from dropdown
        let subtype = $("#subtype-dropdown option:selected").val();

        let hours_of_operation = JSON.parse($("#subtype-dropdown option:selected").attr('data'));
        //  auto fill values
        $("input[name='monday']").val(hours_of_operation.monday);
        $("input[name='tuesday']").val(hours_of_operation.tuesday);
        $("input[name='wednesday']").val(hours_of_operation.wednesday);
        $("input[name='thursday']").val(hours_of_operation.thursday);
        $("input[name='friday']").val(hours_of_operation.friday);
        $("input[name='saturday']").val(hours_of_operation.saturday);
        $("input[name='sunday']").val(hours_of_operation.sunday);
        $("input[name='total']").val(hours_of_operation.total);
    });

    // HOO autofill: user input
    $( ".weekly-hours" ).keyup( function() {
        let current_input_value = $(this);
        let all_other_hours = 0;
        
        // get all other hours
        $(".weekly-hours").not(current_input_value).each(function(){
            all_other_hours += Number($(this).val());
        });

        // get weekly total and multiple for the yearly
        new_total = (Number(current_input_value.val()) + all_other_hours) * 52.143;
        $("input[name='total']").val(Math.trunc(new_total));
    });

    // led: counts input 
    $( '.led-option' ).click( function(e){
        let led_id = $(this).attr('data-id');
        $('.led-counts').slideUp();
        $(`.led-counts[data-id=${led_id}]`).slideToggle();
    });

    // led: autocalc not-replacing
    $( "input[name='led-count'], input[name='led-total'], input[name='led-delamping']" ).keyup( function(e){
        let led_id = $(this).attr('data-id');
        let total = Number($(`input[name='led-total'][data-id=${led_id}]`).val());
        let led_count = Number($(`input[name='led-count'][data-id=${led_id}]`).val());
        let delamping = Number($(`input[name='led-delamping'][data-id=${led_id}]`).val());
        $(`input[name='led-not-replacing'][data-id=${led_id}]`).val(total - (led_count + delamping));    
    });

    // led: add to sale
    $( "form[name='led-to-sale-form']" ).submit( function(event) {
        //Stop html form submission
        event.preventDefault(); 

        // gen LED obj
        let led_id = $(this).attr('data-id');
        let total = Number($(`input[name='led-total'][data-id=${led_id}]`).val());
        let led_count = Number($(`input[name='led-count'][data-id=${led_id}]`).val());
        let delamping = Number($(`input[name='led-delamping'][data-id=${led_id}]`).val());
        let not_replacing = Number($(`input[name='led-not-replacing'][data-id=${led_id}]`).val()); 
        let color = $(`.led-color[data-id=${led_id}] option:selected`).val();
        let installation = $(this).find(".active").attr('data-type');
        let ceiling_height = Number($(`.ceiling-height-dropdown[data-id=${led_id}] option:selected`).val());
        
        let led = {
            id: Math.floor((Math.random() * 100) + 1),
            led_id: led_id,
            total_lights: total,
            led_count: led_count,
            delamping: delamping,
            not_replacing: not_replacing,
            color: color,
            installation: installation,
            ceiling_height: ceiling_height,
            non_led_price: JSON.parse($(this).attr('data')).pricing.non_led_price
        };

        // add led to sale
        new_sale.leds.push(led);
        // clone element into selected
        $(`.led-counts[data-id=${led_id}]`).slideUp();
        $(`.led-option[data-id=${led_id}]`).clone().addClass('led-on-sale').prop({'id': led.id, "draggable": true}).appendTo('#selected-leds');
    });

    // utility dropdown: set account number max length
    $( "#utility-dropdown" ).change( function(e){
        let utility = $( "#utility-dropdown option:selected" );
        let account_length = JSON.parse(utility.attr('data')).utility.max_account_digits;

        // add account limit length to account input
        $( "input[name='account_number'" ).val('');
        $( "input[name='account_number'" ).attr( {maxlength:account_length, minlength: account_length} );
    });

    // monthly usage: estimate yearly
    $('input[name="monthly_usage"]').keyup( _.debounce(estimateYearlyUsage, 500) );

    // service start date
    $("input[name='service_start_date']").datepicker();


    // service start: date notification 
    $("input[name='service_start_date']").on('change', function(e){
        service_date = $(this).val();
        if( service_date.substring(3, 5) !== '01'){
            $.notify({
                // options
                message: 'Most rates start on the first of each month. Choosing any other day reduces likelyhood of finding a rate.' 
            },{
                // settings
                type: 'danger',
                delay: 3000,
            });
        }
    });

    // Handle bill image
    $('#bill-image').on('change', function(e) {
        let bill_image = document.getElementById('bill-image').files[0];
        var reader = new FileReader();
        reader.onloadend = function() {
            new_sale.bill_image = reader.result;
            $.notify({
                message: 'Image Added'
            },{
                type: 'success'
            });
        }
        reader.readAsDataURL(bill_image);
    });

    // create Sale
    $( '.create-new-sale' ).click(function(e){
        // check for any blanks
        $('input[required="true"]').each(function(){
            if( !$(this).val() ){
                if($(this).attr('type') === 'text'){
                    $(this).parent().addClass('has-error');
                    $(this).focus();
                    // send notification
                    $.notify({
                        message: 'Field is required.' 
                    },{
                        type: 'danger'
                    });
                    return;
                }
            }
        });

        // send new sale data
        new_sale.business_name = String($('input[name="business_name"]').val()).trim();
        new_sale.authorized_representative = String($('input[name="authorized_representative"]').val()).trim();
        new_sale.subtype = $('#subtype-dropdown option:selected').val();
        new_sale.service_address = {
            street_address: String($("input[name='service_address']").val()).trim(),
            city: String($("input[name='service_city']").val()).trim(),
            state: String($("input[name='service_state']").val()).trim(),
            zip_code: String($("input[name='service_zip_code']").val()).trim(),
        };
        new_sale.billing_address = {
            street_address: String($("input[name='billing_address']").val()).trim(),
            city: String($("input[name='billing_city']").val()).trim(),
            state: String($("input[name='billing_state']").val()).trim(),
            zip_code: String($("input[name='billing_zip_code']").val()).trim(),
        };
        new_sale.annual_hours_of_operation = Number($("input[name='total']").val());
        new_sale.utility = $('#utility-dropdown option:selected').val();
        new_sale.service_class = $('#service-class-dropdown option:selected').val();
        new_sale.account_number = String($('input[name="account_number"]').val()).trim();
        new_sale.supply_charges = Number($('input[name="supply_charges"]').val());
        new_sale.delivery_charges = Number($('input[name="delivery_charges"]').val());
        new_sale.monthly_kwh = Number($('input[name="monthly_usage"]').val());
        new_sale.yearly_kwh = Number($('input[name="yearly_usage"]').val());
        new_sale.service_start_date = $('input[name="service_start_date"]').val();

        console.log(new_sale);
        // estimate with annual scaler on backend
        $.ajax({
            type: "POST",
            url: "/sales/create/",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(new_sale), 
            success: function(data){
                if( data.status === 200){
                    // notify: created
                    $.notify({
                        message: 'Sale Created!'
                    },{
                        type: 'success'
                    });
                    // notify: link to savings
                    ({
                        // options
                        title: 'Sale Ready!',
                        message: 'Click this notification to see your savings now!',
                        url: window.location.protocol + "//" + window.location.host + "/" + data.sale_url,
                        target: '_blank'
                    },{
                        // settings
                        element: '#bill-info-card',
                        type: "info",
                        allow_dismiss: false,
                        newest_on_top: true,
                        placement: {
                            from: "bottom",
                            align: "center"
                        },
                        delay: 30000,
                        url_target: '_blank',
                        mouse_over: 'pause',
                    });
                } else {
                    $.notify({
                        message: data.error_msg
                    },{
                        type: 'danger'
                    });
                }
            },
            fail: function(){
                $.notify({
                    message: 'unknown server error'
                },{
                    type: 'danger'
                });
            }
        });
    });

    // sales table
    let sales_table = $('#sales-table').DataTable( {
        stateSave: true
    } );

    // sales table: clicks
    $('#sales-table tbody').on('click', 'tr', function () {
        let table = $('#sales-table');
        var data = sales_table.row( this ).data();
        window.location = window.location.protocol + "//" + window.location.host + "/sales/sale/"+data[0]
    } ); 

    // rep table
    let rep_table = $('#rep-table').DataTable( {
        stateSave: true,
    } );

    // rep table: clicks
    $('#rep-table tbody').on('click', 'tr', function () {
        let table = $('#rep-table');
        var data = rep_table.row( this ).data();
        window.location = window.location.protocol + "//" + window.location.host + "/retailEnergyProviders/details/"+data[0]
    } ); 

    // rep detail: rate upload
    $('input[name=rate-sheet-upload]').on('change', function(e){
        let rate_sheet = e.target.files[0];
        let rep_id = $(this).attr('data-id');

        Papa.parse(rate_sheet, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            worker: false,
            beforeFirstChunk: function(chunk) {
                let rows = chunk.split( /\r\n|\r|\n/ );
                let headings = rows[0].toLowerCase().trim().replace(/ /g, "_");
                rows[0] = headings;
                return rows.join("\r\n");
            },
            complete: function(results) {
                rates = results;
                
                // estimate with annual scaler on backend
                $.ajax({
                    type: "POST",
                    url: `/retailEnergyProviders/rateUpload/${rep_id}`,
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(rates), 
                    success: function(data){
                        if( data.status === 200){
                            $.notify({
                                message: 'Your rate have been successfully uploaded.'
                            },{
                                type: 'success'
                            });
                            setTimeout(function(){ 
                                window.location.reload();
                            }, 3000);

                        } else {
                            $.notify({
                                message: data.error_msg
                            },{
                                type: 'danger'
                            });
                        }
                    },
                    fail: function(data){
                        $.notify({
                            message: data.error_msg
                        },{
                            type: 'danger'
                        });
                    }
                });
            }
        });
    });

    // rep detail: rates table
    $('#rates-table').DataTable( {
        stateSave: true,
        dom: 'Bfrtip',
        buttons: [
            'csv', 'excel'
        ],
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]]
    } ); 

    // LED table
    let led_table = $('#led-table').DataTable( {
        stateSave: true,
    } );

    // LED table: clicks
    $('#led-table tbody').on('click', 'tr', function () {
        let table = $('#led-table');
        var data = led_table.row( this ).data();
        window.location = window.location.protocol + "//" + window.location.host + "/LEDs/details/"+data[0]
    }); 

    // LED: Remove
    $('#remove-led').click(function(e){
        var result = confirm("Are you  sure you wish to delete LED.");
        if (result) {
            $.ajax({
                type: "DELETE",
                url: "/LEDs/remove",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({led_id: $(this).attr('data-id')}),
                success: function(callback){
                    $.notify({
                        message: 'LED removed please return to list'
                    },{
                        type: 'success'
                    });
                },
                fail: function(callback){
                    $.notify({
                        message: 'unknown server error'
                    },{
                        type: 'danger'
                    });
                }
            });
        }
    });

    // Service Class table
    let service_class_table = $('#service-class-table').DataTable( {
        stateSave: true,
    } );

    // Service Class table: clicks
    $('#service-class-table tbody').on('click', 'tr', function () {
        let table = $('#service-class-table');
        var data = service_class_table.row( this ).data();
        window.location = window.location.protocol + "//" + window.location.host + "/serviceClasses/details/"+data[0]
    }); 
});