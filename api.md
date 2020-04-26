# Api Infomation

## Endpoints other than **/login** and **/signup** will contain a header naming **x-access-token** containing jwt token, you have to check that

## Endpoint other than /login and /signup can also return http 403 if invalid credentials provided

| Endpoint | Method | Request Params | Response|
|----------|-----|----------------|---------|
| /signup  |post| {  email , password   } | 400 = {"Invalid email/password"}, 201 =  { access_token,email }, 200 = {"Already have account"}, 403 = {"Already account exists but doesn't belongs to current user"}| 
| /login | post| {email,password} | 400 = {"Invalid email/password"}, 200 = {access_token}, 403 = {"Invalid Credentials"} |
| /list | get| ?only_deployed=(true or false) | 200 = { [{hostname,status}] List of projects, is only_deployed is true it means we only need to list only deplyed website else all websites belong to user}|
| /recommend|get|?name|200={[string] Array of recommendations}|
| /down|post|{hostname}|200={Site undeployed},404={Site belongs to user but is not deployed}, 401={Site doesn't belongs to current user}|
 | /up |post|{hostname,files,wd}|200={Site is successfully deployed} |

### Files in /up is tar file encoded as base64
### wd in /up is the path of current working directory