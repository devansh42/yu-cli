//This file contains app wide constant




export const apiBackend = isDevEnv() ? "http://api.gstatic.tech" : "http://api.gstatic.tech";
export const appName = "";
export const serviceDomain = isDevEnv() ? "gstatic.tech" : "gstatic.tech";



function isDevEnv() {
   return "YU_DEV_ENV" in process.env;
   
}
