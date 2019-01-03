"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param constructor
 */
function swaggerClass(constructor) {
    return function (target, propertyKey, descriptor) {
        if (target.swaggerDocument == undefined)
            target.swaggerDocument = {};
    };
}
exports.swaggerClass = swaggerClass;
;
/**
 *
 */
class PropertyOptions {
    constructor() {
        /**
         *
         */
        this.type = null;
        /**
         *
         */
        this.required = null;
        /**
         *
         */
        this.example = null;
        /**
         *
         */
        this.descriptor = null;
        /**
         *
         */
        this.items = null;
    }
}
exports.PropertyOptions = PropertyOptions;
/**
 *
 * @param type
 * @param options
 */
function swaggerProperty(options) {
    return function (target, propertyKey, descriptor) {
        if (target.swaggerDocument == undefined)
            target.swaggerDocument = {};
        target.swaggerDocument[propertyKey] = options;
    };
}
exports.swaggerProperty = swaggerProperty;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhZ2dlclByb3BlcnR5SGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL3N3YWdnZXJQcm9wZXJ0eUhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUtBOzs7R0FHRztBQUNILHNCQUE2QixXQUFzQjtJQUMvQyxPQUFPLFVBQVUsTUFBVSxFQUFFLFdBQW1CLEVBQUUsVUFBOEI7UUFDNUUsSUFBSSxNQUFNLENBQUMsZUFBZSxJQUFJLFNBQVM7WUFBRSxNQUFNLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztJQUN6RSxDQUFDLENBQUE7QUFDTCxDQUFDO0FBSkQsb0NBSUM7QUFBQSxDQUFDO0FBRUY7O0dBRUc7QUFDSDtJQUFBO1FBQ0k7O1dBRUc7UUFDSCxTQUFJLEdBQWUsSUFBSSxDQUFDO1FBQ3hCOztXQUVHO1FBQ0gsYUFBUSxHQUFhLElBQUksQ0FBQztRQUMxQjs7V0FFRztRQUNILFlBQU8sR0FBUyxJQUFJLENBQUM7UUFDckI7O1dBRUc7UUFDSCxlQUFVLEdBQXdCLElBQUksQ0FBQztRQUN2Qzs7V0FFRztRQUNILFVBQUssR0FBcUIsSUFBSSxDQUFDO0lBS25DLENBQUM7Q0FBQTtBQXpCRCwwQ0F5QkM7QUFFRDs7OztHQUlHO0FBQ0gseUJBQWdDLE9BQXlCO0lBQ3JELE9BQU8sVUFBVSxNQUFVLEVBQUUsV0FBbUIsRUFBRSxVQUE4QjtRQUM1RSxJQUFJLE1BQU0sQ0FBQyxlQUFlLElBQUksU0FBUztZQUFFLE1BQU0sQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQ2xELENBQUMsQ0FBQTtBQUNMLENBQUM7QUFMRCwwQ0FLQztBQUFBLENBQUMifQ==