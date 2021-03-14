/**
 * User API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';

/**
* The LightResourceStateCPU model module.
* @module model/LightResourceStateCPU
* @version 1.0
*/
export default class LightResourceStateCPU {
    /**
    * Constructs a new <code>LightResourceStateCPU</code>.
    * @alias module:model/LightResourceStateCPU
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>LightResourceStateCPU</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/LightResourceStateCPU} obj Optional instance to populate.
    * @return {module:model/LightResourceStateCPU} The populated <code>LightResourceStateCPU</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new LightResourceStateCPU();
                        
            
            if (data.hasOwnProperty('consumedTime')) {
                obj['consumedTime'] = ApiClient.convertToType(data['consumedTime'], 'Number');
            }
            if (data.hasOwnProperty('percentConsumed')) {
                obj['percentConsumed'] = ApiClient.convertToType(data['percentConsumed'], 'Number');
            }
            if (data.hasOwnProperty('percentAllocated')) {
                obj['percentAllocated'] = ApiClient.convertToType(data['percentAllocated'], 'Number');
            }
        }
        return obj;
    }

    /**
    * Time used by the CPU in nanoseconds (sum of used time of containers)
    * @member {Number} consumedTime
    */
    'consumedTime' = undefined;
    /**
    * Percentage of CPU used from the overall CPU available
    * @member {Number} percentConsumed
    */
    'percentConsumed' = undefined;
    /**
    * Percentage of CPU allocated but not used from the overall CPU available (percentage of sum of limits - percentConsumed)
    * @member {Number} percentAllocated
    */
    'percentAllocated' = undefined;




}