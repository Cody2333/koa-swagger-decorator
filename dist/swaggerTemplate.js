"use strict";
/**
 * init swagger definitions
 * @param {String} title
 * @param {String} description
 * @param {String} version
 * @param {Object} options other options for swagger definition
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (title = 'API DOC', description = 'API DOC', version = '1.0.0', options = {}) => Object.assign({
    info: { title, description, version },
    paths: {},
    responses: {}
}, {
    definitions: {},
    tags: [],
    swagger: '2.0',
    securityDefinitions: {
        ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization'
        }
    }
}, options);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhZ2dlclRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL3N3YWdnZXJUZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGtCQUFlLENBQ2IsS0FBSyxHQUFHLFNBQVMsRUFDakIsV0FBVyxHQUFHLFNBQVMsRUFDdkIsT0FBTyxHQUFHLE9BQU8sRUFDakIsT0FBTyxHQUFHLEVBQUUsRUFDWixFQUFFLENBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FDWDtJQUNFLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFO0lBQ3JDLEtBQUssRUFBRSxFQUFFO0lBQ1QsU0FBUyxFQUFFLEVBQUU7Q0FDZCxFQUNEO0lBQ0UsV0FBVyxFQUFFLEVBQUU7SUFDZixJQUFJLEVBQUUsRUFBRTtJQUNSLE9BQU8sRUFBRSxLQUFLO0lBQ2QsbUJBQW1CLEVBQUU7UUFDbkIsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLFFBQVE7WUFDZCxFQUFFLEVBQUUsUUFBUTtZQUNaLElBQUksRUFBRSxlQUFlO1NBQ3RCO0tBQ0Y7Q0FDRixFQUNELE9BQU8sQ0FDUixDQUFDIn0=