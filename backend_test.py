import requests
import sys
import json
from datetime import datetime

class GfxtabAPITester:
    def __init__(self, base_url="https://cosmic-portfolio-48.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=10):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": None,
                "error": None
            }

            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    result["response_data"] = response.json()
                except:
                    result["response_data"] = response.text[:200]
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    result["error"] = response.json()
                except:
                    result["error"] = response.text[:200]

            self.test_results.append(result)
            return success, response.json() if success and response.content else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": None,
                "success": False,
                "response_data": None,
                "error": str(e)
            }
            self.test_results.append(result)
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "api/", 200)

    def test_status_create(self):
        """Test creating a status check"""
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
        }
        return self.run_test("Create Status Check", "POST", "api/status", 200, data=test_data)

    def test_status_get(self):
        """Test getting status checks"""
        return self.run_test("Get Status Checks", "GET", "api/status", 200)

    def test_contact_form_valid(self):
        """Test contact form with valid data"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "message": "This is a test message from automated testing."
        }
        return self.run_test("Contact Form - Valid Data", "POST", "api/contact", 200, data=test_data)

    def test_contact_form_invalid_email(self):
        """Test contact form with invalid email"""
        test_data = {
            "name": "Test User",
            "email": "invalid-email",
            "message": "This is a test message."
        }
        return self.run_test("Contact Form - Invalid Email", "POST", "api/contact", 422, data=test_data)

    def test_contact_form_missing_fields(self):
        """Test contact form with missing required fields"""
        test_data = {
            "name": "Test User"
            # Missing email and message
        }
        return self.run_test("Contact Form - Missing Fields", "POST", "api/contact", 422, data=test_data)

def main():
    print("🚀 Starting GFXTAB API Testing...")
    print("=" * 50)
    
    tester = GfxtabAPITester()
    
    # Test all endpoints
    print("\n📡 Testing API Endpoints...")
    tester.test_root_endpoint()
    
    print("\n📊 Testing Status Endpoints...")
    tester.test_status_create()
    tester.test_status_get()
    
    print("\n📧 Testing Contact Form...")
    tester.test_contact_form_valid()
    tester.test_contact_form_invalid_email()
    tester.test_contact_form_missing_fields()
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Results Summary:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Print failed tests details
    failed_tests = [test for test in tester.test_results if not test["success"]]
    if failed_tests:
        print(f"\n❌ Failed Tests Details:")
        for test in failed_tests:
            error_msg = test['error'] or f"Status {test['actual_status']} (expected {test['expected_status']})"
            print(f"   - {test['test_name']}: {error_msg}")
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            "summary": {
                "tests_run": tester.tests_run,
                "tests_passed": tester.tests_passed,
                "success_rate": (tester.tests_passed/tester.tests_run)*100 if tester.tests_run > 0 else 0
            },
            "detailed_results": tester.test_results
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())