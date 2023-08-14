# tests/util.py
import subprocess

def run_command(command):
	subprocess.run(command, shell=True);
