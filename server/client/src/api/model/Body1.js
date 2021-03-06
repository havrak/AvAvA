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
import Limits from './Limits';

/**
* The Body1 model module.
* @module model/Body1
* @version 1.0
*/
export default class Body1 {
    /**
    * Constructs a new <code>Body1</code>.
    * @alias module:model/Body1
    * @class
    * @param name {String} 
    * @param customLimits {module:model/Limits} 
    */

    constructor(name, customLimits) {
        
        
        this['name'] = name;
        this['customLimits'] = customLimits;
        
    }

    /**
    * Constructs a <code>Body1</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/Body1} obj Optional instance to populate.
    * @return {module:model/Body1} The populated <code>Body1</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new Body1();
                        
            
            if (data.hasOwnProperty('name')) {
                obj['name'] = ApiClient.convertToType(data['name'], 'String');
            }
            if (data.hasOwnProperty('customLimits')) {
                obj['customLimits'] = Limits.constructFromObject(data['customLimits']);
            }
        }
        return obj;
    }

    /**
    * @member {String} name
    */
    'name' = undefined;
    /**
    * @member {module:model/Limits} customLimits
    */
    'customLimits' = undefined;




}
