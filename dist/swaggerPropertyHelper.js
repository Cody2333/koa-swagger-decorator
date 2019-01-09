"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function swaggerClass(constructor) {
    return function (target, propertyKey, descriptor) {
        if (target.swaggerDocument == undefined)
            target.swaggerDocument = {};
    };
}
exports.swaggerClass = swaggerClass;
class PropertyOptions {
    constructor() {
        this.type = undefined;
        this.required = undefined;
        this.example = undefined;
        this.descriptor = undefined;
        this.items = undefined;
    }
}
exports.PropertyOptions = PropertyOptions;
function swaggerProperty(options) {
    return function (target, propertyKey, descriptor) {
        if (target.swaggerDocument == undefined)
            target.swaggerDocument = {};
        target.swaggerDocument[propertyKey] = options;
    };
}
exports.swaggerProperty = swaggerProperty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhZ2dlclByb3BlcnR5SGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL3N3YWdnZXJQcm9wZXJ0eUhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU1BLHNCQUE2QixXQUFzQjtJQUMvQyxPQUFPLFVBQVUsTUFBVyxFQUFFLFdBQW1CLEVBQUUsVUFBOEI7UUFDN0UsSUFBSSxNQUFNLENBQUMsZUFBZSxJQUFJLFNBQVM7WUFBRSxNQUFNLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztJQUN6RSxDQUFDLENBQUM7QUFDTixDQUFDO0FBSkQsb0NBSUM7QUFFRDtJQUFBO1FBRUksU0FBSSxHQUFpQixTQUFTLENBQUM7UUFFL0IsYUFBUSxHQUFhLFNBQVMsQ0FBQztRQUUvQixZQUFPLEdBQVMsU0FBUyxDQUFDO1FBRTFCLGVBQVUsR0FBd0IsU0FBUyxDQUFDO1FBRTVDLFVBQUssR0FBcUIsU0FBUyxDQUFDO0lBR3hDLENBQUM7Q0FBQTtBQWJELDBDQWFDO0FBRUQseUJBQWdDLE9BQXlCO0lBQ3JELE9BQU8sVUFBVSxNQUFXLEVBQUUsV0FBbUIsRUFBRSxVQUE4QjtRQUM3RSxJQUFJLE1BQU0sQ0FBQyxlQUFlLElBQUksU0FBUztZQUFFLE1BQU0sQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQ2xELENBQUMsQ0FBQztBQUNOLENBQUM7QUFMRCwwQ0FLQyJ9