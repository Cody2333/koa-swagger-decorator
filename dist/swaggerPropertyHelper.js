"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BasePropertyOptions {
}
/**
 *
 * @param source
 */
function deepClone(source) {
    if (!source || typeof source !== 'object') {
        return null;
    }
    const targetObj = source.constructor === Array ? [] : {};
    for (const keys in source) {
        if (source.hasOwnProperty(keys)) {
            if (source[keys] && typeof source[keys] === 'object') {
                targetObj[keys] = source[keys].constructor === Array ? [] : {};
                targetObj[keys] = deepClone(source[keys]);
            }
            else {
                targetObj[keys] = source[keys];
            }
        }
    }
    return targetObj;
}
/**
 * Made for empty class
 */
function swaggerClass() {
    return function (target, propertyKey, descriptor) {
        if (target.swaggerDocument == undefined)
            target.swaggerDocument = {};
        if (target.swaggerClass == undefined)
            target.swaggerClass = target;
        if (target.swaggerClass != target) {
            target.swaggerClass = target;
            target.swaggerDocument = deepClone(target.swaggerDocument);
        }
    };
}
exports.swaggerClass = swaggerClass;
/**
 * @param options
 */
function swaggerProperty(options) {
    return function (target, propertyKey, descriptor) {
        if (target.constructor.swaggerDocument == undefined)
            target.constructor.swaggerDocument = {};
        if (target.constructor.swaggerClass == undefined)
            target.constructor.swaggerClass = target.constructor;
        if (target.constructor.swaggerClass != target.constructor) {
            target.constructor.swaggerClass = target.constructor;
            target.constructor.swaggerDocument = deepClone(target.constructor.swaggerDocument);
        }
        target.constructor.swaggerDocument[propertyKey] = options;
    };
}
exports.swaggerProperty = swaggerProperty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhZ2dlclByb3BlcnR5SGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL3N3YWdnZXJQcm9wZXJ0eUhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBO0NBT0M7QUE4Q0Q7OztHQUdHO0FBQ0gsbUJBQW1CLE1BQVc7SUFDMUIsSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7UUFDdkMsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELE1BQU0sU0FBUyxHQUFRLE1BQU0sQ0FBQyxXQUFXLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUM5RCxLQUFLLE1BQU0sSUFBSSxJQUFJLE1BQU0sRUFBRTtRQUN2QixJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDN0IsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUSxFQUFFO2dCQUNsRCxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUMvRCxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzdDO2lCQUFNO2dCQUNILFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbEM7U0FDSjtLQUNKO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDckIsQ0FBQztBQUVEOztHQUVHO0FBQ0g7SUFDSSxPQUFPLFVBQVUsTUFBVyxFQUFFLFdBQW1CLEVBQUUsVUFBOEI7UUFDN0UsSUFBSSxNQUFNLENBQUMsZUFBZSxJQUFJLFNBQVM7WUFBRSxNQUFNLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUNyRSxJQUFJLE1BQU0sQ0FBQyxZQUFZLElBQUksU0FBUztZQUFFLE1BQU0sQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO1FBQ25FLElBQUksTUFBTSxDQUFDLFlBQVksSUFBSSxNQUFNLEVBQUU7WUFDL0IsTUFBTSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7WUFDN0IsTUFBTSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQzlEO0lBQ0wsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQVRELG9DQVNDO0FBRUQ7O0dBRUc7QUFDSCx5QkFBZ0MsT0FBeUI7SUFDckQsT0FBTyxVQUFVLE1BQVcsRUFBRSxXQUFtQixFQUFFLFVBQThCO1FBQzdFLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxlQUFlLElBQUksU0FBUztZQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUM3RixJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsWUFBWSxJQUFJLFNBQVM7WUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3ZHLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRTtZQUN2RCxNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxXQUFXLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ3RGO1FBQ0QsTUFBTSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQzlELENBQUMsQ0FBQztBQUNOLENBQUM7QUFWRCwwQ0FVQyJ9