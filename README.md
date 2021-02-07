# Cement System (C-Stem)
C-Stem is a web-based integrated system for the sales, purchasing, inventory, and logistics management for JM Aquino Trading and Services. It includes modules namely Sales, Purchasing, and Logistic. This system focuses on sales, procurement,, and delivery of products, thus its  main functions focus on order processing and billing, scheduling and confirming deliveries, inventory tracking, and record keeping. 

The software is divided into three modules namely the Sales, Purchasing, and Logistics Modules. Each module is intended to be used by the different employees of the company and has its own functions, requirements and specifications. The Sales Module is in charge of all the orders that come in to the company as well as the payments from the customers. The users of this module ensure that the customers are receiving the correct number of cements in their specified product on a date scheduled by them. The Purchasing Module handles inventory management. The users of the module must be able to edit the product price for all products and create an order for the products if the stocks are low. Lastly, the Logistics Module schedules and confirms the delivery of products ordered by both Sales and Purchasing. 

## Setup

The software runs with NodeJS, a javascript runtime environment with MySQL as the default database. First, download the software, database, and the jre using the steps below.

### Downloading the software

Step 1.  Clone the application. Click Code and Download ZIP. Once the download has finished, unzip the folder. 

### Installing MySQL

Step 2. To install MySQL, click on the link below. MySQL Workbench can be installed using the Windows MSI Installer package. The MSI package bears the name mysql-workbench-community-version-winarch.msi, where version indicates the MySQL Workbench version number, and arch the build architecture (winx64).

-  [MySQL](https://dev.mysql.com/downloads/workbench/)

When executing MySQL Installer, you may choose MySQL Workbench as one of the products to install. It is selected by default, and essentially executes the standalone MSI Installer package.

Step 3. Once MySQL Workbench has been installed, it is now time to import the database. From the sidebar, go to the Schema tab and select Data Import/Restore. Click on the Import from Disk tab then Import from Self Contained File then import the .sql file located in the same folder as the application. 

Step 4. Once you have selected the .sql file, create a new schema and name it however you want. Keep in mind that the schema name will be used to run the application later. 

### Installing Node JS & npm

Step 5. To run the server, open up the command prompt and navigate through the folder where the files are contained. To create the node modules, use the command

            npm install --save

To check if you have Node.js installed, run this command in your terminal:  
            node -v                                           
To confirm that you have npm installed you can run this command in your terminal: 
            npm -v

### Editing the .env file

Step 6. Go to the same folder of the cloned application and open the .env in any text editor (VSCode, Atom, SublimeText, Notepad, etc.). 

Step 7. Replace the DB_DATABASE= isande_db tp DB_DATABASE= <name of the schema that was imported in MySQL Workbench earlier>. Save the file after editing.

### Hosting the application

Step 8. Now that node js and its dependencies have been installed, it’s time to host the application. On the same command line, enter the following below:
            node app.js

	A prompt saying “App listening at port 3000” must be seen on the screen. 
* Note that the host machine needs to have the same ip address with the connecting devices and that the host machine needs to be running in order for the web application to be accessible
Do not close the command prompt. Keep it running in the background from this step forward. Once the command prompt is exited, the server will also stop running and will not be able to run the system. 

### Running the application

Step   9.   Run the command ‘hostname’ in command terminal of the host machine and take note of the hostname 

Step 10. Open your preferred browser (Google Chrome, Mozilla Firefox, Microsoft Edge) and on the address bar, enter the following:
            localhost:3000

It will now navigate to the login page of the application where you can login with the given credentials. 

## User Accounts
Step 11. Once the application is running, it will be available at <hostname>:3000. This will then bring you to the login page. You may login with the following credentials:
 | username | password |
| --- | --- |
| sales | password |
| purchasing | password |
| logistics | password |
