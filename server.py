from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import csv

app = Flask(__name__)
CORS(app)

USERS_FILE = 'users.csv'
HOSTELS_FILE = 'hostels.csv'

def init_db():
    # Check and create users.csv with seed data if it doesn't exist
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['id', 'username', 'password', 'role'])
            writer.writerow([1, 'student', '123', 'student'])
            writer.writerow([2, 'owner', '123', 'owner'])
        print(f"Created {USERS_FILE} with seed data.")

    # Check and create hostels.csv if it doesn't exist
    if not os.path.exists(HOSTELS_FILE):
        with open(HOSTELS_FILE, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['id', 'name', 'price', 'type', 'ac', 'beds', 'address', 'latitude', 'longitude', 'image', 'amenities'])
        print(f"Created {HOSTELS_FILE}.")

# Initialize the CSV databases before starting the server
init_db()

def get_next_id(filename):
    """Helper to get the next auto-incrementing ID for a given CSV file."""
    if not os.path.exists(filename):
        return 1
    with open(filename, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        rows = list(reader)
        if not rows:
            return 1
        return max(int(row['id']) for row in rows) + 1

def check_user_credentials(username, password, role):
    if not os.path.exists(USERS_FILE):
        return False
    with open(USERS_FILE, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if row['username'] == username and row['password'] == password and row['role'] == role:
                return True
    return False

@app.route('/api/login', methods=['POST'])
def login():
    """Validates user credentials against users.csv"""
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if check_user_credentials(username, password, role):
        return jsonify({
            "status": "success", 
            "role": role, 
            "name": username
        }), 200
                
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/hostels', methods=['GET'])
def get_hostels():
    import os, csv
    file_path = os.path.join(os.path.dirname(__file__), 'hostels.csv')
    
    if not os.path.exists(file_path):
        return jsonify([]), 200
        
    hostels = []
    try:
        with open(file_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                clean_row = {}
                # Crucial Fix: Clean up every key and value to prevent NoneType crashes
                for key, value in row.items():
                    if key is None:
                        continue  # Skip broken dangling CSV data
                    
                    # Convert values to safe fallbacks if they are None or blank
                    if value is None:
                        clean_row[key] = ""
                    else:
                        clean_row[key] = str(value).strip()
                
                # Safe individual type casting for numbers
                try:
                    clean_row['price'] = int(clean_row['price']) if clean_row.get('price') else 0
                except ValueError:
                    clean_row['price'] = 0
                    
                try:
                    clean_row['latitude'] = float(clean_row['latitude']) if clean_row.get('latitude') else 0.0
                except ValueError:
                    clean_row['latitude'] = 0.0
                    
                try:
                    clean_row['longitude'] = float(clean_row['longitude']) if clean_row.get('longitude') else 0.0
                except ValueError:
                    clean_row['longitude'] = 0.0

                hostels.append(clean_row)
                
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return jsonify([]), 500

    return jsonify(hostels), 200

@app.route('/api/hostels', methods=['POST'])
def add_hostel():
    """Appends a new hostel to hostels.csv with an auto-incremented ID"""
    data = request.json
    new_id = get_next_id(HOSTELS_FILE)
    
    amenities = data.get('amenities', '')
    if isinstance(amenities, list):
        amenities_str = ",".join(amenities)
    else:
        amenities_str = str(amenities)
        
    image_url = data.get('image') or 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
    
    with open(HOSTELS_FILE, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow([
            new_id,
            data.get('name', ''),
            data.get('price', ''),
            data.get('type', ''),
            data.get('ac', ''),
            data.get('beds', ''),
            data.get('address', ''),
            data.get('latitude', ''),
            data.get('longitude', ''),
            image_url,
            amenities_str
        ])
    
    return jsonify({'success': True, 'id': new_id, 'message': 'Hostel added successfully'}), 201

@app.route('/')
def index():
    """Serve the main index.html on root access"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files like HTML, CSS, and JS"""
    return send_from_directory('.', filename)

if __name__ == '__main__':
    # Run the Flask app on port 5000
    app.run(port=5000, debug=True)
