.PHONY: push commit status

# Usage:
#   make push          — stage all, commit with auto message, push
#   make push m="msg"  — stage all, commit with custom message, push
#   make status        — show git status

m ?= "update"

push:
	git add -A
	git commit -m $(m)
	git push -u origin main

status:
	git status
