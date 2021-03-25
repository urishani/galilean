# Galilean 
A program to display continuous panel for the Galilean 
clinic, showing doctors' activity status.

## Installation
Unzip the package obtained from the github repository at:
<https://github.com/urishani/galilean/archive/master.zip>

## Execution
To execute, double click the ***galilean.html*** 
file on your Windows (or MacOS) file browser, 
or enter this URL in your web browser:

<file:///F:/workspace/EREZ/galilean/galilean.html>

***NOTE:*** Just change the path to where the package has been unzipped.

When the page opens up, a button appears on screen top
to load the configuration file (e.g. ***galilean.xlsx*** - see explanation in 
[Configuration](#configuration) below).
Click and select the configuration file you modified. The button disappears.

Whenever the configuration is changed (see below), you can click anywhere on the 
banner for this button to re-appear and then to upload a new configuration.

Clicking anywhere on the banner again will make this button disappear.

In general, the banner can run in full-page mode by clicking
the ***F11*** button (or combine the ***Fn*** button with ***F11*** 
in some computers).

## Configuration
The banner is configured via an ***xlsx*** file. The ***galilean.xlsx*** should
be used as the file template that you can change.

The file has the following pages:
1. **names** - contains a table listing physician names in the clinic. Having these columns:
   1. *id* - short name id
   2. *name* - full name
   3. *field* - field of medical expertise
   4. *picture* - name of picture file. If missing, ***genericDoctor.jpg*** is used.
The picture files are located in the installation folder.
2. **Monday** and additional pages for each work day of the week - Each page has a table 
    with these columns:
   1. *hour* - in which listed are the operational hours of the clinic. Presently these are
        from 8 (AM) to 20 (PM).
   2. *1*,*2*, ...*5* (more can be added) - each representing a room number.    
To mark room usage, enter the doctor short id in the cell corresponding to
that room (column) and the hour (row).
   3. *pictures* - in this page list the pictures for the cycling picture effect on the banner. This page has two columns: 
      * *picture* - which holds pictures file names, located in the installation folder. 
      * *cycle* - which has only one entry to hold the number of 
milliseconds for the pictures cycling time.

# Server

The service can also work as a web server. The advantage is that the computer holding
all the data runs a web server as explained here, 
and it can (as well as any other computer, tablet or smart phone on the network)
open the banner page from its built-in web-browser of choice.

## Installation

The server requires an application known as ***node.js***.
1. install ***node.js*** on your PC (or MAC) computer from this link:
<https://nodejs.org/en/download/>
This will create two tools: ***node***, which is the program which 
 executes our web server, and ***npm*** which is a tool to manage
 node.
2. Prepate the server: Run in the installation folder ***npm install***, which will prepare
all the needed software.

## Execution
Every time you want to run the server itself run the command
***npm start***
The server will start working, printing on the console that 
it started, and what is the URL to reach its content.
That may very well be: ***<http://localhost:8080/galilean.html>***.
To activate this from another device, replace ***hostname*** with the 
IP address of the server computer, or its network name.

Note: The port 8080 used here can be changed by editing the 
file ***server.js***, locating the string 8080, and choosing 
a different 4 digit number (e.g., 3000).

## Killing the server
To kill the server you can type ***<ctrl>C*** on the server console.

## Configuraiton

As in the non-server mode, the xlsx file ***galilean.xlsx***
in the installation folder is used. However, when the file
changes, all the clients displaying the banner page will update
the new data at the next (per-minute) update period automatically.

In any of these clients, clicking anywhere on the panel will 
pop-up on the screen top a button reading ***Refresh from Server***.
Clicking on this button will update immediately that client.
Clicking again on the screen will make this button disapear. 