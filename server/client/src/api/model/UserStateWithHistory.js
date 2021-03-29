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
import ProjectStateWithHistory from './ProjectStateWithHistory';

/**
* The UserStateWithHistory model module.
* @module model/UserStateWithHistory
* @version 1.0
*/
export default class UserStateWithHistory {
    /**
    * Constructs a new <code>UserStateWithHistory</code>.
    * Object that knows state and history of all projects and all containers in them
    * @alias module:model/UserStateWithHistory
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>UserStateWithHistory</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/UserStateWithHistory} obj Optional instance to populate.
    * @return {module:model/UserStateWithHistory} The populated <code>UserStateWithHistory</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new UserStateWithHistory();
                        
            
            if (data.hasOwnProperty('projectStatesHistory')) {
                obj['projectStatesHistory'] = ApiClient.convertToType(data['projectStatesHistory'], [ProjectStateWithHistory]);
            }
        }
        return obj;
    }

    /**
    * First state is the current state, after that there are logs of projects's state that were belonged to this user. Even if the container has already been deleted, it is present in this log.
    * @member {Array.<module:model/ProjectStateWithHistory>} projectStatesHistory
    */
    'projectStatesHistory' = undefined;




}