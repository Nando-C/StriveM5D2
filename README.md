# StriveM5D2
Strive Blog API


You are in charge of creating a set of WebAPIs for the Strive Blog application.


In this first "step" the application should enable the creation, editing, deletion, listing of blog authors.

Authors should have following information:



name
surname
ID (Unique and server generated)
email
date of birth
avatar (e.g. https://ui-avatars.com/api/?name=John+Doe)


The backend should include the following routes:



GET /authors => returns the list of authors
GET /authors/123 => returns a single author
POST /authors => create a new author
PUT /authors/123 => edit the author with the given id
DELETE /authors/123 => delete the author with the given id


The persistence must be granted via file system (es.: Json file with a list of authors inside)