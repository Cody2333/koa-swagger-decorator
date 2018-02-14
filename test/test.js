import app from '../example/main';
import { getPath, convertPath } from '../lib/wrapper';

const request = require('supertest')(app);
const { expect } = require('chai');

describe('HTTP API generation test:', async () => {
  describe('Init Swagger Doc:', async () => {
    it('GET /api/swagger-html should return success for swagger ui page', (done) => {
      request.get('/api/swagger-html')
        .expect(200)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
    it('GET /api/swagger-json should return swagger json data', (done) => {
      request.get('/api/swagger-json')
        .expect(200)
        .expect(res => expect(res.body.info).to.be.an('object'))
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
  });
  describe('Construct api from router.map:', async () => {
    it('POST /api/user/login should return user data if success', (done) => {
      request.post('/api/user/login')
        .send({
          name: 'string',
          password: '123456',
        })
        .expect(200)
        .expect(res => expect(res.body.user).to.be.an('object'))
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
    it('POST /api/user/login should have corresponding swagger doc data', (done) => {
      request.get('/api/swagger-json')
        .expect(200)
        .expect(res => expect(res.body.paths['/api/user/login']).to.be.an('object'))
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
  });
});

describe('Function Test:', () => {
  describe('ConvertPath:', () => {
    it('should convert /api/{p1}/user/{p2} -> /api/:p1/user/:p2', () => {
      const r = convertPath('/api/{p1}/user/{p2}');
      expect(r).to.equal('/api/:p1/user/:p2');
    });
  });

  describe('GetPath:', () => {
    it('should convert /api + /user -> /api/user', () => {
      const r = getPath('/api', '/user');
      expect(r).to.equal('/api/user');
    });
  });
});

