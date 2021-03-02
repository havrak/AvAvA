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
* The User model module.
* @module model/User
* @version 1.0
*/
export default class User {
    /**
    * Constructs a new <code>User</code>.
    * @alias module:model/User
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>User</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/User} obj Optional instance to populate.
    * @return {module:model/User} The populated <code>User</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new User();
                        
            
            if (data.hasOwnProperty('id')) {
                obj['id'] = ApiClient.convertToType(data['id'], 'Number');
            }
            if (data.hasOwnProperty('email')) {
                obj['email'] = ApiClient.convertToType(data['email'], 'String');
            }
            if (data.hasOwnProperty('familyName')) {
                obj['familyName'] = ApiClient.convertToType(data['familyName'], 'String');
            }
            if (data.hasOwnProperty('givenName')) {
                obj['givenName'] = ApiClient.convertToType(data['givenName'], 'String');
            }
            if (data.hasOwnProperty('role')) {
                obj['role'] = ApiClient.convertToType(data['role'], 'Number');
            }
            if (data.hasOwnProperty('coins')) {
                obj['coins'] = ApiClient.convertToType(data['coins'], 'Number');
            }
        }
        return obj;
    }

    /**
    * Id of the user generated by database
    * @member {Number} id
    */
    'id' = undefined;
    /**
    * @member {String} email
    */
    'email' = undefined;
    /**
    * inherited family name
    * @member {String} familyName
    */
    'familyName' = undefined;
    /**
    * first name - given by parents
    * @member {String} givenName
    */
    'givenName' = undefined;
    /**
    * 0 = normal user, 1 = admin, 2 = superadmin
    * @member {Number} role
    */
    'role' = undefined;
    /**
    * number of coins that can be used to buy bigger resource quotas
    * @member {Number} coins
    */
    'coins' = undefined;




}