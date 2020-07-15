/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");
const Book = require("../bookModel");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function(done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function() {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: "Test"
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);

              assert.property(res.body, "title", "Test");

              assert.property(res.body, "_id");

              done();
            });
        });

        test("Test POST /api/books with no title given", function(done) {
          //done();
          chai
            .request(server)
            .post("/api/books")

            .end(function(err, res) {
              assert.equal(res.status, 500);

              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        //done();
        chai
          .request(server)
          .get("/api/books")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with id not in db", function(done) {
        let invalidId = "vryinvalidID";
        chai
          .request(server)

          .get("/api/books/" + invalidId)
          .end((err, res) => {
            assert.equal(res.status, 500);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        let validId = "5f0f340dd6b89e31ccad1b70";
        chai
          .request(server)

          .get("/api/books/" + validId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(
              res.body,
              "comments",
              "Books in object should contain commentcount"
            );
            assert.property(
              res.body,
              "title",
              "Books in object should contain title"
            );
            assert.property(
              res.body,
              "_id",
              "Books in object should contain _id"
            );
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", function(done) {
          let validId = "5f0f340dd6b89e31ccad1b70";
          chai
            .request(server)
            .post("/api/books/" + validId)
            .send({
              _id: validId,
              comment: "Comment test"
            })
            .end((err, res) => {
              assert.equal(res.status, 200);

              assert.property(
                res.body,
                "comments",
                "Books in object should contain commentcount"
              );
              assert.property(
                res.body,
                "title",
                "Books in object should contain title"
              );
              assert.property(
                res.body,
                "_id",
                "Books in object should contain _id"
              );
              assert.equal(res.body.comments[0], "Comment test");
              done();
            });
          //done();
        });
      }
    );
  });
});
