//This file contains app wide constant




export const apiBackend = isDevEnv() ? "http://localhost:8080" : "https://api.site.com";
export const appName = "";
export const serviceDomain = isDevEnv() ? "bsnl.online" : "site.com";



function isDevEnv() {
   return "YU_DEV_ENV" in process.env;
   
}