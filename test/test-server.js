process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const server = require('../app');

const User = require('../models/user');
const RetailEnergyProvider = require('../models/retailEnergyProvider');

const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);

describe('Index', function() {
    // test home page
    it('should retrieve home page on / GET', function(done) {
        chai.request(server)
        .get('/')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.html;
            done();
        });
    });
});

describe('UserController', function() {
    // User Collection clear
    User.collection.drop();
    RetailEnergyProvider.collection.drop();

    // Add REPs for dropdown
    RetailEnergyProvider.insertMany([
        {name: 'Test REP 1'},
        {name: 'Test REP 2'},
        {name: 'Test REP 3'}
    ]);

    // register page
    it('should retrieve register page on /users/register GET', function(done) {
        chai.request(server)
        .get('/users/register')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.html;
            done();
        });
    });

    // register form: success
    it('should register:success then redirect on /users/register POST', function(done) {
        RetailEnergyProvider.findOne()
        .exec(function(err, rep){
            chai.request(server)
            .post('/users/register')
            .send({
                retail_energy_provider: rep._id, 
                email: 'testuser@test.com',
                password: 'password123',
                confirm_password: 'password123'
            })
            .end(function(err, res){
                res.should.have.status(200);
                expect(res).to.redirect;
                done();                
            });
        });   
    });

    // register form: fail, duplicate email
    it('should register:fail(duplicate email) NOT redirect on /users/register POST', function(done) {
        RetailEnergyProvider.findOne()
        .exec(function(err, rep){
            chai.request(server)
            .post('/users/register')
            .send({
                retail_energy_provider: rep._id, 
                email: 'testuser@test.com',
                password: 'password123',
                confirm_password: 'password123'
            })
            .end(function(err, res){
                res.should.have.status(200);
                expect(res).to.not.redirect;
                res.should.be.html;
                done();
            });
        });   
    });

    // register form: fail, password/confirm dont match 
    it('should register fail(password/confrim) NOT redirect on /users/register POST', function(done) {
        RetailEnergyProvider.findOne()
        .exec(function(err, rep){
            chai.request(server)
            .post('/users/register')
            .send({
                retail_energy_provider: rep._id, 
                email: 'testusernew@test.com',
                password: 'password',
                confirm_password: 'password123'
            })
            .end(function(err, res){
                res.should.have.status(200);
                expect(res).to.not.redirect;
                res.should.be.html;
                done();
            });
        });   
    });

    // login page
    it('should retrieve login page on /users/login GET', function(done) {
        chai.request(server)
        .get('/users/login')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.html;
            done();
        });
    });

    //  login form: success
    it('should login:success then redirect on /users/login POST', function(done) {
        chai.request(server)
        .post('/users/login')
        .send({
            email: 'testuser@test.com',
            password: 'password123'
        })
        .end(function(err, res){
            res.should.have.status(200);
            expect(res).to.redirect;
            done();                
        });  
    });

    //  login form: fail
    it('should login:fail(unknown email) NOT redirect on /users/login POST', function(done) {
        chai.request(server)
        .post('/users/login')
        .send({
            email: 'notinsystem@test.com',
            password: 'password123'
        })
        .end(function(err, res){
            res.should.have.status(200);
            expect(res).to.not.redirect;
            done();                
        });  
    });

    //  login form: fail
    it('should login:fail(password incorrect) NOT redirect on /users/login POST', function(done) {
        chai.request(server)
        .post('/users/login')
        .send({
            email: 'testuser@test.com',
            password: 'password'
        })
        .end(function(err, res){
            res.should.have.status(200);
            expect(res).to.not.redirect;
            done();                
        });  
    });
});