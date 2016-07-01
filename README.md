# Tinynotebook [DEMO](http://tinynotebook.sourceforge.net/)
Simple, Yet powerful notesystem created with using the best editors of the web. PHP, MariaDB
![alt text](https://github.com/Symgi/Tinynotebook/raw/master/newnotesystem.png "Screenshot")

# Advanced search
1. Begins With 	b:	b:In the beginning God
2. Ends With 	e:	e:and there was light
3. These Words 	t:	t:created beginning
4. Phrase 	p:	p:love not
5. Regex 	r:	r:(\bLove[\S]{0,9}\b)

# INSTALLING
1. Extract files on your server in a directory of your choise. (i choose nn as the name for my directory /var/www/html/nn )
2. chmod 775 to your nn/uploads directory
3. write your database login information into config.inc.php
4. upload the sql file to your sql server

Login using admin@bibleway.us password: test

That's all, Enjoy


#Technical Specifications
PHP PDO database driver

passwords stored with sha512 with bread

TinyMCE, CKeditor, nicEditor

niceditor also uploads to imgur so that the photos isn't stored locally
