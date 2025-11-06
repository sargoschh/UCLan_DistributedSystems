Demo of file upload to a staging area
ETL process to extract the data, transform it from text into records then load into tables

endpoint examples:
http://localhost:3000
http://localhost:3000/etl/quiz/quiz.txt  same for both databases but Mongo will name quiz collection quizzes

Check the data has arrived in the database using workbench or compass

Also can check with http://localhost:3000/data/quizzes for mongo
or http://localhost:3000/data/quiz for mysql

Change the env var in .env from MYSQL to MONGO, restart the app then rerun the API call
Check the data has arrived in mongo using compass

