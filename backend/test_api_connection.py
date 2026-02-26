#!/usr/bin/env python3
"""
Backend API Connection Test Script
Tests all endpoints to verify frontend-backend connectivity
"""

import requests
import json
from typing import Dict, Any
import sys

BASE_URL = "http://localhost:8000"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_test(name: str, passed: bool, response: Any = None):
    """Print test result"""
    status = f"{Colors.GREEN}✓ PASSED{Colors.END}" if passed else f"{Colors.RED}✗ FAILED{Colors.END}"
    print(f"\n{Colors.BLUE}{name}{Colors.END}")
    print(f"Status: {status}")
    if response:
        print(f"Response: {json.dumps(response, indent=2)}")

def test_health_check():
    """Test basic health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        data = response.json()
        passed = response.status_code == 200 and data.get("status") == "ok"
        print_test("Health Check", passed, data)
        return passed
    except Exception as e:
        print_test("Health Check", False)
        print(f"{Colors.RED}Error: {str(e)}{Colors.END}")
        return False

def test_system_status():
    """Test system status endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/system/status", timeout=5)
        data = response.json()
        passed = (
            response.status_code == 200 and
            data.get("backend_online") == True and
            "timestamp" in data
        )
        print_test("System Status", passed, data)
        return passed
    except Exception as e:
        print_test("System Status", False)
        print(f"{Colors.RED}Error: {str(e)}{Colors.END}")
        return False

def test_auth_ping():
    """Test auth ping endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/auth/ping", timeout=5)
        data = response.json()
        passed = response.status_code == 200 and data.get("status") == "ok"
        print_test("Auth Ping", passed, data)
        return passed
    except Exception as e:
        print_test("Auth Ping", False)
        print(f"{Colors.RED}Error: {str(e)}{Colors.END}")
        return False

def test_emissions_history():
    """Test emissions history endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/emissions/history", timeout=5)
        data = response.json()
        passed = (
            response.status_code == 200 and
            "items" in data and
            "total_emissions" in data
        )
        print_test("Emissions History", passed, data)
        return passed
    except Exception as e:
        print_test("Emissions History", False)
        print(f"{Colors.RED}Error: {str(e)}{Colors.END}")
        return False

def test_transactions():
    """Test transactions endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/transactions", timeout=5)
        data = response.json()
        passed = (
            response.status_code == 200 and
            "transactions" in data and
            "total_volume" in data
        )
        print_test("Transactions", passed, data)
        return passed
    except Exception as e:
        print_test("Transactions", False)
        print(f"{Colors.RED}Error: {str(e)}{Colors.END}")
        return False

def test_cluster_emission():
    """Test cluster emission endpoint"""
    try:
        payload = {
            "description": "Factory emissions from production line A"
        }
        response = requests.post(f"{BASE_URL}/ai/cluster", json=payload, timeout=10)
        data = response.json()
        passed = (
            response.status_code == 200 and
            "cluster_label" in data and
            "vector_id" in data
        )
        print_test("Cluster Emission", passed, data)
        return passed
    except Exception as e:
        print_test("Cluster Emission", False)
        print(f"{Colors.RED}Error: {str(e)}{Colors.END}")
        return False

def test_optimize_carbon():
    """Test optimize carbon endpoint"""
    try:
        payload = {
            "vector_id": "vec_001",
            "target_reduction": 0.2
        }
        response = requests.post(f"{BASE_URL}/ai/optimize", json=payload, timeout=10)
        data = response.json()
        passed = (
            response.status_code == 200 and
            "strategy" in data and
            "confidence" in data
        )
        print_test("Optimize Carbon", passed, data)
        return passed
    except Exception as e:
        print_test("Optimize Carbon", False)
        print(f"{Colors.RED}Error: {str(e)}{Colors.END}")
        return False

def test_trade_action():
    """Test trade action endpoint"""
    try:
        payload = {
            "market_state": {"price": 25.50, "volume": 1000},
            "balance": 10000
        }
        response = requests.post(f"{BASE_URL}/ai/trade", json=payload, timeout=10)
        data = response.json()
        passed = (
            response.status_code == 200 and
            "action" in data and
            "confidence" in data
        )
        print_test("Trade Action", passed, data)
        return passed
    except Exception as e:
        print_test("Trade Action", False)
        print(f"{Colors.RED}Error: {str(e)}{Colors.END}")
        return False

def test_trading_history():
    """Test trading history endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/trading/history", timeout=5)
        data = response.json()
        passed = (
            response.status_code == 200 and
            "transactions" in data and
            "total_trades" in data
        )
        print_test("Trading History", passed, data)
        return passed
    except Exception as e:
        print_test("Trading History", False)
        print(f"{Colors.RED}Error: {str(e)}{Colors.END}")
        return False

def test_marketplace_farmers():
    """Test marketplace farmers endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/marketplace/farmers", timeout=5)
        data = response.json()
        passed = (
            response.status_code == 200 and
            "farmers" in data and
            isinstance(data["farmers"], list)
        )
        print_test("Marketplace Farmers", passed, data)
        return passed
    except Exception as e:
        print_test("Marketplace Farmers", False)
        print(f"{Colors.RED}Error: {str(e)}{Colors.END}")
        return False

def main():
    """Run all tests"""
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"GreenProof Backend API Connection Test")
    print(f"{'='*60}{Colors.END}\n")
    print(f"Testing backend at: {BASE_URL}\n")
    
    tests = [
        test_health_check,
        test_system_status,
        test_auth_ping,
        test_emissions_history,
        test_transactions,
        test_cluster_emission,
        test_optimize_carbon,
        test_trade_action,
        test_trading_history,
        test_marketplace_farmers,
    ]
    
    results = []
    for test in tests:
        results.append(test())
    
    # Summary
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"Test Summary")
    print(f"{'='*60}{Colors.END}")
    passed = sum(results)
    total = len(results)
    percentage = (passed / total) * 100 if total > 0 else 0
    
    if passed == total:
        print(f"{Colors.GREEN}All {total} tests passed! ({percentage:.0f}%){Colors.END}")
        return 0
    else:
        print(f"{Colors.YELLOW}{passed} out of {total} tests passed ({percentage:.0f}%){Colors.END}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
