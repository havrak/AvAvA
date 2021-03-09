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
import Container from './Container';
import LightResourceState from './LightResourceState';
import User from './User';

/**
* The Project model module.
* @module model/Project
* @version 1.0
*/
export default class Project {
    /**
    * Constructs a new <code>Project</code>.
    * @alias module:model/Project
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>Project</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/Project} obj Optional instance to populate.
    * @return {module:model/Project} The populated <code>Project</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new Project();
                        
            
            if (data.hasOwnProperty('id')) {
                obj['id'] = ApiClient.convertToType(data['id'], 'Number');
            }
            if (data.hasOwnProperty('name')) {
                obj['name'] = ApiClient.convertToType(data['name'], 'String');
            }
            if (data.hasOwnProperty('owner')) {
                obj['owner'] = User.constructFromObject(data['owner']);
            }
            if (data.hasOwnProperty('coworkers')) {
                obj['coworkers'] = ApiClient.convertToType(data['coworkers'], [User]);
            }
            if (data.hasOwnProperty('projectState')) {
                obj['projectState'] = LightResourceState.constructFromObject(data['projectState']);
            }
            if (data.hasOwnProperty('containers')) {
                obj['containers'] = ApiClient.convertToType(data['containers'], [Container]);
            }
        }
        return obj;
    }

    /**
    * id of the project generated by the database
    * @member {Number} id
    */
    'id' = undefined;
    /**
    * Name of the project
    * @member {String} name
    */
    'name' = undefined;
    /**
    * @member {module:model/User} owner
    */
    'owner' = undefined;
    /**
    * @member {Array.<module:model/User>} coworkers
    */
    'coworkers' = undefined;
    /**
    * @member {module:model/LightResourceState} projectState
    */
    'projectState' = undefined;
    /**
    * @member {Array.<module:model/Container>} containers
    */
    'containers' = undefined;




}
