//This file contains app wide constant




export const apiBackend = isDevEnv() ? "http://localhost:8080" : "http://api.gstatic.tech";
export const appName = "";
export const serviceDomain = isDevEnv() ? "bsnl.online" : "gstatic.tech";



function isDevEnv() {
   return "YU_DEV_ENV" in process.env;
   
}
