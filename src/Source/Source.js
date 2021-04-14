import { createContext } from "react";
// eslint-disable-next-line no-unused-vars
import initSource from "./initSource";
// eslint-disable-next-line no-unused-vars
import reducerSource from "./reducerSource";


/**
 * 
 * @param {import('./reducerSource').reducerAction} action 
 */
// eslint-disable-next-line no-unused-vars
function reducerFunc(action)
{

}
/**
 * @typedef TGeneralContext
 * @property {initSource} state
 * @property {reducerFunc} action
 */

/**
 * @type {import('react').Context<TGeneralContext>}
 */
const SourceContext = createContext()
export default SourceContext