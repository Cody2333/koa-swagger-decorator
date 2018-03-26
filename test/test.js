import _path from 'path';
import app from '../example/main';
import { getPath, convertPath, readSync } from '../lib/utils';

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
  describe('Construct api from router.mapDir:', async () => {
    it('GET /api/other should return data if success', (done) => {
      request.get('/api/other')
        .expect(200)
        .expect(res => expect(res.body.other).to.be.an('array'))
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
    it('GET /api/other/what should return data if success', (done) => {
      request.get('/api/other/what')
        .expect(200)
        .expect(res => expect(res.body.other).to.be.an('array'))
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
    it('GET /api/other/how should return data if options:{rescursive: true}', (done) => {
      request.get('/api/other/how')
        .expect(200)
        .expect(res => expect(res.body.other).to.be.an('array'))
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
  describe('ReadSync:', () => {
    it('should return an array,length = 2 when recursive=false', () => {
      const dir = _path.resolve(__dirname, '../example/routes/sub_routes');
      const r = readSync(dir);
      expect(r).to.be.an('array').to.have.lengthOf(2);
    });
    it('should return an array,length = 3 when recursive=true', () => {
      const dir = _path.resolve(__dirname, '../example/routes/sub_routes');
      const r = readSync(dir, [], true);
      expect(r).to.be.an('array').to.have.lengthOf(3);
    });
  });
});

