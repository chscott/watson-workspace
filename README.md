# WatsonWorkspace

Module for working with Watson Workspace spaces.

### Quick start

1. Log into IBM's NPM registry using the following command:

   ```PowerShell
   npm login --registry=https://npm-registry.whitewater.ibm.com --scope=@ics
   ```

   Be sure to follow the URL link in the shell to complete login.
   
2. Require the @ics/watson-workspace module:

    ```JavaScript
    const ww = require('@ics/watson-workspace');
    ```
    
3. Invoke the API functions. See the Examples section for details.

### Authentication API

- auth.getToken
  
  Returns a JSON object representing a token that can be used for interacting with Watson Workspace.
  
  #### Example
  
  ```JavaScript
  const ww = require('@ics/watson-workspace');
  
  var token;
  
  return Promise.resolve()
  .then( () => ww.auth.getToken(token, appId, appSecret) )
  .then( (returnToken) => {
     console.log('Token: ' + JSON.stringify(returnToken));
     token = returnToken;
  })
  .catch( (err) => console.error(err) );
  ```
  
- auth.verifyWebhook
  
  Verifies the challenge sent by Watson Workspace when enabling a webhook.
  
  #### Example
  
  ```JavaScript
  const ww = require('@ics/watson-workspace');
  
  return Promise.resolve()
  .then( () => ww.auth.verifyWebhook(req, res, webhookSecret) )
  .then( (result) => console.log('Result: ' + JSON.stringify(result)) )
  .catch( (err) => console.error(err) );
  ```

### Spaces API

- getSpace
  
  Returns a JSON object representing a Watson Workspace space.
  
  #### Example
  
  ```JavaScript
  const ww = require('@ics/watson-workspace');
  
  var token;

  return Promise.resolve()
  .then( () => ww.auth.getToken(token, appId, appSecret) )
  .then( (returnToken) => token = returnToken )
  .then( () => ww.spaces.getSpace('My WW Space', token.access_token) )
  .then( (space) => console.log('Space: ' + JSON.stringify(space)) )
  .catch( (err) => console.error(err) );
  ```

### Messages API

- sendMessageToSpace
  
  Sends a message to a Watson Workspace space.
  
  #### Example
  
  This example uses the message template defined by the module in messages.messageTemplate.
  
  ```JavaScript
  const ww = require('@ics/watson-workspace');
  
  var message = ww.messages.messageTemplate;
  message.annotations[0].text = 'Hello world!';
  var token;
  
  return Promise.resolve()
  .then( () => ww.auth.getToken(token, appId, appSecret) )
  .then( (returnToken) => token = returnToken )
  .then( () => ww.spaces.getSpace('My WW Space', token.access_token) )
  .then( (space) => ww.messages.sendMessageToSpace(message, space.id, token.access_token) )
  .then( (result) => console.log('Result: ' + JSON.stringify(result)) )
  .catch( (err) => console.error(err) );
  ```


### Users API

- getUserById
  
  Returns a JSON object representing a Watson Workspace user.
  
  #### Example
  
  ```JavaScript
  const ww = require('@ics/watson-workspace');
  
  var token;
  
  return Promise.resolve()
  .then( () => ww.auth.getToken(token, appId, appSecret) )
  .then( (returnToken) => token = returnToken )
  .then( () => ww.users.getUserById('1234abcd-56ef-78gh-90ij-klmnopqrstuv', token.access_token) )
  .then( (user) => console.log('User: ' + JSON.stringify(user)) )
  .catch( (err) => console.error(err) )
  ```
  
- getUserByEmail
  
  Returns a JSON object representing a Watson Workspace user.
  
  #### Example
  
  ```JavaScript
  const ww = require('@ics/watson-workspace');
  
  var token;
  
  return Promise.resolve()
  .then( () => ww.auth.getToken(token, appId, appSecret) )
  .then( (returnToken) => token = returnToken )
  .then( () => ww.users.getUserByEmail('user@ibm.com', token.access_token) )
  .then( (user) => console.log('User: ' + JSON.stringify(user)) )
  .catch( (err) => console.error(err) )
  ```