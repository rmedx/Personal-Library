/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { test } = require('mocha');

chai.use(chaiHttp);

let testid;

suite('Functional Tests', function() {
  this.timeout(5000);
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .type('form')
          .send({title: "testtitle1"})
          .end(function(err, res){
            testid = res.body._id;
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments, 'response should contain array of comments');
            assert.property(res.body, 'title', 'book should contain title');
            assert.property(res.body, '_id', 'book should contain _id');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .type('form')
          .send({title: "testtitle1"})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments, 'response should be an array');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
            .request(server)
            .get('/api/books')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body, "response is array");
                assert.notEqual(res.body.length, 0), "response array is not empty";
                done();
            });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
        .request(server)
        .get('/api/books/5f665eb46e296f6b9b6a504d')
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            assert.equal(res.text, 'no book exists');
            done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
        .request(server)
        .get('/api/books/' + testid)
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments, 'response should contain array of comments');
            assert.property(res.body, 'title', 'book should contain title');
            assert.property(res.body, '_id', 'book should contain _id');
            done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + testid)
          .type('form')
          .send({comment: "blahtest"})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments, 'response should contain array of comments');
            assert.property(res.body, 'title', 'book should contain title');
            assert.property(res.body, '_id', 'book should contain _id');
            assert.isTrue(res.body.comments.includes('blahtest'));
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post('/api/books/' + testid)
          .type('form')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            assert.equal(res.text, "missing required field comment");
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/5f665eb46e296f6b9b6a504d')
        .type('form')
        .send({comment: "testblah"})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isString(res.text);
          assert.equal(res.text, "no book exists");
          done();
        });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete('/api/books/' + testid)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful');
          done();
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('/api/books/5f665eb46e296f6b9b6a504d')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isString(res.text);
          assert.equal(res.text, "no book exists");
          done();
        });
      });

    });

  });

});
