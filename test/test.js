//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('RESTAPI', () => {
    
/*
  * Test the /GET route
  */
  describe('/POST login', () => {
      it('it should not POST a login without userdata', (done) => {
        let book = {
            username: ""
        }
        chai.request(server)
            .post('/login')
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
              done();
            });
      });
	  
	  it('it should POST login data and generate java web token ', (done) => {
        let userdata = {
            username: "test",
            password: "test"
        }
        chai.request(server)
            .post('/login')
            .send(userdata)
            .end((err, res) => {
                //res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User successfully logged in!');
                res.body.should.have.property('token');
              done();
            });
      });

  });  
  
  describe('/GET thumbnail', () => {
      it('it should not provide access to the protected page without JWT token', async () => {
        let data = {
            token: ""
        }
        chai.request(server)
            .get('/thumbnail')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error').eql('Unauthorized access');
              done();
            });
      });

      it('it should not generate the thumbnail without img url and throw error', async () => {
		  
        chai.request(server)
            .get('/thumbnail')
			.set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoidGVzdCJ9LCJpYXQiOjE1MTQ1NzE1NzN9.SA4WahFGN5vm4oBzcNkEGYpXRENHEJ2fZRnaSq-gUyc')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');				
                res.body.should.have.property('error').eql('Must provide a url address for the image.');
              done();
            });
      });

	  it('it should not provide access because of wrong token', async () => {
		  
        chai.request(server)
            .get('/thumbnail?q=https://www.google.co.in/logos/doodles/2017/kuppali-venkatappa-puttappas-113th-birthday-6430765557481472-l.png')
			.set('Authorization', '.eyJ1c2VyIjp7InVzZXJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoidGVzdCJ9LCJpYXQiOjE1MTQ1NzE1NzN9.SA4WahFGN5vm4oBzcNkEGYpXRENHEJ2fZRnaSq-gUyc')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');				
                res.body.should.have.property('error').eql('Unauthorized access because of token verification failure.');
              done();
            });
      });
	  
	  it('it should not generate the thumbnail with provided JWT token and wrong img url', async () => {
		  
        chai.request(server)
            .get('/thumbnail?q=https://www.google.co.in/logos/doodles/2017/kupvenkatappa-puttappas-113th-birthday-6430765557481472-l.png')
			.set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoidGVzdCJ9LCJpYXQiOjE1MTQ1NzE1NzN9.SA4WahFGN5vm4oBzcNkEGYpXRENHEJ2fZRnaSq-gUyc')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');				
                res.body.should.have.property('error').eql('Image loading error - 404.');
              done();
            });
      });

	  it('it should generate the thumbnail with provided JWT token and img url', async () => {
		  
        chai.request(server)
            .get('/thumbnail?q=https://www.google.co.in/logos/doodles/2017/kuppali-venkatappa-puttappas-113th-birthday-6430765557481472-l.png')
			.set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoidGVzdCJ9LCJpYXQiOjE1MTQ1NzE1NzN9.SA4WahFGN5vm4oBzcNkEGYpXRENHEJ2fZRnaSq-gUyc')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');				
                res.body.should.have.property('message').eql('Thumbnail successfully generated');
                res.body.should.have.property('thumb');
              done();
            });
      });
	  


  });

});