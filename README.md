1. Display authors and their books (names to be displayed - not Ids) (SELECT)

	SELECT a.au_lname + ' ' + a.au_fname AS author_name, t.title
	FROM authors a
	JOIN titleauthor ta ON a.au_id = ta.au_id
	JOIN titles t ON ta.title_id = t.title_id
	ORDER BY author_name


2. Display publishers and authors

	SELECT p.pub_name AS publisher, a.au_fname + ' ' +  a.au_lname AS author_name
	From publishers p
	JOIN titles t on t.pub_id = p.pub_id
	JOIN titleauthor ta on t.title_id = ta.title_id
	JOIN authors a on ta.au_id = a.au_id
	ORDER BY publisher, author_name


3. Display publishers, employees and their jobs

	SELECT p.pub_name AS publisher, e.fname + ' ' + e.lname AS employee_name, j.job_desc AS job
	FROM publishers p
	JOIN employee e ON p.pub_id = e.pub_id
	JOIN jobs j ON e.job_id = j.job_id
	ORDER BY publisher, e.fname, e.lname


4. Add new Authors (John Doe, Mitch and Gregg) (INSERT)

	INSERT INTO authors (au_id, au_fname, au_lname, contract)
	VALUES 
	('111-11-1111', 'John', 'Doe', 1),
	('222-22-2222', 'Mitch', 'Mija', 1),
	('333-33-3333', 'Gregg', 'Wartman', 1)
	

5. Add new book "Testing" written by Gregg published by "Ramona Publishing"

	DECLARE @authorid VARCHAR(11)
	DECLARE @pubid VARCHAR(4)

	SELECT @authorid=au_id FROM authors
	WHERE au_fname = 'Gregg'

	SELECT @pubid=pub_id FROM publishers
	WHERE pub_name = 'Ramona Publishers'

	INSERT INTO titles (title_id, title, pub_id)
	VALUES ('MC4506', 'testing', @pubid)

	INSERT INTO titleauthor (au_id, title_id)
	VALUES (@authorid, 'MC4506')
	

6.  Add new book "Devops" written by Gregg and Mitch published by "Lucerne Publishing"

	DECLARE @authorid1 VARCHAR(11)
	DECLARE @authorid2 VARCHAR(11)
	DECLARE @pubid VARCHAR(4)

	SELECT @authorid1=au_id FROM authors
	WHERE au_fname = 'Gregg'

	SELECT @authorid2=au_id FROM authors
	WHERE au_fname = 'Mitch'

	SELECT @pubid=pub_id FROM publishers
	WHERE pub_name = 'Lucerne Publishing'

	INSERT INTO titles (title_id, title, pub_id)
	VALUES ('MC4020', 'Devops', @pubid)

	INSERT INTO titleauthor (au_id, title_id)
	VALUES (@authorid1, 'MC4020'), (@authorid2, 'MC4020')
	

7. Add new book "No Name" written by John Doe published by "Lucerne Publishing"

	DECLARE @authorid VARCHAR(11)
	DECLARE @pubid VARCHAR(4)

	SELECT @authorid=au_id FROM authors
	WHERE au_fname = 'John' and au_lname = 'Doe'

	SELECT @pubid=pub_id FROM publishers
	WHERE pub_name = 'Lucerne Publishing'

	INSERT INTO titles (title_id, title, pub_id)
	VALUES ('MC4021', 'No Name', @pubid)

	INSERT INTO titleauthor (au_id, title_id)
	VALUES (@authorid, 'MC4021')
	

8. Update mitch address (100 King St. W, Hamilton - 905-999-9999) (UPDATE)
	
	DECLARE @authorid VARCHAR(11)

	SELECT @authorid=au_id FROM authors
	WHERE au_fname = 'Mitch' and au_lname = 'Mija'

	UPDATE authors
	SET address = '100 King St. W',
		city = 'Hamilton',
		State = 'ON',
		phone = '905-999-9999'
	WHERE au_id = @authorid
	
	
9. Display all books written by more that one authors

	SELECT t.title_id, t.title
	FROM titleauthor ta
	JOIN titles t
	ON ta.title_id = t.title_id
	GROUP BY t.title, t.title_id
	HAVING COUNT(ta.au_id) > 1


