import _path from 'path';
import assert from 'assert';
import server from '../example/main';
import { getPath, convertPath, getFilepaths } from '../lib/utils';
import validate from '../lib/validate';

const request = require('supertest')(server);
const { expect } = require('chai');

describe('HTTP API generation test:', async () => {
  after(() => {
    server.close();
  });

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
  describe('getFilepaths:', () => {
    it('should return an array,length = 2 when recursive=false', () => {
      const dir = _path.resolve(__dirname, '../example/routes/sub_routes');
      const r = getFilepaths(dir, false);
      expect(r).to.be.an('array').to.have.lengthOf(2);
    });
    it('should return an array,length = 3 when recursive=true', () => {
      const dir = _path.resolve(__dirname, '../example/routes/sub_routes');
      const r = getFilepaths(dir, true);
      expect(r).to.be.an('array').to.have.lengthOf(3);
    });
  });
});

describe('Validate:', () => {
  it('should return validated input when meets expects requirement', () => {
    const input = {
      foo: '1',
      bar: 'fwq',
      fpk: false,
      nax: 12,
      qoa: [
        1, 2
      ],
      baz: {
        b: 'f'
      },
      addon: 'ttt',
      boo: 'true',
      coo: 'false',
      sst: '666',
    };
    const expect = {
      nax: { type: 'number' },
      foo: {
        type: 'number',
        required: true
      },
      bar: {
        type: 'string',
        required: false
      },
      baz: {
        type: 'object',
        required: true
      },
      qoa: {
        type: 'array',
        required: true
      },
      fpk: {
        type: 'boolean',
        required: true
      },
      boo: {
        type: 'boolean',
      },
      coo: {
        type: 'boolean',
      },
      default: {
        type: 'string',
        required: false,
        default: 'ddd'
      },
      sst: {
        type: 'string',
      },
      addon: undefined
    };
    const validatedInput = validate(input, expect);
    assert(validatedInput.foo === 1);
    assert(validatedInput.default === 'ddd');
    assert(!validatedInput.addon);
    assert(validatedInput.boo === true);
    assert(validatedInput.coo === false);
    assert(typeof validatedInput.sst === 'string');
  });
  it('should throw error when no required input', () => {
    const input = {};
    const expect = {
      foo: {
        type: 'string',
        required: true,
      }
    };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when not a number while type=number', () => {
    const input = { foo: 'r' };
    const expect = { foo: { type: 'number' } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when not a boolean while type=boolean', () => {
    const input = { foo: 'r' };
    const expect = { foo: { type: 'boolean' } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when not a number while type=object', () => {
    const input = { foo: 'r' };
    const expect = { foo: { type: 'object' } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when not a number while type=array', () => {
    const input = { foo: 'r' };
    const expect = { foo: { type: 'array' } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });

  it('shoud support complex object data', () => {
    const expect = {
      o1: {
        type: 'object',
        properties: {
          aaaa: { type: 'string', example: 'http://www.baidu.com', required: true },
          bbbb: {
            type: 'object',
            required: true,
            properties: {
              yy: { type: 'string', required: true },
              zz: {
                type: 'object',
                required: true,
                properties: {
                  pp: { type: 'string' }
                }
              },
              aa: { type: 'number', required: false }
            }
          }
        }
      }
    };

    const input = {
      o1: {
        aaaa: 'gg',
        bbbb: { yy: 'rr', zz: { pp: 'false' }, aa: '66' },
        cccc: 'dd',
      }
    };
    validate(input, expect);
  });
  it('shoud support complex array data', () => {
    const expect = {
      arr: {
        type: 'array',
        items: 'string',
        required: true,
      }
    };

    const input = { arr: ['eee', 'tt'] };
    validate(input, expect);
    expect.arr.items = 'number';
    input.arr = [3, 4];
    validate(input, expect);
    expect.arr.items = 'boolean';
    input.arr = [true, false];
    validate(input, expect);
    expect.arr.items = 'object';
    input.arr = [{}, { a: 3 }];
    validate(input, expect);
    expect.arr.items = {
      type: 'object',
      properties: {
        url: { type: 'string', required: true },
        name: { type: 'string', example: 'Bob' },
        nnn: { type: 'number' }
      }
    };
    input.arr = [{ url: 'a', other: 'b', num: '33' }, { url: 'a', name: 'b' }];
    validate(input, expect);
  });
});
