# clear_db.py
from util import run_command

run_command("echo \"clear sqlite3 db file.\"");
run_command("echo \"working dir:\"");
run_command("pwd");

run_command("rm ./dao/sqlite3_db.db");
run_command("cat ./dao/sqlite3_db.sql | sqlite3 ./dao/sqlite3_db.db");
run_command("echo \"working dir:\"");
run_command("ls");
run_command("echo \"./dao dir:\"");
run_command("ls ./dao");

