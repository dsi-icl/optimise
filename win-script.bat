@echo off

set argC=0
for %%x in (%*) do Set /A argC+=1

if %argC% LEQ 0 (
    echo Failure: Provide a .sql schema file
    goto :end
)

:checkSqlite
    echo Checking if sqlite3.exe is present...

    where sqlite3.exe >nul 2>&1
    if %errorLevel% == 0 (
        echo Success: Sqlite3 found.
        goto runningDBSchema
    ) else (
        echo Failure: Sqlite3 not found. Please install it.
        goto end
    )

:runningDBSchema
    echo Creating the database from the schema %1 ...
    bash -c "rm -f ./db/optimise-db.sqlite ; sqlite3.exe ./db/optimise-db.sqlite < ./schema/schema.sql"
    echo Done.
    goto end

:end
    echo Script finished. Type any key to exit.
    pause >nul