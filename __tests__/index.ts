import _path from 'path';
import assert from 'assert';
import server from '../example/main';
import { getPath, convertPath, getFilepaths, sortObject } from '../lib/utils';
import validate from '../lib/validate';
import { expect } from 'chai';
const request = require('supertest')(server);

afterAll(() => {
  server.close();
})
describe('HTTP API generation test:', () => {
  describe('Init Swagger Doc:', () => {
    it('GET /api/v1/swagger-html should return success for swagger ui page', (done) => {
      request
        .get('/api/v1/swagger-html')
        .expect(200)
        .end((err: any) => {
          if (err) return done(err);
          done();
        });
    });
    it('GET /api/v1/swagger-json should return swagger json data', (done) => {
      request
        .get('/api/v1/swagger-json')
        .expect(200)
        .expect((res: { body: { info: any; }; }) => expect(res.body.info).to.be.an('object'))
        .end((err: any) => {
          if (err) return done(err);
          done();
        });
    });
  });
  describe('Construct api from router.map:', () => {
    it('POST /api/v1/user/login should return user data if success', (done) => {
      request
        .post('/api/v1/user/login')
        .send({
          name: 'string',
          password: '123456'
        })
        .expect(200)
        .expect((res: { body: { user: any; }; }) => expect(res.body.user).to.be.an('object'))
        .end((err: any) => {
          if (err) return done(err);
          done();
        });
    });
    it('POST /api/v1/user/login should have corresponding swagger doc data', (done) => {
      request
        .get('/api/v1/swagger-json')
        .expect(200)
        .expect((res: { body: { paths: { [x: string]: any; }; }; }) =>
          expect(res.body.paths['/api/v1/user/login']).to.be.an('object'))
        .end((err: any) => {
          if (err) return done(err);
          done();
        });
    });
  });
  describe('Construct api from router.mapDir:', () => {
    it('GET /api/v2/other should return data if success', (done) => {
      request
        .get('/api/v2/other')
        .expect(200)
        .expect((res: { body: { other: any; }; }) => expect(res.body.other).to.be.an('array'))
        .end((err: any) => {
          if (err) return done(err);
          done();
        });
    });
    it('GET /api/v2/other/what should return data if success', (done) => {
      request
        .get('/api/v2/other/what')
        .expect(200)
        .expect((res: { body: { other: any; }; }) => expect(res.body.other).to.be.an('array'))
        .end((err: any) => {
          if (err) return done(err);
          done();
        });
    });

    it('GET /api/v1/v1/prefix with class decorator prefix', (done) => {
      request
        .get('/api/v1/v1/prefix?page=a')
        .expect(200)
        .expect((res: { body: { result: any; }; }) => expect(res.body.result).to.be.an('string'))
        .end((err: any) => {
          if (err) return done(err);
          done();
        });
    });

    it('GET /api/v2/other/how should return data if options:{rescursive: true}', (done) => {
      request
        .get('/api/v2/other/how')
        .expect(200)
        .expect((res: { body: { other: any; }; }) => expect(res.body.other).to.be.an('array'))
        .end((err: any) => {
          if (err) return done(err);
          done();
        });
    });

    it('GET /api/v2/egg/method1 should return data if success', (done) => {
      request
        .get('/api/v2/egg/method1?no=nonono')
        .expect(200)
        .expect((res: { body: { no: any; }; }) => expect(res.body.no).to.be.an('string'))
        .end((err: any) => {
          if (err) return done(err);
          done();
        });
    });

    it('POST /api/v2/egg/method2 should return data if success', (done) => {
      request
        .post('/api/v2/egg/method2')
        .send({
          yes: 'yesyesyes'
        })
        .expect(200)
        .expect((res: { body: { yes: any; }; }) => expect(res.body.yes).to.be.an('string'))
        .end((err: any) => {
          if (err) return done(err);
          done();
        });
    });
  });
  describe('Validation and Swagger Test', () => {
    it('GET /api/v1/enum?limit=1 should success', (done) => {
      request
        .get('/api/v1/enum?limit=1')
        .expect(200)
        .end((err: any) => {
          if (err) return done(err);
          done();
        });
    });
    it('GET /api/v1/enum should fail due to lack of query params: [limit]', (done) => {
      request
        .get('/api/v1/enum')
        .expect(400)
        .end((err: any) => {
          if (err) return done(err);
          done();
        });
    });
    it('GET /api/v1/enum?limit=fff should fail due to wrong type of query params: [limit] (number required)', (done) => {
      request
        .get('/api/v1/enum?limit=fff')
        .expect(400)
        .end((err: any) => {
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
      const dir = _path.resolve(__dirname, '../example/routes/v2');
      const r = getFilepaths(dir, false);
      expect(r)
        .to.be.an('array')
        .to.have.lengthOf(2);
    });
    it('should return an array,length = 5 when recursive=true', () => {
      const dir = _path.resolve(__dirname, '../example/routes/v2');
      const r = getFilepaths(dir, true);
      expect(r)
        .to.be.an('array')
        .to.have.lengthOf(5);
    });
    it('should return an array,length = 4 when ignore=["**/egg.ts"]', () => {
      const dir = _path.resolve(__dirname, '../example/routes/v2');
      const r = getFilepaths(dir, true, ['egg.ts']);
      expect(r)
        .to.be.an('array')
        .to.have.lengthOf(4);
    });
  });
  describe('sortObject:', () => {
    it('should return an object with keys ordered in the specified weight', () => {
      const input = {
        foo: { weight: 4 },
        baz: { weight: 1 },
        cat: { weight: 3 }
      };
      const expectedOrder = ['baz', 'cat', 'foo'];
      const output = sortObject(input, item => item.weight);
      const outputKeys = Object.keys(output);
      expect(outputKeys).to.be.eql(expectedOrder);
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
      qoa: [1, 2],
      baz: {
        b: 'f'
      },
      addon: 'ttt',
      boo: 'true',
      coo: 'false',
      sst: '666',
      uuid: '208d0175-23e8-46ca-9013-5164d74bc3c7',
      email: 'test@test.com',
      date: '2020-11-14T10:00:00Z',
      "date-time": '2020-11-14T12:00:00Z',
      byte: 'U3dhZ2dlciByb2Nrcw==',
      ipv4: '127.0.0.1',
      ipv6: '::1'
    };
    const expect: any = {
      nax: {
        type: 'number',
        exclusiveMinimum: 11,
        exclusiveMaximum: 13,
        multipleOf: 4
      },
      foo: {
        type: 'number',
        required: true
      },
      bar: {
        type: 'string',
        required: false,
        minLength: 1,
        maxLength: 3,
        pattern: '^[qwf]{3,}$'
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
        type: 'boolean'
      },
      coo: {
        type: 'boolean'
      },
      default: {
        type: 'string',
        required: false,
        default: 'ddd'
      },
      sst: {
        type: 'string'
      },
      uuid: { type: 'string', format: 'uuid' },
      email: { type: 'string', format: 'email' },
      date: { type: 'string', format: 'date' },
      "date-time": { type: 'string', format: 'date-time' },
      byte: { type: 'string', format: 'byte' },
      ipv4: { type: 'string', format: 'ipv4' },
      ipv6: { type: 'string', format: 'ipv6' },
      addon: undefined
    };
    const validatedInput = validate(input, expect);
    assert(validatedInput.foo === 1);
    assert(validatedInput.default === 'ddd');
    assert(!validatedInput.addon);
    assert(validatedInput.boo === true);
    assert(validatedInput.coo === false);
    assert(typeof validatedInput.sst === 'string');
    assert(validatedInput.uuid === '208d0175-23e8-46ca-9013-5164d74bc3c7');
    assert(validatedInput.email === 'test@test.com');
    assert(validatedInput.date === '2020-11-14T10:00:00Z');
    assert(validatedInput["date-time"] === '2020-11-14T12:00:00Z');
    assert(validatedInput.byte === 'U3dhZ2dlciByb2Nrcw==');
    assert(validatedInput.ipv4 === '127.0.0.1');
    assert(validatedInput.ipv6 === '::1');
  });
  it('should throw error when no required input', () => {
    const input = {};
    const expect = {
      foo: {
        type: 'string',
        required: true
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
  it('should throw error when not an object while type=object', () => {
    const input = { foo: 'r' };
    const expect = { foo: { type: 'object' } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when not an array while type=array', () => {
    const input = { foo: 'r' };
    const expect = { foo: { type: 'array' } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when using wrong format while type=string format=uuid', () => {
    const input = { foo: 'bad-uuid' };
    const expect = { foo: { type: 'string', format: 'uuid' } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when using wrong format while type=string format=email', () => {
    const input = { foo: 'bad-email' };
    const expect = { foo: { type: 'string', format: 'email' } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when using wrong format while type=string format=date', () => {
    const input = { foo: '11-14-2017' };
    const expect = { foo: { type: 'string', format: 'date' } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when using wrong format while type=string format=date-time', () => {
    const input = { foo: '2017-07-21 17:32:28' };
    const expect = { foo: { type: 'string', format: 'date' } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when using wrong format while type=string format=byte', () => {
    const input = { foo: 'not a base 64 string' };
    const expect = { foo: { type: 'string', format: 'byte' } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when using wrong format while type=string format=ipv4', () => {
    const input = { foo: '::1' };
    const expect = { foo: { type: 'string', format: 'ipv4' } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when using wrong format while type=string format=ipv6', () => {
    const input = { foo: '127.0.0.1' };
    const expect = { foo: { type: 'string', format: 'ipv6' } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when minLength not satisfied for type=string', () => {
    const input = { foo: 'asdf' };
    const expect = { foo: { type: 'string', minLength: 10 } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when maxLength not satisfied for type=string', () => {
    const input = { foo: 'foobarbaz' };
    const expect = { foo: { type: 'string', maxLength: 5 } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when pattern not satisfied for type=string', () => {
    const input = { foo: 'foobarbaz' };
    const expect = { foo: { type: 'string', pattern: '^[0-9]+$' } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });

  it('should throw error when exclusiveMinimum not satisfied for type=number', () => {
    const input = { foo: 5 };
    const expect = { foo: { type: 'number', exclusiveMinimum: 5 } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when exclusiveMaximum not satisfied for type=number', () => {
    const input = { foo: 5 };
    const expect = { foo: { type: 'number', exclusiveMaximum: 5 } };
    try {
      validate(input, expect);
      throw new Error();
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });
  it('should throw error when multipleOf not satisfied for type=number', () => {
    const input = { foo: 5 };
    const expect = { foo: { type: 'number', multipleOf: 3 } };
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
          aaaa: {
            type: 'string',
            example: 'http://www.baidu.com',
            required: true
          },
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
        cccc: 'dd'
      }
    };
    validate(input, expect);
  });
  it('shoud support complex array data', () => {
    const expect: any = {
      arr: {
        type: 'array',
        items: 'string',
        required: true
      }
    };

    const input: any = { arr: ['eee', 'tt'] };
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
  it('should not set undefined default value on the top layer', () => {
    const schema = {
      key1: { type: 'string' },
      key2: { type: 'number' }
    };

    const input = {
      key1: 'abc'
    };
    const output = validate(input, schema);
    expect(Object.keys(output)).to.eql(['key1']);
  });

  it('throw error when enum is an empty array', () => {
    const input = { foo: '1' };
    const expect: any = {
      foo: { type: 'string', enum: [] }
    };
    try {
      validate(input, expect);
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });

  it('throw error when enum doesnot include input', () => {
    const input = { foo: '1' };
    const expect = {
      foo: { type: 'string', enum: ['2', '3', '4'] }
    };
    try {
      validate(input, expect);
    } catch (err) {
      assert(err.message === "incorrect field: 'foo', please check again!");
    }
  });

  it(' when enum include input', () => {
    const input = { foo: '1' };
    const expect = {
      foo: { type: 'string', enum: ['1', '2', '3', '4'] }
    };
    const { foo } = validate(input, expect);
    assert(foo === '1');
  });

  it(' should allow any type when type is not defined in expect', () => {
    const input = { foo: '1', bar: 2 };
    const expect = {
      foo: { required: true }
    };
    const { foo } = validate(input, expect);
    assert(foo === '1');
  });
});
