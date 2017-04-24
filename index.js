const http = require('http');
const express = require('express');
const app = express();

//This is the key line that will ask Express to serve our 
//HTML, CSS, and client-side JS files:
app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);

const server = http.createServer(app);
server.listen(app.get('port'), () => {
	console.log(`Server listening on port ${app.get('port')}...`)
});

