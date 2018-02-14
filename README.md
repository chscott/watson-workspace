# WatsonWorkspace

Module for working with Watson Workspace spaces.

### Quick start
   
1. Require the watson-workspace module:

    ```JavaScript
    const ww = require('watson-workspace');
    ```
    
2. Invoke the API functions. See the Examples section for details.

### Authentication API

- **auth.getToken**: Get a token to use for Watson Workspace interactions.
  
  On success: Returns a JSON object representing a valid token.
  
  On failure: Throws HTTP StatusCodeError.
  
  #### Example
  
  ```JavaScript
    const ww = require('@ics/watson-workspace');
    const appId = process.env.APP_ID;
    const appSecret = process.env.APP_SECRET;

    var token;

    Promise.resolve()
    .then(() => ww.auth.getToken(token, appId, appSecret))
    .then((returnToken) => {
        console.log('Token: ' + JSON.stringify(returnToken));
        token = returnToken;
    })
    .catch((err) => console.error(err));
  ```
  
  ```PowerShell
  Token: {"access_token":"eyJh...","token_type":"bearer","expires_in":43199,"scope":"read write","id":"3908d0cd-6df2-497d-a683-45a8616f8e85","jti":"ca7f671d-392a-4fca-a0b4-6842f8b9d8a9"}
  ```
  
- **auth.verifyWebhook**: Verifies the challenge sent by Watson Workspace when enabling a webhook.
  
  On success: Returns a JSON object indicating success.
  
  On failure: Throws WebhookVerificationError or HTTP StatusCodeError.
  
  #### Example
  
  ```JavaScript
  const ww = require('@ics/watson-workspace');
  
  return Promise.resolve()
  .then( () => ww.auth.verifyWebhook(req, res, webhookSecret) )
  .then( (result) => console.log('Result: ' + JSON.stringify(result)) )
  .catch( (err) => console.error(err) );
  ```

### Spaces API

- **spaces.getSpaceByName**: Gets information about the specified Watson Workspace space.
  
  On success: Returns a JSON object representing a Watson Workspace space.
  
  On failure: Throws NoSuchSpaceError or HTTP StatusCodeError.
  
  #### Example
  
  ```JavaScript
    const ww = require('@ics/watson-workspace');
    const appId = process.env.APP_ID;
    const appSecret = process.env.APP_SECRET;
    const spaceName = "Chad's Sandbox";

    var token;

    Promise.resolve()
    .then( () => ww.auth.getToken(token, appId, appSecret) )
    .then( (returnToken) => token = returnToken )
    .then( () => ww.spaces.getSpaceByName(spaceName, token.access_token) )
    .then( (space) => console.log('Space: ' + JSON.stringify(space)) )
    .catch( (err) => console.error(err) );
  ```
  
  ```PowerShell
  Space: {"id":"58d0f0e6e4b014d4036ee597","title":"Chad's Sandbox","description":null,"created":"2017-03-21T09:22:46.689+0000","updated":"2017-06-09T18:08:31.102+0000","membersUpdated":"2017-06-05T17:13:16.956+0000","createdBy":{"id":"48125740-8f0b-1028-92c4-db07163b51b2","email":"chads@us.ibm.com"},"updatedBy":{"id":"48125740-8f0b-1028-92c4-db07163b51b2","email":"chads@us.ibm.com"},"members":{"items":[{"email":"chads@us.ibm.com","displayName":"Chad Scott"},{"email":null,"displayName":"WWModuleTester"}]}}
  ```
  
