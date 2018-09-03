#!/usr/bin/env python
import sys
from datetime import datetime
from cork import Cork

def create(username, password):
    cork = Cork('./', initialize=False)

    cork._store.roles['admin'] = 100
    cork._store.save_roles()

    tstamp = str(datetime.utcnow())
    cork._store.users[username] = {
        'role': 'admin',
        'hash': cork._hash(username, password),
        'email_addr': username + '@localhost.local',
        'desc': username,
        'creation_date': tstamp
    }
    cork._store.save_users()

if __name__ == '__main__':

    if len(sys.argv) < 3:
        print """Usage:
    create_user.py <username> <password>
        """
        sys.exit(1)

    create(sys.argv[1], sys.argv[2])
