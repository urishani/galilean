#Galilean 

A program to display continuous panel for the Galilean clinic, showing
doctors activity status.

#Installation
Unzip the package obtained from the github repository at:
<https://github.com/shani/galilean/archive/master.zip>

#Execution
To execute, double click on the galilean.html file on your pc file browser, 
or enter this URL in your web browser:

<file:///F:/workspace/EREZ/galilean/galilean.html>

Just change the path to where the package has been unzipped.

#Configuration
The banner is configured via the ***galilean.xlsx*** file.
The file has the following pages:
1. **names** - which has a table listing physician names in the clinic. Having these columns:
    1. *id* - short name id
    2. *name* - full name
    3. *field* - field of medical expertise
    4. *picture* - name of picture file. If missing, defaultDoctor.jpg is used. The picture files are located in the installation folder.
2. **Monday** and additional pages for each work day of the week - Each page has a table with these columns:
    1. *hour* in which listed are the operational hours of the clinic. Presently these are
    from 8 (AM) to 20 (PM).
    2. *1*,*2*, ...*5*. More can be added, each representing a room number.
    
    To mark room usage, enter the doctor short id in the cell corresponding to
    that room and the hour.

3. **pictures** - in this page we list the pictures for the cycling picture effect on the banner.
This page has two columns: 
  * *picture* which holds a picture file name, located in the installation folder. 
  * *cycle* which has
only one entry to hold the number of milliseconds for the pictures cycling time.
        