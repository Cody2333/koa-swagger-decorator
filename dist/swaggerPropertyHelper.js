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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhZ2dlclByb3BlcnR5SGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL3N3YWdnZXJQcm9wZXJ0eUhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUtBOzs7R0FHRztBQUNILFNBQWdCLFlBQVksQ0FBQyxXQUFzQjtJQUMvQyxPQUFPLFVBQVUsTUFBVSxFQUFFLFdBQW1CLEVBQUUsVUFBOEI7UUFDNUUsSUFBSSxNQUFNLENBQUMsZUFBZSxJQUFJLFNBQVM7WUFBRSxNQUFNLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztJQUN6RSxDQUFDLENBQUE7QUFDTCxDQUFDO0FBSkQsb0NBSUM7QUFBQSxDQUFDO0FBRUY7O0dBRUc7QUFDSCxNQUFhLGVBQWU7SUFBNUI7UUFDSTs7V0FFRztRQUNILFNBQUksR0FBZSxJQUFJLENBQUM7UUFDeEI7O1dBRUc7UUFDSCxhQUFRLEdBQWEsSUFBSSxDQUFDO1FBQzFCOztXQUVHO1FBQ0gsWUFBTyxHQUFTLElBQUksQ0FBQztRQUNyQjs7V0FFRztRQUNILGVBQVUsR0FBd0IsSUFBSSxDQUFDO1FBQ3ZDOztXQUVHO1FBQ0gsVUFBSyxHQUFxQixJQUFJLENBQUM7SUFLbkMsQ0FBQztDQUFBO0FBekJELDBDQXlCQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixlQUFlLENBQUMsT0FBeUI7SUFDckQsT0FBTyxVQUFVLE1BQVUsRUFBRSxXQUFtQixFQUFFLFVBQThCO1FBQzVFLElBQUksTUFBTSxDQUFDLGVBQWUsSUFBSSxTQUFTO1lBQUUsTUFBTSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7UUFDckUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDbEQsQ0FBQyxDQUFBO0FBQ0wsQ0FBQztBQUxELDBDQUtDO0FBQUEsQ0FBQyJ9