import sqlite3
import os
from werkzeug.security import generate_password_hash


# -------------------------------------------------
# DATABASE PATH
# -------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

DATABASE = os.path.join(
    BASE_DIR,
    "users.db"
)


# -------------------------------------------------
# MIGRATE PASSWORDS
# -------------------------------------------------

def migrate_passwords():

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, password
        FROM users
    """)

    users = cursor.fetchall()

    migrated = 0

    for user_id, password in users:

        # Skip passwords that are already hashed
        if (
            password.startswith("scrypt:")
            or password.startswith("pbkdf2:")
            or password.startswith("argon2:")
        ):
            continue

        password_hash = generate_password_hash(password)

        cursor.execute("""
            UPDATE users
            SET password = ?
            WHERE id = ?
        """, (
            password_hash,
            user_id
        ))

        migrated += 1

    conn.commit()
    conn.close()

    print(
        f"Successfully migrated {migrated} password(s)."
    )


if __name__ == "__main__":
    migrate_passwords()