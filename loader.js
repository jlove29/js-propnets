//==============================================================================
// loader.js
//==============================================================================
//------------------------------------------------------------------------------
// Start-up:
//   cd <this folder>
//   node loader.js <player file pathname> <optional port>
//
// Requires this file, epilog.js (in this folder), and player file
//------------------------------------------------------------------------------

var playerfile = 'with_propnets.js';
var port = (process.argv.length>2) ? process.argv[3] : 9147;

var http = require("http");
var url = require("url");
var querystring = require("querystring");
var fs = require('fs');
eval(fs.readFileSync('epilog.js') + '');
eval(fs.readFileSync(playerfile) + '');

start(0, 'red', {}, 20, 20);


//==============================================================================
// Web Server
//==============================================================================
//------------------------------------------------------------------------------
// Listens for connections and calls player functions defined in playerfile
//------------------------------------------------------------------------------

function onRequest(request,response) {
    if (request.method === 'OPTIONS')
     {var headers = {};
      headers["Access-Control-Allow-Origin"] = "*";
      headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";
      headers["Access-Control-Allow-Credentials"] = false;
      headers["Access-Control-Max-Age"] = '86400';
      headers["Access-Control-Allow-Headers"] = "Sender, Receiver, Content-Type, Accept";
      response.writeHead(200, headers);
      response.end()}
  else{
response.writeHead(200,
   {"Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Age": "86400",
    "Content-Type": "text/plain"});
  var postData = "";
  var pathname = url.parse(request.url).pathname;
  request.setEncoding("utf8");
  request.addListener("data",function (chunk) {postData += chunk});
  request.addListener("end",function () {route(pathname,response,postData)})}}

function route (pathname,response,postData)
 {var request = readkif(postData);
  var result = eval(request[0]).apply(null,request.slice(1));
  response.write(printit(result));
  response.end()}

//==============================================================================
// Start-up
//==============================================================================

http.createServer(onRequest).listen(port);
console.log("Server has started.");

//==============================================================================
// End
//==============================================================================