- **spaces.getSpaceById**: Gets information about the specified Watson Workspace space.
  
  On success: Returns a JSON object representing a Watson Workspace space.
  
  On failure: Throws NoSuchSpaceError or HTTP StatusCodeError.
  
  #### Example
  
  ```JavaScript
    const ww = require('@ics/watson-workspace');
    const appId = process.env.APP_ID;
    const appSecret = process.env.APP_SECRET;
    const spaceId = '58d0f0e6e4b014d4036ee597';

    var token;

    Promise.resolve()
    .then( () => ww.auth.getToken(token, appId, appSecret) )
    .then( (returnToken) => token = returnToken )
    .then( () => ww.spaces.getSpaceById(spaceId, token.access_token) )
    .then( (space) => console.log('Space: ' + JSON.stringify(space)) )
    .catch( (err) => console.error(err) );
  ```
  
  ```PowerShell
  Space: {"id":"58d0f0e6e4b014d4036ee597","title":"Chad's Sandbox","description":null,"created":"2017-03-21T09:22:46.689+0000","updated":"2017-06-09T18:08:31.102+0000","membersUpdated":"2017-06-05T17:13:16.956+0000","createdBy":{"id":"48125740-8f0b-1028-92c4-db07163b51b2","email":"chads@us.ibm.com"},"updatedBy":{"id":"48125740-8f0b-1028-92c4-db07163b51b2","email":"chads@us.ibm.com"},"members":{"items":[{"email":"chads@us.ibm.com","displayName":"Chad Scott"},{"email":null,"displayName":"WWModuleTester"}]}}
  ```

### Messages API

- **messages.sendMessageToSpace**: Sends a message to a Watson Workspace space.
  
  On success: Returns a JSON object indicating success.
  
  On failure: Throws HTTP StatusCodeError.
  
  #### Example
  
  This example uses the message template defined by the module in messages.messageTemplate.
  
  ```JavaScript
    const ww = require('@ics/watson-workspace');
    const appId = process.env.APP_ID;
    const appSecret = process.env.APP_SECRET;
    const space = "Chad's Sandbox";
    var message = ww.messages.messageTemplate;
    message.annotations[0].text = 'Hello world!';

    var token;

    Promise.resolve()
    .then( () => ww.auth.getToken(token, appId, appSecret) )
    .then( (returnToken) => token = returnToken )
    .then( () => ww.spaces.getSpace(space, token.access_token) )
    .then( (space) => ww.messages.sendMessageToSpace(message, space.id, token.access_token) )
    .then( (result) => console.log('Result: ' + JSON.stringify(result)) )
    .catch( (err) => console.error(err) );
  ```
  
  ```PowerShell
  Result: {"result":"success"}
  ```


### Users API

- **users.getUserById**: Gets information about the specified user.
  
  On success: Returns a JSON object representing the user.
  
  On failure: Throws NoSuchUserError or HTTP StatusCodeError.
  
  #### Example
  
  ```JavaScript
    const ww = require('@ics/watson-workspace');
    const appId = process.env.APP_ID;
    const appSecret = process.env.APP_SECRET;
    const userId = '48125740-8f0b-1028-92c4-db07163b51b2';

    var token;

    Promise.resolve()
    .then( () => ww.auth.getToken(token, appId, appSecret) )
    .then( (returnToken) => token = returnToken )
    .then( () => ww.users.getUserById(userId, token.access_token) )
    .then( (user) => console.log('User: ' + JSON.stringify(user)) )
    .catch( (err) => console.error(err) );
  ```
  
  ```PowerShell
  User: {"id":"48125740-8f0b-1028-92c4-db07163b51b2","displayName":"Chad Scott","email":"chads@us.ibm.com"}
  ```
  
- **users.getUserByEmail**: Gets information about the specified user.
  
  On success: Returns a JSON object representing the user.
  
  On failure: Throws NoSuchUserError or HTTP StatusCodeError.
  
  #### Example
  
  ```JavaScript
    const ww = require('@ics/watson-workspace');
    const appId = process.env.APP_ID;
    const appSecret = process.env.APP_SECRET;
    const userEmail = 'chads@us.ibm.com';

    var token;

    Promise.resolve()
    .then( () => ww.auth.getToken(token, appId, appSecret) )
    .then( (returnToken) => token = returnToken )
    .then( () => ww.users.getUserByEmail(userEmail, token.access_token) )
    .then( (user) => console.log('User: ' + JSON.stringify(user)) )
    .catch( (err) => console.error(err) );
  ```
  
  ```PowerShell
  User: {"id":"48125740-8f0b-1028-92c4-db07163b51b2","displayName":"Chad Scott","email":"chads@us.ibm.com"}
  ```