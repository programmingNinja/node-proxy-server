/**
 * http://usejsdoc.org/
 */
let http = require('http');
let request = require('request');
let argv = require('yargs')
    .argv;

let localhost = '127.0.0.1';
let scheme = 'http://';
let host = argv.host || localhost;
let port = argv.port || (host === localhost ? 8000:80);
let destinationUrl = scheme + host + ':' + port;


let echoServer = http.createServer((req, res) => {
	destinationUrl = req.headers['x-destination-url'] || destinationUrl;
    console.log('Request received:', req.url);
    console.log('destin echo:', destinationUrl);

    process.stdout.write('\n\n\n' + JSON.stringify(req.headers));
    req.pipe(process.stdout);
    req.pipe(res);
});
echoServer.listen(8000);


http.createServer((req, res) => {
	let url = destinationUrl;
	if (req.headers['x-destination-url']) {
		url = 'http://' + req.headers['x-destination-url'];
	}
    // Proxy code
    let options = {
        headers: req.headers,
        url: url+req.url
    };
    console.log('req url proxy', req.url);
    console.log('url proxy', url);
    console.log('options url proxy', options.url);
    options.method = req.method;

    process.stdout.write('\n\n\n' + JSON.stringify(req.headers))
    req.pipe(process.stdout)
    req.pipe(request(options)).pipe(res);
}).listen(8001);