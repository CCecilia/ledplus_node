
subtype_1 = new SubType({
    name: '24hr Retail',
    estimated_hours: {
        monday: 24,
        tuesday: 24,
        wednesday: 24,
        thursday: 24,
        friday: 24,
        saturday: 24,
        sunday: 24,
        total: 8760
    }      
});
subtype_1.save(function(err){
    if(err){ return next(err)}
    console.log('created subtype', subtype_1.name);
});

utility = new Utility({
    name: 'NIMO',
    state: 'ny',
});

utility.save(function(err){
    if(err){ return next(err)}
    console.log('created utilty', utility.name);
});

service_class = new ServiceClass({
    name: 'SC9'
});

service_class.save(function(err){
    if(err){ return next(err)}
    console.log('created service class', service_class.name);
});

let led_1 = new Led({
    name: 'T8 2ft LED for electronic ballast',
    pricing: {
        net_cost: 15.84,
        sale_price: 15.84,
        non_led_price: 4.00
    },
    wattage: 11,
    conventional_wattage: 18,
    order_number: 1,
    installation_costs: {
        zero_to_fifty: 4.26,
        fifty_one_to_two_hundred: 3.64,
        two_hundred_one_to_five_hundred: 3.33,
        five_hundred_to_one_thousand: 2.70
    },
    brands: ['Philips', 'Forest'],
    lumens: '890-900',
    rated_average_life: '51000'
});

led_1.save(function(err){
    if(err) {return next(err);}
    console.log('created LED', led_1.name);
});

let led_2 = new Led({
    name: 'T8 4ft LED for electronic ballast',
    pricing: {
        net_cost: 16.20,
        sale_price: 16.20,
        non_led_price: 3.75
    },
    wattage: 17,
    conventional_wattage: 32,
    order_number: 2,
    installation_costs: {
        zero_to_fifty: 4.59,
        fifty_one_to_two_hundred: 3.28,
        two_hundred_one_to_five_hundred: 3.65,
        five_hundred_to_one_thousand: 2.34
    },
    brands: ['Philips'],
    lumens: '1850-2450',
    rated_average_life: '36000-50000'
});

led_2.save(function(err){
    if(err) {return next(err);}
    console.log('created LED', led_2.name);
});

let led_3 = new Led({
    name: 'T8 8ft LED for all ballast types',
    pricing: {
        net_cost: 31.59,
        sale_price: 31.59,
        non_led_price: 10
    },
    wattage: 36,
    conventional_wattage: 78,
    order_number: 5,
    installation_costs: {
        zero_to_fifty: 4.99,
        fifty_one_to_two_hundred: 4.68,
        two_hundred_one_to_five_hundred: 4.05,
        five_hundred_to_one_thousand: 3.74
    },
    brands: ['ELB'],
    lumens: '2820-4590',
    rated_average_life: '55000'
});

led_3.save(function(err){
    if(err) {return next(err);}
    console.log('created LED', led_3.name);
});

scaler = new AnnualScaler({
    state: 'NY',
    utility: ObjectId("5a7e69b2a47eca1ffe579916"),
    service_class:  ObjectId("5a7e69b2a47eca1ffe579917"),
    zone: 'J',
    month: {        
        january: 0.0800,
        february: 0.0740,
        march: 0.0788,
        april: 0.0765,
        may: 0.0808, 
        june: 0.0922,
        july: 0.1032,
        august: 0.0945,
        september: 0.0870,
        october: 0.0780,
        november: 0.0740,
        december: 0.0795
    }
})



StateRate.insertMany([
    {state:  'AL',  supply_rate: .122,  delivery_rate: 0},
    {state:  'AK',  supply_rate: .193,  delivery_rate: 0},
    {state:  'AZ',  supply_rate: .122,  delivery_rate: 0},
    {state:  'AR',  supply_rate: .096,  delivery_rate: 0},
    {state:  'CA',  supply_rate: .167,  delivery_rate: 0},
    {state:  'CO',  supply_rate: .123,  delivery_rate: 0},
    {state:  'CT',  supply_rate: .199,  delivery_rate: 0.06},
    {state:  'DE',  supply_rate: .151,  delivery_rate: 0},
    {state:  'NJ',  supply_rate: .179,  delivery_rate: 0.06},
    {state:  'NY',  supply_rate: .199,  delivery_rate: 0.11},
    {state:  'PA',  supply_rate: .145,  delivery_rate: 0.06},
]);