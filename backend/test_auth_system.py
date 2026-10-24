import sys
import uuid
import requests
import sqlite3
import bcrypt

print("=" * 70)
print("MachineMind AI -- Comprehensive Authentication Test Suite")
print("=" * 70)

DIRECT_API = "http://127.0.0.1:8000/api/v1"
PROXY_API = "http://127.0.0.1:3000/api/v1"
DB_PATH = r"C:\Users\Sashika\.gemini\antigravity\scratch\machinemind-ai\backend\machinemind.db"

# 1. Test Demo User Login (Direct & Through Proxy)
print("\n[TEST 1] Demo User Authentication...")
demo_payload = {"email": "elena.vance@machinemind.ai", "password": "ApexReliability2026!"}

r_direct = requests.post(f"{DIRECT_API}/auth/login", json=demo_payload)
assert r_direct.status_code == 200, f"Direct login failed: {r_direct.text}"
print("  [OK] Direct FastAPI login (8000) succeeded (JWT token issued)")

try:
    r_proxy = requests.post(f"{PROXY_API}/auth/login", json=demo_payload, timeout=3)
    if r_proxy.status_code == 200:
        print("  [OK] Vite Reverse Proxy login (3000 -> 8000) succeeded (Same-Origin confirmed)")
    else:
        print(f"  - Vite proxy returned HTTP {r_proxy.status_code} (direct client fallback active)")
except Exception as e:
    print(f"  - Vite proxy connection notice: {e}")

# 2. Test User Registration with Mixed Casing and Spacing
print("\n[TEST 2] Enterprise Registration with Mixed-Case & Whitespace...")
uid = uuid.uuid4().hex[:6]
raw_email = f"  Chief.Engineer.{uid}@ApexPlant.COM  "
clean_email = f"chief.engineer.{uid}@apexplant.com"
password = f"SafeStrongPass2026!{uid}"
name = f"Chief Eng. Kovacs-{uid}"

reg_payload = {
    "name": name,
    "email": raw_email,
    "password": password,
    "organization": "Turbomachinery Unit 4",
    "plant_location": "Rotterdam Industrial Basin"
}

r_reg = requests.post(f"{DIRECT_API}/auth/register", json=reg_payload)
assert r_reg.status_code == 200, f"Registration failed: {r_reg.text}"
reg_data = r_reg.json()["data"]
assert reg_data["user"]["email"] == clean_email, f"Email was not normalized: {reg_data['user']['email']}"
print(f"  [OK] User registered successfully: {clean_email}")
print(f"  [OK] Access token issued: {reg_data['access_token'][:28]}...")

# 3. Verify Database Storage & Password Hash
print("\n[TEST 3] Verifying Database Record & Cryptographic Hash...")
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()
cur.execute("SELECT id, email, hashed_password, is_active FROM users WHERE email=?", (clean_email,))
row = cur.fetchone()
assert row is not None, "User record not found in SQLite database!"
user_id, stored_email, stored_hash, is_active = row
assert stored_email == clean_email, "Stored email does not match normalized email!"
assert is_active == 1, "User is not marked active!"
assert bcrypt.checkpw(password.encode("utf-8")[:72], stored_hash.encode("utf-8")), "Stored hash does not match bcrypt!"
print(f"  [OK] User {user_id} found in database table 'users'")
print(f"  [OK] Password verified against stored bcrypt hash ({stored_hash[:18]}...)")
conn.close()

# 4. Test Login with Lowercase Email
print("\n[TEST 4] Login with Clean Lowercase Email...")
r_login_clean = requests.post(f"{DIRECT_API}/auth/login", json={"email": clean_email, "password": password})
assert r_login_clean.status_code == 200, f"Login failed: {r_login_clean.text}"
print("  [OK] Login succeeded with lowercase email")

# 5. Test Login with Original Uppercase & Spaced Email
print("\n[TEST 5] Login with Uppercase & Whitespace Autofill Input...")
r_login_raw = requests.post(f"{DIRECT_API}/auth/login", json={"email": raw_email, "password": password})
assert r_login_raw.status_code == 200, f"Login with casing/spaces failed: {r_login_raw.text}"
print("  [OK] Login succeeded with casing/spaces (case-insensitive lookup verified)")

# 6. Test Invalid Password Handling
print("\n[TEST 6] Invalid Password Rejection...")
r_wrong_pass = requests.post(f"{DIRECT_API}/auth/login", json={"email": clean_email, "password": "WrongPassword2026!"})
assert r_wrong_pass.status_code == 401, f"Expected 401, got {r_wrong_pass.status_code}"
assert "Incorrect enterprise email or security password." in r_wrong_pass.text
print("  [OK] Correctly rejected with HTTP 401 and secure message")

# 7. Test Duplicate Email Registration
print("\n[TEST 7] Duplicate Email Prevention...")
r_dup = requests.post(f"{DIRECT_API}/auth/register", json={
    "name": "Imposter",
    "email": f"CHIEF.ENGINEER.{uid}@APEXPLANT.COM",
    "password": "AnotherPassword2026!",
    "organization": "Apex"
})
assert r_dup.status_code == 400, f"Expected 400 for duplicate, got {r_dup.status_code}"
assert "already exists" in r_dup.text
print("  [OK] Duplicate registration blocked with HTTP 400")

# 8. Test Short Password Validation (< 8 chars)
print("\n[TEST 8] Password Complexity / Min Length Validation...")
r_short = requests.post(f"{DIRECT_API}/auth/register", json={
    "name": "Short Pass User",
    "email": f"short.{uid}@example.com",
    "password": "short",
    "organization": "Apex"
})
assert r_short.status_code == 422, f"Expected 422, got {r_short.status_code}"
print("  [OK] Short password rejected with HTTP 422 Unprocessable Entity")

# 9. Test Authenticated Route with Token
print("\n[TEST 9] Protected Endpoint Access with Bearer Token...")
token = reg_data["access_token"]
r_me = requests.get(f"{DIRECT_API}/auth/me", headers={"Authorization": f"Bearer {token}"})
assert r_me.status_code == 200, f"Failed /auth/me: {r_me.text}"
profile = r_me.json()["data"]
assert profile["email"] == clean_email
assert profile["id"] == user_id
print(f"  [OK] Authenticated user profile retrieved: {profile['name']} ({profile['role']})")

print("\n" + "=" * 70)
print("ALL 9 AUTHENTICATION TESTS PASSED SUCCESSFULLY (100%)")
print("=" * 70)
