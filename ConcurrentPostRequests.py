import requests
import threading
import random
import json

# URL of the server
url = 'http://localhost:8080/requests'

# Number of threads and requests
num_threads = 10
requests_per_thread = 50

# Sample data for the request payload
guest_names = ["Alice", "Bob", "Charlie", "David", "Eve"]
room_numbers = [101, 102, 103, 104, 105]
request_details = [
    "Check-in request", 
    "Room service", 
    "Maintenance needed", 
    "Additional towels", 
    "Late checkout request"
]
statuses = ['received', 'in progress', 'awaiting confirmation', 'completed', 'canceled']

# Function to generate random request data
def generate_request_data():
    return {
        "guestName": random.choice(guest_names),
        "roomNumber": random.choice(room_numbers),
        "requestDetails": random.choice(request_details),
        "priority": random.randint(1, 5),  # Lower numbers indicate higher priority
        "status": random.choice(statuses)
    }

# Function to send POST requests
def send_post_requests(thread_id):
    for i in range(requests_per_thread):
        request_data = generate_request_data()
        try:
            response = requests.post(url, json=request_data)
            print(f"Thread {thread_id}: Response {response.status_code} - {response.json()}")
        except Exception as e:
            print(f"Thread {thread_id}: Error - {e}")

# Create and start threads
threads = []
for thread_id in range(num_threads):
    thread = threading.Thread(target=send_post_requests, args=(thread_id,))
    threads.append(thread)
    thread.start()

# Wait for all threads to finish
for thread in threads:
    thread.join()

print("All POST requests sent.")
