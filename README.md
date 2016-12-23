# TabFlix

Seamless looping through full-screen URLs 

## What is TabFlix

TabFlix takes a series of URLs and loops through them in sequence in a full-screen browser window. It was conceived to
run the call stats screens in a contact centre, where it is used to loop through different screens of data, each one
a custom designed dashboard with its own unique URL.

## How does TabFlix work

Each url given to TabFlix is stored in the browsers local storage, then when the start button is pressed, an iframe is
created for each URL in local storage. The z-index of each iframe is then rotated appropriately to give the impression
of flicking between the URLs.  

## Known issues

Please check the [issues list](https://github.com/samchivers/tabflix/issues/) for known issues, however the most pressing 
outstanding one at the moment is that TabFlix renders iframes for each url it is given, so if the server disallows iframing 
from domains other than its own, TabFlix will not be able to render the site. e.g. `https://www.bbc.co.uk` - see 
[issue #2](https://github.com/samchivers/tabflix/issues/2).

## How to use TabFlix

There are two ways to use TabFlix depending on your use case:

1. Hosted

   There is a version of TabFlix hosted on GitHub pages [here](https://samchivers.github.io/tabflix/). Simply visit that
   url and add the addresses of the sites you want to flick through. However there are some drawbacks to it, most noteably 
   that GitHub enforces TLS on GitHub pages, so the hosted version of it cannot be used with non-https urls, see 
   this [issue](https://github.com/samchivers/tabflix/issues/5).  

2. Locally
   
   1. Pre-requisites
       1. Node.js v7.3.0 or greater - [https://nodejs.org/en/](https://nodejs.org/en/)
       2. NPM (Node's package manager, comes with Node.js install)
       3. AngularCli NPM package - after installing Node run `npm install -g angular-cli` 
   2. Download or Clone TabFlix to a folder on your local pc
   3. Open a command window inside the TabFlix window (at the same level as the `package.json` file)
   4. Run `npm install` to install TabFlix's dependencies
   5. Run `ng serve` - this will start a local server at the following address `http://localhost:4200`
   6. Browse to `http://localhost:4200` and enter the URLs 


