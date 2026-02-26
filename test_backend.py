#!/usr/bin/env python3
"""Quick backend API test"""
import requests
import json

BASE = "http://localhost:8000"

endpoints = [
    ("GET", "/health"),
    ("GET", "/system/status"),
    ("GET", "/emissions/history"),
    ("GET", "/transactions"),
    ("GET", "/trading/history"),
    ("GET", "/marketplace/farmers"),
]

print("=" * 60)
print("BACKEND API TEST RESULTS")
print("=" * 60)

passed = 0
failed = 0

for method, endpoint in endpoints:
    try:
        if method == "GET":
            r = requests.get(f"{BASE}{endpoint}", timeout=3)
        else:
            r = requests.post(f"{BASE}{endpoint}", json={}, timeout=3)
        
        if r.status_code == 200:
            status = "[PASS]"
            passed += 1
        else:
            status = f"[FAIL {r.status_code}]"
            failed += 1
        
        print(f"{status:15} {method:6} {endpoint}")
        if r.status_code == 200:
            data = r.json()
            keys = list(data.keys())[:3]
            print(f"                 Keys: {keys}")
    except Exception as e:
        print(f"[ERROR]         {method:6} {endpoint}")
        print(f"                 {str(e)[:60]}")
        failed += 1

print("\n" + "=" * 60)
print("AI ENDPOINTS (POST with payload)")
print("=" * 60)

ai_endpoints = [
    ("/ai/cluster", {"description": "Test emission"}),
    ("/ai/optimize", {"vector_id": "test_123", "target_reduction": 0.2}),
    ("/ai/trade", {"balance": 5000, "marketState": {}}),
]

for endpoint, payload in ai_endpoints:
    try:
        r = requests.post(f"{BASE}{endpoint}", json=payload, timeout=3)
        if r.status_code == 200:
            status = "[PASS]"
            passed += 1
        elif r.status_code == 500:
            status = "[500-SVC]"
            failed += 1
        else:
            status = f"[FAIL {r.status_code}]"
            failed += 1
        
        print(f"{status:15} POST {endpoint}")
        if r.status_code == 200:
            data = r.json()
            keys = list(data.keys())[:3]
            print(f"                 Keys: {keys}")
    except Exception as e:
        print(f"[ERROR]         POST {endpoint}")
        print(f"                 {str(e)[:60]}")
        failed += 1

print("\n" + "=" * 60)
print(f"SUMMARY: {passed} passed, {failed} failed")
print("=" * 60)
