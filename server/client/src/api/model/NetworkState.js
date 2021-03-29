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
import LimitsInternet from './LimitsInternet';
import NetworkStateAdresses from './NetworkStateAdresses';
import NetworkStateCounters from './NetworkStateCounters';

/**
* The NetworkState model module.
* @module model/NetworkState
* @version 1.0
*/
export default class NetworkState {
    /**
    * Constructs a new <code>NetworkState</code>.
    * @alias module:model/NetworkState
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>NetworkState</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/NetworkState} obj Optional instance to populate.
    * @return {module:model/NetworkState} The populated <code>NetworkState</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new NetworkState();
                        
            
            if (data.hasOwnProperty('name')) {
                obj['name'] = ApiClient.convertToType(data['name'], 'String');
            }
            if (data.hasOwnProperty('limits')) {
                obj['limits'] = LimitsInternet.constructFromObject(data['limits']);
            }
            if (data.hasOwnProperty('adresses')) {
                obj['adresses'] = ApiClient.convertToType(data['adresses'], [NetworkStateAdresses]);
            }
            if (data.hasOwnProperty('counters')) {
                obj['counters'] = NetworkStateCounters.constructFromObject(data['counters']);
            }
            if (data.hasOwnProperty('hwaddr')) {
                obj['hwaddr'] = ApiClient.convertToType(data['hwaddr'], 'String');
            }
            if (data.hasOwnProperty('hostName')) {
                obj['hostName'] = ApiClient.convertToType(data['hostName'], 'String');
            }
            if (data.hasOwnProperty('mtu')) {
                obj['mtu'] = ApiClient.convertToType(data['mtu'], 'Number');
            }
            if (data.hasOwnProperty('state')) {
                obj['state'] = ApiClient.convertToType(data['state'], 'String');
            }
            if (data.hasOwnProperty('type')) {
                obj['type'] = ApiClient.convertToType(data['type'], 'String');
            }
        }
        return obj;
    }

    /**
    * name of the network
    * @member {String} name
    */
    'name' = undefined;
    /**
    * @member {module:model/LimitsInternet} limits
    */
    'limits' = undefined;
    /**
    * @member {Array.<module:model/NetworkStateAdresses>} adresses
    */
    'adresses' = undefined;
    /**
    * @member {module:model/NetworkStateCounters} counters
    */
    'counters' = undefined;
    /**
    * @member {String} hwaddr
    */
    'hwaddr' = undefined;
    /**
    * @member {String} hostName
    */
    'hostName' = undefined;
    /**
    * maximum transmission unit
    * @member {Number} mtu
    */
    'mtu' = undefined;
    /**
    * @member {String} state
    */
    'state' = undefined;
    /**
    * @member {String} type
    */
    'type' = undefined;




}