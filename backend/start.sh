#!/usr/bin/env bash
export PYTHONPATH=$PYTHONPATH:./backend
flask db upgrade
gunicorn app:app
