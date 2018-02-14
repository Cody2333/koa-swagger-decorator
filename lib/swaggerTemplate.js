/**
 * swagger的初始化模板, options参数请参考open api 文档
 * @param {String} title
 * @param {String} description
 * @param {String} version
 * @param {Object} options
 */

const init = (
  title = 'API DOC',
  description = 'API DOC',
  version = '1.0.0',
  options = {}
) => (Object.assign(
  options,
  {
    info: { title, description, version },
    paths: {},
    responses: {},
  },
  {
    definitions: {},
    tags: [],
    swagger: '2.0',
    securityDefinitions: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization'
      }
    },
  }
));

export default init;
export { init };

