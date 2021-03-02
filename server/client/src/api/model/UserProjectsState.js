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
import ProjectState from './ProjectState';

/**
* The UserProjectsState model module.
* @module model/UserProjectsState
* @version 1.0
*/
export default class UserProjectsState {
    /**
    * Constructs a new <code>UserProjectsState</code>.
    * @alias module:model/UserProjectsState
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>UserProjectsState</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/UserProjectsState} obj Optional instance to populate.
    * @return {module:model/UserProjectsState} The populated <code>UserProjectsState</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new UserProjectsState();
                        
            
            if (data.hasOwnProperty('maxResources')) {
                obj['maxResources'] = Limits.constructFromObject(data['maxResources']);
            }
            if (data.hasOwnProperty('projectsState')) {
                obj['projectsState'] = ApiClient.convertToType(data['projectsState'], [ProjectState]);
            }
        }
        return obj;
    }

    /**
    * @member {module:model/Limits} maxResources
    */
    'maxResources' = undefined;
    /**
    * @member {Array.<module:model/ProjectState>} projectsState
    */
    'projectsState' = undefined;




}