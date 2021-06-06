# Galilean 
A program to display continuous panel for the Galilean 
clinic, showing doctors' activity status.

## Installation
Unzip the package obtained from the github repository at:
<https://github.com/urishani/galilean/archive/master.zip>

## Execution
To execute, double click the ***galilean.html*** 
file on your Windows (or MacOS) file explorer, 
or enter this URL in your web browser:

<file:///F:/workspace/EREZ/galilean/public/galilean.html>

***NOTE:*** Just change the path to where the package has been unzipped.

When the page opens up, a button appears on screen top
to load the configuration file (e.g. ***data/galilean.xlsx*** - see explanation in 
[Configuration](#configuration) below).
Click and select the configuration file you modified. The button disappears.

Whenever the configuration is changed (see below), you can click anywhere on the 
screen for this button to re-appear and then to upload a new configuration.

Clicking anywhere on the screen again will make this button disappear.

In general, the banner can run in full-page mode by clicking
the ***F11*** button (or combine the ***Fn*** button with ***F11*** 
in some computers).

## Configuration
The banner is configured via an ***xlsx*** file. The ***data/galilean.xlsx*** should
be used as the file template that you can change.

The file has the following pages:

1. **names** - contains a table listing physician names in the clinic. Having these columns:
   
   1. *id* - short name id
   2. *name* - full name
   3. *field* - field of medical expertise
   4. *picture* - name of picture file. If missing, ***genericDoctor.jpg*** is used.

The picture files are located in ***public/images*** folder in the installation folder.
2. **Monday** and additional pages for each work day of the week - Each page has a table 
    with these columns:
   
   1. *hour* - in which listed are the operational hours of the clinic. Presently these are
        from 8 (AM) to 20 (PM).
   2. *1*,*2*, ...*5* (more can be added) - each representing a room number.    

To mark room usage, enter the doctor short id in the cell corresponding to
that room (column) and the hour (row).
3. **pictures** - in this page list the pictures for the cycling picture effect on the banner. This page has two columns: 
   
   * *picture* - which holds pictures file names, located in the ***public/images*** folder in the installation folder. 
   * *cycle* - which has two entries. The first one 
   holds the number of milliseconds for the pictures cycling time.
   The second holds the number of milliseconds for the fade-in-out process to last.
   Defaults are 7000 (7 seconds for each image to show), and 1500 (1.5 seconds for the fade-in-out process duration).

# Server

This is a more convenient option. Once the server is started, you 
can access it via a simple URL from any computer of tablet on 
your LAN (wired or wifi). Moreover, any URL starts automatically
and its data is updated whenever the configuration changes, 
also automatically. See "Alternative invocation Option" below.

## Installation

The server requires an application known as ***node.js***.

1. install ***node.js*** on your PC (or MAC) computer from this link:
<https://nodejs.org/en/download/>
This will create two tools: ***node***, which is the program which 
 executes our web server, and ***npm*** which is a tool to manage
 node.
2. Prepare the server: Run in the installation folder ***npm install***, which will prepare
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

## Alternative invocation options
The ***main*** panel can be invoked via the URL above, but here are
 additional URL options that can be used:
 
 1. ***<http://localhost:8080/main>*** starts the same main panel as
 the above URL.
 2. ***<http://localhost:8080/room/1>*** starts a mini panel for 
 room number 1, likewise the ***1*** can be replaced with any number
 of a room in the clinic. This mini panel will show the doctor occupying that
 room, and it can be used for the ipad positioned at the room door lintel.
 
 when in the main panel display, clicking on the room number of
 any of the rooms shown there, will replace the panel with a room panel.
 Once on a room panel, clicking anywhere will restore the main
 panel view again.

## Killing the server
To kill the server you can type ***CTRL-C*** on the server console.

## Configuration

As in the non-server mode, the xlsx file ***data/galilean.xlsx***
in the installation folder is used. However, when the file
changes, all the clients displaying the banner page will update
the new data at the next (per-minute) update period automatically.

In any of these clients, clicking anywhere on the panel will 
pop-up on the screen top a button reading ***Refresh from Server***.
Clicking on this button will update immediately that client.
Clicking again on the screen will make this button disappear. 