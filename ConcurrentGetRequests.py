import requests
import threading

# URL of the server
url = 'http://localhost:8080/requests'

# Number of threads and requests
num_threads = 10
requests_per_thread = 50

# Function to send GET requests
def send_get_requests(thread_id):
    for i in range(requests_per_thread):
        try:
            response = requests.get(url)
            print(f"Thread {thread_id}: Response {response.status_code} - {response.json()}")
        except Exception as e:
            print(f"Thread {thread_id}: Error - {e}")

# Create and start threads
threads = []
for thread_id in range(num_threads):
    thread = threading.Thread(target=send_get_requests, args=(thread_id,))
    threads.append(thread)
    thread.start()

# Wait for all threads to finish
for thread in threads:
    thread.join()

print("All requests sent.")