10. Add "No Name" to all stores (SAME AS #11)
11. Add sales for "No Name" to these stores (Eric the Read Books, Barnum's, News & Brews) in quantities 50, 100, 200 respectively

	DECLARE @titleid VARCHAR(6)
	DECLARE @storeid1 VARCHAR(4)
	DECLARE @storeid2 VARCHAR(4)
	DECLARE @storeid3 VARCHAR(4)

	SELECT @titleid=title_id FROM titles
	WHERE title = 'No Name'

	SELECT @storeid1=stor_id FROM stores
	WHERE stor_name = 'Eric the Read Books'

	SELECT @storeid2=stor_id FROM stores
	WHERE stor_name = 'Barnum''s'

	SELECT @storeid3=stor_id FROM stores
	WHERE stor_name = 'News & Brews'

	INSERT INTO sales (stor_id, ord_num, ord_date, qty, payterms, title_id)
	VALUES (@storeid1, '1718', getdate(), 50, 'Net 30', @titleid),
		   (@storeid2, '2024', getdate(), 100, 'Net 60', @titleid),
		   (@storeid3, '3707', getdate(), 200, 'Net 30', @titleid)


12. Rank all stores for the most book sold 
   1. Store name, quantity sold (highest quantity number)
   2. Store name, quantity sold (second highest quantity number)
   3. Store name, quantity sold (third highest quantity number)
   4. ...

	SELECT st.stor_name, SUM(qty) as [quantity sold]
	FROM sales sa
	JOIN stores st
	ON sa.stor_id = st.stor_id
	GROUP BY st.stor_name
	ORDER BY SUM(qty) DESC
	

13. Add new table Customer (first, last name, phone, address). Each customer ID is unique, sequential integer (CREATE TABLE)

	CREATE TABLE Customer (
		cu_id INT IDENTITY(1,1) PRIMARY KEY,
		cu_fname VARCHAR(20)  NOT NULL,
		cu_lname VARCHAR(40)  NOT NULL,
		phone VARCHAR(12),
		address VARCHAR(40)
	)
	
	
14. Insert 3 new customers

	INSERT INTO Customer
	VALUES ('Cherry', 'Wang', '223 334-4456', '400 University Ave'),
		   ('Michelle', 'Zhang', '143 789-3910', '246 Albert St'),
		   ('Kyle', 'Qi', '582 178-4789', '203 King st')
		   
		   
15. Add nullable column CustomerId to Sales - Foreign Key to Customer table

	ALTER TABLE Sales
	ADD CustomerId INT NULL

	ALTER TABLE Sales
	ADD FOREIGN KEY (CustomerId) REFERENCES Customer(cu_id)
	
	
16. Add CustomerId to sales order numbers (P2121, P3087a, X999)

	UPDATE Sales
	SET CustomerId = 1
	WHERE ord_num = 'P2121'

	UPDATE Sales
	SET CustomerId = 2
	WHERE ord_num = 'P3087a'

	UPDATE Sales
	SET CustomerId = 3
	WHERE ord_num = 'X999'


17. Display Orders, Store name, Book name, Author Name, Customer name for all orders that customer has been entered

	SELECT sa.ord_num AS 'order', st.stor_name AS [store name], t.title as [book name], a.au_fname + ' ' + a.au_lname AS [author name], 
		   cu.cu_fname + ' ' + cu.cu_lname AS [customer name]
	FROM Customer cu
	JOIN sales sa ON cu.cu_id = sa.CustomerId
	JOIN stores st ON sa.stor_id = st.stor_id
	JOIN titles t ON sa.title_id = t.title_id
	JOIN titleauthor ta ON ta.title_id = t.title_id
	JOIN authors a ON a.au_id = ta.au_id
	
	
18. Delete author John Doe  (DELETE)
	
	DELETE FROM titleauthor
	WHERE au_id = (SELECT au_id FROM authors WHERE au_fname = 'John' AND au_lname = 'Doe')

	DELETE FROM authors
	WHERE au_fname = 'John' AND au_lname = 'Doe'
	
	delete from titleauthor
	where au


19. Display all employees named Maria

	SELECT * 
	FROM employee
	WHERE fname = 'Maria'
	
	
20. Display all employees in order from most seniority

	SELECT *
	FROM employee
	ORDER BY hire_date
	
	
21. Display all employees hired 1994

	SELECT * 
	FROM employee
	WHERE YEAR(hire_date) = 1994
	
	
22. Display all employees who contains "on" letters in their last name

	SELECT *
	FROM employee
	WHERE lname LIKE '%on%'
	

23. Create View "Co-Authors" that displays all books written by more than one authors

	CREATE VIEW [Co-Authors] AS 
	SELECT t.title_id, t.title
	FROM titles t
	JOIN titleauthor ta ON t.title_id = ta.title_id
	GROUP BY t.title, t.title_id
	HAVING COUNT(ta.au_id) > 1
	
	
24. Create Stored Procedure that takes Author Id as input parameter and returns all titles written by same author

	CREATE PROCEDURE booksBy @authorid VARCHAR(11)
	AS
	SELECT t.title
	FROM titles t
	JOIN titleauthor ta
	ON t.title_id = ta.title_id
	WHERE ta.au_id = @authorid
	GO


DECLARE @InvoiceID INT
DECLARE @CustomerName VARCHAR(100)
DECLARE @SaleDate DATE
DECLARE @Dealership VARCHAR(20)
DECLARE @VIN VARCHAR(50)
DECLARE @Make VARCHAR(40)
DECLARE @Model VARCHAR(40)
DECLARE @ListPrice MONEY
DECLARE @CashAmount MONEY
DECLARE @LoanAmount MONEY
DECLARE @TradeInAmount MONEY
DECLARE @BankName VARCHAR(20)
DECLARE @InsuranceName VARCHAR(20)

DECLARE invoiceCursor CURSOR
FOR 
	SELECT s.SaleID, c.FirstName +' ' + c.LastName, s.SaleDate, so.Name, ca.VIN, cm.Make, cm.Model, s.ListPrice, s.CashAmount, COALESCE(l.Amount, 0), COALESCE(s.TradeInValue, 0), COALESCE(b.BankName, 'no loan'), ip.InsuranceName
	FROM Sale s
	LEFT JOIN Customer c ON s.CustomerID = c.CustomerID
	LEFT JOIN Car ca ON s.CarID = ca.Id
	LEFT JOIN CarModel cm ON ca.CarModelID = cm.CarModelID
	LEFT JOIN SalesPerson sp ON s.SalesPersonID = sp.SalesPersonID
	LEFT JOIN SalesOffice so ON so.OfficeID = sp.OfficeID
	LEFT JOIN Loan l ON l.SaleID = s.SaleID
	LEFT JOIN bank b ON l.BankID = b.BankID
	LEFT JOIN InsuranceProvider ip ON s.InsuranceProviderID = ip.InsuranceProviderID

OPEN invoiceCursor

FETCH NEXT FROM invoiceCursor INTO @InvoiceID, @CustomerName, @SaleDate, @Dealership, @VIN, @Make, @Model, @ListPrice, @CashAmount, @LoanAmount, @TradeInAmount, @BankName, @InsuranceName


WHILE @@FETCH_STATUS = 0
BEGIN
	PRINT '=================================================='
	PRINT '                 Car Sale invoice'
	PRINT '=================================================='
	PRINT 'InvoiceID: ' + CAST(@InvoiceID AS VARCHAR(10))
	PRINT 'Customer name: ' + @CustomerName
	PRINT 'Sale date: ' + CAST(@SaleDate AS VARCHAR(10))
	PRINT 'Dealership: ' + @Dealership
	PRINT 'VIN: ' + @VIN
	PRINT 'Make: ' + @Make
	PRINT 'Model: ' + @Model
	PRINT 'List price: ' + CAST(@ListPrice AS VARCHAR(10))
	PRINT 'Cash amount: ' + CAST(@CashAmount AS VARCHAR(10))
	PRINT 'Loan amount: ' + CAST(@LoanAmount AS VARCHAR(10))
	PRINT 'Trade-in amount: ' + CAST(@TradeInAmount AS VARCHAR(10))
	PRINT 'Bank name: ' + @BankName
	PRINT 'Insurance provider Name: ' + @InsuranceName

	FETCH NEXT FROM invoiceCursor INTO @InvoiceID, @CustomerName, @SaleDate, @Dealership, @VIN, @Make, @Model, @ListPrice, @CashAmount, @LoanAmount, @TradeInAmount, @BankName, @InsuranceName

END

CLOSE invoiceCursor

DEALLOCATE invoiceCursor


1. install node.js / npm
2. check: 
	node -v
	npm -v
3. set proxy:
	npm config set proxy http://proxy2.gonet.gov.on.ca:3128
	npm config set https-proxy http://proxy2.gonet.gov.on.ca:3128
4. install Angular CLI
	npm install -g @angular/cli
5. verify:
	ng --version
	
	
check proxy:
	netsh winhttp show proxy

npm config get proxy
npm config get https-proxy



git remote add origin https://github.com/Ruowen0613/pubs-app.git
git branch -M main
git push -u origin main

Setup your local machine for angular development (use steps from Wiki) 
https://netsdc.visualstudio.com/SDC/_wiki/wikis/SDC.wiki/786/LTC.PHM.HCMS-Land-Development?anchor=developer-tools
Find Angular tutorial  - Spend a week learning Angular
5 Best Angular Tutorials for Beginners - Snipcart or similar
Get angular material tutorial and learn
Angular Material UI component library
Create your first Angular page
Display table with "Authors" from your Azure Pubs database
Open single Author in new window
Edit, update author and save change to DB
Create new Author and save change to DB
Delete author and save change to DB
Sign up to GitHub, create your repository, place your code in repository
GitHub learning resources Git and GitHub learning resources - GitHub Docs


git config --global http.proxy http://204.40.130.129:3128
git config --global https.proxy http://204.40.130.129:3128

npm config set proxy http://204.40.130.129:3128
npm config set https-proxy http://204.40.130.129:3128

git config --global --unset http.proxy
git config --global --unset https.proxy
npm config delete proxy
npm config delete https-proxy


pip install imutils --proxy http://204.40.130.129:3128

python3 deepstream.py -i rtsp://234-ivds.compass-cctv.com:1935/CHAN-449/CHAN-449_1.stream

rtsp://20.63.111.75:554/ds-test

CUDA 12.5